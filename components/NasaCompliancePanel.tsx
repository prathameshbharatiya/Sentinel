import React from 'react';
import { NasaComplianceStatus } from '../types';
import { Rocket, ShieldCheck, UserCheck, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';

interface NasaCompliancePanelProps {
  status: NasaComplianceStatus;
}

const NasaCompliancePanel: React.FC<NasaCompliancePanelProps> = ({ status }) => {
  return (
    <div className="border border-[#00ff41]/30 bg-zinc-900/40 p-3 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
        <h2 className="font-black uppercase text-xs flex items-center gap-2">
          <Rocket size={14} className="text-[#00ff41]" />
          L10: NASA-STD-8739.8_Mission_Ready
        </h2>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse"></div>
          <span className="text-[10px] text-[#00ff41] uppercase font-bold">Mission_Ready</span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
        {/* IV&V Status */}
        <div className="bg-black/60 border border-zinc-800 p-2 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck size={16} className="text-blue-400" />
              <span className="text-[11px] font-black uppercase text-white tracking-wider">Independent_Verification (IV&V)</span>
            </div>
            <span className="text-[9px] bg-blue-400/10 text-blue-400 px-1 border border-blue-400/20 uppercase font-bold">Verified</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase">Contractor_ID</span>
              <span className="text-xs font-mono text-blue-300">{status.ivv.contractorId}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase">Verified_Layers</span>
              <div className="flex gap-1 mt-0.5">
                {status.ivv.verifiedLayers.map(layer => (
                  <span key={layer} className="text-[9px] bg-zinc-800 px-1 rounded border border-zinc-700">{layer}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Software Safety Analysis (SSA) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-[#00ff41]" />
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Software_Safety_Analysis (SSA)</span>
          </div>
          
          <div className="space-y-1.5">
            {status.softwareSafetyAnalysis.map(func => (
              <div key={func.id} className="p-2 bg-zinc-950/40 border border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white uppercase">{func.name}</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 size={10} className="text-[#00ff41]" />
                    <span className="text-[10px] text-[#00ff41] uppercase font-bold">SSA_Complete</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-start gap-1">
                    <AlertCircle size={10} className="text-rose-400 mt-0.5 shrink-0" />
                    <span className="text-[10px] text-zinc-400 leading-tight italic">Hazard: {func.hazardContribution}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {func.controls.map(control => (
                      <span key={control} className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 uppercase">
                        {control}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NASA Mission Assurance */}
        <div className="p-2 border border-amber-500/20 bg-amber-500/5 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-amber-500" />
            <span className="text-[10px] font-bold uppercase text-amber-500">NASA Mission Assurance</span>
          </div>
          <p className="text-[9px] text-zinc-400 leading-tight">
            Compliance with NASA-STD-8739.8 established. Safety-critical functions L4, L6, and L3 have been independently verified and validated for high-reliability rocket applications.
          </p>
        </div>
      </div>

        <div className="flex items-center justify-between pt-1 opacity-40">
          <span className="text-[10px] uppercase">Last_Audit_Cycle</span>
          <span className="text-[10px] font-mono">{new Date(status.ivv.lastAuditTimestamp).toISOString()}</span>
        </div>
    </div>
  );
};

export default NasaCompliancePanel;
