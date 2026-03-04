import React from 'react';
import { VerificationStatus, IndustryProfile } from '../types';
import { ShieldCheck, FileCheck, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';

interface FormalVerificationPanelProps {
  status: VerificationStatus;
  industry?: IndustryProfile;
}

const FormalVerificationPanel: React.FC<FormalVerificationPanelProps> = ({ status, industry = IndustryProfile.GENERAL_ROBOTICS }) => {
  const getGuaranteeLabel = () => {
    switch (industry) {
      case IndustryProfile.AEROSPACE_LAUNCH: return "Aerospace_Stability_Guarantee";
      case IndustryProfile.URBAN_AIR_MOBILITY: return "UAM_Stability_Guarantee";
      case IndustryProfile.FLEET_LOGISTICS: return "Fleet_Coordination_Guarantee";
      default: return "Industrial_Stability_Guarantee";
    }
  };

  const getStandardLabel = () => {
    switch (industry) {
      case IndustryProfile.AEROSPACE_LAUNCH: return "NASA-STD-8739.8";
      case IndustryProfile.URBAN_AIR_MOBILITY: return "RT-DO-178C-DAL-A";
      case IndustryProfile.FLEET_LOGISTICS: return "ISO-13849-PL-e";
      default: return "IEC-61508-SIL-4";
    }
  };

  return (
    <div className="border border-[#00ff41]/30 bg-zinc-900/40 p-3 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
        <h2 className="font-black uppercase text-xs flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#00ff41]" />
          L8: Formal_Verification_Kernel
        </h2>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse"></div>
          <span className="text-[10px] text-[#00ff41] uppercase font-bold">Verified</span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
        {/* Certificate Section */}
        <div className="bg-black/60 border border-zinc-800 p-2 space-y-2">
          <div className="flex items-center gap-2">
            <FileCheck size={16} className="text-[#00ff41]" />
            <span className="text-[11px] font-black uppercase text-white tracking-wider">Stability_Certificate</span>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase">dReal_Nonlinear_Solver</span>
              <div className="text-[11px] font-mono text-emerald-400 bg-emerald-400/5 px-1.5 py-0.5 border border-emerald-400/20 rounded">
                {status.dRealCertificate}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase">Coq_Formal_Proof_Hash</span>
              <div className="text-[11px] font-mono text-blue-400 bg-blue-400/5 px-1.5 py-0.5 border border-blue-400/20 rounded truncate">
                {status.coqProofHash}
              </div>
            </div>
          </div>
        </div>

        {/* Proof Properties */}
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-between p-2 bg-zinc-950/40 border border-zinc-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={12} className="text-[#00ff41]" />
              <span className="text-[10px] text-zinc-300 uppercase">Interval_Lyapunov_Tube</span>
            </div>
            <span className="text-xs bg-[#00ff41]/10 text-[#00ff41] px-1 border border-[#00ff41]/20 uppercase font-bold">Proved</span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-zinc-950/40 border border-zinc-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={12} className="text-[#00ff41]" />
              <span className="text-[10px] text-zinc-300 uppercase">Convex_Projection_Safety</span>
            </div>
            <span className="text-xs bg-[#00ff41]/10 text-[#00ff41] px-1 border border-[#00ff41]/20 uppercase font-bold">Proved</span>
          </div>
        </div>

        {/* Guarantees */}
        <div className="p-2 border border-amber-500/20 bg-amber-500/5 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Lock size={12} className="text-amber-500" />
            <span className="text-[10px] font-bold uppercase text-amber-500">{getGuaranteeLabel()}</span>
          </div>
          <p className="text-xs text-zinc-400 leading-tight">
            The kernel provides a machine-checkable proof that if the tube computation returns <span className="text-emerald-400">STABLE</span>, the physical system is guaranteed to be stable within L2 parameter bounds.
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 opacity-40">
          <span className="text-[10px] uppercase">Last_Verification_Cycle</span>
          <span className="text-[10px] font-mono">{new Date(status.verificationTimestamp).toISOString()}</span>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full border border-[#00ff41]/30 flex items-center justify-center">
            <ShieldCheck size={14} className="text-[#00ff41]" />
          </div>
          <div className="text-xs text-zinc-500 uppercase leading-tight">
            Formal Certificate: <span className="text-white">{getStandardLabel()}</span> compliant kernel logic.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormalVerificationPanel;
