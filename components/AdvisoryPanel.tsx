
import React from 'react';
import { HealthAdvisory, RiskLevel } from '../types';

interface AdvisoryPanelProps {
  advisory: HealthAdvisory;
}

const AdvisoryPanel: React.FC<AdvisoryPanelProps> = ({ advisory }) => {
  const isSafe = advisory.riskLevel === RiskLevel.NOMINAL;
  
  const getBorderColor = () => {
    switch (advisory.riskLevel) {
      case RiskLevel.CRITICAL: return 'border-rose-600 bg-rose-950/20';
      case RiskLevel.HIGH_RISK: return 'border-amber-600 bg-amber-950/20';
      default: return 'border-emerald-600/30 bg-emerald-950/10';
    }
  };

  const getTextColor = () => {
    switch (advisory.riskLevel) {
      case RiskLevel.CRITICAL: return 'text-rose-400';
      case RiskLevel.HIGH_RISK: return 'text-amber-400';
      default: return 'text-emerald-400';
    }
  };

  return (
    <div className={`border-l-4 p-4 rounded-r-lg transition-colors duration-500 ${getBorderColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">L9: Planner Interface</h4>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${isSafe ? 'border-emerald-500/30' : 'border-rose-500/50'} ${getTextColor()}`}>
          {advisory.riskLevel}
        </span>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-end mb-1">
            <span className="text-[9px] text-zinc-500 uppercase">Rate-Limited Velocity Scale</span>
            <span className="text-[8px] opacity-30 uppercase">Target: {(advisory.targetVelocityScale * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getTextColor().replace('text', 'bg')} transition-all duration-300`}
                style={{ width: `${advisory.recommendedVelocityScale * 100}%` }}
              />
            </div>
            <span className="mono text-lg font-bold">{(advisory.recommendedVelocityScale * 100).toFixed(0)}%</span>
          </div>
        </div>

        {advisory.anomalyDetected && (
          <div className="animate-pulse flex items-center gap-2 text-rose-500 text-[10px] font-bold uppercase tracking-tighter">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
             Anomaly Detected - Active Envelope Clamping
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvisoryPanel;
