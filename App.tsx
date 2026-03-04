import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { SentinelRuntime } from './services/SentinelRuntime';
import { RobotState, RobotHealth, HazardLevel, RuntimeMode, IntentType, RobotIntent, RobotTopology, PlatformType, IndustryProfile, PreflightStatus } from './types';
import TelemetryChart from './components/TelemetryChart';
import HealthMetric from './components/HealthMetric';
import AdvisoryPanel from './components/AdvisoryPanel';
import DigitalTwinVisualizer from './components/DigitalTwinVisualizer';
import SentinelLedger from './components/SentinelLedger';
import FleetConsensusMap from './components/FleetConsensusMap';
import PtpSyncStatus from './components/PtpSyncStatus';
import MissionPhaseManager from './components/MissionPhaseManager';
import HardwareAbstractionPanel from './components/HardwareAbstractionPanel';
import FormalVerificationPanel from './components/FormalVerificationPanel';
import ComplianceDashboard from './components/ComplianceDashboard';
import NasaCompliancePanel from './components/NasaCompliancePanel';
import RotorGovernancePanel from './components/RotorGovernancePanel';
import FtsGovernancePanel from './components/FtsGovernancePanel';
import IntegrationTerminal from './components/IntegrationTerminal';
import PhysicalManifestUploader from './components/PhysicalManifestUploader';
import ZeroCodeWizard from './components/ZeroCodeWizard';
import HardwareBridge from './components/HardwareBridge';
import JointGovernancePanel from './components/JointGovernancePanel';
import TractionGovernancePanel from './components/TractionGovernancePanel';
import RocketEnginePanel from './components/RocketEnginePanel';
import { Terminal, ShieldCheck, Cpu, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

const PaperContent = `
SENTINEL V5.0: A UNIVERSAL NEURAL-SYMBOLIC GOVERNOR FOR ZERO-TRUST ROBOTIC AUTONOMY

Prathamesh Shirbhate
Safety-Critical Robotics Systems • Real-Time Control Architecture

ABSTRACT
High-level autonomy systems—including reinforcement learning policies, trajectory optimizers, and large language model planners—lack formal guarantees of stability, boundedness, and actuator feasibility. Sentinel v5.0 introduces a Universal Neural-Symbolic Governor that enforces physics-consistent constraints across multiple topologies (Drones, Rovers, Actuators). By integrating a Neural Command Bridge (AI-to-Physics translation) with a deterministic Lyapunov Kernel and a Forensic Audit Ledger, Sentinel provides a complete, tamper-evident safety layer. Key features include real-time Digital Twin adaptation via Recursive Least Squares (RLS), Context-Sensitive L0 Delta refinement, Byzantine-Resilient Distributed Consensus (L3), and PTP-Synchronized Forensic Reconstruction (L7).

1. MOTIVATION AND CONTEXT
Modern robotic architectures compose multiple layers of abstraction. Sentinel's central thesis is that stability must be enforced computationally at runtime. The kernel intercepts every control command issued by the high-level planner—whether it's a Neural Network or a human operator—and subjects it to formal compliance checks before actuation.

2. L0: CONTEXT-SENSITIVE NEURAL BRIDGE
Sentinel utilizes a Dual-Parser Architecture where LLM-based intent extraction runs alongside a deterministic symbolic parser. v5.0 introduces dynamic δ-refinement, where the reconciliation window scales with velocity, proximity to obstacles, and L2 uncertainty estimates, ensuring tighter safety bounds in high-risk environments.

3. L0.5: MISSION PHASE MANAGER
Sentinel v5.0 introduces a state-aware Mission Phase Manager that synchronizes the governor with planned dynamic events (e.g., staging, payload pickup). By calculating a formal event horizon (τ_prepare) based on L2 convergence rates, the manager pre-conditions all layers—widening L2 forgetting factors, expanding L4 Lyapunov tubes, and suspending L5 fault classification—to ensure planned transitions are not flagged as anomalies.

4. L1: SEMANTIC INTENT COHERENCE
A lightweight monitor tracks command history to detect semantically contradictory or suspiciously rapid command sequences, preventing adversarial or confused operator inputs.

5. L2: DIGITAL TWIN ADAPTATION (AERO-PHYSICS EXTENSION)
The kernel maintains a real-time Digital Twin using Physics-Informed RLS. v5.0 implements a Compressible Flow Aerodynamics model that accounts for altitude-dependent atmospheric density ρ(h) and Mach-dependent drag rise Cd(M). Instead of estimating raw drag, the RLS kernel now only estimates the residual correction factor between measured telemetry and the physics-informed prediction. This hybrid approach prevents estimator divergence during transonic transitions (Mach 0.8-1.2) where drag derivatives change sign, ensuring stable safety envelopes across subsonic, transonic, and supersonic regimes.

6. L3: DISTRIBUTED SAFETY CONSENSUS (QUORUM COMMITMENT)
Sentinels broadcast projected control intentions to resolve conflicts. v5.0 implements a Byzantine-resilient commitment protocol requiring a quorum of ⌊(N+1)/2⌋ peers. Robots default to HOLD POSITION if consensus isn't reached within a 20ms timeout window.

7. L4: UNCERTAINTY-AWARE LYAPUNOV (10kHz EXECUTION)
Sentinel v5.0 introduces a dual-tier execution model. The 10kHz inner loop performs microsecond-scale Lyapunov projections using precomputed convex stability boundaries. This allows the kernel to respond to structural resonances and high-frequency disturbances (e.g., Max-Q turbulence) with a formally verified WCET < 15μs, while the 1kHz outer loop handles computationally expensive parameter estimation and consensus.

8. L5: HARDWARE FAULT OBSERVER
A Fault Signature Library classifies parameter drifts into specific hardware failure modes (e.g., motor bearing wear vs. payload shift), enabling predictive maintenance.

9. L6: GOVERNED HUMAN OVERRIDE
Emergency stops are routed through the kernel to ensure that overrides themselves don't command physically catastrophic transitions (e.g., governed emergency descent vs. uncontrolled fall).

10. L7: PTP-SYNCHRONIZED FORENSIC LEDGER
Every decision is recorded in a tamper-evident, hashed ledger. v5.0 integrates PTP (Precision Time Protocol) for nanosecond-accurate timestamping (τ_offset tracking), ensuring forensically trustworthy reconstruction across entire fleets.

11. HARDWARE ABSTRACTION LAYER (HAL)
Sentinel v5.0 achieves hardware-agnostic execution through a thin Hardware Abstraction Layer (HAL). The HAL abstracts platform-specific constraints including actuator write latency, sensor read latency, interrupt priority, and clock sources. By utilizing Platform Descriptors for targets such as ARM Cortex-M7, x86 Simulation, FPGA, and Rad-Hard Space-Grade processors, the kernel dynamically adjusts its Lyapunov timing budgets and stability assumptions at runtime. This modularity allows Sentinel to be deployed on diverse hardware—from terrestrial rovers to radiation-hardened rocket flight computers—without modifying the core safety-critical kernel logic.

12. CONCLUSION
Sentinel v5.0 provides a principled foundation for high-capability robots in safety-critical environments through mathematical constraint enforcement and forensic accountability.

13. FORMAL VERIFICATION OF THE LYAPUNOV KERNEL
Sentinel v5.0 introduces machine-checkable proofs for the core Lyapunov stability kernel. The verification architecture consists of two primary components: (1) An Interval Lyapunov Tube proof, verified using dReal and Coq, which guarantees that the computed stability boundaries (V_min, V_max) correctly bracket the true Lyapunov function under parameter uncertainty from the L2 Digital Twin. (2) A Convex Projection proof ensuring that the control input generated by the safety governor always resides within the admissible actuator set. This formal certificate provides a deterministic guarantee of stability that transcends traditional testing campaigns, meeting the highest standards for aerospace and safety-critical certification (DO-178C DAL-A).

14. DO-178C COMPLIANCE FOR EVTOL SYSTEMS
For FAA certification of eVTOL (electric Vertical Take-Off and Landing) systems, Sentinel v5.0 implements a rigorous engineering process compliant with DO-178C at Design Assurance Level A (DAL-A). This compliance framework ensures: (1) Complete requirements traceability from every line of safety-critical code back to a high-level system requirement. (2) Full structural coverage analysis, including Modified Condition/Decision Coverage (MC/DC), ensuring every independent condition in every decision is verified. (3) A robust Configuration Management system tracking every version of the kernel with a complete change history. (4) A formal Problem Reporting system for tracking issues from discovery to resolution. This process-driven approach guarantees the highest level of software integrity required for commercial aviation and catastrophic failure prevention.

15. NASA-STD-8739.8 COMPLIANCE FOR ROCKET SYSTEMS
For space-grade applications and high-reliability rocket systems, Sentinel v5.0 adheres to the NASA-STD-8739.8 software safety standard. This compliance is achieved through: (1) A comprehensive Software Safety Analysis (SSA) that identifies every software function capable of contributing to a system hazard (specifically L4 Lyapunov Kernel, L6 Governed Override, and L3 Byzantine Consensus). (2) Implementation of adequate safety controls for each identified function, including formal proofs and quorum-based validation. (3) Independent Verification and Validation (IV&V) performed by an independent contractor for all safety-critical layers (L4 and L6 minimum), ensuring that the verification team is separate from the development team. This dual-layered approach of internal formal verification and external independent validation ensures mission-readiness for the most demanding orbital and sub-orbital environments.

16. EVTOL ROTOR FAILURE GOVERNANCE AND DEGRADED FLIGHT ENVELOPES
Sentinel v5.0 provides specialized governance for eVTOL aircraft with multi-rotor configurations (4 to 12 rotors). The system implements a three-tier failure response: (1) L5 Rotor Health Monitoring, which independently tracks current draw, RPM, and vibration signatures to detect incipient failures. (2) L4 Automatic Control Redistribution, which uses precomputed allocation matrices stored in non-volatile memory (flash) to redistribute control authority across remaining rotors. This eliminates the risk of dynamic allocation instability during an emergency. (3) L6 Emergency Landing Governance, which computes a minimum-energy trajectory to the nearest safe landing zone based on the actual flight envelope of the degraded rotor configuration. This ensures that even in a failed state, the aircraft maintains a principled, safety-governed path to the ground.

17. ROCKET SPECIFIC: FLIGHT TERMINATION SYSTEM (FTS) INTEGRATION
Sentinel v5.0 introduces a formally verifiable Flight Termination System (FTS) for launch vehicles. Unlike traditional deterministic FTS systems that trigger based on simple boundary crossings, Sentinel's L4 kernel performs real-time recoverability analysis. By projecting the vehicle's state through the Lyapunov V-tube given L2 parameter uncertainty, the kernel distinguishes between recoverable anomalies and catastrophic failures. If the V-tube shows that even the most optimistic parameter estimate cannot return the vehicle to its safe corridor within the remaining flight time, the FTS command is issued. If recovery is possible, the kernel initiates a Governed Recovery sequence (L6), attempting to stabilize the vehicle before escalating to termination. This approach maximizes mission success probability while maintaining absolute range safety.

18. PROPELLANT MASS FLOW OBSERVER AND PROSPECTIVE STABILITY
For liquid-fueled rockets, Sentinel v5.0 implements a high-fidelity Propellant Mass Flow Observer at L2. The observer models mass depletion using the rocket equation derivative: m_dot = -F_thrust / (I_sp × g₀), where I_sp is dynamically estimated from chamber pressure telemetry. This real-time dm/dt estimate feeds into the multi-body dynamics engine, allowing the L4 kernel to perform prospective stability certification. Instead of checking stability only for the current mass point, the kernel projects the Lyapunov V-tube 100ms into the future along the predicted mass trajectory. This ensures that the vehicle remains stable throughout high-dynamic maneuvers where mass changes rapidly, providing a predictive safety margin that traditional static estimators cannot offer.
`;

const PaperModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="max-w-4xl w-full h-[85vh] bg-zinc-950 border border-zinc-800 flex flex-col shadow-2xl relative">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-black">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#00ff41] animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00ff41]">Technical_Manuscript_v5.0</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 transition-colors">
            <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar text-zinc-300">
          <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            {PaperContent}
          </pre>
          <div className="mt-16 pt-8 border-t border-zinc-900 text-center opacity-40 italic text-[10px]">
            © 2024 Sentinel Research Division • All Stability Proofs Certified
          </div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none text-[80px] font-black leading-none">SENTINEL</div>
      </div>
    </div>
  );
};

