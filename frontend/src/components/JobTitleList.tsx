import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';

interface JobTitle {
  id: number;
  name: string;
}

const JobTitleList: React.FC = () => {
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    fetchJobTitles();

    if (socket) {
      socket.on('job_title_added', (jobTitle: JobTitle) => {
        setJobTitles((prev) => [...prev, jobTitle]);
      });
      socket.on('job_title_deleted', (data: { id: number }) => {
        setJobTitles((prev) => prev.filter((job) => job.id !== data.id));
      });
      return () => {
        socket.off('job_title_added');
        socket.off('job_title_deleted');
      };
    }
  }, [socket]);

  const fetchJobTitles = async () => {
    try {
      const response = await api.get('/api/job-titles');
      setJobTitles(response.data);
    } catch (error) {
      console.error('Error fetching job titles:', error);
    }
  };

  const addJobTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newJobTitle.trim() === '') return;
    try {
      await api.post('/api/job-titles', { name: newJobTitle });
      setNewJobTitle('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding job title:', error);
    }
  };

  const deleteJobTitle = async (id: number) => {
    try {
      await api.delete(`/api/job-titles/${id}`);
    } catch (error) {
      console.error('Error deleting job title:', error);
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
          <span>Add Job Title</span>
        </button>
      </div>

      <AnimatePresence>
        <motion.ul className="space-y-2">
          {jobTitles.map((job) => (
            <motion.li
              key={job.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className="flex justify-between items-center bg-background-secondary p-3 rounded-lg"
            >
              <span className="text-text-primary font-medium">{job.name}</span>
              <button
                onClick={() => deleteJobTitle(job.id)}
                className="text-text-muted hover:text-red-500 transition-colors"
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
                <h2 className="text-2xl font-bold text-text-primary">Add New Job Title</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-text-secondary hover:text-text-primary hover:bg-background-secondary/50 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={addJobTitle}>
                <label className="block text-text-primary font-medium mb-2">Job Title Name</label>
                <input
                  type="text"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="input-field w-full"
                  placeholder="e.g., Software Engineer"
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
                    Add Job Title
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

export default JobTitleList;
