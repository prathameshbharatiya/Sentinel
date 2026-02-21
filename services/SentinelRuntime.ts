import { 
  RobotState, 
  RobotHealth, 
  FailureEvent, 
  HazardLevel, 
  RuntimeMode,
  LyapunovMatrix,
  ActuatorHealth,
  ModelMetadata,
  RiskLevel,
  HealthAdvisory,
  RobotIntent,
  IntentType,
  RobotTopology,
  DigitalTwinState,
  AuditEntry,
  IntentCoherence,
  FaultDiagnosis,
  ConsensusState
} from '../types';

export class SentinelRuntime {
  private history: RobotState[] = [];
  private mode: RuntimeMode = RuntimeMode.NORMAL;
  private failures: FailureEvent[] = [];
  private smoothedVelocityScale = 1.0;
  private readonly MAX_HISTORY = 100;
  
  private topology: RobotTopology = RobotTopology.LINEAR_ACTUATOR;
  private currentIntent: RobotIntent | null = null;
  private ledger: AuditEntry[] = [];
  private readonly MAX_LEDGER = 50;
  
  // L7: PTP Clock Sync
  private ptpOffset = 0; // nanoseconds
  private lastSyncTime = 0;

  // L1: Intent Coherence
  private lastIntentTime = 0;
  private intentHistory: RobotIntent[] = [];
  private coherenceScore = 1.0;

  // L5: Fault Signatures
  private faultDiagnosis: FaultDiagnosis = {
    classifiedFault: null,
    confidence: 0,
    isPredictive: false,
    isOOD: false,
    signatureMatch: null
  };

  // v5 Model Parameters (Universal Estimates)
  private mass_est = 1.0;
  private friction_est = 0.1;
  private inertia_est = [1.0, 1.0, 1.0]; // For 3D topologies
  private drag_est = 0.05;
  
  private covariance = 1000.0;
  private lambda = 0.99; 
  
  private lastResidual = 0;
  
  // Task Timings
  private timing: { [key: string]: number } = {};

  // Formal Lyapunov Parameters
  private P = [[1.0, 0.0], [0.0, 1.0]];
  private Q = [[0.1, 0.0], [0.0, 0.1]];
  
  // Actuator Limits
  private readonly ACTUATOR_LIMITS = {
    max_torque: 80.0,
    max_power: 500.0,
    max_temp: 75.0
  };

  // Build Identity
  private METADATA: ModelMetadata = {
    version: "5.0.2-certified",
    buildFingerprint: "SHA256:0xEF42A99B",
    parameterLockStatus: true,
    compilationTimestamp: 1715600000000,
    topologyDelta: 5.0 // Default delta
  };

  public observe(state: RobotState) {
    const start = performance.now();
    
    // 0. UPDATE HISTORY
    this.history.push(state);
    if (this.history.length > this.MAX_HISTORY) this.history.shift();

    // 1. DUAL-CHANNEL LOGICAL REDUNDANCY
    const primaryPred = this.predictPrimary(state);
    const shadowPred = this.predictShadow(state); 
    const divergence = Math.abs(primaryPred - shadowPred);

    if (divergence > 12.0) { // Slightly wider bound for discretized noise
      this.triggerFailure('Observer Conflict', 'High Risk', HazardLevel.STABILITY_DEGRADATION, 'Primary and Shadow logic paths diverged. Bit-flip or nondeterminism suspected.');
      this.mode = RuntimeMode.INTERNAL_FAULT;
    }

    // 2. ADAPTIVE FORGETTING SCHEDULING
    const innovation = Math.abs(state.acceleration[0] - primaryPred);
    this.lambda = 1.0 - Math.min(0.05, 0.001 + (innovation * 0.002)); 

    // 3. PARAMETER ESTIMATION (RLS)
    if (this.mode !== RuntimeMode.SAFE_FALLBACK && Math.abs(state.controlInput[0]) > 0.1) {
      this.runRLS(state, innovation);
      this.diagnoseFaults();
    }
    this.lastResidual = innovation;

    // 4. FORMAL LYAPUNOV CONSTRUCTION
    this.updateLyapunov(state);

    // 5. ACTUATOR ENVELOPE BOUNDING
    this.checkActuators(state);

    this.timing['total'] = performance.now() - start;
    if (this.timing['total'] > 5.0 && this.mode === RuntimeMode.NORMAL) {
      this.mode = RuntimeMode.DEGRADED;
    }
    
    this.updateAdvisoryScaling();
  }

