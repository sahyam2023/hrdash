import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeModal from '../components/EmployeeModal';
import { Employee, employeeAPI } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await employeeAPI.getEmployees({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearchTerm,
        department: filterDepartment,
      });
      setEmployees(response.data.data);
      setPagination(prev => ({ ...prev, totalPages: response.data.pagination.totalPages }));
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  }, [pagination.page, pagination.limit, debouncedSearchTerm, filterDepartment]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const departments = [...new Set(employees.map(emp => emp.department))];

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSaveEmployee = async (employeeData: Omit<Employee, 'id'>) => {
    try {
      if (selectedEmployee) {
        await employeeAPI.updateEmployee(selectedEmployee.id, employeeData);
      } else {
        await employeeAPI.createEmployee(employeeData);
      }
      fetchEmployees(); // Refresh data
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save employee:", error);
      // Re-throw the error to be caught by the modal's handleSubmit
      throw error;
    }
  };

  const handleDeactivateEmployee = async (id: number) => {
    try {
      await employeeAPI.deactivateEmployee(id);
      fetchEmployees(); // Refresh data
    } catch (error) {
      console.error("Failed to deactivate employee:", error);
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
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Employees</h1>
          <p className="text-text-secondary">Manage your team members</p>
        </div>
        <button
          onClick={handleAddEmployee}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Employee</span>
        </button>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="input-field pl-10 pr-8 appearance-none"
          >
            <option value="">All Departments</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </motion.div>

      <EmployeeTable
        employees={employees}
        onEditEmployee={handleEditEmployee}
        onDeactivateEmployee={handleDeactivateEmployee}
      />

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
          disabled={pagination.page === 1}
          className="btn-secondary"
        >
          Previous
        </button>
        <span>Page {pagination.page} of {pagination.totalPages}</span>
        <button
          onClick={() => setPagination(p => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
          disabled={pagination.page === pagination.totalPages}
          className="btn-secondary"
        >
          Next
        </button>
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
      />
    </motion.div>
  );
};

export default Employees;