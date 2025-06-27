import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeProvider';
import { USER_ROLES, USER_STATUS, THEME_COLORS } from '../../constants/adminConstants';

const AdminFilters = ({ 
  searchTerm, 
  onSearchChange, 
  roleFilter, 
  onRoleFilterChange, 
  statusFilter, 
  onStatusFilterChange,
  onCreateUser 
}) => {
  const { theme } = useTheme();
  const cliniFinesseTheme = {
    primary: THEME_COLORS.PRIMARY,
    secondary: THEME_COLORS.SECONDARY,
    background: theme === 'dark' ? '#1a1a1a' : '#f8f9fa',
    textPrimary: theme === 'dark' ? '#ffffff' : '#2c3e50',
    textSecondary: theme === 'dark' ? '#b0b0b0' : '#6c757d',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border shadow-lg"
      style={{
        backgroundColor: cliniFinesseTheme.background,
        borderColor: `${cliniFinesseTheme.textSecondary}15`,
        boxShadow: `0 4px 20px ${cliniFinesseTheme.textSecondary}10`
      }}
    >
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Enhanced Search */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{
                  backgroundColor: cliniFinesseTheme.background,
                  borderColor: `${cliniFinesseTheme.textSecondary}20`,
                  color: cliniFinesseTheme.textPrimary,
                    boxShadow: `0 2px 8px ${cliniFinesseTheme.textSecondary}10`,
                  focusRingColor: cliniFinesseTheme.primary
                }}
              />
                <div 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: cliniFinesseTheme.textSecondary }}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
                </div>
            </div>
          </div>

            {/* Enhanced Role Filter */}
            <div className="sm:w-48">
              <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{
                backgroundColor: cliniFinesseTheme.background,
                borderColor: `${cliniFinesseTheme.textSecondary}20`,
                color: cliniFinesseTheme.textPrimary,
                    boxShadow: `0 2px 8px ${cliniFinesseTheme.textSecondary}10`,
                focusRingColor: cliniFinesseTheme.primary
              }}
            >
              <option value={USER_ROLES.ALL}>All Roles</option>
              <option value={USER_ROLES.NORMAL}>Normal</option>
              <option value={USER_ROLES.ADMIN}>Admin</option>
            </select>
                <div 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                  style={{ color: cliniFinesseTheme.textSecondary }}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
          </div>

            {/* Enhanced Status Filter */}
            <div className="sm:w-48">
              <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{
                backgroundColor: cliniFinesseTheme.background,
                borderColor: `${cliniFinesseTheme.textSecondary}20`,
                color: cliniFinesseTheme.textPrimary,
                    boxShadow: `0 2px 8px ${cliniFinesseTheme.textSecondary}10`,
                focusRingColor: cliniFinesseTheme.primary
              }}
            >
              <option value={USER_STATUS.ALL}>All Status</option>
              <option value={USER_STATUS.ACTIVE}>Active</option>
              <option value={USER_STATUS.BLOCKED}>Blocked</option>
            </select>
                <div 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                  style={{ color: cliniFinesseTheme.textSecondary }}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
          </div>
        </div>

          {/* Enhanced Create User Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          onClick={onCreateUser}
            className="px-6 py-3 rounded-xl font-medium specimen-font-medium transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
            style={{ 
              backgroundColor: cliniFinesseTheme.primary, 
              color: '#ffffff',
              boxShadow: `0 4px 12px ${cliniFinesseTheme.primary}30`
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create User
          </motion.button>
          </div>
      </div>
    </motion.div>
  );
};

export default AdminFilters; 