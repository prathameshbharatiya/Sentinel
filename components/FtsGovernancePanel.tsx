import React from 'react';
import { RocketGovernance } from '../types';
import { Rocket, ShieldAlert, ShieldCheck, Activity, Timer, Crosshair, Gauge, Droplets } from 'lucide-react';

interface FtsGovernancePanelProps {
  governance: RocketGovernance;
  currentDrift: number;
}

const FtsGovernancePanel: React.FC<FtsGovernancePanelProps> = ({ governance, currentDrift }) => {
  const { fts, stageStatus, remainingFlightTime, engine } = governance;
  
  const driftPercent = Math.min(100, (Math.abs(currentDrift) / fts.safeCorridor.maxX) * 100);
  const isOutside = Math.abs(currentDrift) > fts.safeCorridor.maxX;

  return (
    <div className="border border-rose-500/30 bg-zinc-900/40 p-3 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
        <h2 className="font-black uppercase text-xs flex items-center gap-2">
          <Rocket size={14} className={fts.isTriggered ? "text-rose-500" : "text-amber-500"} />
          FTS: Flight_Termination_System
        </h2>
        <span className="text-[10px] opacity-40 uppercase tracking-widest">Range_Safety_Kernel</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className={`p-2 border ${fts.isTriggered ? 'border-rose-500 bg-rose-500/10' : 'border-zinc-800 bg-black/40'}`}>
          <div className="text-[10px] text-zinc-500 uppercase mb-1 flex items-center gap-1">
            <ShieldAlert size={10} />
            System_Status
          </div>
          <div className={`text-sm font-black uppercase ${fts.isTriggered ? 'text-rose-500 animate-pulse' : fts.isArmed ? 'text-amber-500' : 'text-emerald-500'}`}>
            {fts.isTriggered ? 'TERMINATED' : fts.isArmed ? 'ARMED' : 'SAFE'}
          </div>
        </div>

        <div className="p-2 border border-zinc-800 bg-black/40">
          <div className="text-[10px] text-zinc-500 uppercase mb-1 flex items-center gap-1">
            <Timer size={10} />
            Remaining_Flight
          </div>
          <div className="text-sm font-black text-white">
            {remainingFlightTime.toFixed(1)}s
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
        {/* Recoverability Score */}
        <div>
          <div className="flex justify-between items-end mb-1">
            <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
              <Activity size={10} />
              V-Tube_Recoverability
            </div>
            <div className={`text-[11px] font-bold ${fts.recoverabilityScore < 0.3 ? 'text-rose-500' : fts.recoverabilityScore < 0.7 ? 'text-amber-500' : 'text-emerald-400'}`}>
              {(fts.recoverabilityScore * 100).toFixed(1)}%
            </div>
          </div>
          <div className="h-1.5 bg-zinc-800 w-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${fts.recoverabilityScore < 0.3 ? 'bg-rose-500' : fts.recoverabilityScore < 0.7 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${fts.recoverabilityScore * 100}%` }}
            />
          </div>
        </div>

        {/* Trajectory Corridor */}
        <div>
          <div className="flex justify-between items-end mb-1">
            <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
              <Crosshair size={10} />
              Trajectory_Drift
            </div>
            <div className={`text-[11px] font-bold ${isOutside ? 'text-rose-500' : 'text-zinc-400'}`}>
              {Math.abs(currentDrift).toFixed(2)}m
            </div>
          </div>
          <div className="relative h-4 bg-zinc-950 border border-zinc-800 flex items-center justify-center">
            {/* Safe Corridor Bounds */}
            <div className="absolute inset-y-0 w-1/2 border-x border-zinc-800 bg-zinc-900/20" />
            {/* Center Line */}
            <div className="absolute inset-y-0 w-px bg-zinc-800" />
            {/* Vehicle Position */}
            <div 
              className={`absolute w-1 h-3 transition-all duration-300 ${isOutside ? 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]' : 'bg-[#00ff41]'}`}
              style={{ left: `${50 + (currentDrift / fts.safeCorridor.maxDrift) * 50}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-zinc-600">-{fts.safeCorridor.maxDrift}m</span>
            <span className="text-[10px] text-zinc-600">0m</span>
            <span className="text-[10px] text-zinc-600">+{fts.safeCorridor.maxDrift}m</span>
          </div>
        </div>

        {/* Engine Telemetry */}
        <div className="grid grid-cols-2 gap-2 border-t border-zinc-800 pt-2">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1 mb-0.5">
              <Gauge size={10} />
              P_Chamber
            </div>
            <div className="text-[11px] font-mono text-amber-400">
              {engine.chamberPressure.toFixed(0)} <span className="text-[10px] opacity-50">PSI</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1 mb-0.5">
              <Droplets size={10} />
              m_dot
            </div>
            <div className="text-[11px] font-mono text-emerald-400">
              {engine.massFlowRate.toFixed(2)} <span className="text-[10px] opacity-50">kg/s</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-zinc-500 uppercase mb-0.5">
            <span>Propellant_Remaining</span>
            <span>{engine.isp.toFixed(1)}s Isp</span>
          </div>
          <div className="h-1 bg-zinc-800">
            <div 
              className="h-full bg-blue-500"
              style={{ width: `${(engine.propellantRemaining / 5000) * 100}%` }}
            />
          </div>
        </div>

        {/* Status Messages */}
        <div className="space-y-1">
          {fts.isTriggered && (
            <div className="p-1.5 bg-rose-500/10 border border-rose-500/30 text-[10px] text-rose-400 uppercase font-bold leading-tight">
              CRITICAL: {fts.terminationReason}
            </div>
          )}
          {fts.isRecoveryAttempted && !fts.isTriggered && (
            <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-400 uppercase font-bold leading-tight animate-pulse">
              WARNING: GOVERNED_RECOVERY_IN_PROGRESS
            </div>
          )}
          <div className="p-1.5 bg-zinc-800/30 text-[10px] text-zinc-500 uppercase leading-tight">
            STAGE: {stageStatus}
          </div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-zinc-800">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">L4_V-Tube_Projection</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-rose-500 rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse delay-75" />
            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse delay-150" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FtsGovernancePanel;
