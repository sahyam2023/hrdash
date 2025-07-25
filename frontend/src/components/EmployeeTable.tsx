import React from 'react';
import { motion } from 'framer-motion';
import { Edit, UserMinus, Mail, Calendar, DollarSign } from 'lucide-react';
import { Employee } from '../services/api';

interface EmployeeTableProps {
  employees: Employee[];
  onEditEmployee: (employee: Employee) => void;
  onDeactivateEmployee: (id: number) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onEditEmployee,
  onDeactivateEmployee,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatSalary = (salary: number) => {
    // Format salary in Indian Rupees (INR)
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-background-tertiary rounded-xl border border-white/10 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-background-secondary/50">
              <th className="text-left p-6 text-text-primary font-semibold">Employee</th>
              <th className="text-left p-6 text-text-primary font-semibold">Department</th>
              <th className="text-left p-6 text-text-primary font-semibold">Position</th>
              <th className="text-left p-6 text-text-primary font-semibold">Salary</th>
              <th className="text-left p-6 text-text-primary font-semibold">Hire Date</th>
              <th className="text-left p-6 text-text-primary font-semibold">Status</th>
              <th className="text-left p-6 text-text-primary font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <motion.tr
                key={employee.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b border-white/5 table-hover"
              >
                <td className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {employee.first_name && employee.first_name[0]}{employee.last_name && employee.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-text-primary font-medium">{employee.first_name} {employee.last_name}</p>
                      <div className="flex items-center space-x-1 text-text-secondary text-sm">
                        <Mail className="w-3 h-3" />
                        <span>{employee.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium">
                    {employee.department}
                  </span>
                </td>
                <td className="p-6 text-text-primary">{employee.job_title}</td>
                <td className="p-6 text-text-primary">
                  {formatSalary(employee.salary)}
                </td>
                <td className="p-6">
                  <div className="flex items-center space-x-1 text-text-secondary">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(employee.start_date)}</span>
                  </div>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    employee.is_active
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {employee.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEditEmployee(employee)}
                      className="p-2 text-text-secondary hover:text-accent-400 hover:bg-accent-500/10 rounded-lg transition-all duration-200"
                      title="Edit Employee"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {employee.is_active && (
                      <button
                        onClick={() => onDeactivateEmployee(employee.id)}
                        className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                        title="Deactivate Employee"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default EmployeeTable;