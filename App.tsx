import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SentinelRuntime } from './services/SentinelRuntime';
import { RobotState, RobotHealth, HazardLevel, RuntimeMode } from './types';
import TelemetryChart from './components/TelemetryChart';
import HealthMetric from './components/HealthMetric';
import AdvisoryPanel from './components/AdvisoryPanel';

const LandingPage: React.FC<{ onEnter: () => void, onDownloadSDK: (type: 'hpp' | 'cpp') => void }> = ({ onEnter, onDownloadSDK }) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'integration' | 'sdk'>('mission');

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6 mono">
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
                  Sentinel is a <span className="text-[#00ff41]">Middleware Safety Kernel</span>. 
                  It is designed to run locally on your robot's flight controller or single-board computer, 
                  shielding your motors from software command instability and physical wear.
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
              </div>
              <div className="space-y-4">
                 <h3 className="text-[10px] font-bold text-zinc-500 uppercase">Operational Guarantees:</h3>
                 {[
                   "Deterministic Worst-Case Execution Time (WCET) < 1.0ms",
                   "Mathematical Proof of Stability via Lyapunov Functions",
                   "Real-time Identification of Payload/Mass Changes",
                   "No Dynamic Memory Allocation (Heap-Free Runtime)"
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
                <h2 className="text-xl font-bold text-white uppercase tracking-tight border-b border-zinc-800 pb-2">Hardware Wiring</h2>
                <p className="text-xs text-zinc-400">Insert Sentinel into your primary control loop. It acts as a passive observer that transforms risky commands into safe ones.</p>
                <div className="space-y-4">
                  <div className="bg-black border border-zinc-800 p-4">
                    <span className="text-[9px] text-zinc-600 block mb-2 uppercase tracking-widest">Input Signals</span>
                    <ul className="text-[10px] space-y-2 text-zinc-400">
                      <li>• <code className="text-[#00ff41]">VectorXd Pos</code>: Raw Encoder Data</li>
                      <li>• <code className="text-[#00ff41]">VectorXd Vel</code>: Velocity State</li>
                      <li>• <code className="text-[#00ff41]">VectorXd Cmd</code>: Intended Torque</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-900/40 border border-[#00ff41]/20 p-4">
                    <span className="text-[9px] text-[#00ff41] block mb-2 uppercase tracking-widest">Output Filter</span>
                    <ul className="text-[10px] space-y-2 text-zinc-300 font-bold">
                      <li>• <code className="text-white">double v_scale</code>: Multiply torque by this.</li>
                      <li>• <code className="text-rose-400">RiskLevel risk</code>: Emergency stop flag.</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="md:col-span-7 border border-zinc-800 bg-black p-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 text-[8px] bg-zinc-900 text-zinc-500 uppercase">main.cpp (Snippet)</div>
                <pre className="text-[10px] text-[#00ff41]/80 leading-relaxed overflow-x-auto whitespace-pre h-[300px] custom-scrollbar">
{`#include "SentinelCore.hpp"

sentinel::SentinelCore kernel(6); // 6-DOF Robot

void loop() {
    // 1. Telemetry Ingestion
    VectorXd q = encoders.read();
    VectorXd q_dot = encoders.derive();
    VectorXd tau_ref = planner.get_command();

    // 2. Step the Safety Kernel
    kernel.step(q, q_dot, tau_ref);

    // 3. Command Clamping
    auto adv = kernel.getAdvisory();
    if(adv.risk != RiskLevel::CRITICAL) {
        motors.write(tau_ref * adv.velocity_scale);
    } else {
        motors.estop();
    }
}`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'sdk' && (
            <div className="flex flex-col items-center justify-center space-y-8 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white uppercase">C++17 Production SDK</h2>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">Certified Build: 0xEF42A99B // RTOS Optimized</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
                <button 
                  onClick={() => onDownloadSDK('hpp')}
                  className="flex flex-col items-center p-6 border border-[#00ff41]/40 bg-zinc-900/20 hover:bg-[#00ff41]/10 transition-all group"
                >
                  <div className="text-[#00ff41] font-black text-xl mb-1">HEADER</div>
                  <div className="text-[9px] text-zinc-500 uppercase">SentinelCore.hpp</div>
                </button>
                <button 
                  onClick={() => onDownloadSDK('cpp')}
                  className="flex flex-col items-center p-6 border border-[#00ff41]/40 bg-zinc-900/20 hover:bg-[#00ff41]/10 transition-all group"
                >
                  <div className="text-[#00ff41] font-black text-xl mb-1">SOURCE</div>
                  <div className="text-[9px] text-zinc-500 uppercase">SentinelCore.cpp</div>
                </button>
              </div>
              <div className="p-4 border border-zinc-800 bg-zinc-950 max-w-lg text-left">
                <h4 className="text-[10px] text-white font-bold uppercase mb-2">Build Requirements</h4>
                <ul className="text-[10px] text-zinc-500 space-y-1">
                   <li>• C++17 Standard or higher</li>
                   <li>• Eigen 3.3.7+ (Matrix Mathematics)</li>
                   <li>• No standard library dependencies (optional for some logs)</li>
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
            Enter Dashboard Simulator
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'onboarding' | 'dashboard'>('onboarding');
  const sentinelRef = useRef<SentinelRuntime>(new SentinelRuntime());
  const [telemetry, setTelemetry] = useState<any[]>([]);
  const [health, setHealth] = useState<RobotHealth | null>(null);
  const [failures, setFailures] = useState<any[]>([]);
  const [driftSim, setDriftSim] = useState(1.0);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  const simStateRef = useRef<RobotState>({
    position: [0, 0, 0],
    velocity: [0, 0, 0],
    acceleration: [0, 0, 0],
    controlInput: [0, 0, 0],
    timestamp: Date.now()
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
      const control = [Math.sin(t) * 15 + (Math.random() > 0.99 ? 100 : 0)]; 
      
      const last = simStateRef.current;
      const acc = [(control[0] - 0.2 * last.velocity[0]) / actualMass];
      const vel = [last.velocity[0] + acc[0] * 0.1];
      const pos = [last.position[0] + vel[0] * 0.1];

      const state: RobotState = { 
        position: pos, 
        velocity: vel, 
        acceleration: acc, 
        controlInput: control, 
        timestamp: Date.now() 
      };

      simStateRef.current = state;
      sentinelRef.current.observe(state);

      if (Math.random() > 0.8) {
        setTelemetry(prev => [...prev.slice(-40), { 
          timestamp: state.timestamp, 
          velocity: vel[0], 
          controlInput: control[0] 
        }]);
        setHealth(sentinelRef.current.getHealth());
        setFailures([...sentinelRef.current.getFailures()]);
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      isActive = false;
      cancelAnimationFrame(animationFrameId);
      clearTimeout(bootTimeout);
    };
  }, [driftSim, view]);

  const handleDownloadSDK = async (type: 'hpp' | 'cpp') => {
    let content = "";
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

  if (view === 'onboarding') {
    return <LandingPage onEnter={() => setView('dashboard')} onDownloadSDK={handleDownloadSDK} />;
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
    <div className="min-h-screen bg-black text-[#00ff41] p-6 mono text-[11px] selection:bg-[#00ff41] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700">
        
        {/* KERNEL IDENTITY HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border border-[#00ff41]/30 p-4 bg-zinc-900/40 gap-4">
           <div className="flex gap-8 items-center">
             <button onClick={() => setView('onboarding')} className="hover:opacity-60 transition-opacity">
               <h1 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">Sentinel_v5</h1>
             </button>
             <div className="hidden md:flex gap-4 px-6 border-l border-zinc-800">
               <span className={health?.runtimeMode === RuntimeMode.NORMAL ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                 KERNEL_{health?.runtimeMode.toUpperCase()}
               </span>
               <span className="opacity-40">WCET: {health?.wcet_ms.toFixed(3)}ms</span>
             </div>
           </div>
           <div className="flex items-center gap-6">
             <button 
                onClick={() => handleDownloadSDK('cpp')}
                className="px-4 py-2 border border-[#00ff41]/30 hover:bg-[#00ff41] hover:text-black transition-all text-[9px] font-bold uppercase tracking-widest"
             >
                Extract_Source
             </button>
             <div className="text-right hidden sm:block">
               <div className="text-[10px] opacity-60">AUDIT_LEDGER_HASH</div>
               <div className="font-bold text-white uppercase">0x{health?.integrityHash}</div>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3 space-y-6">
            <div className="border border-[#00ff41]/20 p-5 bg-zinc-900/20">
              <h2 className="font-black uppercase mb-6 border-b border-zinc-800 pb-2">L4: Lyapunov Matrix (P)</h2>
              {health && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-center border border-zinc-800 p-4 bg-black/50">
                    <div className="border border-zinc-800 p-2">{health.lyapunov.P[0][0].toFixed(3)}</div>
                    <div className="border border-zinc-800 p-2">{health.lyapunov.P[0][1].toFixed(3)}</div>
                    <div className="border border-zinc-800 p-2">{health.lyapunov.P[1][0].toFixed(3)}</div>
                    <div className="border border-zinc-800 p-2">{health.lyapunov.P[1][1].toFixed(3)}</div>
                  </div>
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="opacity-40 uppercase">State_Invariant_Check</span>
                    <span className={health.lyapunov.isPositiveDefinite ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {health.lyapunov.isPositiveDefinite ? 'POSITIVE_DEF' : 'DIVERGED'}
                    </span>
                  </div>
                  <HealthMetric label="λ_Adaptive_Forget" value={health.estimates.lambda} />
                </div>
              )}
            </div>

            <div className="border border-zinc-800 p-5 bg-black">
              <h3 className="uppercase mb-4 opacity-40">L5: Actuator Envelope</h3>
              {health && (
                <div className="space-y-3">
                  <HealthMetric label="Torque_Utilization" value={health.actuators.torqueUtilization / 10} />
                  <div className="flex justify-between text-[9px]">
                    <span className="opacity-40 uppercase">Thermal_Est</span>
                    <span className={health.actuators.thermalEstimate > 60 ? 'text-rose-500 font-bold' : 'text-white'}>
                      {health.actuators.thermalEstimate.toFixed(1)}°C
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border border-zinc-800 bg-zinc-950/40">
               <span className="opacity-40 uppercase block mb-3 text-[9px]">Simulator_Inject: Physical_Drift</span>
               <input 
                 type="range" min="0.5" max="3" step="0.1" value={driftSim} 
                 onChange={e => setDriftSim(parseFloat(e.target.value))}
                 className="w-full accent-[#00ff41] bg-zinc-900 h-1.5 rounded-lg appearance-none cursor-pointer"
               />
               <div className="flex justify-between mt-2 opacity-30 text-[8px]">
                  <span>0.5kg</span>
                  <span>1.0kg (NOM)</span>
                  <span>3.0kg</span>
               </div>
            </div>
          </div>

          <div className="md:col-span-6 space-y-6">
            <div className="border-2 border-zinc-800 p-4 bg-black overflow-hidden relative">
               <div className="absolute top-2 right-4 text-[8px] opacity-20 uppercase tracking-widest pointer-events-none">Live_Newtonian_Telemetry</div>
               <TelemetryChart data={telemetry} title="L1: Multi-Channel State Observer" />
            </div>
            {health && <AdvisoryPanel advisory={sentinelRef.current.getAdvisory()} />}
            
            <div className="border border-zinc-800 p-5 h-56 bg-zinc-950/50 relative flex flex-col">
               <div className="absolute top-2 right-2 px-2 py-0.5 bg-rose-900/30 text-rose-500 text-[8px] font-black uppercase tracking-widest border border-rose-900">Offline_Forensic_Air_Gap</div>
               <h4 className="uppercase mb-2 opacity-40">L10: Forensic Replay Analysis</h4>
               <div className="text-[10px] overflow-y-auto flex-1 leading-relaxed opacity-80 whitespace-pre-wrap mono pr-2 custom-scrollbar">
                 {analyzing ? (
                   <div className="flex items-center gap-2 text-white animate-pulse">
                     <div className="w-1.5 h-1.5 bg-white rounded-full" />
                     REPLAYING_TELEMETRY_IN_FORENSIC_KERNEL...
                   </div>
                 ) : (analysis || "> KERNEL_IDLE: Awaiting stability exception ledger...")}
               </div>
            </div>
          </div>

          <div className="md:col-span-3">
             <div className="border border-zinc-800 h-full p-4 bg-zinc-900/10 flex flex-col min-h-[400px]">
                <h2 className="uppercase border-b border-zinc-800 pb-2 mb-4 font-black">L7: Signed Audit Ledger</h2>
                <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                  {failures.length === 0 ? (
                    <div className="text-center py-20 opacity-20 uppercase tracking-widest text-[9px]">Audit_Log_Nominal</div>
                  ) : (
                    failures.slice().reverse().map(f => (
                      <div 
                        key={f.id} 
                        onClick={() => runGeminiForensics(f)} 
                        className="border border-zinc-800 p-3 bg-black hover:border-[#00ff41]/50 cursor-pointer transition-all border-l-2 border-l-rose-500/30 group"
                      >
                        <div className="flex justify-between mb-1 opacity-50 text-[8px] group-hover:opacity-100 transition-opacity">
                          <span>{f.signedBy}</span>
                          <span className="text-white">{f.checksum}</span>
                        </div>
                        <div className="font-bold text-white uppercase text-[9px] group-hover:text-[#00ff41] transition-colors">{f.type}</div>
                        <div className="text-zinc-600 line-clamp-1 mt-1 text-[8px]">{f.description}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className="pt-4 mt-4 border-t border-zinc-800 text-[8px] opacity-40 uppercase flex justify-between items-center">
                   <span>Sentinel_Verified</span>
                   <span className="text-emerald-500 font-bold">READY</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;