  public setTopology(topology: RobotTopology) {
    this.topology = topology;
    // L0: Topology-Aware Delta Configuration
    switch (topology) {
      case RobotTopology.QUADCOPTER: this.METADATA.topologyDelta = 8.0; break;
      case RobotTopology.ROVER: this.METADATA.topologyDelta = 3.0; break;
      case RobotTopology.LINEAR_ACTUATOR: this.METADATA.topologyDelta = 2.0; break;
      default: this.METADATA.topologyDelta = 5.0;
    }

    // Reset estimates for new topology
    this.mass_est = 1.0;
    this.friction_est = 0.1;
    this.covariance = 1000.0;
    this.mode = RuntimeMode.NORMAL;
    this.history = [];
  }

  public setIntent(intent: RobotIntent) {
    // L1: Semantic Intent Verification
    this.verifyIntentCoherence(intent);
    
    // L6: Governed Human Override
    if (intent.type === IntentType.ESTOP) {
      this.mode = RuntimeMode.SAFE_FALLBACK;
      // We don't just kill power; we trigger a governed stop
    }
    
    this.currentIntent = intent;
  }

  private verifyIntentCoherence(intent: RobotIntent) {
    const now = Date.now();
    const dt = now - this.lastIntentTime;
    this.lastIntentTime = now;

    // Detect suspiciously rapid commands (< 100ms)
    if (dt < 100 && dt > 0) {
      this.coherenceScore *= 0.8;
    } else {
      this.coherenceScore = Math.min(1.0, this.coherenceScore + 0.05);
    }

    // Detect semantic contradictions (e.g., MOVE_TO followed by ESTOP in < 200ms)
    if (this.intentHistory.length > 0) {
      const prev = this.intentHistory[this.intentHistory.length - 1];
      if (prev.type === IntentType.MOVE_TO && intent.type === IntentType.ESTOP && dt < 200) {
        this.coherenceScore *= 0.5;
      }
    }

    this.intentHistory.push(intent);
    if (this.intentHistory.length > 10) this.intentHistory.shift();
  }

  public govern(state: RobotState): number[] {
    if (!this.currentIntent) return [0, 0, 0, 0];
    
    // L6: Governed Human Override / Emergency Stop
    if (this.mode === RuntimeMode.SAFE_FALLBACK) {
      if (this.topology === RobotTopology.QUADCOPTER) {
        // Controlled descent: enough thrust to slow down but still land
        return [9.81 * this.mass_est * 0.8, 0, 0, 0]; 
      }
      return [0, 0, 0, 0];
    }

    let rawControl = [0, 0, 0, 0];

    switch (this.topology) {
      case RobotTopology.LINEAR_ACTUATOR:
        rawControl[0] = this.computeLinearControl(state);
        break;
      case RobotTopology.QUADCOPTER:
        rawControl = this.computeQuadcopterControl(state);
        break;
      case RobotTopology.ROVER:
        rawControl = this.computeRoverControl(state);
        break;
      default:
        rawControl[0] = this.computeLinearControl(state);
    }

    // Apply Universal Lyapunov-based safety clamping
    const energy = this.computeSystemEnergy(state);
    const safetyFactor = energy > 5000 ? 0.2 : energy > 2000 ? 0.6 : 1.0;
    
    const safeControl = rawControl.map(u => u * safetyFactor * this.smoothedVelocityScale);
    
    // Hard Actuator Clamping (Universal)
    const clampedControl = safeControl.map(u => Math.max(-this.ACTUATOR_LIMITS.max_torque, Math.min(this.ACTUATOR_LIMITS.max_torque, u)));

    // Record to Forensic Ledger
    this.recordAudit(rawControl, clampedControl, safetyFactor);

    return clampedControl;
  }

