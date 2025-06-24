import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeProvider';
import { USER_ROLES, THEME_COLORS } from '../../constants/adminConstants';

const CreateUserModal = ({ 
  isOpen, 
  onClose, 
  formData, 
  onFormChange, 
  onSubmit, 
  loading 
}) => {
  const { theme } = useTheme();
  const cliniFinesseTheme = {
    primary: THEME_COLORS.PRIMARY,
    background: theme === 'dark' ? '#1a1a1a' : '#f8f9fa',
    textPrimary: theme === 'dark' ? '#ffffff' : '#2c3e50',
    textSecondary: theme === 'dark' ? '#b0b0b0' : '#6c757d',
  };

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
          className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
          style={{ backgroundColor: cliniFinesseTheme.background }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold specimen-font-bold" style={{ color: cliniFinesseTheme.textPrimary }}>
              Create New User
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
              style={{ backgroundColor: `${cliniFinesseTheme.textSecondary}15` }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: cliniFinesseTheme.textSecondary }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium specimen-font-medium mb-2" style={{ color: cliniFinesseTheme.textPrimary }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onFormChange}
                className="w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: cliniFinesseTheme.background,
                  borderColor: `${cliniFinesseTheme.textSecondary}20`,
                  color: cliniFinesseTheme.textPrimary,
                  focusRingColor: cliniFinesseTheme.primary
                }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium specimen-font-medium mb-2" style={{ color: cliniFinesseTheme.textPrimary }}>
                Role
              </label>
              <select
                name="user_role"
                value={formData.user_role}
                onChange={onFormChange}
                className="w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: cliniFinesseTheme.background,
                  borderColor: `${cliniFinesseTheme.textSecondary}20`,
                  color: cliniFinesseTheme.textPrimary,
                  focusRingColor: cliniFinesseTheme.primary
                }}
                required
              >
                <option value={USER_ROLES.NORMAL}>Normal</option>
                <option value={USER_ROLES.ADMIN}>Admin</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl border transition-colors hover:bg-opacity-80"
                style={{
                  backgroundColor: cliniFinesseTheme.background,
                  borderColor: `${cliniFinesseTheme.textSecondary}20`,
                  color: cliniFinesseTheme.textSecondary
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl font-medium specimen-font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: cliniFinesseTheme.primary, color: '#ffffff' }}
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateUserModal; 