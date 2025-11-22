import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import { cn } from "@/utils/cn";

// Temporary NotificationBadge component until proper implementation
const NotificationBadge = () => (
  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`)
    }
  }

const navItems = [
    { label: "Discover", path: "", exact: true },
    { label: "Library", path: "library" },
    { label: "Following", path: "following" },
    { label: "Notifications", path: "notifications" },
    { label: "Write", path: "write" }
  ]

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === "/" && !location.search
    }
    return location.pathname.startsWith(`/${path}`)
  }

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
            <Button
              variant="primary"
              onClick={() => navigate("/write/new")}
              className="inline-flex items-center gap-2"
            >
              <ApperIcon name="Plus" size={16} />
              New Story
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                const { logout } = useAuth()
                logout()
              }}
              className="inline-flex items-center gap-2"
            >
              <ApperIcon name="LogOut" size={16} />
              Logout
            </Button>
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
              
              <Button
                variant="outline"
                onClick={() => {
                  const { logout } = useAuth()
                  logout()
                  setIsMenuOpen(false)
                }}
                className="w-full inline-flex items-center justify-center gap-2"
              >
                <ApperIcon name="LogOut" size={16} />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header