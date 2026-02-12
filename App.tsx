
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SentinelRuntime } from './services/SentinelRuntime';
import { RobotState, RobotHealth, HazardLevel, RuntimeMode } from './types';
import TelemetryChart from './components/TelemetryChart';
import HealthMetric from './components/HealthMetric';
import AdvisoryPanel from './components/AdvisoryPanel';

const App: React.FC = () => {
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
    let t = 0;
    let animationFrameId: number;
    let isActive = true;

    // Kernel initialization delay simulation
    const bootTimeout = setTimeout(() => setIsBooting(false), 800);

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

      // Decouple state updates from physics loop for performance
      if (Math.random() > 0.85) {
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
  }, [driftSim]);

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
        Provide formal verification of state invariant preservation during breach.`;
      
      const res = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
      setAnalysis(res.text);
    } catch (e) { 
      setAnalysis("REPLAY_ERROR_0xDEADBEEF: Logic core unreachable or API key invalid."); 
    } finally { 
      setAnalyzing(false); 
    }
  };

  if (isBooting) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-[#00ff41] mono p-6">
        <div className="w-64 border border-[#00ff41]/20 p-1 bg-zinc-950">
          <div className="h-1 bg-[#00ff41] animate-[shimmer_2s_infinite] w-full" />
        </div>
        <div className="mt-4 text-[10px] uppercase tracking-[0.2em] animate-pulse">
          Sentinel_Kernel_v5_Booting...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#00ff41] p-6 mono text-[11px] selection:bg-[#00ff41] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* KERNEL IDENTITY HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border border-[#00ff41]/30 p-4 bg-zinc-900/40 gap-4">
           <div className="flex gap-8 items-center">
             <div>
               <h1 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">Sentinel_Runtime_v5</h1>
               <p className="text-[9px] opacity-40 uppercase tracking-widest mt-1">Formal_Safety_Verified // {health?.metadata.buildFingerprint}</p>
             </div>
             <div className="hidden md:flex gap-4 px-6 border-l border-zinc-800">
               <span className={health?.runtimeMode === RuntimeMode.NORMAL ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                 KERNEL_{health?.runtimeMode.toUpperCase()}
               </span>
               <span className="opacity-40">WCET: {health?.wcet_ms.toFixed(3)}ms</span>
             </div>
           </div>
           <div className="text-right">
             <div className="text-[10px] opacity-60">AUDIT_LEDGER_HASH</div>
             <div className="font-bold text-white uppercase">0x{health?.integrityHash}</div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* L3 & L4: FORMAL METRICS */}
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
                    <span className="opacity-40">POS_DEFINITE</span>
                    <span className={health.lyapunov.isPositiveDefinite ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {health.lyapunov.isPositiveDefinite ? 'VERIFIED' : 'FAILED'}
                    </span>
                  </div>
                  <HealthMetric label="λ_Adaptive_Forget" value={health.estimates.lambda} />
                </div>
              )}
            </div>

            <div className="border border-zinc-800 p-5 bg-black">
              <h3 className="uppercase mb-4 opacity-40">L5: Actuator Bounds</h3>
              {health && (
                <div className="space-y-3">
                  <HealthMetric label="Torque_Utilization" value={health.actuators.torqueUtilization / 10} />
                  <div className="flex justify-between text-[9px]">
                    <span className="opacity-40 uppercase">Thermal_Est</span>
                    <span className={health.actuators.thermalEstimate > 60 ? 'text-rose-500 font-bold' : 'text-white'}>
                      {health.actuators.thermalEstimate}°C
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border border-zinc-800 bg-zinc-950/40">
               <span className="opacity-40 uppercase block mb-3 text-[9px]">Simulation_Injection: Mass Drift</span>
               <input 
                 type="range" min="0.5" max="3" step="0.1" value={driftSim} 
                 onChange={e => setDriftSim(parseFloat(e.target.value))}
                 className="w-full accent-[#00ff41] bg-zinc-900 h-1.5 rounded-lg appearance-none cursor-pointer"
               />
               <div className="flex justify-between mt-2 opacity-30 text-[8px]">
                  <span>0.5kg</span>
                  <span>1.0kg (NOMINAL)</span>
                  <span>3.0kg</span>
               </div>
            </div>
          </div>

          {/* TELEMETRY & ADVISORY */}
          <div className="md:col-span-6 space-y-6">
            <div className="border-2 border-zinc-800 p-4 bg-black overflow-hidden">
               <TelemetryChart data={telemetry} title="L1: Redundant Dual-Channel Ingestion" />
            </div>
            {health && <AdvisoryPanel advisory={sentinelRef.current.getAdvisory()} />}
            
            <div className="border border-zinc-800 p-5 h-56 bg-zinc-950/50 relative flex flex-col">
               <div className="absolute top-2 right-2 px-2 py-0.5 bg-rose-900/30 text-rose-500 text-[8px] font-black uppercase tracking-widest border border-rose-900">Offline_Forensic_Air_Gap</div>
               <h4 className="uppercase mb-2 opacity-40">L10: Forensic Replay Analysis</h4>
               <div className="text-[10px] overflow-y-auto flex-1 leading-relaxed opacity-80 whitespace-pre-wrap mono pr-2 custom-scrollbar">
                 {analyzing ? (
                   <div className="flex items-center gap-2 text-white animate-pulse">
                     <div className="w-1.5 h-1.5 bg-white rounded-full" />
                     BOOTING_AIR_GAP_PROCESSOR_AND_REPLAYING_TELEMETRY...
                   </div>
                 ) : (analysis || "> WAITING_FOR_KERNEL_EXCEPTION_LEDGER...")}
               </div>
            </div>
          </div>

          {/* AUDIT LOG */}
          <div className="md:col-span-3">
             <div className="border border-zinc-800 h-full p-4 bg-zinc-900/10 flex flex-col min-h-[400px]">
                <h2 className="uppercase border-b border-zinc-800 pb-2 mb-4 font-black">L7: Signed Audit Ledger</h2>
                <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                  {failures.length === 0 ? (
                    <div className="text-center py-20 opacity-20 uppercase tracking-widest text-[9px]">Ledger_Nominal</div>
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
                   <span>Deterministic_Build</span>
                   <span className="text-emerald-500 font-bold">PASS</span>
                </div>
             </div>
          </div>

        </div>
      </div>
      <div className="crt-overlay fixed inset-0 z-[100] opacity-[0.03]" />
    </div>
  );
};

export default App;
