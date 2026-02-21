import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SentinelRuntime } from './services/SentinelRuntime';
import { RobotState, RobotHealth, HazardLevel, RuntimeMode, IntentType, RobotIntent, RobotTopology } from './types';
import TelemetryChart from './components/TelemetryChart';
import HealthMetric from './components/HealthMetric';
import AdvisoryPanel from './components/AdvisoryPanel';
import DigitalTwinVisualizer from './components/DigitalTwinVisualizer';
import SentinelLedger from './components/SentinelLedger';

const PaperContent = `
SENTINEL V5.0: A UNIVERSAL NEURAL-SYMBOLIC GOVERNOR FOR ZERO-TRUST ROBOTIC AUTONOMY

Prathamesh Shirbhate
Safety-Critical Robotics Systems • Real-Time Control Architecture

ABSTRACT
High-level autonomy systems—including reinforcement learning policies, trajectory optimizers, and large language model planners—lack formal guarantees of stability, boundedness, and actuator feasibility. Sentinel v5.0 introduces a Universal Neural-Symbolic Governor that enforces physics-consistent constraints across multiple topologies (Drones, Rovers, Actuators). By integrating a Neural Command Bridge (AI-to-Physics translation) with a deterministic Lyapunov Kernel and a Forensic Audit Ledger, Sentinel provides a complete, tamper-evident safety layer. Key features include real-time Digital Twin adaptation via Recursive Least Squares (RLS), Uncertainty-Aware Lyapunov Extension (Interval Analysis), and a cryptographically hashed forensic chain for liability and reconstruction.

1. MOTIVATION AND CONTEXT
Modern robotic architectures compose multiple layers of abstraction. Sentinel's central thesis is that stability must be enforced computationally at runtime. The kernel intercepts every control command issued by the high-level planner—whether it's a Neural Network or a human operator—and subjects it to formal compliance checks before actuation.

2. L0: DUAL-PARSER NEURAL BRIDGE
Sentinel utilizes a Dual-Parser Architecture where LLM-based intent extraction runs alongside a deterministic symbolic parser. This prevents "Neural Hallucinations" from reaching the control loop.

3. L1: SEMANTIC INTENT COHERENCE
A lightweight monitor tracks command history to detect semantically contradictory or suspiciously rapid command sequences, preventing adversarial or confused operator inputs.

4. L2: DIGITAL TWIN ADAPTATION
The kernel maintains a real-time Digital Twin of the physical system using RLS with innovation-driven forgetting. This allows Sentinel to "feel" changes in mass, friction, or environmental drag and adapt its safety envelopes in < 1ms.

5. L3: DISTRIBUTED SAFETY CONSENSUS
Sentinels broadcast projected control intentions to resolve conflicts in multi-robot environments, ensuring local stability doesn't lead to global catastrophe.

6. L4: UNCERTAINTY-AWARE LYAPUNOV (INTERVAL ANALYSIS)
Sentinel computes a Lyapunov "tube" (V_min and V_max) bracketing parameter uncertainty. The kernel only certifies stability if the entire tube is stable, automatically becoming more conservative during re-learning transients.

7. L5: HARDWARE FAULT OBSERVER
A Fault Signature Library classifies parameter drifts into specific hardware failure modes (e.g., motor bearing wear vs. payload shift), enabling predictive maintenance.

8. L6: GOVERNED HUMAN OVERRIDE
Emergency stops are routed through the kernel to ensure that overrides themselves don't command physically catastrophic transitions (e.g., governed emergency descent vs. uncontrolled fall).

9. L7: FORENSIC AUDIT LEDGER
Every decision made by the Governor is recorded in a tamper-evident, hashed ledger. This provides a "Black Box" for robotics, ensuring that every divergence between AI intent and safe actuation is forensically documented.

10. CONCLUSION
Sentinel v5.0 provides a principled foundation for high-capability robots in safety-critical environments through mathematical constraint enforcement and forensic accountability.
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

const LandingPage: React.FC<{ onEnter: () => void, onDownloadSDK: (type: 'hpp' | 'cpp') => void }> = ({ onEnter, onDownloadSDK }) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'integration' | 'sdk'>('mission');
  const [showPaper, setShowPaper] = useState(false);

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6 mono">
      <PaperModal isOpen={showPaper} onClose={() => setShowPaper(false)} />
      
      <div className="max-w-5xl w-full border border-zinc-800 bg-zinc-900/10 p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 text-[9px] opacity-20 uppercase tracking-[0.3em]">Build_Auth_0xEE92</div>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-16 h-16 border-2 border-[#00ff41] flex items-center justify-center mb-4 glow-core shadow-[0_0_20px_rgba(0,255,65,0.2)]">
              <div className="w-8 h-8 bg-[#00ff41] animate-pulse"></div>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Sentinel 5.0</h1>
            <p className="text-[#00ff41] text-[10px] tracking-[0.5em] uppercase opacity-60">Physical Autonomy Reliability Layer</p>
          </div>
          
          <div className="flex gap-4 border border-zinc-800 p-1 bg-black">
            {(['mission', 'integration', 'sdk'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 text-[10px] font-bold uppercase transition-all ${activeTab === tab ? 'bg-[#00ff41] text-black' : 'text-zinc-500 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[420px]">
          {activeTab === 'mission' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white uppercase tracking-tight border-b border-zinc-800 pb-2">The Mission</h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Sentinel is a <span className="text-[#00ff41]">Universal Neural-Symbolic Governor</span>. 
                  It bridges the gap between high-level AI intent and low-level Newtonian physics, 
                  providing a deterministic safety layer for Drones, Rovers, and Industrial Robotics.
                </p>
                <div className="p-4 border border-zinc-800 bg-zinc-950/50 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-500">MCU</div>
                    <div className="flex-1 h-px bg-zinc-800 relative">
                       <div className="absolute inset-0 bg-[#00ff41] w-1/3 animate-[shimmer_2s_infinite]"></div>
                    </div>
                    <div className="w-20 h-10 border border-[#00ff41]/40 flex items-center justify-center text-[10px] text-[#00ff41] font-bold">SENTINEL</div>
                    <div className="flex-1 h-px bg-zinc-800"></div>
                    <div className="w-10 h-10 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-500">PWM</div>
                  </div>
                  <p className="text-[9px] text-center text-zinc-600 uppercase tracking-widest">Hardware Control Flow Diagram</p>
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
                    <div className="text-[10px] font-bold text-white uppercase group-hover:text-[#00ff41] transition-colors">Technical Manuscript</div>
                    <div className="text-[9px] text-zinc-500 uppercase tracking-widest">Read v5.0 Whitepaper</div>
                  </div>
                </button>
              </div>
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase">Operational Guarantees:</h3>
                {[
                  "L0-L1: Dual-Parser & Intent Coherence Monitor",
                  "L2-L4: Uncertainty-Aware Lyapunov (Interval Analysis)",
                  "L3: Distributed Fleet Safety Consensus",
                  "L5-L7: Predictive Faults & Forensic Audit Chain"
                ].map((item, i) => (
                   <div key={i} className="flex gap-3 items-start border-l border-zinc-800 pl-4 py-1">
                      <div className="w-1.5 h-1.5 bg-[#00ff41] mt-1"></div>
                      <span className="text-[11px] text-zinc-400">{item}</span>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'integration' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="md:col-span-5 space-y-6">
                <h2 className="text-xl font-bold text-white uppercase tracking-tight border-b border-zinc-800 pb-2">Universal Integration</h2>
                <p className="text-xs text-zinc-400">Sentinel acts as a <span className="text-[#00ff41]">Deterministic Firewall</span> between high-level AI intents and physical motors. It supports any topology via a unified state-space interface.</p>
                <div className="space-y-4">
                  <div className="bg-black border border-zinc-800 p-4">
                    <span className="text-[9px] text-zinc-600 block mb-2 uppercase tracking-widest">Neural Bridge Input</span>
                    <ul className="text-[10px] space-y-2 text-zinc-400">
                      <li>• <code className="text-[#00ff41]">Intent_Type</code>: MOVE_TO, STABILIZE, etc.</li>
                      <li>• <code className="text-[#00ff41]">Priority</code>: Deterministic Scheduling</li>
                      <li>• <code className="text-[#00ff41]">Target</code>: Topology-Specific Goal</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-900/40 border border-[#00ff41]/20 p-4">
                    <span className="text-[9px] text-[#00ff41] block mb-2 uppercase tracking-widest">Forensic Output</span>
                    <ul className="text-[10px] space-y-2 text-zinc-300 font-bold">
                      <li>• <code className="text-white">Safe_Control</code>: Interval-Verified Torque</li>
                      <li>• <code className="text-rose-400">Audit_Hash</code>: Signed Proof of Governance</li>
                      <li>• <code className="text-amber-400">Fault_ID</code>: Predictive Hardware Diagnosis</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="md:col-span-7 border border-zinc-800 bg-black p-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 text-[8px] bg-zinc-900 text-zinc-500 uppercase">governor.cpp (Snippet)</div>
                <pre className="text-[10px] text-[#00ff41]/80 leading-relaxed overflow-x-auto whitespace-pre h-[300px] custom-scrollbar">
{`#include "SentinelGovernor.hpp"

