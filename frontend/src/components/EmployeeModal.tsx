import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Building, Briefcase, Calendar } from 'lucide-react';
import { Employee, settingsAPI } from '../services/api';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSave: (employee: Omit<Employee, 'id'>) => Promise<Employee>;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  employee,
  onSave,
}) => {
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    job_title: '',
    start_date: '',
    is_active: true,
    salary: 0,
  });
  const [departments, setDepartments] = useState<any[]>([]);
  const [jobTitles, setJobTitles] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      settingsAPI.getDepartments().then(res => setDepartments(res.data));
      settingsAPI.getJobTitles().then(res => setJobTitles(res.data));
    }
  }, [isOpen]);

  useEffect(() => {
    if (employee) {
      setFormData({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        department: employee.department,
        job_title: employee.job_title,
        start_date: new Date(employee.start_date).toISOString().split('T')[0],
        is_active: employee.is_active,
        salary: employee.salary,
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        department: '',
        job_title: '',
        start_date: new Date().toISOString().split('T')[0],
        is_active: true,
        salary: 0,
      });
    }
  }, [employee]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await onSave(formData);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background-tertiary rounded-xl border border-white/10 w-full max-w-md p-6 shadow-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary">
                {employee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-background-secondary/50 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

              {errorMessage && (
                <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4">
                  {errorMessage}
                </div>
              )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-primary font-medium mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="input-field w-full"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-text-primary font-medium mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="input-field w-full"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Salary (₹)
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                  placeholder="Enter salary in Rupees"
                />
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                >
                  <option value="">Select department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Job Title
                </label>
                <select
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                >
                  <option value="">Select job title</option>
                  {jobTitles.map(job => (
                    <option key={job.id} value={job.name}>{job.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {employee ? 'Update' : 'Create'} Employee
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmployeeModal;