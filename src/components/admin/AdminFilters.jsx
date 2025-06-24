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
      className="mb-6 p-6 rounded-2xl border"
      style={{
        backgroundColor: cliniFinesseTheme.background,
        borderColor: `${cliniFinesseTheme.textSecondary}15`
      }}
    >
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: cliniFinesseTheme.background,
                  borderColor: `${cliniFinesseTheme.textSecondary}20`,
                  color: cliniFinesseTheme.textPrimary,
                  focusRingColor: cliniFinesseTheme.primary
                }}
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: cliniFinesseTheme.textSecondary }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Role Filter */}
          <div className="sm:w-40">
            <select
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2"
              style={{
                backgroundColor: cliniFinesseTheme.background,
                borderColor: `${cliniFinesseTheme.textSecondary}20`,
                color: cliniFinesseTheme.textPrimary,
                focusRingColor: cliniFinesseTheme.primary
              }}
            >
              <option value={USER_ROLES.ALL}>All Roles</option>
              <option value={USER_ROLES.NORMAL}>Normal</option>
              <option value={USER_ROLES.ADMIN}>Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:w-40">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2"
              style={{
                backgroundColor: cliniFinesseTheme.background,
                borderColor: `${cliniFinesseTheme.textSecondary}20`,
                color: cliniFinesseTheme.textPrimary,
                focusRingColor: cliniFinesseTheme.primary
              }}
            >
              <option value={USER_STATUS.ALL}>All Status</option>
              <option value={USER_STATUS.ACTIVE}>Active</option>
              <option value={USER_STATUS.BLOCKED}>Blocked</option>
            </select>
          </div>
        </div>

        {/* Create User Button */}
        <button
          onClick={onCreateUser}
          className="px-6 py-3 rounded-xl font-medium specimen-font-medium transition-colors hover:bg-opacity-90"
          style={{ backgroundColor: cliniFinesseTheme.primary, color: '#ffffff' }}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create User
          </div>
        </button>
      </div>
    </motion.div>
  );
};

export default AdminFilters; 