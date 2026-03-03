import React from 'react';
import { EvtolGovernance } from '../types';
import { Fan, ShieldAlert, MapPin, Zap, Activity, AlertTriangle } from 'lucide-react';

interface RotorGovernancePanelProps {
  governance: EvtolGovernance;
}

const RotorGovernancePanel: React.FC<RotorGovernancePanelProps> = ({ governance }) => {
  return (
    <div className="border border-[#00ff41]/30 bg-zinc-900/40 p-3 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
        <h2 className="font-black uppercase text-xs flex items-center gap-2">
          <Fan size={14} className={governance.allocation.isDegraded ? "text-amber-500 animate-spin" : "text-[#00ff41]"} />
          L5: eVTOL_Rotor_Governance
        </h2>
        <div className="flex items-center gap-1">
          <span className={`text-[10px] uppercase font-bold ${governance.allocation.isDegraded ? "text-amber-500" : "text-[#00ff41]"}`}>
            {governance.allocation.isDegraded ? "DEGRADED_MODE" : "NOMINAL_FLIGHT"}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
        {/* Rotor Grid */}
        <div className="grid grid-cols-4 gap-1">
          {governance.rotors.map(rotor => (
            <div 
              key={rotor.id} 
              className={`p-1 border flex flex-col items-center justify-center transition-colors ${
                rotor.status === 'FAILED' ? "bg-rose-900/20 border-rose-500/50" :
                rotor.status === 'DEGRADED' ? "bg-amber-900/20 border-amber-500/50" :
                "bg-zinc-950/40 border-zinc-800"
              }`}
            >
              <span className="text-[10px] text-zinc-500 font-mono">{rotor.id.split('_')[1]}</span>
              <Activity size={12} className={rotor.status === 'FAILED' ? "text-rose-500" : rotor.status === 'DEGRADED' ? "text-amber-500" : "text-[#00ff41]"} />
              <span className="text-[10px] font-bold mt-0.5">{(rotor.healthScore * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>

        {/* Control Allocation */}
        <div className="bg-black/40 border border-zinc-800 p-2 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase text-white tracking-wider">Control_Allocation</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-500">FLASH_STORAGE_ACTIVE</span>
          </div>
          
          <div className="flex items-center justify-between p-1.5 bg-zinc-900/60 border border-zinc-800">
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase">Active_Matrix</span>
              <span className={`text-[11px] font-mono ${governance.allocation.isDegraded ? "text-amber-400" : "text-[#00ff41]"}`}>
                {governance.allocation.activeMatrixId}
              </span>
            </div>
            {governance.allocation.redistributionActive && (
              <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1 border border-amber-500/20 uppercase font-bold animate-pulse">
                Redistributing
              </span>
            )}
          </div>
        </div>

        {/* Emergency Landing Governance */}
        {governance.emergencyLandingActive && (
          <div className="p-2 border border-rose-500/30 bg-rose-500/5 space-y-2 animate-pulse">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-rose-500" />
              <span className="text-[11px] font-black uppercase text-rose-500 tracking-wider">L6: Emergency_Landing_Active</span>
            </div>
            
            <div className="flex items-center gap-2 p-1.5 bg-black/40 border border-rose-500/20">
              <MapPin size={12} className="text-rose-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 uppercase">Target_Safe_Zone</span>
                <span className="text-xs text-white font-bold">{governance.nearestSafeZone}</span>
              </div>
            </div>
            
            <p className="text-xs text-rose-400 leading-tight italic">
              Minimum-energy trajectory computed using degraded flight envelope. Dynamic allocation suspended.
            </p>
          </div>
        )}

        {!governance.emergencyLandingActive && (
          <div className="p-2 border border-zinc-800 bg-zinc-950/20 flex items-start gap-2">
            <AlertTriangle size={14} className="text-zinc-600 shrink-0" />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase text-zinc-500">Contingency_Ready</span>
              <p className="text-xs text-zinc-600 leading-tight">
                Rotor failure matrices precomputed for all single/dual failure combinations. L4/L6 governance standby.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-zinc-800 flex justify-between items-center opacity-40">
        <span className="text-[10px] uppercase">Envelope_Status</span>
        <span className="text-[10px] font-mono">{governance.allocation.isDegraded ? "DEGRADED_ENVELOPE" : "FULL_ENVELOPE"}</span>
      </div>
    </div>
  );
};

export default RotorGovernancePanel;
