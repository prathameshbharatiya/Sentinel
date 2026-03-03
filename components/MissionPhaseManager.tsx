import React from 'react';
import { MissionPhaseState } from '../types';
import { Activity, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MissionPhaseManagerProps {
  state: MissionPhaseState;
}

const MissionPhaseManager: React.FC<MissionPhaseManagerProps> = ({ state }) => {
  const { isPreparing, isTransitioning, timeToNextEvent, tau_prepare } = state;

  return (
    <div className="border border-[#00ff41]/20 bg-zinc-900/20 p-3 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
        <h2 className="font-black uppercase text-xs flex items-center gap-2">
          <Activity size={12} className="text-[#00ff41]" />
          L0.5: Mission_Phase_Manager
        </h2>
        <div className="flex items-center gap-2">
           {isTransitioning && (
             <span className="text-[10px] bg-blue-900/30 text-blue-400 px-1 border border-blue-900 uppercase font-bold animate-pulse">Transition_Active</span>
           )}
           {isPreparing && !isTransitioning && (
             <span className="text-[10px] bg-amber-900/30 text-amber-500 px-1 border border-amber-900 uppercase font-bold animate-pulse">Preparing</span>
           )}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-2">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase">Current_Event</span>
            <span className="text-xs font-mono text-white">{state.currentEventId || 'INITIAL_FLIGHT'}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-zinc-500 uppercase">Next_Event</span>
            <span className="text-xs font-mono text-[#00ff41]">{state.nextEventId || 'MISSION_END'}</span>
          </div>
        </div>

        <div className="relative h-1.5 bg-zinc-800 w-full rounded-full overflow-hidden">
          {state.nextEventId && (
            <div 
              className={`h-full transition-all duration-500 ${isPreparing ? 'bg-amber-500' : 'bg-[#00ff41]'}`}
              style={{ width: `${Math.max(0, Math.min(100, (1 - timeToNextEvent / 10000) * 100))}%` }}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="bg-black/40 border border-zinc-800 p-1.5 flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 uppercase">τ_prepare</span>
            <span className="text-xs font-mono text-zinc-300">
              {tau_prepare.toFixed(0)}ms
            </span>
          </div>
          <div className="bg-black/40 border border-zinc-800 p-1.5 flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 uppercase">T_minus</span>
            <span className="text-xs font-mono text-zinc-300">
              {state.nextEventId ? (timeToNextEvent / 1000).toFixed(1) : '--'}s
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-1 border-t border-zinc-800 pt-2">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isPreparing ? 'bg-amber-500 animate-ping' : 'bg-zinc-700'}`}></div>
          <span className={`text-[10px] uppercase ${isPreparing ? 'text-amber-400 font-bold' : 'text-zinc-500'}`}>
            L2: Proactive Forgetting {isPreparing ? 'ENABLED' : 'IDLE'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isTransitioning ? 'bg-blue-500 animate-ping' : 'bg-zinc-700'}`}></div>
          <span className={`text-[10px] uppercase ${isTransitioning ? 'text-blue-400 font-bold' : 'text-zinc-500'}`}>
            L5: Fault Classification {isTransitioning ? 'SUSPENDED' : 'ACTIVE'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MissionPhaseManager;
