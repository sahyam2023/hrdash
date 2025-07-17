import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, Building2, DollarSign } from 'lucide-react';
import { mockKPIData } from '../services/api';

const KPIWidgets: React.FC = () => {
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

  return (
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
  );
};

export default KPIWidgets;