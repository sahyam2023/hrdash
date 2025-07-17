import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import { SocketProvider, useSocket } from './context/SocketContext';
import { initializeSocketListeners } from './listeners/socketListeners';

function AppContent() {
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      const cleanupListeners = initializeSocketListeners(socket);
      return cleanupListeners;
    }
  }, [socket]); // The effect depends on the socket object.

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background-primary"
    >
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1C2128',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
    </motion.div>
  );
}

function App() {
  return (
    <SocketProvider>
      <Router>
        <AppContent />
      </Router>
    </SocketProvider>
  );
}

export default App;