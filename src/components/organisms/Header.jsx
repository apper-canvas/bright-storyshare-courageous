import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/layouts/Root";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import NotificationBadge from "@/components/atoms/NotificationBadge";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    }
  };

const navItems = [
    { label: "Discover", path: "", exact: true },
    { label: "Library", path: "library" },
    { label: "Following", path: "following" },
    { label: "Notifications", path: "notifications" },
    { label: "Write", path: "write" }
  ];
const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === "/" && !location.search;
    }
    return location.pathname.startsWith(`/${path}`);
  };
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-surface/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center">
              <ApperIcon name="BookOpen" size={24} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-2xl font-bold text-primary">
                StoryShare
              </h1>
              <p className="text-xs text-secondary font-ui -mt-1">
                Connect through stories
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
<nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path === "" ? "/" : `/${item.path}`}
                className={cn(
                  "px-4 py-2 rounded-lg font-ui font-medium transition-all duration-200 relative",
                  isActive(item.path, item.exact)
                    ? "bg-accent text-white shadow-md"
                    : "text-secondary hover:text-primary hover:bg-surface"
                )}
              >
                {item.label}
                {item.path === "notifications" && (
                  <NotificationBadge />
                )}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar onSearch={handleSearch} />
          </div>

{/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  variant="primary"
                  onClick={() => navigate("/write/new")}
                  className="inline-flex items-center gap-2"
                >
                  <ApperIcon name="Plus" size={16} />
                  New Story
                </Button>
                
                {/* User Menu */}
                <div className="flex items-center gap-2">
                  <Avatar 
                    name={user?.firstName || user?.name || 'User'} 
                    size="sm" 
                  />
                  <span className="text-sm text-secondary font-ui">
                    {user?.firstName || user?.name || 'User'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-secondary hover:text-error"
                  >
                    <ApperIcon name="LogOut" size={16} />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center gap-2"
                >
                  <ApperIcon name="LogIn" size={16} />
                  Login
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate("/signup")}
                  className="inline-flex items-center gap-2"
                >
                  <ApperIcon name="UserPlus" size={16} />
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-secondary hover:text-primary hover:bg-surface rounded-lg transition-colors"
          >
            <ApperIcon name={isMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden mt-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-surface">
<nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path === "" ? "/" : `/${item.path}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-lg font-ui font-medium transition-all duration-200 relative",
                    isActive(item.path, item.exact)
                      ? "bg-accent text-white shadow-md"
                      : "text-secondary hover:text-primary hover:bg-surface"
                  )}
                >
                  <div className="flex items-center gap-3">
<ApperIcon 
                      name={item.path === "" ? "Compass" : item.path === "library" ? "Library" : item.path === "following" ? "Users" : item.path === "notifications" ? "Bell" : "PenTool"} 
                      size={20} 
                    />
                    {item.label}
                    {item.path === "notifications" && (
                      <NotificationBadge />
                    )}
                  </div>
                </Link>
              ))}
            </nav>
            
<div className="mt-6 pt-4 border-t border-surface space-y-3">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="primary"
                    onClick={() => {
                      navigate("/write/new")
                      setIsMenuOpen(false)
                    }}
                    className="w-full inline-flex items-center justify-center gap-2"
                  >
                    <ApperIcon name="Plus" size={16} />
                    New Story
                  </Button>
                  
                  {/* User Info */}
                  <div className="flex items-center gap-3 p-3 bg-surface/30 rounded-lg">
                    <Avatar 
                      name={user?.firstName || user?.name || 'User'} 
                      size="sm" 
                    />
                    <div className="flex-1">
                      <p className="text-sm font-ui font-medium text-primary">
                        {user?.firstName || user?.name || 'User'}
                      </p>
                      <p className="text-xs text-secondary font-ui">
                        {user?.emailAddress || 'user@example.com'}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 text-error hover:bg-error hover:text-white"
                  >
                    <ApperIcon name="LogOut" size={16} />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate("/login")
                      setIsMenuOpen(false)
                    }}
                    className="w-full inline-flex items-center justify-center gap-2"
                  >
                    <ApperIcon name="LogIn" size={16} />
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      navigate("/signup")
                      setIsMenuOpen(false)
                    }}
                    className="w-full inline-flex items-center justify-center gap-2"
                  >
                    <ApperIcon name="UserPlus" size={16} />
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
</header>
  );
};

export default Header;