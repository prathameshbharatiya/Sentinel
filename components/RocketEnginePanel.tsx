import React from 'react';
import { Flame, Wind, Database } from 'lucide-react';
import { RobotHealth } from '../types';

const RocketEnginePanel: React.FC<{ health: RobotHealth }> = ({ health }) => {
  const rocket = health.rocketGovernance || {
    engine: { chamberPressure: 850, isp: 310, massFlowRate: 12.5, propellantRemaining: 4500 },
    stageStatus: 'BOOSTER_ACTIVE'
  };

  return (
    <div className="bg-black border border-zinc-800 p-4 font-mono">
      <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
        <h3 className="text-[10px] text-white font-black uppercase flex items-center gap-2">
          <Flame size={14} className="text-orange-500" />
          Propulsion_Governance
        </h3>
        <span className="text-[9px] text-zinc-500 uppercase tracking-widest">{rocket.stageStatus}</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 p-2 border border-zinc-800">
            <div className="text-[8px] text-zinc-500 uppercase mb-1">Chamber Pressure</div>
            <div className="text-sm text-white font-black">{rocket.engine.chamberPressure} <span className="text-[10px] font-normal text-zinc-500">PSI</span></div>
          </div>
          <div className="bg-zinc-900/50 p-2 border border-zinc-800">
            <div className="text-[8px] text-zinc-500 uppercase mb-1">Specific Impulse</div>
            <div className="text-sm text-white font-black">{rocket.engine.isp} <span className="text-[10px] font-normal text-zinc-500">SEC</span></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[9px] text-zinc-500 uppercase font-bold">Propellant Remaining</span>
            <span className="text-xs text-white font-bold">{rocket.engine.propellantRemaining}kg</span>
          </div>
          <div className="h-2 bg-zinc-900 border border-zinc-800 relative">
            <div 
              className="h-full bg-orange-500 transition-all duration-1000"
              style={{ width: `${(rocket.engine.propellantRemaining / 5000) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-2 bg-zinc-900 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind size={12} className="text-blue-400" />
            <span className="text-[9px] text-zinc-400 uppercase">Mass Flow Rate</span>
          </div>
          <span className="text-[10px] text-white font-bold">{rocket.engine.massFlowRate} kg/s</span>
        </div>
      </div>

      <div className="mt-4 p-2 bg-orange-950/10 border border-orange-900/30 flex gap-2">
        <Database size={12} className="text-orange-500 shrink-0" />
        <p className="text-[8px] text-orange-400 leading-tight uppercase">
          TVC (Thrust Vector Control) authority verified for current dynamic pressure.
        </p>
      </div>
    </div>
  );
};

export default RocketEnginePanel;
