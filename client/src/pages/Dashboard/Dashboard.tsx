import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, User, BarChart2, Heart } from 'lucide-react';
import AIChat from './components/AIChat';
import UserProfile from './components/UserProfile';
import MoodActionHandler from './components/MoodTracker';
import Analytics from './components/Analytics';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setErrorMessage('No token found. Please log in.');
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/data`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setErrorMessage('Unauthorized. Please log in again.');
          } else {
            setErrorMessage(`Error: ${response.status}`);
          }
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Check if user has a profile
    const checkUserProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const profileData = await response.json();
          
          if (profileData && profileData.responses && profileData.responses.length > 0) {
            setActiveTab('ai');
          } else {
            setActiveTab('knowme');
          }
        } else {
          if (response.status === 404) {
            setActiveTab('knowme');
          } else {
            setActiveTab('ai'); 
          }
        }
      } catch (error) {
        console.error('Error checking user profile:', error);
        setActiveTab('ai');  
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserData();
    checkUserProfile();
  }, []);

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-purple-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-h-screen h-[800px] bg-purple-50 flex">
      {/* Sidebar */}
      <div className="group relative bg-white shadow-md">
        <div className="h-full flex flex-col items-center py-4 space-y-4 w-16 group-hover:w-48 transition-all duration-300 overflow-hidden">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center space-x-2 p-2 rounded-md w-full ${
              activeTab === 'ai' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-purple-50'
            }`}
          >
            <Brain className="h-5 w-5 mx-auto group-hover:mx-0" />
            <span className="hidden group-hover:inline-block">AI Twin</span>
          </button>
          
          <button
            onClick={() => setActiveTab('knowme')}
            className={`flex items-center space-x-2 p-2 rounded-md w-full ${
              activeTab === 'knowme' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-purple-50'
            }`}
          >
            <User className="h-5 w-5 mx-auto group-hover:mx-0" />
            <span className="hidden group-hover:inline-block">Let Me Know You</span>
          </button>

          <button
            onClick={() => setActiveTab('mood')}
            className={`flex items-center space-x-2 p-2 rounded-md w-full ${
              activeTab === 'mood' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-purple-50'
            }`}
          >
            <Heart className="h-5 w-5 mx-auto group-hover:mx-0" />
            <span className="hidden group-hover:inline-block">Mood</span>
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 p-2 rounded-md w-full ${
              activeTab === 'analytics' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-purple-50'
            }`}
          >
            <BarChart2 className="h-5 w-5 mx-auto group-hover:mx-0" />
            <span className="hidden group-hover:inline-block">Analytics</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {errorMessage && (
          <div className="bg-red-100 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'ai' && <AIChat />}
          {activeTab === 'knowme' && <UserProfile userData={userData} />}
          {activeTab === 'mood' && <MoodActionHandler />}
          {activeTab === 'analytics' && <Analytics />}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;