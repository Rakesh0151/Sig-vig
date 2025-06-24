import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeProvider';
import { THEME_COLORS, ERROR_MESSAGES } from '../../constants/adminConstants';

const AdminMessages = ({ successMessage, error }) => {
  const { theme } = useTheme();
  const cliniFinesseTheme = {
    success: THEME_COLORS.SUCCESS,
    secondary: THEME_COLORS.SECONDARY,
  };

  return (
    <>
      {/* Success Message */}
      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl border"
          style={{
            backgroundColor: `${cliniFinesseTheme.success}10`,
            borderColor: cliniFinesseTheme.success,
            color: cliniFinesseTheme.success
          }}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium specimen-font-medium">{successMessage}</span>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl border"
          style={{
            backgroundColor: `${cliniFinesseTheme.secondary}10`,
            borderColor: cliniFinesseTheme.secondary,
            color: cliniFinesseTheme.secondary
          }}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <span className="font-medium specimen-font-medium">{error}</span>
              {error.includes('do not have access') && (
                <p className="text-sm mt-1 opacity-80">
                  {ERROR_MESSAGES.ACCESS_DENIED}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default AdminMessages; 