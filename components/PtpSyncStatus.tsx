import React from 'react';
import { PtpStatus } from '../types';
import { Clock, ShieldCheck, ShieldAlert } from 'lucide-react';

interface PtpSyncStatusProps {
  status: PtpStatus;
}

const PtpSyncStatus: React.FC<PtpSyncStatusProps> = ({ status }) => {
  const isCritical = status.syncQuality === 'CRITICAL' || !status.isTrustworthy;
  const isPoor = status.syncQuality === 'POOR';
  
  const getQualityColor = () => {
    if (isCritical) return 'text-rose-500';
    if (isPoor) return 'text-amber-500';
    return 'text-emerald-400';
  };

  return (
    <div className="border border-[#00ff41]/20 bg-zinc-900/20 p-3 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
        <h2 className="font-black uppercase text-[9px] flex items-center gap-2">
          <Clock size={10} className="text-[#00ff41]" />
          L7: PTP_Sync_Status
        </h2>
        <div className={`text-[7px] font-bold uppercase ${getQualityColor()}`}>
          {status.syncQuality}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-3">
        <div className="flex flex-col items-center">
          <span className="text-[7px] text-zinc-500 uppercase mb-1">Clock_Offset</span>
          <div className={`text-xl font-mono tracking-tighter ${getQualityColor()}`}>
            {status.offsetNs > 0 ? '+' : ''}{status.offsetNs.toFixed(1)}
            <span className="text-[10px] ml-1 opacity-60">ns</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-black/40 border border-zinc-800 p-1.5 flex flex-col items-center">
            <span className="text-[6px] text-zinc-500 uppercase">Trust_Score</span>
            <span className={`text-[10px] font-bold ${status.isTrustworthy ? 'text-emerald-400' : 'text-rose-500'}`}>
              {status.isTrustworthy ? 'VERIFIED' : 'UNTRUSTED'}
            </span>
          </div>
          <div className="bg-black/40 border border-zinc-800 p-1.5 flex flex-col items-center">
            <span className="text-[6px] text-zinc-500 uppercase">Last_Sync</span>
            <span className="text-[10px] font-mono text-zinc-300">
              {Math.floor((Date.now() - status.lastSyncTime) / 1000)}s ago
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 border-t border-zinc-800 pt-2">
        {status.isTrustworthy ? (
          <ShieldCheck size={12} className="text-emerald-500" />
        ) : (
          <ShieldAlert size={12} className="text-rose-500 animate-pulse" />
        )}
        <span className={`text-[7px] uppercase leading-tight ${status.isTrustworthy ? 'text-zinc-500' : 'text-rose-400 font-bold'}`}>
          {status.isTrustworthy 
            ? 'Forensic ledger integrity verified via fleet master.' 
            : 'Clock drift exceeds forensic threshold. Ledger reliability compromised.'}
        </span>
      </div>
    </div>
  );
};

export default PtpSyncStatus;
