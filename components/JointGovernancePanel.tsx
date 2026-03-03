import React from 'react';
import { Activity, Settings2, AlertCircle } from 'lucide-react';
import { RobotHealth } from '../types';

const JointGovernancePanel: React.FC<{ health: RobotHealth }> = ({ health }) => {
  // Mock joints for a 2-DOF arm as defined in types.ts INDUSTRIAL_ARM
  const joints = [
    { id: 'J1', angle: 45.2, torque: 12.4, limit: 45, temp: 38.2, status: 'NOMINAL' },
    { id: 'J2', angle: -12.8, torque: 8.1, limit: 30, temp: 41.5, status: 'NOMINAL' }
  ];

  return (
    <div className="bg-black border border-zinc-800 p-4 font-mono">
      <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
        <h3 className="text-[10px] text-white font-black uppercase flex items-center gap-2">
          <Settings2 size={14} className="text-[#00ff41]" />
          Joint_Space_Governance
        </h3>
        <span className="text-[9px] text-zinc-500 uppercase tracking-widest">L4 Lyapunov Clamping</span>
      </div>

      <div className="space-y-4">
        {joints.map((joint) => (
          <div key={joint.id} className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-xs text-white font-bold">{joint.id}</span>
              <div className="flex gap-4 text-[9px] uppercase">
                <span className="text-zinc-500">Torque: <span className="text-white">{joint.torque}Nm</span></span>
                <span className="text-zinc-500">Temp: <span className="text-white">{joint.temp}°C</span></span>
              </div>
            </div>
            
            <div className="h-1.5 bg-zinc-900 border border-zinc-800 relative overflow-hidden">
              <div 
                className="h-full bg-[#00ff41] transition-all duration-300"
                style={{ width: `${(joint.torque / joint.limit) * 100}%` }}
              />
              {/* Limit Marker */}
              <div className="absolute top-0 right-[20%] h-full w-px bg-rose-500/50" />
            </div>

            <div className="flex justify-between text-[8px] text-zinc-600 uppercase">
              <span>0Nm</span>
              <span className="text-rose-500/50">Safety_Limit</span>
              <span>{joint.limit}Nm</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-2 bg-blue-950/10 border border-blue-900/30 flex gap-2">
        <AlertCircle size={12} className="text-blue-500 shrink-0" />
        <p className="text-[8px] text-blue-400 leading-tight uppercase">
          Singularity avoidance active. Jacobian conditioning monitored at 10kHz.
        </p>
      </div>
    </div>
  );
};

export default JointGovernancePanel;
