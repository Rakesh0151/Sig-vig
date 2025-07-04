import React, { useState, useRef, useEffect, useMemo, memo, useCallback } from 'react';
import { useTheme, themeConfig } from './ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

// Helper function to extract name from email
const getNameFromEmail = (email) => {
  if (!email) return '';
  return email.split('@')[0];
};

// Memoize UserMenuButton component
const UserMenuButton = memo(({ user, isOpen, onClick, colorPalette, theme }) => (
  <motion.button
    onClick={onClick}
    className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-lg"
    style={{ 
      backgroundColor: colorPalette.surface,
      border: `1px solid ${colorPalette.border}`,
      boxShadow: isOpen ? `0 0 0 2px ${colorPalette.primary}40` : 'none'
    }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div 
      className="w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 relative overflow-hidden"
      style={{ 
        background: theme === 'dark'
          ? `linear-gradient(135deg, ${colorPalette.secondary} 0%, #c62828 100%)`
          : `linear-gradient(135deg, ${colorPalette.secondary} 0%, #c62828 100%)`,
        boxShadow: theme === 'dark'
          ? '0 2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)'
          : '0 2px 4px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.2)'
      }}
    >
      <span 
        className="text-white font-semibold text-sm relative z-10 specimen-font-medium"
        style={{
          textShadow: '0 1px 2px rgba(0,0,0,0.2)'
        }}
      >
        {getNameFromEmail(user?.username)?.charAt(0).toUpperCase()}
      </span>
    </div>
    <div className="hidden lg:flex flex-col min-w-0">
      <span 
        className="text-sm font-medium truncate specimen-font-medium"
        style={{ color: colorPalette.text }}
      >
        {getNameFromEmail(user?.username)}
      </span>
    </div>
    <motion.svg 
      className="w-4 h-4 ml-1" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.2 }}
      style={{ color: colorPalette.textSecondary }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </motion.svg>
  </motion.button>
));

