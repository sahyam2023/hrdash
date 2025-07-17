import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface JobTitle {
  id: number;
  name: string;
}

const JobTitleList: React.FC = () => {
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [newJobTitle, setNewJobTitle] = useState('');

  useEffect(() => {
    fetchJobTitles();
  }, []);

  const fetchJobTitles = async () => {
    try {
      const response = await api.get('/api/job-titles');
      setJobTitles(response.data);
    } catch (error) {
      console.error('Error fetching job titles:', error);
    }
  };

  const addJobTitle = async () => {
    if (newJobTitle.trim() === '') return;
    try {
      await api.post('/api/job-titles', { name: newJobTitle });
      setNewJobTitle('');
      fetchJobTitles();
    } catch (error) {
      console.error('Error adding job title:', error);
    }
  };

  const deleteJobTitle = async (id: number) => {
    try {
      await api.delete(`/api/job-titles/${id}`);
      fetchJobTitles();
    } catch (error) {
      console.error('Error deleting job title:', error);
    }
  };

  return (
    <div>
      <div className="flex mb-4">
        <input
          type="text"
          value={newJobTitle}
          onChange={(e) => setNewJobTitle(e.target.value)}
          className="bg-background-secondary text-text-primary p-2 rounded-l-md flex-grow"
          placeholder="New Job Title"
        />
        <button onClick={addJobTitle} className="bg-primary-accent text-white p-2 rounded-r-md">
          Add
        </button>
      </div>
      <ul>
        {jobTitles.map((job) => (
          <li key={job.id} className="flex justify-between items-center bg-background-secondary p-2 rounded-md mb-2">
            <span>{job.name}</span>
            <button onClick={() => deleteJobTitle(job.id)} className="text-red-500">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobTitleList;
