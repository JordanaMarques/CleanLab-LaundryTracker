import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { OrderRecord } from '../types';

interface StatsChartProps {
  data: OrderRecord[];
}

const parseWeight = (value: string): number => {
  if (!value) return 0;
  // Extract numeric part from string like "12kg" or "12.5 kg"
  const clean = value.replace(/[^0-9.]/g, '');
  return parseFloat(clean) || 0;
};

export const StatsChart: React.FC<StatsChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    return data.map(item => ({
      name: item.customerName.split(' ')[0], // First name for label
      fullLabel: `${item.orderNumber} - ${item.customerName}`,
      Weight: parseWeight(item.weight),
    }));
  }, [data]);

  if (data.length === 0) return null;

  return (
    <div className="h-72 w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Laundry Weight (kg) per Order</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{fontSize: 12}} stroke="#9ca3af" />
          <YAxis tick={{fontSize: 12}} stroke="#9ca3af" label={{ value: 'kg', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af' } }} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            cursor={{fill: '#f9fafb'}}
            formatter={(value: number) => [`${value} kg`, 'Weight']}
          />
          <Bar dataKey="Weight" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Weight (kg)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};