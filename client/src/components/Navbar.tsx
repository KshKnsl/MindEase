import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Brain } from 'lucide-react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-semibold">MindEase</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/mood-tracker">Mood Tracker</Link>
            </Button>
            {!isLoggedIn ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/register">Register</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              </>
            ) : (
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-4">
                <Button variant="ghost" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/mood-tracker">Mood Tracker</Link>
                </Button>
                {!isLoggedIn ? (
                  <>
                    <Button variant="ghost" asChild>
                      <Link to="/register">Register</Link>
                    </Button>
                    <Button variant="default" asChild>
                      <Link to="/login">Login</Link>
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" onClick={handleLogout}>
                    Logout
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;