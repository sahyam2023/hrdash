import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DepartmentBreakdown } from '../services/api';

const COLORS = [
  '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16'
];

interface DepartmentChartProps {
  data: DepartmentBreakdown[];
}

const DepartmentChart: React.FC<DepartmentChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-background-tertiary border border-white/10 rounded-lg p-3 shadow-lg">
          <p className="text-text-primary font-medium">{item.department}</p>
          <p className="text-accent-400">Count: {item.count}</p>
          <p className="text-text-secondary">Percentage: {item.percentage}%</p>
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
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-background-tertiary rounded-xl p-6 border border-white/10 card-hover"
    >
      <h3 className="text-xl font-semibold text-text-primary mb-6">Department Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {data.map((item, index) => (
          <div key={item.department} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-text-secondary">{item.department}</span>
            <span className="text-text-primary font-medium ml-auto">{item.count}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default DepartmentChart;