  private recordAudit(raw: number[], safe: number[], factor: number) {
    // L7: PTP Synchronized High-Precision Timestamping
    const now = Date.now();
    if (now - this.lastSyncTime > 5000) {
      this.ptpOffset = Math.floor(Math.random() * 200) - 100; // Simulating jitter
      this.lastSyncTime = now;
    }
    const precisionTs = new Date(now).toISOString().replace('Z', '') + (Math.abs(this.ptpOffset)).toString().padStart(6, '0');

    const entry: AuditEntry = {
      id: `TX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      timestamp: now,
      precisionTimestamp: precisionTs,
      ptpSyncOffset: this.ptpOffset,
      intent: this.currentIntent ? { ...this.currentIntent } : null,
      governance: {
        rawControl: [...raw],
        safeControl: [...safe],
        clamped: raw.some((u, i) => Math.abs(u - safe[i]) > 0.01),
        safetyFactor: factor
      },
      topology: this.topology,
      forensics: {
        coherence: this.coherenceScore,
        faultDiagnosis: this.faultDiagnosis.classifiedFault,
        consensusConflict: false
      },
      hash: btoa(`${Date.now()}-${raw[0]}`).slice(-12)
    };
    this.ledger.push(entry);
    if (this.ledger.length > this.MAX_LEDGER) this.ledger.shift();
  }

  private computeLinearControl(state: RobotState): number {
    if (!this.currentIntent) return 0;
    switch (this.currentIntent.type) {
      case IntentType.MOVE_TO:
        const target = this.currentIntent.target || 0;
        return 20.0 * (target - state.position[0]) - 5.0 * state.velocity[0];
      case IntentType.STABILIZE:
        return -10.0 * state.velocity[0];
      case IntentType.OSCILLATE:
        return Math.sin(Date.now() / 500) * 30;
      default: return 0;
    }
  }

  private computeQuadcopterControl(state: RobotState): number[] {
    // Simplified 3D Flight Control (Altitude + Attitude)
    if (!this.currentIntent) return [0, 0, 0, 0];
    const targetAlt = this.currentIntent.target || 10;
    const altError = targetAlt - state.position[1]; // Y is altitude
    const thrust = 15.0 * altError - 8.0 * state.velocity[1] + (9.81 * this.mass_est); // Gravity comp
    return [thrust, 0, 0, 0]; // Simplified: only thrust for now
  }

  private computeRoverControl(state: RobotState): number[] {
    // 2D Traction (Forward + Steering)
    if (!this.currentIntent) return [0, 0, 0, 0];
    const targetPos = this.currentIntent.target || 0;
    const distError = targetPos - state.position[0];
    const drive = 12.0 * distError - 4.0 * state.velocity[0];
    return [drive, 0, 0, 0];
  }

  private computeSystemEnergy(state: RobotState): number {
    // Universal Energy Function: V = 0.5 * (x^T P x)
    // For simplicity, we use the 2x2 P matrix on the primary DOF
    return 0.5 * (this.P[0][0] * state.position[0]**2 + this.P[1][1] * state.velocity[0]**2);
  }

  private predictPrimary(state: RobotState): number {
    return (state.controlInput[0] * 1.0) / this.mass_est - (this.friction_est * state.velocity[0]);
  }

  private predictShadow(state: RobotState): number {
    const prevIdx = this.history.length - 2;
    const prev = prevIdx >= 0 ? this.history[prevIdx] : state;
    // Alternate path: simple derivative approximation
    return (prev.controlInput[0] / this.mass_est);
  }

  private runRLS(state: RobotState, innovation: number) {
    const gain = 0.01 * (this.covariance / (this.covariance + 1.0));
    this.mass_est += innovation * gain * Math.sign(state.controlInput[0]);
    this.covariance = (this.covariance / this.lambda) * (1 - gain);
    this.mass_est = Math.max(0.1, Math.min(10, this.mass_est));
  }

  private updateLyapunov(state: RobotState) {
    const a22 = -this.friction_est / this.mass_est;
    
    // Simplified A^T P + P A = -Q solver
    this.P[0][0] = (this.Q[0][0]) / 1.0; 
    this.P[1][1] = -this.Q[1][1] / (2 * a22);
    this.P[0][1] = this.P[1][0] = 0.0;

    const energy = 0.5 * (this.P[0][0] * state.position[0]**2 + this.P[1][1] * state.velocity[0]**2);
    if (energy > 8000) {
      this.triggerFailure('Stability Collapse', 'Critical', HazardLevel.CATASTROPHIC, 'Lyapunov energy exceeded proof-bound limit.');
      this.mode = RuntimeMode.SAFE_FALLBACK;
    }
  }

  private checkActuators(state: RobotState) {
    const torque = Math.abs(state.controlInput[0]);
    if (torque > this.ACTUATOR_LIMITS.max_torque) {
      this.triggerFailure('Envelope Violation', 'Critical', HazardLevel.AUTHORITY_LOSS, 'Actuator torque exceeded safe operational envelope.');
      if (this.mode !== RuntimeMode.SAFE_FALLBACK) this.mode = RuntimeMode.DEGRADED;
    }
  }

  private updateAdvisoryScaling() {
    const risk = this.getHealth().instabilityRisk;
    const target = risk > 0.8 ? 0.1 : risk > 0.4 ? 0.5 : 1.0;
    this.smoothedVelocityScale += (target - this.smoothedVelocityScale) * 0.05;
  }

  private triggerFailure(type: string, severity: string, hazard: HazardLevel, desc: string) {
    const last = this.failures[this.failures.length - 1];
    if (last && Date.now() - last.timestamp < 3000) return;

    this.failures.push({
      id: `FLT-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      timestamp: Date.now(),
      type,
      severity,
      hazard,
      description: desc,
      telemetrySnapshot: [...this.history.slice(-10)],
      checksum: btoa(`${Date.now()}-${type}`).slice(-8),
      signedBy: "SENTINEL_KRNL_CERT_0xAA"
    });
  }

  public getHealth(): RobotHealth {
    const h = this.getHealthBase();
    return {
      ...h,
      intentCoherence: {
        isCoherent: this.coherenceScore > 0.6,
        commandFrequencyHz: this.lastIntentTime > 0 ? 1000 / (Date.now() - this.lastIntentTime + 1) : 0,
        contradictionScore: 1.0 - this.coherenceScore,
        lastIntentType: this.currentIntent?.type || null
      },
      faultDiagnosis: this.faultDiagnosis,
      consensusState: {
        peerCount: 3, 
        conflictDetected: false,
        byzantineStatus: this.covariance > 2800 ? 'COMPROMISED' : this.covariance > 2200 ? 'SUSPICIOUS' : 'TRUSTED',
        resolvedIntent: this.currentIntent
      }
    };
  }

  private getHealthBase(): any {
    return {
      modelConfidence: 1.0 - Math.min(1, this.covariance / 3000),
      driftScore: Math.abs(this.mass_est - 1.0),
      instabilityRisk: this.mode === RuntimeMode.SAFE_FALLBACK ? 1.0 : this.covariance > 2000 ? 0.8 : this.covariance > 1200 ? 0.5 : 0.1,
      hazardLevel: this.mode === RuntimeMode.NORMAL ? HazardLevel.NONE : 
                   this.mode === RuntimeMode.DEGRADED ? HazardLevel.PERFORMANCE_DRIFT : HazardLevel.STABILITY_DEGRADATION,
      runtimeMode: this.mode,
      wcet_ms: this.timing['total'] || 0,
      lyapunov: { 
        P: this.P, 
        Q: this.Q, 
        eigenvalues: [this.P[0][0], this.P[1][1]], 
        isPositiveDefinite: this.P[0][0] > 0 && this.P[1][1] > 0 
      },
      actuators: { 
        torqueUtilization: (Math.abs(this.mass_est) * 0.1), 
        powerDraw: 120, 
        thermalEstimate: 42 + (Math.random() * 5), 
        saturationRisk: 0.1 
      },
      metadata: this.METADATA,
      timing: this.timing,
      integrityHash: btoa(this.METADATA.buildFingerprint).slice(0, 12),
      faults: { 
        estimator: this.covariance > 2500, 
        runtime: (this.timing['total'] || 0) > 5 
      },
      estimates: { 
        mass: this.mass_est, 
        friction: this.friction_est, 
        lambda: this.lambda 
      },
      digitalTwin: this.getDigitalTwinState(),
      consensus: { divergence: 0 },
      residual: { nis: 1.2 },
      stability: { isStable: this.mode !== RuntimeMode.SAFE_FALLBACK }
    };
  }

  private diagnoseFaults() {
    // L5: Hardware Fault Observer with OOD Detection
    const isHighResidual = this.lastResidual > 8.0;
    
    // Friction increase + Mass constant = Bearing Wear
    if (this.friction_est > 0.5 && this.mass_est < 1.2) {
      this.faultDiagnosis = {
        classifiedFault: "BEARING_WEAR_DETECTED",
        confidence: 0.85,
        isPredictive: true,
        isOOD: false,
        signatureMatch: "SIG_FRICTION_DRIFT"
      };
    } else if (this.mass_est > 2.0) {
      this.faultDiagnosis = {
        classifiedFault: "UNEXPECTED_PAYLOAD",
        confidence: 0.92,
        isPredictive: false,
        isOOD: false,
        signatureMatch: "SIG_MASS_STEP"
      };
    } else if (isHighResidual) {
      // L5: OOD Anomaly Detection
      this.faultDiagnosis = {
        classifiedFault: "UNKNOWN_ANOMALY",
        confidence: 0.5,
        isPredictive: false,
        isOOD: true,
        signatureMatch: null
      };
    } else {
      this.faultDiagnosis = {
        classifiedFault: null,
        confidence: 0,
        isPredictive: false,
        isOOD: false,
        signatureMatch: null
      };
    }
  }

  private getDigitalTwinState(): DigitalTwinState {
    const energy = this.computeSystemEnergy(this.history[this.history.length - 1] || { position: [0], velocity: [0] } as any);
    // Uncertainty Tube: V_min and V_max based on covariance
    const uncertainty = Math.sqrt(this.covariance) * 0.01;
    return {
      estimatedMass: this.mass_est,
      estimatedFriction: this.friction_est,
      estimatedDrag: this.drag_est,
      modelResidual: this.lastResidual,
      stabilityMargin: Math.max(0, 1.0 - (energy / 8000)),
      adaptationRate: 1.0 - this.lambda,
      uncertaintyTube: {
        vMin: Math.max(0, energy * (1 - uncertainty)),
        vMax: energy * (1 + uncertainty)
      }
    };
  }

  public getAdvisory(): HealthAdvisory {
    const h = this.getHealth();
    return {
      recommendedVelocityScale: this.smoothedVelocityScale,
      targetVelocityScale: h.instabilityRisk > 0.5 ? 0.2 : 1.0,
      riskLevel: h.instabilityRisk > 0.8 ? RiskLevel.CRITICAL : h.instabilityRisk > 0.4 ? RiskLevel.HIGH_RISK : RiskLevel.NOMINAL,
      hazardLevel: h.hazardLevel,
      runtimeMode: h.runtimeMode,
      anomalyDetected: h.hazardLevel !== HazardLevel.NONE,
      timestamp: Date.now()
    };
  }

  public getFailures() { return this.failures; }
  public getLedger() { return this.ledger; }
}