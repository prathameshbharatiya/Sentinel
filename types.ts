
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

export interface RobotState {
  position: number[];
  velocity: number[];
  acceleration: number[];
  controlInput: number[];
  timestamp: number;
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
