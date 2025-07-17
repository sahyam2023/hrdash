import React from 'react';
import { motion } from 'framer-motion';

const Analytics: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">Analytics</h1>
        <p className="text-text-secondary">In-depth analysis of your HR data</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <div className="bg-background-tertiary rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Employee Turnover</h2>
          {/* Employee turnover chart will go here */}
        </div>
        <div className="bg-background-tertiary rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Salary Distribution</h2>
          {/* Salary distribution chart will go here */}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
