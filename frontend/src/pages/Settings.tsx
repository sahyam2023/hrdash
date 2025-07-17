import React from 'react';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
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
        <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
        <p className="text-text-secondary">Manage your application settings</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-background-tertiary rounded-xl p-6 border border-white/10"
      >
        <h2 className="text-xl font-semibold text-text-primary mb-4">Departments</h2>
        {/* Department management UI will go here */}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-background-tertiary rounded-xl p-6 border border-white/10"
      >
        <h2 className="text-xl font-semibold text-text-primary mb-4">Job Titles</h2>
        {/* Job title management UI will go here */}
      </motion.div>
    </motion.div>
  );
};

export default Settings;
