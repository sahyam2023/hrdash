import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserMinus, Edit, Clock } from 'lucide-react';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'user_added',
      message: 'John Doe joined the Engineering team',
      time: '2 hours ago',
      icon: UserPlus,
      color: 'text-green-400',
    },
    {
      id: 2,
      type: 'user_updated',
      message: 'Sarah Wilson updated her profile information',
      time: '4 hours ago',
      icon: Edit,
      color: 'text-blue-400',
    },
    {
      id: 3,
      type: 'user_deactivated',
      message: 'Mike Johnson left the Sales team',
      time: '1 day ago',
      icon: UserMinus,
      color: 'text-red-400',
    },
    {
      id: 4,
      type: 'user_added',
      message: 'Emma Davis joined the Marketing team',
      time: '2 days ago',
      icon: UserPlus,
      color: 'text-green-400',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-background-tertiary rounded-xl p-6 border border-white/10 card-hover"
    >
      <h3 className="text-xl font-semibold text-text-primary mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start space-x-4 p-4 rounded-lg hover:bg-background-secondary/50 transition-colors duration-200"
          >
            <div className={`p-2 rounded-lg bg-background-secondary ${activity.color}`}>
              <activity.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-text-primary font-medium">{activity.message}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="w-4 h-4 text-text-muted" />
                <span className="text-text-secondary text-sm">{activity.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentActivity;