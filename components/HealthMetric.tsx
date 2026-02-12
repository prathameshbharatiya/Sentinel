
import React from 'react';

interface HealthMetricProps {
  label: string;
  value: number; // 0 to 1
  inverse?: boolean;
}

const HealthMetric: React.FC<HealthMetricProps> = ({ label, value, inverse = false }) => {
  const percentage = Math.round(value * 100);
  
  // Color logic
  let color = "bg-emerald-500";
  const displayValue = inverse ? 1 - value : value;

  if (displayValue < 0.3) color = "bg-rose-500";
  else if (displayValue < 0.6) color = "bg-amber-500";

  return (
    <div className="mb-4">
      <div className="flex justify-between text-[10px] uppercase font-bold tracking-tighter text-zinc-400 mb-1">
        <span>{label}</span>
        <span className="mono">{percentage}%</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default HealthMetric;
