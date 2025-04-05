import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, BarChart3, Book, Users, User } from 'lucide-react';
import AIChat from './components/AIChat';
import JournalEntry from './components/JournalEntry';
import UserProfile from './components/UserProfile';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setErrorMessage('No token found. Please log in.');
          return;
        }

        const response = await fetch('http://localhost:5000/api/user/data', {
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
        
        const response = await fetch('http://localhost:5000/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const profileData = await response.json();
          
          // If user has completed profile, set default tab to 'ai'
          // Otherwise, set default tab to 'knowme'
          if (profileData && profileData.responses && profileData.responses.length > 0) {
            setActiveTab('ai');
          } else {
            setActiveTab('knowme');
          }
        } else {
          // If response is 404 (no profile), direct to 'knowme'
          if (response.status === 404) {
            setActiveTab('knowme');
          } else {
            setActiveTab('ai');  // Default to AI for any other error
          }
        }
      } catch (error) {
        console.error('Error checking user profile:', error);
        setActiveTab('ai');  // Default to AI if there's an error
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserData();
    checkUserProfile();
  }, []);

  // Show loading spinner while determining the default tab
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-purple-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 flex">
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
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 p-2 rounded-md w-full ${
              activeTab === 'analytics' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-purple-50'
            }`}
          >
            <BarChart3 className="h-5 w-5 mx-auto group-hover:mx-0" />
            <span className="hidden group-hover:inline-block">Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center space-x-2 p-2 rounded-md w-full ${
              activeTab === 'resources' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-purple-50'
            }`}
          >
            <Book className="h-5 w-5 mx-auto group-hover:mx-0" />
            <span className="hidden group-hover:inline-block">Resources</span>
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex items-center space-x-2 p-2 rounded-md w-full ${
              activeTab === 'community' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-purple-50'
            }`}
          >
            <Users className="h-5 w-5 mx-auto group-hover:mx-0" />
            <span className="hidden group-hover:inline-block">Community</span>
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`flex items-center space-x-2 p-2 rounded-md w-full ${
              activeTab === 'journal' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-purple-50'
            }`}
          >
            <Book className="h-5 w-5 mx-auto group-hover:mx-0" />
            <span className="hidden group-hover:inline-block">Journal</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'ai' && <AIChat />}
          {activeTab === 'journal' && <JournalEntry />}
          {activeTab === 'knowme' && <UserProfile userData={userData} />}
          {activeTab === 'analytics' && <div>Analytics Content</div>}
          {activeTab === 'resources' && <div>Resources Content</div>}
          {activeTab === 'community' && <div>Community Content</div>}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;