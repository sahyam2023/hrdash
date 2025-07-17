import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TurnoverChart from '../components/TurnoverChart';
import SalaryDistributionChart from '../components/SalaryDistributionChart';
import  api  from '../services/api';

interface TurnoverData {
  month: string;
  hires: number;
  departures: number;
}

interface SalaryData {
  range: string;
  count: number;
}

const Analytics: React.FC = () => {
  const [turnoverData, setTurnoverData] = useState<TurnoverData[]>([]);
  const [salaryData, setSalaryData] = useState<SalaryData[]>([]);

  useEffect(() => {
    fetchTurnoverData();
    fetchSalaryDistributionData();
  }, []);

  const fetchTurnoverData = async () => {
    try {
      const response = await api.get('/api/analytics/turnover');
      const { hires, departures } = response.data;

      const combinedData: { [key: string]: TurnoverData } = {};

      hires.forEach((item: { month: string; count: number }) => {
        combinedData[item.month] = {
          month: item.month,
          hires: item.count,
          departures: 0,
        };
      });

      departures.forEach((item: { month: string; count: number }) => {
        if (combinedData[item.month]) {
          combinedData[item.month].departures = item.count;
        } else {
          combinedData[item.month] = {
            month: item.month,
            hires: 0,
            departures: item.count,
          };
        }
      });

      const sortedData = Object.values(combinedData).sort((a, b) => a.month.localeCompare(b.month));
      setTurnoverData(sortedData);
    } catch (error) {
      console.error('Error fetching turnover data:', error);
    }
  };

  const fetchSalaryDistributionData = async () => {
    try {
      const response = await api.get('/api/analytics/salary-distribution');
      setSalaryData(response.data);
    } catch (error) {
      console.error('Error fetching salary distribution data:', error);
    }
  };

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
        <TurnoverChart data={turnoverData} />
        <SalaryDistributionChart data={salaryData} />
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
