
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TelemetryChartProps {
  data: any[];
}

const TelemetryChart: React.FC<TelemetryChartProps> = ({ data }) => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorLyapunov" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ff41" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00ff41" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorRLS" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis 
            stroke="#525252" 
            fontSize={10} 
            tickFormatter={(val) => val.toFixed(2)}
            domain={[0, 1.2]}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', border: '1px solid #00ff4133', fontSize: '10px', fontFamily: 'JetBrains Mono' }}
            itemStyle={{ padding: '2px 0' }}
            cursor={{ stroke: '#00ff4133', strokeWidth: 1 }}
          />
          <Area 
            type="monotone" 
            dataKey="lyapunov" 
            stroke="#00ff41" 
            fillOpacity={1} 
            fill="url(#colorLyapunov)" 
            isAnimationActive={false}
            strokeWidth={2}
            name="Lyapunov_V"
          />
          <Area 
            type="monotone" 
            dataKey="rls" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorRLS)" 
            isAnimationActive={false}
            strokeWidth={2}
            name="RLS_Estimate"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TelemetryChart;
