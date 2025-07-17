import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalaryData {
  range: string;
  count: number;
}

interface SalaryDistributionChartProps {
  data: SalaryData[];
}

const SalaryDistributionChart: React.FC<SalaryDistributionChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background-tertiary border border-white/10 rounded-lg p-3 shadow-lg">
          <p className="text-text-primary font-medium">{label}</p>
          <p style={{ color: '#8884d8' }}>Employees: {payload[0].value}</p>
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
      <h3 className="text-xl font-semibold text-text-primary mb-6">Salary Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="range" stroke="#8B949E" fontSize={12} />
            <YAxis stroke="#8B949E" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalaryDistributionChart;
