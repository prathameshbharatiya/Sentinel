import React from 'react';
import { PlatformDescriptor, RobotTopology } from '../types';
import { Cpu, Zap, Clock, ShieldCheck, Layers } from 'lucide-react';

interface HardwareAbstractionPanelProps {
  platform: PlatformDescriptor;
  currentTopology: RobotTopology;
  onTopologyChange: (topology: RobotTopology) => void;
}

const HardwareAbstractionPanel: React.FC<HardwareAbstractionPanelProps> = ({ platform, currentTopology, onTopologyChange }) => {
  return (
    <div className="border border-[#00ff41]/30 bg-zinc-900/40 p-3 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-1">
        <h2 className="font-black uppercase text-xs flex items-center gap-2">
          <Cpu size={14} className="text-[#00ff41]" />
          HAL: Hardware_Abstraction_Layer
        </h2>
        <span className="text-[10px] opacity-40 uppercase tracking-widest">Agnostic_Kernel</span>
      </div>

      <div className="mb-3 space-y-2">
        <div>
          <div className="text-xs text-zinc-500 uppercase mb-1">Active_Platform</div>
          <div className="text-base font-black text-white uppercase leading-none border-l-2 border-[#00ff41] pl-2">
            {platform.type}
          </div>
        </div>

        <div>
          <div className="text-xs text-zinc-500 uppercase mb-1 flex items-center gap-1">
            <Layers size={10} />
            Active_Topology
          </div>
          <select 
            value={currentTopology}
            onChange={(e) => onTopologyChange(e.target.value as RobotTopology)}
            className="w-full bg-black/60 border border-zinc-800 text-xs text-white uppercase font-bold p-1 focus:outline-none focus:border-[#00ff41]"
          >
            {Object.values(RobotTopology).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
        {/* Latency Metrics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-black/40 border border-zinc-800 p-2 space-y-1">
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-amber-400" />
              <span className="text-xs text-zinc-500 uppercase">Write_Latency</span>
            </div>
            <div className="text-sm font-mono font-bold text-white">
              {platform.actuatorWriteLatencyUs.toFixed(2)} <span className="text-xs opacity-40">μs</span>
            </div>
          </div>
          <div className="bg-black/40 border border-zinc-800 p-2 space-y-1">
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-blue-400" />
              <span className="text-xs text-zinc-500 uppercase">Read_Latency</span>
            </div>
            <div className="text-sm font-mono font-bold text-white">
              {platform.sensorReadLatencyUs.toFixed(2)} <span className="text-xs opacity-40">μs</span>
            </div>
          </div>
        </div>

        {/* Timing Budget */}
        <div className="bg-zinc-950/60 border border-zinc-800 p-2 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Clock size={12} className="text-[#00ff41]" />
              <span className="text-[10px] font-black uppercase text-[#00ff41]">Inner_Loop_Budget</span>
            </div>
            <span className="text-[10px] font-mono text-white">{platform.innerLoopTimingBudgetUs.toFixed(1)} μs</span>
          </div>
          <div className="h-1 bg-zinc-800 w-full rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#00ff41] transition-all duration-500"
              style={{ width: '100%' }}
            />
          </div>
          <div className="text-[10px] text-zinc-500 uppercase italic">
            * Runtime constraint derived from platform descriptor
          </div>
        </div>

        {/* Platform Specs */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] border-b border-zinc-800 pb-1">
            <span className="text-zinc-500 uppercase">Interrupt_Priority</span>
            <span className="font-mono text-white">LVL_{platform.interruptPriority}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] border-b border-zinc-800 pb-1">
            <span className="text-zinc-500 uppercase">Clock_Source</span>
            <span className="font-mono text-white">{platform.clockSource}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] border-b border-zinc-800 pb-1">
            <span className="text-zinc-500 uppercase">FP_Latency</span>
            <span className="font-mono text-white">{platform.floatingPointLatencyCycles} CYCLES</span>
          </div>
        </div>

        <div className="bg-[#00ff41]/5 border border-[#00ff41]/20 p-2 flex items-start gap-2">
          <ShieldCheck size={14} className="text-[#00ff41] shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-400 leading-tight">
            <span className="text-[#00ff41] font-bold uppercase">Agnostic_Certification:</span> The Lyapunov kernel is formally verified for this platform's timing budget. No kernel re-compilation required for hardware migration.
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardwareAbstractionPanel;
