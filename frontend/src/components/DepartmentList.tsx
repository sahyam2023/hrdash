import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../context/SocketContext';

interface Department {
  id: number;
  name: string;
}

const DepartmentList: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDepartment, setNewDepartment] = useState('');
  const { socket } = useSocket();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const addDepartment = async (). => {
    if (newDepartment.trim() === '') return;
    try {
      const response = await api.post('/api/departments', { name: newDepartment });
      const newDept = response.data;
      setDepartments([...departments, newDept]);
      setNewDepartment('');
      if (socket) {
        socket.emit('department_added', newDept);
      }
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  const deleteDepartment = async (id: number) => {
    try {
      await api.delete(`/api/departments/${id}`);
      setDepartments(departments.filter(d => d.id !== id));
      if (socket) {
        socket.emit('department_deleted', { id });
      }
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  return (
    <div>
      <div className="flex mb-4">
        <input
          type="text"
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
          className="bg-background-secondary text-text-primary p-2 rounded-l-md flex-grow"
          placeholder="New Department"
        />
        <button onClick={addDepartment} className="bg-primary-accent text-white p-2 rounded-r-md">
          Add
        </button>
      </div>
      <ul>
        <AnimatePresence>
          {departments.map((dept) => (
            <motion.li
              key={dept.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex justify-between items-center bg-background-secondary p-2 rounded-md mb-2"
            >
              <span>{dept.name}</span>
              <button onClick={() => deleteDepartment(dept.id)} className="text-red-500">
                Delete
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default DepartmentList;
