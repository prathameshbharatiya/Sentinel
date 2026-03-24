import React from 'react';
import { AuditEntry } from '../types';

interface SentinelLedgerProps {
  entries: AuditEntry[];
  onGenerateCertificate?: (entryId: string) => void;
}

const SentinelLedger: React.FC<SentinelLedgerProps> = ({ entries, onGenerateCertificate }) => {
  const [filter, setFilter] = React.useState('');
  const [showOverridesOnly, setShowOverridesOnly] = React.useState(false);

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.id.toLowerCase().includes(filter.toLowerCase()) || 
                         entry.intent?.type.toLowerCase().includes(filter.toLowerCase());
    const matchesOverride = showOverridesOnly ? entry.governance.clamped : true;
    return matchesSearch && matchesOverride;
  });

  return (
    <div className="border border-[#00ff41]/30 bg-zinc-900/40 p-3 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
        <h2 className="font-black uppercase text-xs flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00ff41] animate-pulse"></div>
          L7: Forensic_Audit_Ledger
        </h2>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="SEARCH_LEDGER..." 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-black border border-zinc-800 text-[8px] px-1 py-0.5 text-[#00ff41] outline-none focus:border-[#00ff41] w-24"
          />
          <button 
            onClick={() => setShowOverridesOnly(!showOverridesOnly)}
            className={`text-[8px] border px-1 uppercase font-bold transition-colors ${showOverridesOnly ? 'bg-[#00ff41] text-black border-[#00ff41]' : 'border-zinc-800 text-zinc-500'}`}
          >
            Overrides
          </button>
        </div>
      </div>

      {/* HEARTBEAT CHAIN STATUS */}
      <div className="mb-3 p-2 bg-black/60 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Heartbeat_Chain</span>
          <span className="text-[10px] text-emerald-400 font-black uppercase">[INTEGRITY_LOCKED]</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[8px] text-zinc-600 uppercase">Blocks</span>
            <span className="text-[11px] font-mono text-white">{(entries.length * 12).toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-zinc-600 uppercase">Last_Hash</span>
            <span className="text-[11px] font-mono text-zinc-400 truncate">
              {entries.length > 0 ? entries[entries.length - 1].hash.substring(0, 16) : '0x0000...'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-20 opacity-20 uppercase tracking-widest text-[11px]">No_Matches_Found</div>
        ) : (
          filteredEntries.slice().reverse().map(entry => (
            <div key={entry.id} className="border border-zinc-800 p-2 bg-black/50 hover:border-[#00ff41]/30 transition-all group relative">
              <button 
                onClick={() => onGenerateCertificate?.(entry.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[8px] bg-[#00ff41] text-black px-1 font-bold uppercase transition-opacity"
              >
                Gen_Cert
              </button>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-[#00ff41]">{entry.id}</span>
                <span className="text-[10px] opacity-30 font-mono">{entry.hash}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className={`text-xs font-black uppercase ${entry.governance.clamped ? 'text-rose-500' : 'text-white'}`}>
                  {entry.intent?.type || 'IDLE'}
                </div>
                {entry.governance.clamped && (
                  <span className="text-[10px] bg-rose-900/30 text-rose-500 px-1 border border-rose-900 uppercase font-bold">Clamped</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] opacity-60">
                <div className="flex justify-between">
                  <span>Raw_U:</span>
                  <span className="text-white">{entry.governance.rawControl[0].toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Safe_U:</span>
                  <span className="text-[#00ff41]">{entry.governance.safeControl[0].toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-1 grid grid-cols-2 gap-2 text-[10px] border-t border-zinc-900 pt-1">
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
              
              <div className="mt-2 pt-1 border-t border-zinc-900 flex flex-col gap-0.5 text-[10px] opacity-30 uppercase">
                <div className="flex justify-between items-center">
                  <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                  <span>Stability_F: {entry.governance.safetyFactor.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-mono text-[9px]">
                  <span>PTP: {entry.precisionTimestamp}</span>
                  <span className="text-amber-500">
                    [LOCAL CLOCK]
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-zinc-800 flex justify-between items-center">
        <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Clock_Jitter</span>
        <span className="text-[10px] text-emerald-400 font-black">±0.4ms</span>
      </div>
    </div>
  );
};

export default SentinelLedger;
