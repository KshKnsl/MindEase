import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">MindEase</span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-gray-700 hover:text-purple-600">Dashboard</Link>
            {!isLoggedIn && (
              <>
                <Link to="/register" className="text-gray-700 hover:text-purple-600">Register</Link>
                <Link to="/login" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                  Login
                </Link>
              </>
            )}
            {isLoggedIn && (
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  setIsLoggedIn(false);
                }}
                className="text-gray-700 hover:text-purple-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;