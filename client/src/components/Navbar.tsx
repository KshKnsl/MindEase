import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <Brain className="h-8 w-8 text-purple-600 group-hover:text-purple-700 transition-colors" />
              <span className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">MindEase</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/dashboard" 
              className={`font-medium transition-colors ${
                isActive('/dashboard') 
                  ? 'text-purple-700 border-b-2 border-purple-600' 
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Dashboard
            </Link>
           
            
            {!isLoggedIn ? (
              <>
                <Link 
                  to="/register" 
                  className={`font-medium transition-colors ${
                    isActive('/register') 
                      ? 'text-purple-700 border-b-2 border-purple-600' 
                      : 'text-gray-700 hover:text-purple-600'
                  }`}
                >
                  Register
                </Link>
                <Link 
                  to="/login" 
                  className="bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700 transition-colors font-medium shadow-sm hover:shadow-md"
                >
                  Login
                </Link>
              </>
            ) : (
              <button 
                onClick={handleLogout}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-purple-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-4 py-2 shadow-lg">
          <div className="flex flex-col space-y-3 pb-3">
            <Link 
              to="/dashboard" 
              className={`px-2 py-2 rounded-md ${
                isActive('/dashboard') 
                  ? 'bg-purple-50 text-purple-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            
            
            {!isLoggedIn ? (
              <>
                <Link 
                  to="/register" 
                  className={`px-2 py-2 rounded-md ${
                    isActive('/register') 
                      ? 'bg-purple-50 text-purple-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
                <Link 
                  to="/login" 
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </>
            ) : (
              <button 
                onClick={handleLogout}
                className="text-left px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-md w-full"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;