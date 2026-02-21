import React from 'react';
import { DigitalTwinState } from '../types';

interface DigitalTwinVisualizerProps {
  state: DigitalTwinState;
  topology: string;
}

const DigitalTwinVisualizer: React.FC<DigitalTwinVisualizerProps> = ({ state, topology }) => {
  return (
    <div className="border border-[#00ff41]/30 bg-zinc-900/40 p-3 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
        <h2 className="font-black uppercase text-[10px] flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00ff41] animate-pulse"></div>
          L2: Digital_Twin_Observer
        </h2>
        <span className="text-[8px] opacity-40 uppercase tracking-widest">Active_Sync</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 shrink-0">
        <div className="space-y-0.5">
          <span className="text-[7px] text-zinc-500 uppercase">Est_Mass</span>
          <div className="text-base font-black text-white leading-none">{state.estimatedMass.toFixed(3)}<span className="text-[9px] text-zinc-600 ml-1">kg</span></div>
        </div>
        <div className="space-y-0.5">
          <span className="text-[7px] text-zinc-500 uppercase">Stability</span>
          <div className={`text-base font-black leading-none ${state.stabilityMargin < 0.3 ? 'text-rose-500' : 'text-[#00ff41]'}`}>
            {(state.stabilityMargin * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-[7px] uppercase">
            <span className="text-zinc-500">Residual_Error</span>
            <span className={state.modelResidual > 5 ? 'text-rose-400' : 'text-emerald-400'}>{state.modelResidual.toFixed(4)}</span>
          </div>
          <div className="h-1 bg-zinc-800 w-full rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${state.modelResidual > 5 ? 'bg-rose-500' : 'bg-[#00ff41]'}`}
              style={{ width: `${Math.min(100, state.modelResidual * 10)}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[7px] uppercase">
            <span className="text-zinc-500">Adaptation</span>
            <span className="text-white">{(state.adaptationRate * 1000).toFixed(2)} Hz</span>
          </div>
          <div className="h-1 bg-zinc-800 w-full rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${Math.min(100, state.adaptationRate * 2000)}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[7px] uppercase">
            <span className="text-zinc-500">Uncertainty_Tube (V)</span>
            <span className="text-amber-400">
              {state.uncertaintyTube.vMin.toFixed(0)} - {state.uncertaintyTube.vMax.toFixed(0)}
            </span>
          </div>
          <div className="h-1 bg-zinc-800 w-full rounded-full overflow-hidden relative">
            <div 
              className="absolute h-full bg-amber-500/30 transition-all duration-300"
              style={{ 
                left: `${Math.min(100, (state.uncertaintyTube.vMin / 8000) * 100)}%`,
                width: `${Math.min(100, ((state.uncertaintyTube.vMax - state.uncertaintyTube.vMin) / 8000) * 100)}%`
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 border border-zinc-800 flex items-center justify-center">
            <div className={`w-3 h-3 border-2 border-current animate-spin ${state.stabilityMargin < 0.5 ? 'text-rose-500' : 'text-[#00ff41]'}`} style={{ borderTopColor: 'transparent' }}></div>
          </div>
          <div className="flex-1">
            <div className="text-[8px] font-bold text-white uppercase leading-none">{topology}</div>
            <div className="text-[7px] text-zinc-500 uppercase tracking-tighter">Physics_Engine_Synced</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwinVisualizer;
