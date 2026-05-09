import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const VitalsChart = ({ data, title }) => {
  return (
    <div className="chart-wrapper">
      <div className="chart-header">
        <h4 className="chart-title">{title}</h4>
      </div>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              hide={true} 
            />
            <YAxis 
              hide={true} 
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#0d9488" 
              strokeWidth={3} 
              dot={false}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <style>{`
        .chart-wrapper {
          background: white;
          padding: 20px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
        }
        .chart-header {
          margin-bottom: 16px;
        }
        .chart-title {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
};

export default VitalsChart;
