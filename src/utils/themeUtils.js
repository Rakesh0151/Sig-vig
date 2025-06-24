// Theme utility function to create cliniFinesseTheme object
export const createCliniFinesseTheme = (theme) => {
  return {
    primary: '#57c1ef',
    secondary: '#ee3739',
    background: theme === 'dark' ? '#1a1a1a' : '#f8f9fa',
    surface: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    surfaceHover: theme === 'dark' ? '#353535' : '#f0f0f0',
    border: theme === 'dark' ? '#404040' : '#e1e5e9',
    text: theme === 'dark' ? '#ffffff' : '#2c3e50',
    textPrimary: theme === 'dark' ? '#ffffff' : '#2c3e50',
    textSecondary: theme === 'dark' ? '#b0b0b0' : '#6c757d',
    warning: '#ffc107',
    success: '#4caf50',
    shadow: theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)',
  };
}; 