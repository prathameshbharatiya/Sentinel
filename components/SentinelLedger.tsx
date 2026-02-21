import React from 'react';
import { AuditEntry } from '../types';

interface SentinelLedgerProps {
  entries: AuditEntry[];
}

const SentinelLedger: React.FC<SentinelLedgerProps> = ({ entries }) => {
  return (
    <div className="border border-[#00ff41]/30 bg-zinc-900/40 p-3 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
        <h2 className="font-black uppercase text-[10px] flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00ff41] animate-pulse"></div>
          L7: Forensic_Audit_Ledger
        </h2>
        <span className="text-[8px] opacity-40 uppercase tracking-widest">Signed_Proofs</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
        {entries.length === 0 ? (
          <div className="text-center py-20 opacity-20 uppercase tracking-widest text-[9px]">Ledger_Empty</div>
        ) : (
          entries.slice().reverse().map(entry => (
            <div key={entry.id} className="border border-zinc-800 p-2 bg-black/50 hover:border-[#00ff41]/30 transition-all group">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-bold text-[#00ff41]">{entry.id}</span>
                <span className="text-[7px] opacity-30 font-mono">{entry.hash}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className={`text-[9px] font-black uppercase ${entry.governance.clamped ? 'text-rose-500' : 'text-white'}`}>
                  {entry.intent?.type || 'IDLE'}
                </div>
                {entry.governance.clamped && (
                  <span className="text-[7px] bg-rose-900/30 text-rose-500 px-1 border border-rose-900 uppercase font-bold">Clamped</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[8px] opacity-60">
                <div className="flex justify-between">
                  <span>Raw_U:</span>
                  <span className="text-white">{entry.governance.rawControl[0].toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Safe_U:</span>
                  <span className="text-[#00ff41]">{entry.governance.safeControl[0].toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-1 grid grid-cols-2 gap-2 text-[7px] border-t border-zinc-900 pt-1">
                <div className="flex justify-between">
                  <span className="opacity-40">Coherence:</span>
                  <span className={entry.forensics.coherence < 0.7 ? 'text-rose-400' : 'text-emerald-400'}>
                    {(entry.forensics.coherence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-40">Fault:</span>
                  <span className={entry.forensics.faultDiagnosis ? 'text-rose-400' : 'text-zinc-500'}>
                    {entry.forensics.faultDiagnosis ? 'DETECTED' : 'NONE'}
                  </span>
                </div>
              </div>
              
              <div className="mt-2 pt-1 border-t border-zinc-900 flex flex-col gap-0.5 text-[7px] opacity-30 uppercase">
                <div className="flex justify-between items-center">
                  <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                  <span>Stability_F: {entry.governance.safetyFactor.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-mono text-[6px]">
                  <span>PTP: {entry.precisionTimestamp}</span>
                  <span className={Math.abs(entry.ptpSyncOffset) > 50 ? 'text-amber-500' : ''}>
                    Δ: {entry.ptpSyncOffset > 0 ? '+' : ''}{entry.ptpSyncOffset}ns
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SentinelLedger;
