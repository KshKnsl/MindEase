import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Clock, Activity } from 'lucide-react';

const Analytics = () => {
  // Mock data for demonstration
  const moodData = {
    weeklyAverage: 7.5,
    topMoods: ['Happy', 'Calm', 'Energetic'],
    totalEntries: 28,
    streakDays: 7
  };

  const stats = [
    {
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      label: 'Weekly Average',
      value: moodData.weeklyAverage,
      change: '+0.5',
      changeType: 'increase'
    },
    {
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      label: 'Total Entries',
      value: moodData.totalEntries,
      change: '+3',
      changeType: 'increase'
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-500" />,
      label: 'Streak Days',
      value: moodData.streakDays,
      change: '+2',
      changeType: 'increase'
    },
    {
      icon: <Activity className="h-6 w-6 text-orange-500" />,
      label: 'Top Mood',
      value: moodData.topMoods[0],
      change: 'Consistent',
      changeType: 'neutral'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Mood Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 p-4 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              {stat.icon}
              <span className={`text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' :
                stat.changeType === 'decrease' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-2">
              <h3 className="text-lg font-semibold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Recent Moods</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="h-64 flex items-center justify-center text-gray-500">
            Mood trend chart will be displayed here
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Top Moods</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-2">
              {moodData.topMoods.map((mood, index) => (
                <li key={mood} className="flex items-center justify-between">
                  <span className="text-gray-700">{mood}</span>
                  <span className="text-sm text-gray-500">
                    {Math.round((1 - index * 0.2) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="flex items-center">
                  <span className="w-10 text-sm text-gray-500">{day}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${Math.random() * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;