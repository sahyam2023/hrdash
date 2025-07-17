import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Department {
  id: number;
  name: string;
}

const DepartmentList: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDepartment, setNewDepartment] = useState('');

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

  const addDepartment = async () => {
    if (newDepartment.trim() === '') return;
    try {
      await api.post('/api/departments', { name: newDepartment });
      setNewDepartment('');
      fetchDepartments();
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  const deleteDepartment = async (id: number) => {
    try {
      await api.delete(`/api/departments/${id}`);
      fetchDepartments();
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
        {departments.map((dept) => (
          <li key={dept.id} className="flex justify-between items-center bg-background-secondary p-2 rounded-md mb-2">
            <span>{dept.name}</span>
            <button onClick={() => deleteDepartment(dept.id)} className="text-red-500">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentList;
