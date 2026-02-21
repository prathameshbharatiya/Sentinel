
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TelemetryChartProps {
  data: any[];
  title: string;
}

const TelemetryChart: React.FC<TelemetryChartProps> = ({ data, title }) => {
  return (
    <div className="bg-zinc-900/50 border border-[#00ff41]/10 p-2 rounded-lg h-full shadow-inner">
      <h3 className="text-[9px] font-bold uppercase tracking-widest text-[#00ff41]/50 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
          <XAxis 
            dataKey="timestamp" 
            hide 
          />
          <YAxis 
            stroke="#525252" 
            fontSize={9} 
            tickFormatter={(val) => val.toFixed(1)}
            domain={['auto', 'auto']}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', border: '1px solid #00ff4133', fontSize: '9px', fontFamily: 'JetBrains Mono' }}
            itemStyle={{ color: '#00ff41', padding: '2px 0' }}
            cursor={{ stroke: '#00ff4133', strokeWidth: 1 }}
          />
          <Line 
            type="monotone" 
            dataKey="velocity" 
            stroke="#00ff41" 
            dot={false} 
            isAnimationActive={false} 
            strokeWidth={1.5}
            name="Velocity_DOF0"
          />
          <Line 
            type="monotone" 
            dataKey="controlInput" 
            stroke="#ef4444" 
            dot={false} 
            isAnimationActive={false} 
            strokeWidth={1}
            strokeDasharray="4 4"
            name="Control_Ref"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TelemetryChart;
