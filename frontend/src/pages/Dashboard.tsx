import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, Building2, DollarSign, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { dashboardAPI, KPIData, DepartmentBreakdown, NewHireData, employeeAPI } from '../services/api';
import { useEffect, useState } from 'react';
import KPIWidgets from '../components/KPIWidgets';
import DepartmentChart from '../components/DepartmentChart';
import NewHiresChart from '../components/NewHiresChart';

const Dashboard: React.FC = () => {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [departmentData, setDepartmentData] = useState<DepartmentBreakdown[]>([]);
  const [newHireData, setNewHireData] = useState<NewHireData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kpiResponse = await dashboardAPI.getKPIs();
        setKpis(kpiResponse.data);

        const departmentResponse = await dashboardAPI.getDepartmentBreakdown();
        const total = departmentResponse.data.reduce((acc, item) => acc + item.count, 0);
        const dataWithPercentage = departmentResponse.data.map(item => ({
          ...item,
          percentage: total > 0 ? parseFloat(((item.count / total) * 100).toFixed(2)) : 0,
        }));
        setDepartmentData(dataWithPercentage);

        // Simulate new hire data
        const employeeResponse = await employeeAPI.getEmployees({ limit: 1000 }); // Fetch all employees
        const hiresByMonth: { [key: string]: number } = {};
        employeeResponse.data.data.forEach(emp => {
          const month = new Date(emp.start_date).toLocaleString('default', { month: 'short' });
          hiresByMonth[month] = (hiresByMonth[month] || 0) + 1;
        });
        const newHires = Object.keys(hiresByMonth).map(month => ({
          month,
          count: hiresByMonth[month],
        }));
        setNewHireData(newHires);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const widgets = kpis ? [
    {
      title: 'Total Employees',
      value: kpis.totalEmployees.toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgIcon: 'text-blue-500/20',
    },
    {
      title: 'New Hires (30 days)',
      value: kpis.newHires.toLocaleString(),
      icon: UserCheck,
      color: 'from-green-500 to-green-600',
      bgIcon: 'text-green-500/20',
    },
    {
      title: 'Departures (30 days)',
      value: kpis.departures.toLocaleString(),
      icon: Building2,
      color: 'from-purple-500 to-purple-600',
      bgIcon: 'text-purple-500/20',
    },
    {
      title: 'Active Employees',
      value: (kpis.totalEmployees - kpis.departures).toLocaleString(),
      icon: DollarSign,
      color: 'from-accent-500 to-accent-600',
      bgIcon: 'text-accent-500/20',
    },
  ] : [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background-tertiary border border-white/10 rounded-lg p-3 shadow-lg">
          <p className="text-text-primary font-medium">{data.department}</p>
          <p className="text-accent-400">Count: {data.count}</p>
          <p className="text-text-secondary">Percentage: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomAreaTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background-tertiary border border-white/10 rounded-lg p-3 shadow-lg">
          <p className="text-text-primary font-medium">{`${label} 2024`}</p>
          <p className="text-accent-400">New Hires: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-secondary">Welcome to your HR dashboard</p>
      </motion.div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgets.map((widget, index) => (
          <motion.div
            key={widget.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative overflow-hidden bg-background-tertiary rounded-xl p-6 border border-white/10 card-hover group"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${widget.color}`}>
                  <widget.icon className="w-6 h-6 text-white" />
                </div>
                <widget.icon className={`w-16 h-16 ${widget.bgIcon} absolute top-4 right-4`} />
              </div>
              <h3 className="text-text-secondary text-sm font-medium mb-1">{widget.title}</h3>
              <p className="text-3xl font-bold text-text-primary">{widget.value}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DepartmentChart data={departmentData} />
        <NewHiresChart data={newHireData} />
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-background-tertiary rounded-xl p-6 border border-white/10 card-hover"
      >
        <h3 className="text-xl font-semibold text-text-primary mb-6">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-background-secondary/50 transition-colors duration-200">
            <div className="p-2 rounded-lg bg-background-secondary text-green-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-text-primary font-medium">System performance optimized</p>
              <span className="text-text-secondary text-sm">2 hours ago</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;