import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, TrendingUp, Award } from 'lucide-react';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActive: string;
  streakHistory: {
    date: string;
    active: boolean;
  }[];
}

interface UsageStats {
  totalInteractions: number;
  moodEntries: number;
  eventsScheduled: number;
}

const Analytics = () => {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          return;
        }

        // Fetch streak data
        const streakResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/streak`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!streakResponse.ok) {
          throw new Error(`Failed to fetch streak data: ${streakResponse.status}`);
        }

        const streakData = await streakResponse.json();
        setStreakData(streakData);

        // Fetch usage statistics
        const statsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!statsResponse.ok) {
          throw new Error(`Failed to fetch usage stats: ${statsResponse.status}`);
        }

        const statsData = await statsResponse.json();
        setUsageStats(statsData);
        
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchStreakData();
  }, []);

  // Function to render the calendar with active days highlighted
  const renderCalendar = () => {
    if (!streakData?.streakHistory) return null;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get the first day of the month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    
    // Get number of days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Create array of day numbers
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    // Create history lookup map for quick access
    const historyMap = new Map(
      streakData.streakHistory.map(item => [
        new Date(item.date).toISOString().split('T')[0],
        item.active
      ])
    );
    
    return (
      <div className="mt-4">
        <h3 className="font-medium text-gray-700 mb-2">Activity Calendar</h3>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
          
          {/* Empty cells for days before the 1st of the month */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="p-1"></div>
          ))}
          
          {/* Days of the month */}
          {days.map(day => {
            const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const isActive = historyMap.get(dateStr);
            const isToday = day === today.getDate();
            
            return (
              <div 
                key={day} 
                className={`p-1 rounded-full w-8 h-8 mx-auto flex items-center justify-center text-xs
                  ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}
                  ${isToday ? 'ring-2 ring-purple-500' : ''}
                `}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <p>{error}</p>
        <p className="mt-2 text-sm">Please try again or contact support if the problem persists.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your MindEase Analytics</h1>

      {/* Streak Information */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <div className="flex items-center mb-4">
          <Flame className="h-6 w-6 text-orange-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Your Streak</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">Current Streak</p>
            <div className="flex justify-center items-center">
              <Flame className="h-5 w-5 text-orange-500 mr-1" />
              <span className="text-3xl font-bold text-gray-800">{streakData?.currentStreak || 0}</span>
              <span className="ml-1 text-gray-600">days</span>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">Longest Streak</p>
            <div className="flex justify-center items-center">
              <Award className="h-5 w-5 text-purple-500 mr-1" />
              <span className="text-3xl font-bold text-gray-800">{streakData?.longestStreak || 0}</span>
              <span className="ml-1 text-gray-600">days</span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">Last Active</p>
            <div className="flex justify-center items-center">
              <Calendar className="h-5 w-5 text-blue-500 mr-1" />
              <span className="text-lg font-bold text-gray-800">
                {streakData?.lastActive 
                  ? new Date(streakData.lastActive).toLocaleDateString() 
                  : 'Never'}
              </span>
            </div>
          </div>
        </div>

        {renderCalendar()}

        <div className="mt-4 text-sm text-gray-500">
          <p>Log in daily to maintain your streak and build consistency!</p>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-6 w-6 text-green-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Usage Statistics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Total Interactions</p>
            <p className="text-2xl font-semibold text-gray-800">{usageStats?.totalInteractions || 0}</p>
          </div>
          
          <div className="border border-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Mood Entries</p>
            <p className="text-2xl font-semibold text-gray-800">{usageStats?.moodEntries || 0}</p>
          </div>
          
          <div className="border border-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Events Scheduled</p>
            <p className="text-2xl font-semibold text-gray-800">{usageStats?.eventsScheduled || 0}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
