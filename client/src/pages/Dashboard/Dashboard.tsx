import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, BarChart3, Book, Users } from 'lucide-react';
import AIChat from './components/AIChat';
import JournalEntry from './components/JournalEntry';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('ai');
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); // New state for error messages

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
        setErrorMessage(''); // Clear error message on success
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

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
          {activeTab === 'analytics' && <div>Analytics Content</div>}
          {activeTab === 'resources' && <div>Resources Content</div>}
          {activeTab === 'community' && <div>Community Content</div>}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;