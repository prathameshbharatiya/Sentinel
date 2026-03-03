import React, { useState, useEffect } from 'react';
import { Link2, Link2Off, Terminal, Cpu, ShieldCheck, Wifi } from 'lucide-react';

interface HardwareBridgeProps {
  onConnect: () => void;
  isConnected: boolean;
}

const HardwareBridge: React.FC<HardwareBridgeProps> = ({ onConnect, isConnected }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    addLog("Initializing Hardware Abstraction Layer...");
    await new Promise(r => setTimeout(r, 800));
    addLog("Scanning for target: 127.0.0.1:50051 (GRPC)...");
    await new Promise(r => setTimeout(r, 1200));
    addLog("Handshake successful. Protocol: Sentinel_v5.0_Wire");
    await new Promise(r => setTimeout(r, 600));
    addLog("Bridge established. Ready for shim deployment.");
    setIsConnecting(false);
    onConnect();
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 font-mono h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isConnected ? 'bg-[#00ff41]/10 text-[#00ff41]' : 'bg-zinc-900 text-zinc-500'}`}>
            {isConnected ? <Link2 size={20} /> : <Link2Off size={20} />}
          </div>
          <div>
            <h3 className="text-white font-black uppercase text-sm">Hardware_Bridge</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              {isConnected ? 'Connection: Established' : 'Connection: Required'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#00ff41] animate-pulse' : 'bg-zinc-800'}`} />
          <span className="text-[9px] text-zinc-500 uppercase font-bold">{isConnected ? 'Live' : 'Offline'}</span>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black border border-zinc-800 p-4 space-y-2">
            <div className="flex items-center gap-2 text-zinc-500">
              <Cpu size={14} />
              <span className="text-[9px] uppercase font-bold">Target Platform</span>
            </div>
            <p className="text-xs text-white">ARM Cortex-M7 (Embedded)</p>
          </div>
          <div className="bg-black border border-zinc-800 p-4 space-y-2">
            <div className="flex items-center gap-2 text-zinc-500">
              <Wifi size={14} />
              <span className="text-[9px] uppercase font-bold">Protocol</span>
            </div>
            <p className="text-xs text-white">Sentinel_Wire/GRPC</p>
          </div>
        </div>

        <div className="bg-black border border-zinc-800 p-4 flex-1 min-h-[120px]">
          <div className="flex items-center gap-2 text-zinc-600 mb-2">
            <Terminal size={12} />
            <span className="text-[9px] uppercase font-bold">Bridge_Logs</span>
          </div>
          <div className="space-y-1">
            {logs.length === 0 && <p className="text-[10px] text-zinc-800 italic">Waiting for connection sequence...</p>}
            {logs.map((log, i) => (
              <p key={i} className="text-[10px] text-zinc-400 font-mono leading-tight">{log}</p>
            ))}
          </div>
        </div>
      </div>

      {!isConnected && (
        <button 
          onClick={handleConnect}
          disabled={isConnecting}
          className={`mt-6 w-full py-4 font-black uppercase text-xs tracking-widest transition-all ${
            isConnecting ? 'bg-zinc-800 text-zinc-500' : 'bg-[#00ff41] text-black hover:bg-white'
          }`}
        >
          {isConnecting ? 'Establishing Bridge...' : 'Establish Hardware Bridge'}
        </button>
      )}

      {isConnected && (
        <div className="mt-6 p-4 bg-[#00ff41]/5 border border-[#00ff41]/20 flex items-center gap-3 text-[#00ff41]">
          <ShieldCheck size={20} />
          <div className="text-[10px] font-bold uppercase tracking-tight">
            Hardware Linked. Simulation pre-conditioned for target latency.
          </div>
        </div>
      )}
    </div>
  );
};

export default HardwareBridge;
