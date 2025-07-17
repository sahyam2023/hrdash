import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, Building2, DollarSign, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { mockKPIData, mockDepartmentData, mockNewHireData } from '../services/api';

const COLORS = [
  '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16'
];

const Dashboard: React.FC = () => {
  const widgets = [
    {
      title: 'Total Employees',
      value: mockKPIData.total_employees.toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgIcon: 'text-blue-500/20',
    },
    {
      title: 'Active Employees',
      value: mockKPIData.active_employees.toLocaleString(),
      icon: UserCheck,
      color: 'from-green-500 to-green-600',
      bgIcon: 'text-green-500/20',
    },
    {
      title: 'Departments',
      value: mockKPIData.departments.toString(),
      icon: Building2,
      color: 'from-purple-500 to-purple-600',
      bgIcon: 'text-purple-500/20',
    },
    {
      title: 'Average Salary',
      value: `$${mockKPIData.avg_salary.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-accent-500 to-accent-600',
      bgIcon: 'text-accent-500/20',
    },
  ];

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
        {/* Department Chart */}
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
                  data={mockDepartmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {mockDepartmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {mockDepartmentData.map((item, index) => (
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

        {/* New Hires Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-background-tertiary rounded-xl p-6 border border-white/10 card-hover"
        >
          <h3 className="text-xl font-semibold text-text-primary mb-6">New Hires Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockNewHireData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#8B949E"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#8B949E"
                  fontSize={12}
                />
                <Tooltip content={<CustomAreaTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
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