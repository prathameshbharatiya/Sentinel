
export enum RobotTopology {
  LINEAR_ACTUATOR = 'Linear Actuator (1-DOF)',
  QUADCOPTER = 'Quadcopter (3D-Flight)',
  ROVER = 'Mobile Rover (2D-Traction)',
  INDUSTRIAL_ARM = 'Robotic Arm (2-DOF)',
  EVTOL = 'eVTOL (Multi-Rotor Flight)',
  ROCKET = 'Rocket (Vertical Ascent)'
}

export enum IndustryProfile {
  GENERAL_ROBOTICS = 'General Robotics',
  AEROSPACE_LAUNCH = 'Aerospace & Launch',
  URBAN_AIR_MOBILITY = 'Urban Air Mobility',
  FLEET_LOGISTICS = 'Fleet & Logistics'
}

export enum RuntimeMode {
  NORMAL = 'Normal',
  CAUTIOUS = 'Cautious',
  RESTRICTED = 'Restricted',
  GOVERNED_HALT = 'Governed Halt',
  SAFE_STATE = 'Safe State',
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

export interface RigidBodyParameters {
  id: string;
  mass: number;
  friction: number;
  drag: number;
  covariance: number;
  lastResidual: number;
  lambda: number;
}

export interface DigitalTwinState {
  bodies: RigidBodyParameters[];
  isMultiBody: boolean;
  totalMass: number;
  estimatedMass: number;
  estimatedFriction: number;
  estimatedDrag: number;
  modelResidual: number;
  stabilityMargin: number;
  adaptationRate: number;
  massFlowRate?: number; // kg/s (dm/dt)
  uncertaintyTube: {
    vMin: number;
    vMax: number;
  };
  aero?: {
    machNumber: number;
    atmosphericDensity: number;
    dragCoefficient: number;
    speedOfSound: number;
    altitude: number;
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

export interface PeerNode {
  id: string;
  position: number[];
  status: 'TRUSTED' | 'SUSPICIOUS' | 'COMPROMISED';
  trajectory: number[][];
}

export interface ConsensusState {
  peerCount: number;
  conflictDetected: boolean;
  byzantineStatus: 'TRUSTED' | 'SUSPICIOUS' | 'COMPROMISED';
  resolvedIntent: RobotIntent | null;
  peers: PeerNode[];
  quorumReached: boolean;
  ackCount: number;
  requiredQuorum: number;
  commitmentTimeout: boolean;
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

export interface PtpStatus {
  offsetNs: number;
  syncQuality: 'EXCELLENT' | 'GOOD' | 'POOR' | 'CRITICAL';
  isTrustworthy: boolean;
  lastSyncTime: number;
}

export interface MissionEvent {
  id: string;
  timestamp: number;
  label: string;
  expectedMassDelta?: number;
  expectedFrictionDelta?: number;
  expectedDragDelta?: number;
  transitionWindowMs: number;
  isSeparation?: boolean;
}

export interface MissionPhaseState {
  currentEventId: string | null;
  nextEventId: string | null;
  timeToNextEvent: number;
  isPreparing: boolean;
  isTransitioning: boolean;
  tau_prepare: number;
}

export enum PlatformType {
  ARM_CORTEX_M7 = 'ARM Cortex-M7 (Embedded)',
  X86_SIMULATION = 'x86 (Simulation)',
  FPGA_ACCELERATED = 'FPGA (High-Performance)',
  RAD_HARD_PROCESSOR = 'Rad-Hard (Space-Grade)'
}

export interface PlatformDescriptor {
  type: PlatformType;
  actuatorWriteLatencyUs: number;
  sensorReadLatencyUs: number;
  interruptPriority: number;
  clockSource: 'INTERNAL' | 'EXTERNAL_PTP' | 'ATOMIC_REF';
  innerLoopTimingBudgetUs: number;
  floatingPointLatencyCycles: number;
}

export interface VerificationStatus {
  isVerified: boolean;
  dRealCertificate: string;
  coqProofHash: string;
  intervalStabilityGuaranteed: boolean;
  convexProjectionAdmissible: boolean;
  verificationTimestamp: number;
}

export interface RequirementTrace {
  id: string;
  description: string;
  status: 'VERIFIED' | 'PENDING' | 'FAILED';
  linkedCodeModules: string[];
}

export interface CoverageMetrics {
  statement: number;
  branch: number;
  mcdc: number;
}

export interface ProblemReport {
  id: string;
  summary: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  discoveryTimestamp: number;
}

export interface ComplianceStatus {
  dalLevel: 'A' | 'B' | 'C' | 'D' | 'E';
  requirementsTraceability: number; // percentage
  structuralCoverage: CoverageMetrics;
  openProblemReports: number;
  configurationManagementHash: string;
  isCertified: boolean;
}

export interface SafetyCriticalFunction {
  id: string;
  name: string;
  hazardContribution: string;
  controls: string[];
  ssaStatus: 'COMPLETE' | 'IN_PROGRESS' | 'PENDING';
}

export interface IvvStatus {
  isIndependent: boolean;
  contractorId: string;
  verifiedLayers: string[];
  lastAuditTimestamp: number;
}

export interface NasaComplianceStatus {
  standard: 'NASA-STD-8739.8';
  softwareSafetyAnalysis: SafetyCriticalFunction[];
  ivv: IvvStatus;
  isMissionReady: boolean;
}

export interface RotorHealth {
  id: string;
  currentDraw: number;
  rpm: number;
  vibration: number;
  healthScore: number; // 0.0 to 1.0
  status: 'NOMINAL' | 'DEGRADED' | 'FAILED';
}

export interface ControlAllocation {
  activeMatrixId: string; // e.g., "NOMINAL", "ROTOR_3_FAIL", "ROTOR_1_4_FAIL"
  isDegraded: boolean;
  redistributionActive: boolean;
}

export interface EvtolGovernance {
  rotors: RotorHealth[];
  allocation: ControlAllocation;
  emergencyLandingActive: boolean;
  nearestSafeZone: string;
}

export interface FtsStatus {
  isArmed: boolean;
  isTriggered: boolean;
  terminationReason: string | null;
  recoverabilityScore: number; // 0.0 to 1.0
  isRecoveryAttempted: boolean;
  safeCorridor: {
    minX: number;
    maxX: number;
    maxDrift: number;
  };
}

export interface RocketGovernance {
  fts: FtsStatus;
  stageStatus: 'BOOSTER_ACTIVE' | 'STAGING' | 'UPPER_STAGE';
  remainingFlightTime: number;
  engine: {
    chamberPressure: number; // psi
    isp: number; // seconds
    massFlowRate: number; // kg/s
    propellantRemaining: number; // kg
  };
}

export interface PreflightStatus {
  configValid: boolean;
  ros2TopicsLive: boolean;
  ledgerWritable: boolean;
  lyapunovBoundsSafe: boolean;
  isReady: boolean;
  lastCheckTimestamp: number;
}

export enum HardwarePlatform {
  ROBOTIC_ARM = 'ROBOTIC_ARM',
  AUTONOMOUS_DRONE = 'AUTONOMOUS_DRONE'
}

export interface MvkConfig {
  platform: HardwarePlatform;
  controllerType?: string;
  jointCount?: number;
  armModel?: string;
  flightController?: string;
  rotorConfig?: string;
  companionComputer?: string;
  limits: {
    maxVelPct?: number;
    maxTorquePct?: number;
    singularityBuffer?: number;
    confidenceThreshold: number;
    maxAltitude?: number;
    maxVelocity?: number;
    geofenceRadius?: number;
  };
}

export interface SafetyChecklist {
  estopTested: boolean;
  operatorPresent: boolean;
  areaClear: boolean;
  rosRunning: boolean;
  mvkNotRunning: boolean;
  // Arm specific
  armSecured?: boolean;
  jointLimitsVerified?: boolean;
  torqueLimitsConfigured?: boolean;
  effectorSafe?: boolean;
  // Drone specific
  droneTethered?: boolean;
  fcFailsafeConfigured?: boolean;
  geofenceSet?: boolean;
  safetyPilotReady?: boolean;
  propsBalanced?: boolean;
  batteryCharged?: boolean;
}

export interface RobotHealth {
  modelConfidence: number;
  driftScore: number;
  instabilityRisk: number;
  hazardLevel: HazardLevel;
  runtimeMode: RuntimeMode;
  wcet_ms: number;
  innerLoopWCET: number; // microseconds
  executionMode: '1kHz' | '10kHz';
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
  ptpStatus: PtpStatus;
  missionPhase: MissionPhaseState;
  platform: PlatformDescriptor;
  verification: VerificationStatus;
  compliance: ComplianceStatus;
  nasaCompliance: NasaComplianceStatus;
  evtolGovernance?: EvtolGovernance;
  rocketGovernance?: RocketGovernance;
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
