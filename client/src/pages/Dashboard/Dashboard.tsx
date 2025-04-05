import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, BarChart3, Book, Users } from 'lucide-react';
import AIChat from './components/AIChat';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('ai');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/data');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <nav className="space-y-4">
              <button
                onClick={() => setActiveTab('ai')}
                className={`w-full flex items-center space-x-2 p-2 rounded-md ${
                  activeTab === 'ai' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-purple-50'
                }`}
              >
                <Brain className="h-5 w-5" />
                <span>AI Twin</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {activeTab === 'ai' && <AIChat />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;