// Confirmation Modal Component
const ConfirmationModal = memo(({ isOpen, onClose, onConfirm, colorPalette }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
          style={{ backgroundColor: colorPalette.background }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <h2 
              className="text-xl font-bold specimen-font-bold mb-2"
              style={{ color: colorPalette.text }}
            >
              Confirm Logout
            </h2>
            <p 
              className="text-sm"
              style={{ color: colorPalette.textSecondary }}
            >
              Are you sure you want to log out?
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border transition-colors hover:bg-opacity-80"
              style={{
                backgroundColor: colorPalette.surface,
                borderColor: `${colorPalette.textSecondary}20`,
                color: colorPalette.textSecondary
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 rounded-xl font-medium specimen-font-medium transition-colors"
              style={{ backgroundColor: colorPalette.secondary, color: '#ffffff' }}
            >
              Logout
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

// Navigation Confirmation Dialog Component
const NavigationConfirmDialog = memo(({ isOpen, onClose, onConfirm, colorPalette }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
          style={{ backgroundColor: colorPalette.background }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <h2 
              className="text-xl font-bold specimen-font-bold mb-2"
              style={{ color: colorPalette.text }}
            >
              Unsaved Changes
            </h2>
            <p 
              className="text-sm"
              style={{ color: colorPalette.textSecondary }}
            >
              You have unsaved changes. Are you sure you want to leave this page?
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border transition-colors hover:bg-opacity-80"
              style={{
                backgroundColor: colorPalette.surface,
                borderColor: `${colorPalette.textSecondary}20`,
                color: colorPalette.textSecondary
              }}
            >
              Stay
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 rounded-xl font-medium specimen-font-medium transition-colors"
              style={{ backgroundColor: colorPalette.secondary, color: '#ffffff' }}
            >
              Leave
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showNavigationDialog, setShowNavigationDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const userMenuRef = useRef(null);

  // Memoize user menu items
  const userMenuItems = useMemo(() => {
    const items = [
      {
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
        label: 'Profile',
        to: '/'
      }
    ];

    // Only show admin dashboard for admin users
    if (user?.userRole === 'admin') {
      items.push({
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        ),
        label: 'Admin Dashboard',
        to: '/admin-dashboard'
      });
    }

    return items;
  }, [navigate, user?.userRole]);

  // Memoize color palette
  const colorPalette = useMemo(() => ({
    primary: '#57c1ef',
    secondary: '#ee3739',
    accent: '#4A90E2',
    background: theme === 'dark' ? '#1a1a1a' : '#f8f9fa',
    surface: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    surfaceVariant: theme === 'dark' ? '#3d3d3d' : '#f5f5f5',
    text: theme === 'dark' ? '#ffffff' : '#2c3e50',
    textSecondary: theme === 'dark' ? '#b0b0b0' : '#6c757d',
    border: theme === 'dark' ? '#404040' : '#e1e5e9',
    shadow: theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)',
    gradient: theme === 'dark' 
      ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
  }), [theme]);

  // Function to check if we can navigate
  const checkNavigation = useCallback((to) => {
    if (location.pathname === '/prr-chi') {
      const event = new CustomEvent('checkUnsavedData', {
        detail: {
          callback: (hasUnsavedData) => {
            if (hasUnsavedData) {
              setPendingNavigation(() => () => {
                navigate(to);
                setIsMobileMenuOpen(false);
                setIsUserMenuOpen(false);
              });
              setShowNavigationDialog(true);
            } else {
              navigate(to);
              setIsMobileMenuOpen(false);
              setIsUserMenuOpen(false);
            }
          }
        }
      });
      window.dispatchEvent(event);
    } else {
      navigate(to);
      setIsMobileMenuOpen(false);
      setIsUserMenuOpen(false);
    }
  }, [location.pathname, navigate]);

  // Handle logout separately from navigation
  const handleLogout = useCallback(() => {
    setIsLogoutModalOpen(true);
  }, []);

  const confirmLogout = async () => {
    await logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsLogoutModalOpen(false);
  };

  // Update navigation handlers
  const handleNavigate = useCallback((to) => {
    checkNavigation(to);
  }, [checkNavigation]);

  // Update menu handlers to not use checkNavigation
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen(prev => !prev);
  }, []);

  // Update click outside handler to not use checkNavigation
  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleConfirmNavigation = () => {
    setShowNavigationDialog(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  return (
    <>
      <NavigationConfirmDialog
        isOpen={showNavigationDialog}
        onClose={() => setShowNavigationDialog(false)}
        onConfirm={handleConfirmNavigation}
        colorPalette={colorPalette}
      />
      
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between z-50 backdrop-blur-md border-b"
        style={{ 
          background: colorPalette.gradient,
          borderColor: colorPalette.border,
          boxShadow: `0 4px 20px ${colorPalette.shadow}`
        }}
      >
        {/* Logo - Enhanced with company logo and Specimen font */}
        <motion.div 
          className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0 cursor-pointer"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={() => handleNavigate('/')}
        >
          <img src={logo} alt="Logo" className="w-8 h-8 object-contain mr-0.5" />
          <div className="flex flex-col">
            <div className="flex items-center specimen-font">
              <span 
                className="text-xl sm:text-2xl font-bold"
                style={{ color: colorPalette.secondary }}
              >
                Sig
              </span>
              <span 
                className="text-xl sm:text-2xl font-bold"
                style={{ color: colorPalette.primary }}
              >
                Vig
              </span>
            </div>
            <span 
              className="text-[10px] sm:text-xs specimen-font-medium tracking-wide"
              style={{ color: colorPalette.textSecondary }}
            >
              powered by <span style={{ color: colorPalette.secondary }}>CLIN</span><span style={{ color: colorPalette.primary }}>FINESSE</span>
            </span>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          {/* User Profile with Dropdown */}
          {user && (
            <div className="relative" ref={userMenuRef}>
              <UserMenuButton
                user={user}
                isOpen={isUserMenuOpen}
                onClick={toggleUserMenu}
                colorPalette={colorPalette}
                theme={theme}
              />

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border z-50"
                    style={{ 
                      backgroundColor: colorPalette.surface,
                      borderColor: colorPalette.border
                    }}
                  >
                    <div className="p-2">
                      {userMenuItems.map((item, index) => (
                        <motion.button
                          key={item.label}
                          onClick={() => {
                            if (item.to) {
                              checkNavigation(item.to);
                            }
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 hover:shadow-sm specimen-font-medium"
                          style={{ 
                            color: colorPalette.text,
                            backgroundColor: 'transparent'
                          }}
                          whileHover={{ 
                            backgroundColor: colorPalette.surfaceVariant,
                            x: 4
                          }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <span style={{ color: colorPalette.primary }}>
                            {item.icon}
                          </span>
                          {item.label}
                        </motion.button>
                      ))}
                      
                      <div className="my-2 h-px" style={{ backgroundColor: colorPalette.border }}></div>
                      
                      <motion.button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 rounded-xl text-sm font-medium specimen-font-medium transition-colors flex items-center gap-2"
                        style={{ backgroundColor: colorPalette.secondary, color: '#ffffff' }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </motion.button>
                      <div 
                        className="text-xs text-center mt-2 opacity-70"
                        style={{ color: colorPalette.textSecondary }}
                      >
                        Version 1.0.0
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Theme Toggle - Enhanced */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 lg:p-2.5 rounded-xl transition-all duration-200 hover:shadow-lg relative overflow-hidden"
            style={{ 
              backgroundColor: colorPalette.surface,
              color: colorPalette.text,
              border: `1px solid ${colorPalette.border}`
            }}
            aria-label="Toggle theme"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'dark' ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu Button - Enhanced */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleMobileMenu()}
          className="md:hidden p-2 rounded-xl transition-all duration-200 hover:shadow-lg"
          style={{ 
            backgroundColor: colorPalette.surface,
            color: colorPalette.text,
            border: `1px solid ${colorPalette.border}`
          }}
          aria-label="Toggle menu"
        >
          <motion.div
            animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </motion.div>
        </motion.button>
      </motion.nav>

      {/* Mobile Menu Overlay - Enhanced */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-16 right-0 w-72 max-w-[85vw] h-[calc(100vh-4rem)] z-50 shadow-2xl border-l md:hidden"
              style={{ 
                background: colorPalette.gradient,
                borderColor: colorPalette.border
              }}
            >
              <div className="p-4 space-y-4">
                {/* User Profile Mobile - Enhanced */}
                {user && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ 
                      backgroundColor: colorPalette.surface,
                      border: `1px solid ${colorPalette.border}`,
                      boxShadow: `0 4px 12px ${colorPalette.shadow}`
                    }}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 relative overflow-hidden"
                      style={{ 
                        background: theme === 'dark'
                          ? `linear-gradient(135deg, ${colorPalette.secondary} 0%, #c62828 100%)`
                          : `linear-gradient(135deg, ${colorPalette.secondary} 0%, #c62828 100%)`,
                        boxShadow: theme === 'dark'
                          ? '0 2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.1)'
                          : '0 2px 4px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.2)'
                      }}
                    >
                      <span 
                        className="text-white font-semibold relative z-10 specimen-font-medium"
                        style={{
                          textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                        }}
                      >
                        {getNameFromEmail(user?.username)?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span 
                        className="text-sm font-medium truncate specimen-font-medium"
                        style={{ color: colorPalette.text }}
                      >
                        {getNameFromEmail(user?.username)}
                      </span>
                      <span 
                        className="text-xs specimen-font-medium"
                        style={{ color: colorPalette.textSecondary }}
                      >
                        Analyst
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Mobile User Menu Items */}
                <div className="space-y-1">
                  {userMenuItems.map((item, index) => (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (item.action) {
                          checkNavigation(() => {
                            item.action();
                            setIsMobileMenuOpen(false);
                          });
                        }
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 specimen-font-medium"
                      style={{ 
                        backgroundColor: colorPalette.surface,
                        color: colorPalette.text,
                        border: `1px solid ${colorPalette.border}`
                      }}
                    >
                      <span style={{ color: colorPalette.primary }}>
                        {item.icon}
                      </span>
                      <span className="text-sm">{item.label}</span>
                    </motion.button>
                  ))}

                  {/* Theme Toggle Mobile - Enhanced */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 specimen-font-medium"
                    style={{ 
                      backgroundColor: colorPalette.surface,
                      color: colorPalette.text,
                      border: `1px solid ${colorPalette.border}`
                    }}
                  >
                    <motion.div
                      animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      style={{ color: colorPalette.primary }}
                    >
                      {theme === 'dark' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      )}
                    </motion.div>
                    <span className="text-sm">
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  </motion.button>

                  {/* Logout Mobile - Enhanced */}
                  {user && (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 mt-4 specimen-font-medium"
                      style={{ 
                        background: `linear-gradient(135deg, ${colorPalette.secondary} 0%, #c62828 100%)`,
                        color: '#ffffff',
                        boxShadow: `0 4px 12px ${colorPalette.secondary}40`
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="text-sm">Logout</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout confirmation modal */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        colorPalette={colorPalette}
      />
    </>
  );
};

export default Navbar;