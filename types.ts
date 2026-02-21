
export enum RobotTopology {
  LINEAR_ACTUATOR = 'Linear Actuator (1-DOF)',
  QUADCOPTER = 'Quadcopter (3D-Flight)',
  ROVER = 'Mobile Rover (2D-Traction)',
  INDUSTRIAL_ARM = 'Robotic Arm (2-DOF)'
}

export enum RuntimeMode {
  NORMAL = 'Normal',
  DEGRADED = 'Degraded',
  SAFE_FALLBACK = 'Safe Fallback',
  INTERNAL_FAULT = 'Internal Fault'
}

export enum HazardLevel {
  NONE = 'H0: Nominal',
  PERFORMANCE_DRIFT = 'H1: Performance Drift',
  STABILITY_DEGRADATION = 'H2: Stability Degradation',
  AUTHORITY_LOSS = 'H3: Authority Loss',
  CATASTROPHIC = 'H4: Catastrophic Instability'
}

/**
 * Risk levels for robotic system stability.
 * Used for high-level safety coordination.
 */
export enum RiskLevel {
  NOMINAL = 'Nominal',
  HIGH_RISK = 'High Risk',
  CRITICAL = 'Critical'
}

export enum IntentType {
  MOVE_TO = 'MOVE_TO',
  STABILIZE = 'STABILIZE',
  ESTOP = 'ESTOP',
  OSCILLATE = 'OSCILLATE'
}

export interface RobotIntent {
  type: IntentType;
  target?: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: number;
}

export interface RobotState {
  position: number[];
  velocity: number[];
  acceleration: number[];
  controlInput: number[];
  timestamp: number;
  topology?: RobotTopology;
}

export interface LyapunovMatrix {
  P: number[][]; // Solution to A^T P + P A = -Q
  Q: number[][]; // Weighting matrix
  eigenvalues: number[];
  isPositiveDefinite: boolean;
}

export interface ActuatorHealth {
  torqueUtilization: number;
  powerDraw: number;
  thermalEstimate: number;
  saturationRisk: number;
}

export interface ModelMetadata {
  version: string;
  buildFingerprint: string;
  parameterLockStatus: boolean;
  compilationTimestamp: number;
  topologyDelta: number; // L0 Topology-Aware Reconciliation Delta
}

export interface DigitalTwinState {
  estimatedMass: number;
  estimatedFriction: number;
  estimatedDrag: number;
  modelResidual: number;
  stabilityMargin: number;
  adaptationRate: number;
  uncertaintyTube: {
    vMin: number;
    vMax: number;
  };
}

export interface IntentCoherence {
  isCoherent: boolean;
  commandFrequencyHz: number;
  contradictionScore: number;
  lastIntentType: IntentType | null;
}

export interface FaultDiagnosis {
  classifiedFault: string | null;
  confidence: number;
  isPredictive: boolean;
  isOOD: boolean; // Out-of-Distribution Anomaly Flag
  signatureMatch: string | null;
}

export interface ConsensusState {
  peerCount: number;
  conflictDetected: boolean;
  byzantineStatus: 'TRUSTED' | 'SUSPICIOUS' | 'COMPROMISED';
  resolvedIntent: RobotIntent | null;
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  precisionTimestamp: string; // PTP-Synchronized High-Precision Timestamp
  ptpSyncOffset: number; // Clock offset from fleet master (nanoseconds)
  intent: RobotIntent | null;
  governance: {
    rawControl: number[];
    safeControl: number[];
    clamped: boolean;
    safetyFactor: number;
  };
  topology: RobotTopology;
  forensics: {
    coherence: number;
    faultDiagnosis: string | null;
    consensusConflict: boolean;
  };
  hash: string;
}

export interface RobotHealth {
  modelConfidence: number;
  driftScore: number;
  instabilityRisk: number;
  hazardLevel: HazardLevel;
  runtimeMode: RuntimeMode;
  wcet_ms: number;
  lyapunov: LyapunovMatrix;
  actuators: ActuatorHealth;
  metadata: ModelMetadata;
  timing: { [key: string]: number };
  integrityHash: string;
  faults: { [key: string]: boolean };
  estimates: { [key: string]: number };
  digitalTwin: DigitalTwinState;
  intentCoherence: IntentCoherence;
  faultDiagnosis: FaultDiagnosis;
  consensusState: ConsensusState;
  consensus: { [key: string]: number };
  residual: { [key: string]: any };
  stability: { [key: string]: any };
}

export interface HealthAdvisory {
  recommendedVelocityScale: number;
  targetVelocityScale: number;
  riskLevel: RiskLevel;
  hazardLevel: HazardLevel;
  runtimeMode: RuntimeMode;
  anomalyDetected: boolean;
  timestamp: number;
}

export interface FailureEvent {
  id: string;
  timestamp: number;
  type: string;
  severity: string;
  hazard: HazardLevel;
  description: string;
  telemetrySnapshot: RobotState[];
  checksum: string;
  signedBy: string; // Safety-Critical Kernel Signer
}
