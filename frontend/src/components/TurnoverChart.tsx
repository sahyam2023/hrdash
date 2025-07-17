import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TurnoverData {
  month: string;
  hires: number;
  departures: number;
}

interface TurnoverChartProps {
  data: TurnoverData[];
}

const TurnoverChart: React.FC<TurnoverChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background-tertiary border border-white/10 rounded-lg p-3 shadow-lg">
          <p className="text-text-primary font-medium">{label}</p>
          <p style={{ color: '#8884d8' }}>Hires: {payload[0].value}</p>
          <p style={{ color: '#82ca9d' }}>Departures: {payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return <div className="bg-background-tertiary rounded-xl p-6 border border-white/10 h-96 animate-pulse" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-background-tertiary rounded-xl p-6 border border-white/10"
    >
      <h3 className="text-xl font-semibold text-text-primary mb-6">Employee Turnover</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDepartures" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#8B949E" fontSize={12} />
            <YAxis stroke="#8B949E" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="hires" stroke="#8884d8" fillOpacity={1} fill="url(#colorHires)" />
            <Area type="monotone" dataKey="departures" stroke="#82ca9d" fillOpacity={1} fill="url(#colorDepartures)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default TurnoverChart;