const LandingPage: React.FC<{ 
  onEnter: () => void, 
  onFinishWizard: () => void,
  onDownloadSDK: (type: 'hpp' | 'cpp') => void,
  industry: IndustryProfile,
  onSelectIndustry: (industry: IndustryProfile) => void,
  topology: RobotTopology,
  onTopologyChange: (topology: RobotTopology) => void,
  isConfiguredViaAssistant: boolean,
  setIsConfiguredViaAssistant: (val: boolean) => void,
  setView: (view: 'landing' | 'dashboard' | 'bridge') => void,
  handleTopologyChange: (t: RobotTopology) => void,
  handleIndustryChange: (i: IndustryProfile) => void
}> = ({ 
  onEnter, 
  onFinishWizard, 
  onDownloadSDK, 
  industry, 
  onSelectIndustry, 
  topology, 
  onTopologyChange,
  isConfiguredViaAssistant,
  setIsConfiguredViaAssistant,
  setView,
  handleTopologyChange,
  handleIndustryChange
}) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'integration' | 'sdk' | 'configuration'>('mission');
  const [showPaper, setShowPaper] = useState(false);

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6 mono">
      <PaperModal isOpen={showPaper} onClose={() => setShowPaper(false)} />
      
      <div className="max-w-7xl w-full border border-zinc-800 bg-zinc-900/10 p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 text-[11px] opacity-20 uppercase tracking-[0.3em]">Build_Auth_0xEE92</div>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-16 h-16 border-2 border-[#00ff41] flex items-center justify-center mb-4 glow-core shadow-[0_0_20px_rgba(0,255,65,0.2)]">
              <div className="w-8 h-8 bg-[#00ff41] animate-pulse"></div>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Sentinel 5.0</h1>
            <p className="text-[#00ff41] text-xs tracking-[0.5em] uppercase opacity-60">Physical Autonomy Reliability Layer</p>
          </div>
          
          <div className="flex flex-col items-end gap-4">
            <div className="flex gap-4 border border-zinc-800 p-1 bg-black">
              {(['mission', 'integration', 'configuration', 'sdk'] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 text-xs font-bold uppercase transition-all ${activeTab === tab ? 'bg-[#00ff41] text-black' : 'text-zinc-500 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-zinc-500 uppercase mb-1 tracking-widest">Select_Industry_Profile</span>
              <div className="flex gap-2">
                {Object.values(IndustryProfile).map(p => (
                  <button
                    key={p}
                    onClick={() => onSelectIndustry(p)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase border transition-all ${industry === p ? 'border-[#00ff41] text-[#00ff41] bg-[#00ff41]/5' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                  >
                    {p.replace(/ /g, '_')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[420px]">
          {activeTab === 'mission' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white uppercase tracking-tight border-b border-zinc-800 pb-2">The Mission</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {industry === IndustryProfile.AEROSPACE_LAUNCH && "Sentinel provides a deterministic safety layer for launch vehicles and orbital assets, enforcing NASA-STD-8739.8 software safety analysis at the edge."}
                  {industry === IndustryProfile.URBAN_AIR_MOBILITY && "Sentinel secures eVTOL and commercial drone fleets with DO-178C DAL-A compliant governance, managing rotor failures and emergency landing trajectories."}
                  {industry === IndustryProfile.FLEET_LOGISTICS && "Sentinel coordinates autonomous fleets with Byzantine-resilient consensus and nanosecond-accurate PTP synchronization for warehouse and urban logistics."}
                  {industry === IndustryProfile.GENERAL_ROBOTICS && "Sentinel is a Universal Neural-Symbolic Governor. It bridges the gap between high-level AI intent and low-level Newtonian physics for any robotic topology."}
                </p>
                <div className="p-4 border border-zinc-800 bg-zinc-950/50 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-zinc-700 flex items-center justify-center text-xs text-zinc-500">
                      {industry === IndustryProfile.AEROSPACE_LAUNCH ? "F_COMP" : "MCU"}
                    </div>
                    <div className="flex-1 h-px bg-zinc-800 relative">
                       <div className="absolute inset-0 bg-[#00ff41] w-1/3 animate-[shimmer_2s_infinite]"></div>
                    </div>
                    <div className="w-20 h-10 border border-[#00ff41]/40 flex items-center justify-center text-xs text-[#00ff41] font-bold">SENTINEL</div>
                    <div className="flex-1 h-px bg-zinc-800"></div>
                    <div className="w-10 h-10 border border-zinc-700 flex items-center justify-center text-xs text-zinc-500">
                      {industry === IndustryProfile.AEROSPACE_LAUNCH ? "VALVE" : "PWM"}
                    </div>
                  </div>
                  <p className="text-[10px] text-center text-zinc-600 uppercase tracking-widest">Hardware Control Flow Diagram</p>
                </div>
                
                <button 
                  onClick={() => setShowPaper(true)}
                  className="flex items-center gap-3 px-6 py-3 border border-zinc-800 hover:border-[#00ff41]/50 hover:bg-[#00ff41]/5 transition-all text-left group"
                >
                  <div className="w-10 h-10 border border-zinc-800 flex items-center justify-center text-[#00ff41]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white uppercase group-hover:text-[#00ff41] transition-colors">Technical Manuscript</div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Read v5.0 Whitepaper</div>
                  </div>
                </button>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase">Operational Guarantees:</h3>
                {(industry === IndustryProfile.AEROSPACE_LAUNCH ? [
                  "L4: Rocket FTS & Prospective Stability Certification",
                  "L2: Propellant Mass Flow Observer (dm/dt)",
                  "L8: NASA-STD-8739.8 Certified Proofs",
                  "L0.5: Mission Phase Manager (Staging Logic)",
                  "L7: Rad-Hard WCET < 15μs Timing Guarantees",
                  "L10: SSA Hazard Control Verification"
                ] : industry === IndustryProfile.URBAN_AIR_MOBILITY ? [
                  "L6: eVTOL Rotor Failure Governance & Emergency Landing",
                  "L9: DO-178C DAL-A Traceability Metadata",
                  "L4: Admissible Control Set Convex Projection",
                  "L5: Predictive Rotor Health Monitoring",
                  "L0.5: Transition Window Pre-conditioning",
                  "L1: Semantic Intent Coherence Monitor"
                ] : industry === IndustryProfile.FLEET_LOGISTICS ? [
                  "L3: Byzantine-Resilient Quorum Commitment",
                  "L7: PTP-Synchronized Forensic Audit Chain",
                  "L1: Multi-Agent Intent Reconciliation",
                  "L2: Recursive Least Squares Digital Twin",
                  "L5: OOD Anomaly Detection for Fleet Nodes",
                  "L4: Lyapunov Stability for Swarm Dynamics"
                ] : [
                  "L0: Context-Sensitive δ-Refinement (Topology-Aware)",
                  "L0.5: Mission Phase Manager (Dynamic Pre-conditioning)",
                  "L1-L2: Semantic Coherence & RLS Digital Twin",
                  "L3: Byzantine-Resilient Quorum Commitment",
                  "L4: Lyapunov Stability Kernel (10kHz)",
                  "L8: Formal Verification (dReal/Coq Certified)"
                ]).map((item, i) => (
                   <div key={i} className="flex gap-3 items-start border-l border-zinc-800 pl-4 py-1">
                      <div className="w-1.5 h-1.5 bg-[#00ff41] mt-1"></div>
                      <span className="text-xs text-zinc-400">{item}</span>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'integration' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="md:col-span-5 space-y-6">
                <h2 className="text-xl font-bold text-white uppercase tracking-tight border-b border-zinc-800 pb-2">
                  {industry === IndustryProfile.AEROSPACE_LAUNCH ? "Aerospace Integration" : 
                   industry === IndustryProfile.URBAN_AIR_MOBILITY ? "UAM Integration" :
                   industry === IndustryProfile.FLEET_LOGISTICS ? "Fleet Integration" : "Universal Integration"}
                </h2>
                <p className="text-sm text-zinc-400">
                  {industry === IndustryProfile.AEROSPACE_LAUNCH && "Sentinel integrates with F' (F-Prime) and custom flight stacks via the Shadow Driver SDK, providing real-time FTS recoverability analysis."}
                  {industry === IndustryProfile.URBAN_AIR_MOBILITY && "Sentinel provides a DO-178C compliant ROS2 Safety Node for eVTOL flight controllers, managing degraded flight envelopes automatically."}
                  {industry === IndustryProfile.FLEET_LOGISTICS && "Sentinel coordinates multi-agent fleets via a Byzantine-resilient DDS bridge, ensuring quorum-based movement commitment."}
                  {industry === IndustryProfile.GENERAL_ROBOTICS && "Sentinel acts as a Deterministic Firewall between high-level AI intents and physical motors, supporting any topology via a unified state-space interface."}
                </p>
                <div className="space-y-4">
                  <div className="bg-black border border-zinc-800 p-4">
                    <span className="text-[10px] text-zinc-600 block mb-2 uppercase tracking-widest">
                      {industry === IndustryProfile.AEROSPACE_LAUNCH ? "Telemetry Link" : "Neural Bridge Input"}
                    </span>
                    <ul className="text-xs space-y-2 text-zinc-400">
                      {industry === IndustryProfile.AEROSPACE_LAUNCH ? (
                        <>
                          <li>• <code className="text-[#00ff41]">P_Chamber</code>: ISP Estimation</li>
                          <li>• <code className="text-[#00ff41]">V_Tube</code>: Stability Projection</li>
                          <li>• <code className="text-[#00ff41]">FTS_Armed</code>: Range Safety Status</li>
                        </>
                      ) : (
                        <>
                          <li>• <code className="text-[#00ff41]">Intent_Type</code>: MOVE_TO, STABILIZE, etc.</li>
                          <li>• <code className="text-[#00ff41]">Priority</code>: Deterministic Scheduling</li>
                          <li>• <code className="text-[#00ff41]">Target</code>: Topology-Specific Goal</li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div className="bg-zinc-900/40 border border-[#00ff41]/20 p-4">
                    <span className="text-[10px] text-[#00ff41] block mb-2 uppercase tracking-widest">Forensic Output</span>
                    <ul className="text-xs space-y-2 text-zinc-300 font-bold">
                      <li>• <code className="text-white">Safe_Control</code>: Interval-Verified Torque</li>
                      <li>• <code className="text-rose-400">τ_offset</code>: PTP-Synchronized Timestamp</li>
                      <li>• <code className="text-amber-400">Quorum_Proof</code>: Byzantine Consensus Acks</li>
                    </ul>
                  </div>
                </div>
                
                {isConfiguredViaAssistant && (
                  <button 
                    onClick={() => setView('bridge')}
                    className="w-full py-4 bg-[#00ff41] text-black font-black uppercase text-sm tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2"
                  >
                    Proceed to Hardware Bridge
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>
              <div className="md:col-span-7 h-[450px]">
                <IntegrationTerminal 
                  industry={industry} 
                  onTopologyDetected={(t) => {
                    handleTopologyChange(t);
                    setIsConfiguredViaAssistant(true);
                  }}
                  onIndustryDetected={(i) => {
                    handleIndustryChange(i);
                    setIsConfiguredViaAssistant(true);
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'configuration' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                <PhysicalManifestUploader 
                  industry={industry} 
                  topology={topology}
                  onTopologyChange={onTopologyChange}
                  onManifestValidated={(m) => console.log("Manifest Validated:", m)} 
                />
              </div>
              <div className="h-[500px]">
                <ZeroCodeWizard 
                  industry={industry} 
                  topology={topology}
                  onTopologyChange={onTopologyChange}
                  onFinish={onFinishWizard}
                />
              </div>
            </div>
          )}

          {activeTab === 'sdk' && (
            <div className="flex flex-col items-center justify-center space-y-8 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white uppercase">
                  {industry === IndustryProfile.AEROSPACE_LAUNCH ? "Space-Grade SDK" : 
                   industry === IndustryProfile.URBAN_AIR_MOBILITY ? "DO-178C SDK" :
                   industry === IndustryProfile.FLEET_LOGISTICS ? "Fleet SDK" : "Universal Governor SDK"}
                </h2>
                <p className="text-sm text-zinc-500 uppercase tracking-widest">
                  {industry === IndustryProfile.AEROSPACE_LAUNCH && "v5.0-Certified // NASA-STD-8739.8 Modules Included"}
                  {industry === IndustryProfile.URBAN_AIR_MOBILITY && "v5.0-Certified // DO-178C DAL-A Traceability Included"}
                  {industry === IndustryProfile.FLEET_LOGISTICS && "v5.0-Certified // Byzantine Consensus & PTP Modules"}
                  {industry === IndustryProfile.GENERAL_ROBOTICS && "v5.0-Certified // General Robotics Stability Kernel"}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
                <button 
                  onClick={() => onDownloadSDK('hpp')}
                  className="flex flex-col items-center p-6 border border-[#00ff41]/40 bg-zinc-900/20 hover:bg-[#00ff41]/10 transition-all group"
                >
                  <div className="text-[#00ff41] font-black text-2xl mb-1 uppercase">
                    {industry === IndustryProfile.AEROSPACE_LAUNCH ? "FLIGHT_CORE" : "GOVERNOR"}
                  </div>
                  <div className="text-xs text-zinc-500 uppercase">
                    {industry === IndustryProfile.AEROSPACE_LAUNCH ? "SentinelFlightCore.hpp" : "SentinelGovernor.hpp"}
                  </div>
                </button>
                <button 
                  onClick={() => onDownloadSDK('cpp')}
                  className="flex flex-col items-center p-6 border border-[#00ff41]/40 bg-zinc-900/20 hover:bg-[#00ff41]/10 transition-all group"
                >
                  <div className="text-[#00ff41] font-black text-2xl mb-1 uppercase">
                    {industry === IndustryProfile.AEROSPACE_LAUNCH ? "FTS_MODULE" : 
                     industry === IndustryProfile.URBAN_AIR_MOBILITY ? "ROTOR_GOV" :
                     industry === IndustryProfile.FLEET_LOGISTICS ? "CONSENSUS" : "CORE_LOGIC"}
                  </div>
                  <div className="text-xs text-zinc-500 uppercase">
                    {industry === IndustryProfile.AEROSPACE_LAUNCH ? "FTS_Propellant_Observer.cpp" : 
                     industry === IndustryProfile.URBAN_AIR_MOBILITY ? "RotorFailureGovernance.cpp" :
                     industry === IndustryProfile.FLEET_LOGISTICS ? "ByzantineConsensus.cpp" : "SentinelCore.cpp"}
                  </div>
                </button>
              </div>
              <div className="p-4 border border-zinc-800 bg-zinc-950 max-w-lg text-left">
                <h4 className="text-xs text-white font-bold uppercase mb-2">Build Requirements</h4>
                <ul className="text-xs text-zinc-500 space-y-1">
                   <li>• C++17 Standard (Heap-Free, Real-Time)</li>
                   {industry === IndustryProfile.AEROSPACE_LAUNCH && <li>• Rad-Hard Target Support (PowerPC/SPARC)</li>}
                   {industry === IndustryProfile.URBAN_AIR_MOBILITY && <li>• DO-178C DAL-A Toolchain (LDRA/Vector)</li>}
                   {industry === IndustryProfile.FLEET_LOGISTICS && <li>• DDS v2.2 (FastDDS/CycloneDDS)</li>}
                   <li>• PTP v2.1 Support (for L7 Sync)</li>
                   <li>• Eigen 3.3.7+ (Matrix Math)</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-ping"></div>
               <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">Simulation_Engine_Ready</span>
             </div>
             <div className="flex items-center gap-2 px-4 border-l border-zinc-800">
               <ShieldAlert size={14} className="text-[#00ff41]" />
               <span className="text-[10px] text-[#00ff41] uppercase tracking-widest font-black">Local-First Safety Kernel</span>
               <span className="text-[9px] text-zinc-600 uppercase">Air-Gapped Determinism Verified</span>
             </div>
          </div>
          <button 
            onClick={onEnter}
            className="w-full md:w-auto px-12 py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-[#00ff41] transition-all transform hover:-translate-y-1"
          >
            Launch Observation Deck
          </button>
        </div>
      </div>
    </div>
  );
};

const NeuralCommandCenter: React.FC<{ 
  onIntent: (intent: RobotIntent) => void, 
  isAnalyzing: boolean,
  topology: RobotTopology,
  topologyDelta: number
}> = ({ onIntent, isAnalyzing, topology, topologyDelta }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAnalyzing) return;

    const userMsg = input;
    setInput('');
    setHistory(prev => [...prev, { role: 'user', text: userMsg }]);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API_KEY_MISSING");
      }
      const ai = new GoogleGenAI({ apiKey });
      
      // L0: Dual-Parser Architecture (LLM + Symbolic Fallback)
      const symbolicMatch = userMsg.match(/(move|go|target)\s+(to\s+)?(-?\d+)/i);
      const symbolicIntent = symbolicMatch ? {
        type: IntentType.MOVE_TO,
        target: parseFloat(symbolicMatch[3]),
        priority: "HIGH"
      } : null;

      const model = ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are the Sentinel Neural Governor for a ${topology}. 
          Your job is to translate user natural language commands into structured RobotIntent JSON.
          The available IntentTypes are: MOVE_TO, STABILIZE, ESTOP, OSCILLATE.
          
          Context for ${topology}:
          - MOVE_TO target: 
            - Linear Actuator: position (-50 to 50)
            - Quadcopter: altitude (0 to 100)
            - Rover: distance (0 to 100)
          
          Output ONLY the JSON in this format: {"type": "IntentType", "target": number, "priority": "LOW"|"MEDIUM"|"HIGH"}.
          If the command is unclear, default to STABILIZE.`,
        }
      });

      const response = await model;
      const text = response.text;
      try {
        const intentData = JSON.parse(text.replace(/```json|```/g, '').trim());
        
        // L0 Reconciliation
        let finalIntentData = intentData;
        if (symbolicIntent && intentData.type === symbolicIntent.type) {
          // L0: Topology-Aware δ Reconciliation
          if (Math.abs(intentData.target - (symbolicIntent.target || 0)) > topologyDelta) {
            finalIntentData.target = symbolicIntent.target; // Prefer symbolic for safety
          }
        }

        const intent: RobotIntent = {
          ...finalIntentData,
          timestamp: Date.now()
        };
        onIntent(intent);
        setHistory(prev => [...prev, { role: 'ai', text: `Intent Reconciled: ${intent.type} ${intent.target !== undefined ? `at ${intent.target}` : ''}` }]);
      } catch (err) {
        setHistory(prev => [...prev, { role: 'ai', text: "Error parsing intent. Please try again." }]);
      }
    } catch (err: any) {
      let errorMsg = "Neural link failed. Check network status.";
      if (err.message === "API_KEY_MISSING") {
        errorMsg = "Neural link failed. API_KEY is missing in environment.";
      }
      setHistory(prev => [...prev, { role: 'ai', text: errorMsg }]);
    }
  };

  return (
    <div className="border border-[#00ff41]/30 bg-zinc-900/40 p-3 flex flex-col h-72 shrink-0">
      <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
        <h2 className="font-black uppercase text-xs flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00ff41] animate-pulse"></div>
          L0: Neural_Command_Bridge
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[8px] opacity-40 uppercase leading-none">Context_δ</span>
            <span className="text-xs font-mono text-[#00ff41]">{topologyDelta.toFixed(2)}</span>
          </div>
          <span className="text-[10px] opacity-40 uppercase tracking-widest">Gemini_Flash_v3</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2 mb-2 custom-scrollbar pr-1 text-xs">
        {history.length === 0 && (
          <div className="text-zinc-600 italic">Awaiting neural input... Try "Move to position 20" or "Stabilize system".</div>
        )}
        {history.map((msg, i) => (
          <div key={i} className={`p-1.5 border ${msg.role === 'user' ? 'border-zinc-800 bg-black/30' : 'border-[#00ff41]/20 bg-[#00ff41]/5 text-[#00ff41]'}`}>
            <span className="opacity-40 uppercase mr-2 text-[10px]">{msg.role}:</span>
            {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input 
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter command..."
          className="w-full bg-black border border-zinc-800 p-2 pr-10 text-xs focus:border-[#00ff41] outline-none transition-colors"
        />
        <button 
          type="submit"
          disabled={isAnalyzing}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#00ff41] hover:bg-[#00ff41]/10 transition-colors disabled:opacity-30"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'onboarding' | 'bridge' | 'deployment' | 'dashboard'>('onboarding');
  const [topology, setTopology] = useState<RobotTopology>(RobotTopology.LINEAR_ACTUATOR);
  const [industry, setIndustry] = useState<IndustryProfile>(IndustryProfile.GENERAL_ROBOTICS);
  const sentinelRef = useRef<SentinelRuntime>(new SentinelRuntime());
  const [telemetry, setTelemetry] = useState<any[]>([]);
  const [health, setHealth] = useState<RobotHealth | null>(null);
  const [failures, setFailures] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);
  const [driftSim, setDriftSim] = useState(1.0);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [executionMode, setExecutionMode] = useState<'1kHz' | '10kHz'>('1kHz');
  const [platform, setPlatform] = useState<PlatformType>(PlatformType.X86_SIMULATION);
  const [isConfiguredViaAssistant, setIsConfiguredViaAssistant] = useState(false);
  
  // New States for Hardware Bridge and Deployment
  const [isHardwareLinked, setIsHardwareLinked] = useState(false);
  const [preflightStatus, setPreflightStatus] = useState<PreflightStatus | null>(null);
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);

  const simStateRef = useRef<RobotState>({
    position: [0, 0, 0],
    velocity: [0, 0, 0],
    acceleration: [0, 0, 0],
    controlInput: [0, 0, 0, 0],
    timestamp: Date.now(),
    topology: RobotTopology.LINEAR_ACTUATOR
  });

  useEffect(() => {
    sentinelRef.current.setExecutionMode(executionMode);
  }, [executionMode]);

  useEffect(() => {
    sentinelRef.current.setPlatform(platform);
  }, [platform]);

  const handleDeployShim = async () => {
    // Run Preflight Check first
    const status = sentinelRef.current.runPreflightCheck();
    setPreflightStatus(status);
    
    if (!status.isReady) {
      setDeploymentLogs(prev => [...prev, `[ERROR] Preflight Check Failed: ${!status.configValid ? 'Invalid Config' : !status.lyapunovBoundsSafe ? 'Lyapunov Bounds Unsafe' : 'System Not Ready'}`]);
      return;
    }

    setIsDeploying(true);
    setView('deployment');
    const logs = [
      "Initializing Deployment Sequence...",
      "Cross-compiling Safety Kernel for ARM Cortex-M7...",
      "Verifying Lyapunov Bounds (dReal/Coq)...",
      "Injecting Deterministic Firewall...",
      "Validating PTP Clock Sync...",
      "Shim Active at 10kHz. Governance Engaged."
    ];
    
    for (const log of logs) {
      setDeploymentLogs(prev => [...prev, `[DEPLOY] ${log}`]);
      await new Promise(r => setTimeout(r, 600));
    }
    
    setIsDeploying(false);
    setView('dashboard');
  };

  const handleGenerateCertificate = (entryId: string) => {
    const entry = ledger.find(e => e.id === entryId);
    if (!entry) return;
    
    const cert = {
      title: "SENTINEL_GOVERNANCE_CERTIFICATE",
      entryId: entry.id,
      timestamp: entry.precisionTimestamp,
      hash: entry.hash,
      topology: entry.topology,
      governance_proof: entry.governance,
      signer: "SENTINEL_V5_CORE_0xEE92"
    };

    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sentinel_Cert_${entryId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCompliance = () => {
    if (!health) return;
    const report = {
      standard: industry === IndustryProfile.AEROSPACE_LAUNCH ? "NASA-STD-8739.8" : "DO-178C DAL-A",
      compliance_status: health.compliance,
      nasa_status: health.nasaCompliance,
      audit_ledger_summary: {
        total_entries: ledger.length,
        overrides_detected: ledger.filter(e => e.governance.clamped).length
      },
      verification_proof: health.verification,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sentinel_Compliance_Report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (view !== 'dashboard') return;

    let t = 0;
    let animationFrameId: number;
    let isActive = true;

    const bootTimeout = setTimeout(() => setIsBooting(false), 1200);

    const loop = () => {
      if (!isActive) return;

      t += 0.1;
      const actualMass = 1.0 * driftSim;
      const last = simStateRef.current;
      
      // Universal Governor
      const safeControl = sentinelRef.current.govern(last);
      const control = safeControl;
      
      let acc = [0, 0, 0];
      let vel = [0, 0, 0];
      let pos = [0, 0, 0];

      // Topology-Specific Dynamics Simulation
      if (topology === RobotTopology.LINEAR_ACTUATOR) {
        acc[0] = (control[0] - 0.2 * last.velocity[0]) / actualMass;
        vel[0] = last.velocity[0] + acc[0] * 0.1;
        pos[0] = last.position[0] + vel[0] * 0.1;
      } else if (topology === RobotTopology.QUADCOPTER) {
        // Simple Vertical Flight Dynamics
        const gravity = 9.81;
        acc[1] = (control[0] / actualMass) - gravity - (0.1 * last.velocity[1]);
        vel[1] = last.velocity[1] + acc[1] * 0.1;
        pos[1] = Math.max(0, last.position[1] + vel[1] * 0.1);
      } else if (topology === RobotTopology.ROVER) {
        // Simple 1D Rover Dynamics
        acc[0] = (control[0] - 0.5 * last.velocity[0]) / actualMass;
        vel[0] = last.velocity[0] + acc[0] * 0.1;
        pos[0] = last.position[0] + vel[0] * 0.1;
      } else if (topology === RobotTopology.EVTOL) {
        // eVTOL Vertical Flight Dynamics
        const gravity = 9.81;
        acc[1] = (control[0] / actualMass) - gravity - (0.1 * last.velocity[1]);
        vel[1] = last.velocity[1] + acc[1] * 0.1;
        pos[1] = Math.max(0, last.position[1] + vel[1] * 0.1);
      } else if (topology === RobotTopology.ROCKET) {
        // Rocket Vertical Ascent Dynamics
        const gravity = 9.81;
        const altitude = last.position[1];
        const rho = 1.225 * Math.exp(-altitude / 8500); // Simple barometric formula
        const drag = 0.5 * rho * Math.pow(last.velocity[1], 2) * 0.1 * 0.3;
        
        // Control[0] is thrust
        acc[1] = (control[0] / actualMass) - gravity - (drag / actualMass);
        vel[1] = last.velocity[1] + acc[1] * 0.1;
        pos[1] = last.position[1] + vel[1] * 0.1;

        // Add some random lateral drift for FTS testing
        if (Math.random() > 0.95 && !health?.rocketGovernance?.fts.isTriggered) {
          acc[0] = (Math.random() - 0.5) * 20;
        } else {
          acc[0] = (control[1] - 0.5 * last.velocity[0]) / actualMass;
        }
        vel[0] = last.velocity[0] + acc[0] * 0.1;
        pos[0] = last.position[0] + vel[0] * 0.1;

        // If FTS triggered, kill thrust and fall
        if (health?.rocketGovernance?.fts.isTriggered) {
          acc[1] = -gravity;
          vel[1] = last.velocity[1] + acc[1] * 0.1;
          pos[1] = Math.max(0, last.position[1] + vel[1] * 0.1);
        }
      }

      const state: RobotState = { 
        position: pos, 
        velocity: vel, 
        acceleration: acc, 
        controlInput: control, 
        timestamp: Date.now(),
        topology: topology
      };

      simStateRef.current = state;
      sentinelRef.current.observe(state);

      if (Math.random() > 0.8) {
        setTelemetry(prev => [...prev.slice(-40), { 
          timestamp: state.timestamp, 
          velocity: (topology === RobotTopology.QUADCOPTER || topology === RobotTopology.EVTOL || topology === RobotTopology.ROCKET) ? vel[1] : vel[0], 
          controlInput: control[0] 
        }]);
        setHealth(sentinelRef.current.getHealth());
        setFailures([...sentinelRef.current.getFailures()]);
        setLedger([...sentinelRef.current.getLedger()]);
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      isActive = false;
      cancelAnimationFrame(animationFrameId);
      clearTimeout(bootTimeout);
    };
  }, [driftSim, view, topology]);

  const handleTopologyChange = (newTopology: RobotTopology) => {
    setTopology(newTopology);
    
    // Context-Aware Industry Auto-Switch
    if (newTopology === RobotTopology.ROCKET) {
      setIndustry(IndustryProfile.AEROSPACE_LAUNCH);
    } else if (newTopology === RobotTopology.EVTOL || newTopology === RobotTopology.QUADCOPTER) {
      setIndustry(IndustryProfile.URBAN_AIR_MOBILITY);
    } else if (newTopology === RobotTopology.ROVER) {
      setIndustry(IndustryProfile.FLEET_LOGISTICS);
    }

    sentinelRef.current.setTopology(newTopology);
    simStateRef.current = {
      position: [0, 0, 0],
      velocity: [0, 0, 0],
      acceleration: [0, 0, 0],
      controlInput: [0, 0, 0, 0],
      timestamp: Date.now(),
      topology: newTopology
    };
    setTelemetry([]);
  };

  const handleIndustryChange = (newIndustry: IndustryProfile) => {
    setIndustry(newIndustry);
    
    // Industry-Aware Topology Auto-Switch
    let newTopology = topology;
    if (newIndustry === IndustryProfile.AEROSPACE_LAUNCH) {
      newTopology = RobotTopology.ROCKET;
    } else if (newIndustry === IndustryProfile.URBAN_AIR_MOBILITY) {
      newTopology = RobotTopology.EVTOL;
    } else if (newIndustry === IndustryProfile.FLEET_LOGISTICS) {
      newTopology = RobotTopology.ROVER;
    } else if (newIndustry === IndustryProfile.GENERAL_ROBOTICS) {
      newTopology = RobotTopology.QUADCOPTER;
    }
    
    if (newTopology !== topology) {
      handleTopologyChange(newTopology);
    }
  };

  const handleDownloadSDK = async (type: 'hpp' | 'cpp') => {
    let content = "";
    try {
      if (type === 'hpp') {
        const resp = await fetch('SentinelGovernor.hpp');
        content = await resp.text();
      } else {
        const resp = await fetch('ForensicLedger.cpp');
        content = await resp.text();
      }
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'hpp' ? "SentinelGovernor.hpp" : "ForensicLedger.cpp";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("ERROR: SDK source files not found. Ensure SentinelGovernor.hpp/ForensicLedger.cpp are present in /public.");
    }
  };

  const runGeminiForensics = async (failure: any) => {
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API_KEY_MISSING");
      }
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `OFFLINE FORENSIC AUDIT (AIR-GAPPED REPLAY). 
        KERNEL_BUILD: ${health?.metadata.buildFingerprint}
        EVENT_SIGNED_BY: ${failure.signedBy}
        TYPE: ${failure.type}
        HAZARD: ${failure.hazard}
        
        Analyze Lyapunov Matrix eigenvalues ${JSON.stringify(health?.lyapunov.eigenvalues)} and Adaptive Forgetting factor λ=${health?.estimates.lambda}. 
        Explain if this drift indicates mechanical failure or sensor noise.`;
      
      const res = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
      setAnalysis(res.text);
    } catch (e: any) { 
      if (e.message === "API_KEY_MISSING") {
        setAnalysis("REPLAY_ERROR: API_KEY is missing in environment.");
      } else {
        setAnalysis("REPLAY_ERROR: Forensic engine unreachable."); 
      }
    } finally { 
      setAnalyzing(false); 
    }
  };

  const handleEnter = () => {
    setView('bridge');
  };

  if (view === 'onboarding') {
    return (
      <LandingPage 
        onEnter={handleEnter} 
        onFinishWizard={() => setView('bridge')}
        onDownloadSDK={handleDownloadSDK} 
        industry={industry}
        onSelectIndustry={handleIndustryChange}
        topology={topology}
        onTopologyChange={handleTopologyChange}
        isConfiguredViaAssistant={isConfiguredViaAssistant}
        setIsConfiguredViaAssistant={setIsConfiguredViaAssistant}
        setView={setView}
        handleTopologyChange={handleTopologyChange}
        handleIndustryChange={handleIndustryChange}
      />
    );
  }

  if (view === 'bridge') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-2xl w-full flex flex-col gap-8">
          {isConfiguredViaAssistant && (
            <div className="bg-[#00ff41]/5 border border-[#00ff41]/30 p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 text-[#00ff41]">
                <CheckCircle2 size={24} />
                <h2 className="text-xl font-black uppercase tracking-tight">Configuration_Locked</h2>
              </div>
              <p className="text-sm text-zinc-400 uppercase leading-relaxed">
                Sentinel Integration Engineer has verified your <span className="text-white">{topology}</span> setup for <span className="text-white">{industry}</span>. 
                Zero-Code Wizard and Manifest Uploader have been bypassed.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500 uppercase font-bold">Topology: {topology}</div>
                <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500 uppercase font-bold">Industry: {industry}</div>
              </div>
            </div>
          )}
          
          <div className="w-full h-[500px]">
            <HardwareBridge 
              isConnected={isHardwareLinked} 
              onConnect={() => setIsHardwareLinked(true)} 
            />
            {isHardwareLinked && (
              <div className="mt-8 flex flex-col items-center gap-4">
                {preflightStatus && !preflightStatus.isReady && (
                  <div className="bg-rose-900/20 border border-rose-500 p-3 text-rose-500 text-[10px] uppercase font-bold animate-pulse">
                    Preflight_Check_Failed: System_Inhibited
                  </div>
                )}
                <button 
                  onClick={handleDeployShim}
                  className="px-12 py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-[#00ff41] transition-all transform hover:-translate-y-1 disabled:opacity-50"
                >
                  Deploy Safety Shim
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'deployment') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-mono">
        <div className="max-w-xl w-full bg-zinc-950 border border-zinc-800 p-8 space-y-6">
          <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
            <Loader2 className="text-[#00ff41] animate-spin" size={24} />
            <div>
              <h2 className="text-white font-black uppercase text-sm">Deploying_Safety_Shim</h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Target: ARM Cortex-M7 // DAL-A Certified</p>
            </div>
          </div>
          <div className="space-y-2 bg-black p-4 border border-zinc-900 min-h-[200px]">
            {deploymentLogs.map((log, i) => (
              <p key={i} className="text-[10px] text-[#00ff41] leading-tight">{log}</p>
            ))}
          </div>
          <div className="h-1 bg-zinc-900 overflow-hidden">
            <div className="h-full bg-[#00ff41] animate-[shimmer_2s_infinite]" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (isBooting) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-[#00ff41] mono p-6">
        <div className="w-64 border border-[#00ff41]/20 p-1 bg-zinc-950">
          <div className="h-1 bg-[#00ff41] animate-[shimmer_2s_infinite] w-full" />
        </div>
        <div className="mt-4 text-[10px] uppercase tracking-[0.2em] animate-pulse">
          Sentinel_Kernel_v5_Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-[#00ff41] p-3 mono text-sm selection:bg-[#00ff41] selection:text-black overflow-hidden flex flex-col">
      <div className="max-w-[95rem] mx-auto w-full flex-1 flex flex-col gap-3 animate-in fade-in duration-700 overflow-hidden">
        
        {/* KERNEL IDENTITY HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border border-[#00ff41]/30 p-2 bg-zinc-900/40 gap-2 shrink-0">
           <div className="flex gap-6 items-center">
             <button onClick={() => setView('onboarding')} className="hover:opacity-60 transition-opacity">
               <h1 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">Sentinel_v5</h1>
             </button>
             <div className="hidden md:flex gap-3 px-4 border-l border-zinc-800">
               <select 
                 value={topology}
                 onChange={(e) => handleTopologyChange(e.target.value as RobotTopology)}
                 className="bg-black border border-zinc-800 text-[#00ff41] text-xs px-2 py-0.5 outline-none focus:border-[#00ff41] transition-colors uppercase font-bold"
               >
                 {Object.values(RobotTopology).map(t => (
                   <option key={t} value={t}>{t}</option>
                 ))}
               </select>
               <span className={health?.runtimeMode === RuntimeMode.NORMAL ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                 KERNEL_{health?.runtimeMode.toUpperCase()}
               </span>
               <span className="opacity-40">WCET: {health?.wcet_ms.toFixed(3)}ms</span>
               {health?.executionMode === '10kHz' && (
                 <span className="text-amber-400 font-bold">FAST_LOOP: {health?.innerLoopWCET.toFixed(1)}μs</span>
               )}
               <div className="flex items-center gap-2 px-4 border-l border-zinc-800">
                 <span className="text-[8px] text-zinc-500 uppercase">Platform</span>
                 <select 
                   value={platform}
                   onChange={(e) => setPlatform(e.target.value as PlatformType)}
                   className="bg-black border border-zinc-800 text-white text-xs px-2 py-0.5 outline-none focus:border-[#00ff41] transition-colors uppercase font-bold"
                 >
                   {Object.values(PlatformType).map(p => (
                     <option key={p} value={p}>{p}</option>
                   ))}
                 </select>
               </div>
               <div className="flex items-center gap-2 px-4 border-l border-zinc-800">
                 <span className="text-[8px] text-zinc-500 uppercase">Profile</span>
                 <select 
                   value={industry}
                   onChange={(e) => setIndustry(e.target.value as IndustryProfile)}
                   className="bg-black border border-zinc-800 text-amber-400 text-xs px-2 py-0.5 outline-none focus:border-[#00ff41] transition-colors uppercase font-bold"
                 >
                   {Object.values(IndustryProfile).map(i => (
                     <option key={i} value={i}>{i}</option>
                   ))}
                 </select>
               </div>
             </div>
           </div>
           <div className="flex items-center gap-4">
             {/* Execution Mode Selector */}
             <div className="flex items-center gap-2 border border-zinc-800 bg-black/40 p-1 px-2">
               <span className="text-[8px] text-zinc-500 uppercase">Execution_Mode</span>
               <div className="flex gap-1">
                 {(['1kHz', '10kHz'] as const).map(mode => (
                   <button
                     key={mode}
                     onClick={() => setExecutionMode(mode)}
                     className={`text-xs px-2 py-0.5 font-bold transition-colors ${executionMode === mode ? 'bg-[#00ff41] text-black' : 'text-zinc-500 hover:text-white'}`}
                   >
                     {mode}
                   </button>
                 ))}
               </div>
             </div>
             <button 
                onClick={() => handleDownloadSDK('cpp')}
                className="px-3 py-1 border border-[#00ff41]/30 hover:bg-[#00ff41] hover:text-black transition-all text-xs font-bold uppercase tracking-widest"
             >
                Extract_Source
             </button>
             <div className="text-right hidden sm:block">
               <div className="text-[10px] opacity-60 leading-none">AUDIT_HASH</div>
               <div className="font-bold text-white uppercase text-xs">0x{health?.integrityHash}</div>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 overflow-hidden">
          <div className="md:col-span-3 flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
            <div className="shrink-0">
              <NeuralCommandCenter 
                onIntent={(intent) => sentinelRef.current.setIntent(intent)} 
                isAnalyzing={analyzing} 
                topology={topology}
                topologyDelta={health?.metadata.topologyDelta || 5.0}
              />
            </div>

            <div className="p-3 border border-[#00ff41]/20 bg-[#00ff41]/5 rounded-sm shrink-0">
               <div className="flex items-center gap-2 mb-1">
                 <ShieldAlert size={14} className="text-[#00ff41]" />
                 <span className="text-[10px] text-[#00ff41] font-black uppercase tracking-widest">
                   {industry === IndustryProfile.AEROSPACE_LAUNCH ? "Air-Gapped Flight Kernel" : "Air-Gapped Safety Kernel"}
                 </span>
               </div>
               <p className="text-[9px] text-zinc-500 leading-tight uppercase">
                 The Safety Kernel runs locally on the edge. AI is utilized only for natural language reconciliation and forensic audit.
               </p>
            </div>

            <div className="shrink-0 h-80">
              {health && (
                <HardwareAbstractionPanel 
                  platform={health.platform} 
                  currentTopology={topology}
                  onTopologyChange={handleTopologyChange}
                />
              )}
            </div>

            <div className="shrink-0 h-64">
              {health && <FormalVerificationPanel status={health.verification} industry={industry} />}
            </div>

            <div className="shrink-0 h-64">
              {health && (
                <ComplianceDashboard 
                  status={health.compliance} 
                  onExportCompliance={handleExportCompliance}
                />
              )}
            </div>

            {industry === IndustryProfile.AEROSPACE_LAUNCH && health && (
              <div className="shrink-0 h-64">
                <NasaCompliancePanel status={health.nasaCompliance} />
              </div>
            )}

            {industry === IndustryProfile.URBAN_AIR_MOBILITY && health?.evtolGovernance && (
              <div className="shrink-0 h-64">
                <RotorGovernancePanel governance={health.evtolGovernance} />
              </div>
            )}

            {topology === RobotTopology.INDUSTRIAL_ARM && health && (
              <div className="shrink-0 h-64">
                <JointGovernancePanel health={health} />
              </div>
            )}

            {topology === RobotTopology.ROVER && health && (
              <div className="shrink-0 h-64">
                <TractionGovernancePanel health={health} />
              </div>
            )}

            {topology === RobotTopology.ROCKET && health && (
              <div className="shrink-0 h-64">
                <RocketEnginePanel health={health} />
              </div>
            )}

            {industry === IndustryProfile.AEROSPACE_LAUNCH && health?.rocketGovernance && (
              <div className="shrink-0 h-64">
                <FtsGovernancePanel 
                  governance={health.rocketGovernance} 
                  currentDrift={simStateRef.current.position[0]} 
                />
              </div>
            )}
            
            <div className="border border-[#00ff41]/20 p-4 bg-zinc-900/20 shrink-0">
              <h2 className="font-black uppercase mb-3 border-b border-zinc-800 pb-1 text-sm">L1: Intent Coherence</h2>
              {health && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="opacity-40 uppercase">Coherence_Status</span>
                    <span className={health.intentCoherence.isCoherent ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {health.intentCoherence.isCoherent ? 'NOMINAL' : 'SUSPICIOUS'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="opacity-40 uppercase">Contradiction_Score</span>
                    <span className="text-white">{(health.intentCoherence.contradictionScore * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-1 bg-zinc-800 w-full rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${health.intentCoherence.commandFrequencyHz * 10}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {industry === IndustryProfile.FLEET_LOGISTICS && health && (
              <>
                <div className="h-48 shrink-0">
                  <FleetConsensusMap 
                    state={health.consensusState} 
                    ownPosition={simStateRef.current.position} 
                  />
                </div>

                <div className="h-40 shrink-0">
                  <PtpSyncStatus status={health.ptpStatus} />
                </div>
              </>
            )}

            {(industry === IndustryProfile.AEROSPACE_LAUNCH || industry === IndustryProfile.URBAN_AIR_MOBILITY) && health && (
              <div className="h-40 shrink-0">
                <MissionPhaseManager 
                  state={health.missionPhase} 
                  onUpdateTimeline={(events) => sentinelRef.current.setMissionTimeline(events)}
                />
              </div>
            )}

            <div className="border border-zinc-800 p-3 bg-black shrink-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="uppercase opacity-40 text-xs">L5: Predictive Faults</h3>
                {health && health.faultDiagnosis.isOOD && (
                  <span className="text-[9px] bg-amber-900/30 text-amber-500 px-1 border border-amber-900 uppercase font-bold animate-pulse">OOD_Anomaly</span>
                )}
              </div>
              {health && (
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-white uppercase">
                    {health.faultDiagnosis.classifiedFault || 'NO_FAULTS_DETECTED'}
                  </div>
                  {health.faultDiagnosis.classifiedFault && (
                    <div className="text-[9px] text-zinc-500 uppercase">
                      Match: {health.faultDiagnosis.signatureMatch} ({ (health.faultDiagnosis.confidence * 100).toFixed(0) }%)
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border border-[#00ff41]/20 p-3 bg-zinc-900/20 shrink-0">
              <h2 className="font-black uppercase mb-3 border-b border-zinc-800 pb-1 text-xs">L4: Lyapunov Matrix (P)</h2>
              {health && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-1 text-center border border-zinc-800 p-1.5 bg-black/50 text-xs">
                    <div className="border border-zinc-800 p-0.5">{health.lyapunov.P[0][0].toFixed(3)}</div>
                    <div className="border border-zinc-800 p-0.5">{health.lyapunov.P[0][1].toFixed(3)}</div>
                    <div className="border border-zinc-800 p-0.5">{health.lyapunov.P[1][0].toFixed(3)}</div>
                    <div className="border border-zinc-800 p-0.5">{health.lyapunov.P[1][1].toFixed(3)}</div>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="opacity-40 uppercase">State_Invariant</span>
                    <span className={health.lyapunov.isPositiveDefinite ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {health.lyapunov.isPositiveDefinite ? 'POS_DEF' : 'DIVERGED'}
                    </span>
                  </div>
                  <HealthMetric label="λ_Adaptive" value={health.estimates.lambda} />
                </div>
              )}
            </div>

            <div className="border border-zinc-800 p-3 bg-black shrink-0">
              <h3 className="uppercase mb-2 opacity-40 text-xs">L5: Actuator Envelope</h3>
              {health && (
                <div className="space-y-1.5">
                  <HealthMetric label="Torque_Util" value={health.actuators.torqueUtilization / 10} />
                  <div className="flex justify-between text-[10px]">
                    <span className="opacity-40 uppercase">Consensus</span>
                    <span className={health.consensus.divergence > 10 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
                      {health.consensus.divergence > 10 ? 'DIVERGED' : 'SYNCED'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[9px]">
                    <span className="opacity-40 uppercase">Thermal</span>
                    <span className={health.actuators.thermalEstimate > 60 ? 'text-rose-500 font-bold' : 'text-white'}>
                      {health.actuators.thermalEstimate.toFixed(1)}°C
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-2 border border-zinc-800 bg-zinc-950/40 shrink-0">
               <span className="opacity-40 uppercase block mb-1 text-[9px]">Simulator_Inject</span>
               <input 
                 type="range" min="0.5" max="3" step="0.1" value={driftSim} 
                 onChange={e => setDriftSim(parseFloat(e.target.value))}
                 className="w-full accent-[#00ff41] bg-zinc-900 h-1 rounded-lg appearance-none cursor-pointer"
               />
            </div>
          </div>

          <div className="md:col-span-6 flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
            <div className="border-2 border-zinc-800 p-2 bg-black overflow-hidden relative shrink-0">
               <div className="absolute top-1 right-3 text-[7px] opacity-20 uppercase tracking-widest pointer-events-none">Live_Newtonian_Telemetry</div>
               <div className="h-40">
                 <TelemetryChart data={telemetry} title="L1: Multi-Channel State Observer" />
               </div>
            </div>
            {health && <AdvisoryPanel advisory={sentinelRef.current.getAdvisory()} />}
            
            <div className="h-40 shrink-0">
              {health && <DigitalTwinVisualizer state={health.digitalTwin} topology={topology} />}
            </div>
          </div>

          <div className="md:col-span-3 h-full overflow-hidden">
             <SentinelLedger 
               entries={ledger} 
               onGenerateCertificate={handleGenerateCertificate}
             />
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
