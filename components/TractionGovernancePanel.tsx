import React from 'react';
import { Truck, Gauge, AlertTriangle } from 'lucide-react';
import { RobotHealth } from '../types';

const TractionGovernancePanel: React.FC<{ health: RobotHealth }> = ({ health }) => {
  const wheels = [
    { id: 'FL', slip: 0.02, traction: 0.98, torque: 45 },
    { id: 'FR', slip: 0.03, traction: 0.97, torque: 42 },
    { id: 'RL', slip: 0.08, traction: 0.92, torque: 55 },
    { id: 'RR', slip: 0.12, traction: 0.88, torque: 58 }
  ];

  return (
    <div className="bg-black border border-zinc-800 p-4 font-mono">
      <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
        <h3 className="text-[10px] text-white font-black uppercase flex items-center gap-2">
          <Truck size={14} className="text-[#00ff41]" />
          Traction_Control_Kernel
        </h3>
        <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Slip-Ratio Governance</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {wheels.map((wheel) => (
          <div key={wheel.id} className="bg-zinc-900/30 border border-zinc-800 p-2 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-white font-bold">{wheel.id}</span>
              <span className={`text-[8px] font-bold px-1 ${wheel.slip > 0.1 ? 'bg-rose-500 text-black' : 'text-[#00ff41]'}`}>
                {wheel.slip > 0.1 ? 'SLIP_DETECTED' : 'NOMINAL'}
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[8px] text-zinc-500 uppercase">
                <span>Traction</span>
                <span>{(wheel.traction * 100).toFixed(0)}%</span>
              </div>
              <div className="h-1 bg-zinc-800 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${wheel.traction < 0.9 ? 'bg-amber-500' : 'bg-[#00ff41]'}`}
                  style={{ width: `${wheel.traction * 100}%` }}
                />
              </div>
            </div>

            <div className="text-[9px] text-zinc-400">
              Torque: <span className="text-white">{wheel.torque}Nm</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-2 bg-amber-950/10 border border-amber-900/30 flex gap-2">
        <AlertTriangle size={12} className="text-amber-500 shrink-0" />
        <p className="text-[8px] text-amber-400 leading-tight uppercase">
          Surface friction estimated at μ=0.65. Adjusting Lyapunov gain for loose terrain.
        </p>
      </div>
    </div>
  );
};

export default TractionGovernancePanel;
