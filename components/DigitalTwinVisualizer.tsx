import React from 'react';
import { DigitalTwinState } from '../types';
import { Box, Layers, Wind } from 'lucide-react';

interface DigitalTwinVisualizerProps {
  state: DigitalTwinState;
  topology: string;
}

const DigitalTwinVisualizer: React.FC<DigitalTwinVisualizerProps> = ({ state, topology }) => {
  return (
    <div className="border border-[#00ff41]/30 bg-zinc-900/40 p-3 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
        <h2 className="font-black uppercase text-[10px] flex items-center gap-2">
          <Layers size={12} className="text-[#00ff41] animate-pulse" />
          L2: Digital_Twin_Observer
        </h2>
        <div className="flex items-center gap-2">
          {state.isMultiBody && (
            <span className="text-[7px] bg-[#00ff41]/20 text-[#00ff41] px-1 border border-[#00ff41]/30 uppercase font-bold">Multi_Body</span>
          )}
          <span className="text-[8px] opacity-40 uppercase tracking-widest">Active_Sync</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 shrink-0">
        <div className="space-y-0.5">
          <span className="text-[7px] text-zinc-500 uppercase">Total_Mass</span>
          <div className="text-base font-black text-white leading-none">{state.totalMass.toFixed(3)}<span className="text-[9px] text-zinc-600 ml-1">kg</span></div>
        </div>
        <div className="space-y-0.5">
          <span className="text-[7px] text-zinc-500 uppercase">Stability</span>
          <div className={`text-base font-black leading-none ${state.stabilityMargin < 0.3 ? 'text-rose-500' : 'text-[#00ff41]'}`}>
            {(state.stabilityMargin * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
        {/* Aero Metrics Section */}
        {state.aero && (
          <div className="bg-zinc-950/60 border border-zinc-800 p-2 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Wind size={10} className="text-blue-400" />
              <span className="text-[8px] font-black uppercase text-blue-400">Aero_Dynamics (Physics-Informed)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <span className="text-[6px] text-zinc-500 uppercase">Mach_Number</span>
                <div className={`text-[10px] font-mono font-bold ${state.aero.machNumber > 0.8 ? 'text-amber-400' : 'text-white'}`}>
                  M {state.aero.machNumber.toFixed(3)}
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[6px] text-zinc-500 uppercase">Drag_Coeff (Cd)</span>
                <div className="text-[10px] font-mono font-bold text-white">
                  {state.aero.dragCoefficient.toFixed(3)}
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[6px] text-zinc-500 uppercase">Air_Density (ρ)</span>
                <div className="text-[10px] font-mono font-bold text-white">
                  {state.aero.atmosphericDensity.toFixed(4)} <span className="text-[6px] opacity-40">kg/m³</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[6px] text-zinc-500 uppercase">Altitude</span>
                <div className="text-[10px] font-mono font-bold text-white">
                  {state.aero.altitude.toFixed(1)} <span className="text-[6px] opacity-40">m</span>
                </div>
              </div>
            </div>
            <div className="pt-1 border-t border-zinc-800">
              <div className="flex justify-between text-[6px] uppercase text-zinc-500">
                <span>RLS_Drag_Correction</span>
                <span className="text-blue-400">x{state.estimatedDrag.toFixed(3)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Body Registry */}
        <div className="space-y-1">
          <span className="text-[7px] text-zinc-500 uppercase block mb-1">Body_Registry</span>
          <div className="grid grid-cols-1 gap-1">
            {state.bodies.map(body => (
              <div key={body.id} className="bg-black/40 border border-zinc-800 p-1.5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Box size={10} className="text-zinc-500" />
                  <span className="text-[8px] font-mono text-zinc-300">{body.id}</span>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-[6px] text-zinc-600 uppercase">Mass</span>
                    <span className="text-[8px] font-mono text-white">{body.mass.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[6px] text-zinc-600 uppercase">Cov</span>
                    <span className="text-[8px] font-mono text-amber-500">{body.covariance.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
