import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

const Navbar = () => {
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
            <Link to="/" className="text-gray-700 hover:text-purple-600">Home</Link>
            <Link to="/features" className="text-gray-700 hover:text-purple-600">Features</Link>
            <Link to="/about" className="text-gray-700 hover:text-purple-600">About Us</Link>
            <Link to="/contact" className="text-gray-700 hover:text-purple-600">Contact</Link>
            <Link to="/login" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;