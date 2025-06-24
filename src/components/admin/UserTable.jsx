import React from 'react';
import { motion } from 'framer-motion';
import { formatDate, getStatusColor, getRoleColor } from '../../utils/adminUtils';
import { useTheme } from '../ThemeProvider';
import { THEME_COLORS, USER_STATUS } from '../../constants/adminConstants';

const UserTable = ({ 
  users, 
  sortField, 
  sortDirection, 
  onSort, 
  onEditUser, 
  onUnblockUser, 
  unblockLoading 
}) => {
  const { theme } = useTheme();
  const cliniFinesseTheme = {
    primary: THEME_COLORS.PRIMARY,
    secondary: THEME_COLORS.SECONDARY,
    success: THEME_COLORS.SUCCESS,
    background: theme === 'dark' ? '#1a1a1a' : '#f8f9fa',
    textPrimary: theme === 'dark' ? '#ffffff' : '#2c3e50',
    textSecondary: theme === 'dark' ? '#b0b0b0' : '#6c757d',
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b" style={{ borderColor: `${cliniFinesseTheme.textSecondary}20` }}>
            <th className="text-left py-4 px-6 font-medium specimen-font-medium" style={{ color: cliniFinesseTheme.textPrimary }}>
              <button 
                onClick={() => onSort('username')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                Username {getSortIcon('username')}
              </button>
            </th>
            <th className="text-left py-4 px-6 font-medium specimen-font-medium" style={{ color: cliniFinesseTheme.textPrimary }}>
              <button 
                onClick={() => onSort('user_role')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                Role {getSortIcon('user_role')}
              </button>
            </th>
            <th className="text-left py-4 px-6 font-medium specimen-font-medium" style={{ color: cliniFinesseTheme.textPrimary }}>
              <button 
                onClick={() => onSort('created_at')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                Created {getSortIcon('created_at')}
              </button>
            </th>
            <th className="text-left py-4 px-6 font-medium specimen-font-medium" style={{ color: cliniFinesseTheme.textPrimary }}>
              <button 
                onClick={() => onSort('lastlogged_in')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                Last Login {getSortIcon('lastlogged_in')}
              </button>
            </th>
            <th className="text-left py-4 px-6 font-medium specimen-font-medium" style={{ color: cliniFinesseTheme.textPrimary }}>
              Status
            </th>
            <th className="text-left py-4 px-6 font-medium specimen-font-medium" style={{ color: cliniFinesseTheme.textPrimary }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const statusColor = getStatusColor(user.login_attempts > 0 ? USER_STATUS.BLOCKED : USER_STATUS.ACTIVE, theme);
            const roleColor = getRoleColor(user.user_role, theme);
            
            return (
              <motion.tr
                key={user.uniqueid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b hover:bg-opacity-50 transition-colors"
                style={{ 
                  borderColor: `${cliniFinesseTheme.textSecondary}10`,
                  backgroundColor: index % 2 === 0 ? `${cliniFinesseTheme.background}` : `${cliniFinesseTheme.textSecondary}05`
                }}
              >
                <td className="py-4 px-6">
                  <div>
                    <div className="font-medium specimen-font-medium" style={{ color: cliniFinesseTheme.textPrimary }}>
                      {user.username}
                    </div>
                    <div className="text-sm" style={{ color: cliniFinesseTheme.textSecondary }}>
                      {user.email}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium specimen-font-medium"
                    style={{ 
                      backgroundColor: roleColor.bg,
                      color: roleColor.text
                    }}
                  >
                    {user.user_role}
                  </span>
                </td>
                <td className="py-4 px-6" style={{ color: cliniFinesseTheme.textSecondary }}>
                  {formatDate(user.created_at)}
                </td>
                <td className="py-4 px-6" style={{ color: cliniFinesseTheme.textSecondary }}>
                  {formatDate(user.lastlogged_in)}
                </td>
                <td className="py-4 px-6">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium specimen-font-medium"
                    style={{ 
                      backgroundColor: statusColor.bg,
                      color: statusColor.text
                    }}
                  >
                    {user.login_attempts > 0 ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditUser(user)}
                      className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
                      style={{ backgroundColor: `${cliniFinesseTheme.primary}15` }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: cliniFinesseTheme.primary }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    {user.login_attempts > 0 && (
                      <button
                        onClick={() => onUnblockUser(user.uniqueid)}
                        disabled={unblockLoading}
                        className="p-2 rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50"
                        style={{ backgroundColor: `${cliniFinesseTheme.success}15` }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: cliniFinesseTheme.success }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable; 