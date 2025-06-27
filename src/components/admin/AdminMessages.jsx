import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeProvider';
import { THEME_COLORS, ERROR_MESSAGES } from '../../constants/adminConstants';

const AdminMessages = ({ successMessage, error, onClearSuccess, onClearError }) => {
  const { theme } = useTheme();
  const cliniFinesseTheme = {
    success: THEME_COLORS.SUCCESS,
    secondary: THEME_COLORS.SECONDARY,
  };

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        onClearSuccess();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, onClearSuccess]);

  // Auto-dismiss error message after 5 seconds (only if it's not an access denied error)
  useEffect(() => {
    if (error && !error.includes('do not have access')) {
      const timer = setTimeout(() => {
        onClearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, onClearError]);

  return (
    <AnimatePresence mode="wait">
      {/* Success Message */}
      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="mb-6 overflow-hidden"
        >
          <div
            className="p-4 rounded-xl border backdrop-blur-sm"
          style={{
            backgroundColor: `${cliniFinesseTheme.success}10`,
            borderColor: cliniFinesseTheme.success,
              color: cliniFinesseTheme.success,
              boxShadow: `0 4px 12px ${cliniFinesseTheme.success}20`
          }}
        >
          <div className="flex items-center gap-3">
              <motion.svg 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-5 h-5 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </motion.svg>
              <motion.span 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-medium specimen-font-medium"
              >
                {successMessage}
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="mb-6 overflow-hidden"
        >
          <div
            className="p-4 rounded-xl border backdrop-blur-sm"
          style={{
            backgroundColor: `${cliniFinesseTheme.secondary}10`,
            borderColor: cliniFinesseTheme.secondary,
              color: cliniFinesseTheme.secondary,
              boxShadow: `0 4px 12px ${cliniFinesseTheme.secondary}20`
          }}
        >
          <div className="flex items-center gap-3">
              <motion.svg 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-5 h-5 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </motion.svg>
            <div>
                <motion.span 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="font-medium specimen-font-medium"
                >
                  {error}
                </motion.span>
              {error.includes('do not have access') && (
                  <motion.p 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm mt-1 opacity-80"
                  >
                  {ERROR_MESSAGES.ACCESS_DENIED}
                  </motion.p>
              )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminMessages; 