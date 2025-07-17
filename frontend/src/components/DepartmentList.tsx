import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';

interface Department {
  id: number;
  name: string;
}

const DepartmentList: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDepartment, setNewDepartment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    fetchDepartments();

    if (socket) {
      socket.on('department_added', (department: Department) => {
        setDepartments((prev) => [...prev, department]);
      });
      socket.on('department_deleted', (data: { id: number }) => {
        setDepartments((prev) => prev.filter((dept) => dept.id !== data.id));
      });
      return () => {
        socket.off('department_added');
        socket.off('department_deleted');
      };
    }
  }, [socket]);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const addDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newDepartment.trim() === '') return;
    try {
      await api.post('/api/departments', { name: newDepartment });
      setNewDepartment('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  const deleteDepartment = async (id: number) => {
    try {
      await api.delete(`/api/departments/${id}`);
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Department</span>
        </button>
      </div>

      <AnimatePresence>
        <motion.ul className="space-y-2">
          {departments.map((dept) => (
            <motion.li
              key={dept.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className="flex justify-between items-center bg-background-secondary p-3 rounded-lg table-hover"
            >
              <span className="text-text-primary font-medium">{dept.name}</span>
              <button
                onClick={() => deleteDepartment(dept.id)}
                className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background-tertiary rounded-xl border border-white/10 w-full max-w-md p-6 shadow-glow"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Add New Department</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-text-secondary hover:text-text-primary hover:bg-background-secondary/50 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={addDepartment}>
                <label className="block text-text-primary font-medium mb-2">Department Name</label>
                <input
                  type="text"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="input-field w-full"
                  placeholder="e.g., Engineering"
                  required
                />
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Add Department
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentList;