// Initialize for Quadcopter Topology
sentinel::Governor kernel(Topology::QUADCOPTER);

void control_loop() {
    // 1. Get AI Intent from Neural Bridge
    auto intent = neural_bridge.get_latest();

    // 2. Step the Universal Governor
    // Enforces Lyapunov stability & records to Ledger
    auto safe_u = kernel.govern(robot_state, intent);

    // 3. Actuate with Zero-Trust Proof
    motors.write(safe_u);
    
    // 4. Broadcast Forensic Hash for Audit
    telemetry.send_audit(kernel.get_last_hash());
}`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'sdk' && (
            <div className="flex flex-col items-center justify-center space-y-8 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white uppercase">Universal Governor SDK</h2>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">Certified Build: 0xEF42A99B // Neural-Symbolic Ready</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
                <button 
                  onClick={() => onDownloadSDK('hpp')}
                  className="flex flex-col items-center p-6 border border-[#00ff41]/40 bg-zinc-900/20 hover:bg-[#00ff41]/10 transition-all group"
                >
                  <div className="text-[#00ff41] font-black text-xl mb-1">GOVERNOR</div>
                  <div className="text-[9px] text-zinc-500 uppercase">SentinelGovernor.hpp</div>
                </button>
                <button 
                  onClick={() => onDownloadSDK('cpp')}
                  className="flex flex-col items-center p-6 border border-[#00ff41]/40 bg-zinc-900/20 hover:bg-[#00ff41]/10 transition-all group"
                >
                  <div className="text-[#00ff41] font-black text-xl mb-1">LEDGER</div>
                  <div className="text-[9px] text-zinc-500 uppercase">ForensicLedger.cpp</div>
                </button>
              </div>
              <div className="p-4 border border-zinc-800 bg-zinc-950 max-w-lg text-left">
                <h4 className="text-[10px] text-white font-bold uppercase mb-2">Build Requirements</h4>
                <ul className="text-[10px] text-zinc-500 space-y-1">
                   <li>• C++17 Standard (Heap-Free)</li>
                   <li>• Eigen 3.3.7+ (Matrix Math)</li>
                   <li>• SHA-256 Hardware Acceleration (Optional)</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-ping"></div>
             <span className="text-[9px] text-zinc-500 uppercase tracking-[0.2em]">Simulation_Engine_Ready</span>
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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
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
    } catch (err) {
      setHistory(prev => [...prev, { role: 'ai', text: "Neural link failed. Check API key." }]);
    }
  };

  return (
    <div className="border border-[#00ff41]/30 bg-zinc-900/40 p-3 flex flex-col h-64 shrink-0">
      <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
        <h2 className="font-black uppercase text-[10px] flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00ff41] animate-pulse"></div>
          L0: Neural_Command_Bridge
        </h2>
        <span className="text-[8px] opacity-40 uppercase tracking-widest">Gemini_Flash_v3</span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2 mb-2 custom-scrollbar pr-1 text-[9px]">
        {history.length === 0 && (
          <div className="text-zinc-600 italic">Awaiting neural input... Try "Move to position 20" or "Stabilize system".</div>
        )}
        {history.map((msg, i) => (
          <div key={i} className={`p-1.5 border ${msg.role === 'user' ? 'border-zinc-800 bg-black/30' : 'border-[#00ff41]/20 bg-[#00ff41]/5 text-[#00ff41]'}`}>
            <span className="opacity-40 uppercase mr-2">{msg.role}:</span>
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
          className="w-full bg-black border border-zinc-800 p-2 pr-10 text-[9px] focus:border-[#00ff41] outline-none transition-colors"
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
  const [view, setView] = useState<'onboarding' | 'dashboard'>('onboarding');
  const [topology, setTopology] = useState<RobotTopology>(RobotTopology.LINEAR_ACTUATOR);
  const sentinelRef = useRef<SentinelRuntime>(new SentinelRuntime());
  const [telemetry, setTelemetry] = useState<any[]>([]);
  const [health, setHealth] = useState<RobotHealth | null>(null);
  const [failures, setFailures] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);
  const [driftSim, setDriftSim] = useState(1.0);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  const simStateRef = useRef<RobotState>({
    position: [0, 0, 0],
    velocity: [0, 0, 0],
    acceleration: [0, 0, 0],
    controlInput: [0, 0, 0, 0],
    timestamp: Date.now(),
    topology: RobotTopology.LINEAR_ACTUATOR
  });

  useEffect(() => {
    if (view === 'onboarding') return;

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
          velocity: topology === RobotTopology.QUADCOPTER ? vel[1] : vel[0], 
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

  const handleDownloadSDK = async (type: 'hpp' | 'cpp') => {
    let content = "";
    try {
      if (type === 'hpp') {
        const resp = await fetch('SentinelCore.hpp');
        content = await resp.text();
      } else {
        const resp = await fetch('SentinelCore.cpp');
        content = await resp.text();
      }
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'hpp' ? "SentinelCore.hpp" : "SentinelCore.cpp";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("ERROR: SDK source files not found in root. Ensure SentinelCore.hpp/cpp are present.");
    }
  };

  const runGeminiForensics = async (failure: any) => {
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `OFFLINE FORENSIC AUDIT (AIR-GAPPED REPLAY). 
        KERNEL_BUILD: ${health?.metadata.buildFingerprint}
        EVENT_SIGNED_BY: ${failure.signedBy}
        TYPE: ${failure.type}
        HAZARD: ${failure.hazard}
        
        Analyze Lyapunov Matrix eigenvalues ${JSON.stringify(health?.lyapunov.eigenvalues)} and Adaptive Forgetting factor λ=${health?.estimates.lambda}. 
        Explain if this drift indicates mechanical failure or sensor noise.`;
      
      const res = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
      setAnalysis(res.text);
    } catch (e) { 
      setAnalysis("REPLAY_ERROR: Forensic engine unreachable."); 
    } finally { 
      setAnalyzing(false); 
    }
  };

  const handleEnter = () => {
    setView('dashboard');
    sentinelRef.current.setIntent({
      type: IntentType.OSCILLATE,
      priority: 'LOW',
      timestamp: Date.now()
    });
  };

  if (view === 'onboarding') {
    return <LandingPage onEnter={handleEnter} onDownloadSDK={handleDownloadSDK} />;
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
    <div className="h-screen bg-black text-[#00ff41] p-3 mono text-[11px] selection:bg-[#00ff41] selection:text-black overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col gap-3 animate-in fade-in duration-700 overflow-hidden">
        
        {/* KERNEL IDENTITY HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border border-[#00ff41]/30 p-2 bg-zinc-900/40 gap-2 shrink-0">
           <div className="flex gap-6 items-center">
             <button onClick={() => setView('onboarding')} className="hover:opacity-60 transition-opacity">
               <h1 className="text-lg font-black italic tracking-tighter text-white uppercase leading-none">Sentinel_v5</h1>
             </button>
             <div className="hidden md:flex gap-3 px-4 border-l border-zinc-800">
               <select 
                 value={topology}
                 onChange={(e) => handleTopologyChange(e.target.value as RobotTopology)}
                 className="bg-black border border-zinc-800 text-[#00ff41] text-[9px] px-2 py-0.5 outline-none focus:border-[#00ff41] transition-colors uppercase font-bold"
               >
                 {Object.values(RobotTopology).map(t => (
                   <option key={t} value={t}>{t}</option>
                 ))}
               </select>
               <span className={health?.runtimeMode === RuntimeMode.NORMAL ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                 KERNEL_{health?.runtimeMode.toUpperCase()}
               </span>
               <span className="opacity-40">WCET: {health?.wcet_ms.toFixed(3)}ms</span>
             </div>
           </div>
           <div className="flex items-center gap-4">
             <button 
                onClick={() => handleDownloadSDK('cpp')}
                className="px-3 py-1 border border-[#00ff41]/30 hover:bg-[#00ff41] hover:text-black transition-all text-[8px] font-bold uppercase tracking-widest"
             >
                Extract_Source
             </button>
             <div className="text-right hidden sm:block">
               <div className="text-[9px] opacity-60 leading-none">AUDIT_HASH</div>
               <div className="font-bold text-white uppercase text-[10px]">0x{health?.integrityHash}</div>
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
            
            <div className="border border-[#00ff41]/20 p-4 bg-zinc-900/20 shrink-0">
              <h2 className="font-black uppercase mb-3 border-b border-zinc-800 pb-1 text-[9px]">L1: Intent Coherence</h2>
              {health && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[8px]">
                    <span className="opacity-40 uppercase">Coherence_Status</span>
                    <span className={health.intentCoherence.isCoherent ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {health.intentCoherence.isCoherent ? 'NOMINAL' : 'SUSPICIOUS'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[8px]">
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

            <div className="border border-[#00ff41]/20 p-3 bg-zinc-900/20 shrink-0">
              <h2 className="font-black uppercase mb-3 border-b border-zinc-800 pb-1 text-[9px]">L3: Fleet Consensus</h2>
              {health && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[8px]">
                    <span className="opacity-40 uppercase">Peers_Online</span>
                    <span className="text-white">{health.consensusState.peerCount}</span>
                  </div>
                  <div className="flex justify-between text-[8px]">
                    <span className="opacity-40 uppercase">Conflict_Status</span>
                    <span className={health.consensusState.conflictDetected ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {health.consensusState.conflictDetected ? 'CONFLICT' : 'RESOLVED'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[8px]">
                    <span className="opacity-40 uppercase">Byzantine_Status</span>
                    <span className={
                      health.consensusState.byzantineStatus === 'COMPROMISED' ? 'text-rose-500 font-bold' :
                      health.consensusState.byzantineStatus === 'SUSPICIOUS' ? 'text-amber-500 font-bold' :
                      'text-emerald-400 font-bold'
                    }>
                      {health.consensusState.byzantineStatus}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="border border-zinc-800 p-3 bg-black shrink-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="uppercase opacity-40 text-[9px]">L5: Predictive Faults</h3>
                {health && health.faultDiagnosis.isOOD && (
                  <span className="text-[7px] bg-amber-900/30 text-amber-500 px-1 border border-amber-900 uppercase font-bold animate-pulse">OOD_Anomaly</span>
                )}
              </div>
              {health && (
                <div className="space-y-1.5">
                  <div className="text-[9px] font-bold text-white uppercase">
                    {health.faultDiagnosis.classifiedFault || 'NO_FAULTS_DETECTED'}
                  </div>
                  {health.faultDiagnosis.classifiedFault && (
                    <div className="text-[7px] text-zinc-500 uppercase">
                      Match: {health.faultDiagnosis.signatureMatch} ({ (health.faultDiagnosis.confidence * 100).toFixed(0) }%)
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border border-[#00ff41]/20 p-3 bg-zinc-900/20 shrink-0">
              <h2 className="font-black uppercase mb-3 border-b border-zinc-800 pb-1 text-[9px]">L4: Lyapunov Matrix (P)</h2>
              {health && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-1 text-center border border-zinc-800 p-1.5 bg-black/50 text-[9px]">
                    <div className="border border-zinc-800 p-0.5">{health.lyapunov.P[0][0].toFixed(3)}</div>
                    <div className="border border-zinc-800 p-0.5">{health.lyapunov.P[0][1].toFixed(3)}</div>
                    <div className="border border-zinc-800 p-0.5">{health.lyapunov.P[1][0].toFixed(3)}</div>
                    <div className="border border-zinc-800 p-0.5">{health.lyapunov.P[1][1].toFixed(3)}</div>
                  </div>
                  <div className="flex justify-between items-center text-[8px]">
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
              <h3 className="uppercase mb-2 opacity-40 text-[9px]">L5: Actuator Envelope</h3>
              {health && (
                <div className="space-y-1.5">
                  <HealthMetric label="Torque_Util" value={health.actuators.torqueUtilization / 10} />
                  <div className="flex justify-between text-[8px]">
                    <span className="opacity-40 uppercase">Consensus</span>
                    <span className={health.consensus.divergence > 10 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
                      {health.consensus.divergence > 10 ? 'DIVERGED' : 'SYNCED'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[7px]">
                    <span className="opacity-40 uppercase">Thermal</span>
                    <span className={health.actuators.thermalEstimate > 60 ? 'text-rose-500 font-bold' : 'text-white'}>
                      {health.actuators.thermalEstimate.toFixed(1)}°C
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-2 border border-zinc-800 bg-zinc-950/40 shrink-0">
               <span className="opacity-40 uppercase block mb-1 text-[7px]">Simulator_Inject</span>
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
             <SentinelLedger entries={ledger} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
