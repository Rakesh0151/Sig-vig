import {
  USER_STATUS,
  USER_ROLES,
  STATUS_COLORS,
  ROLE_COLORS,
  DATE_CONFIG
} from '../constants/adminConstants';

export const formatDate = (dateString) => {
  if (!dateString) return DATE_CONFIG.FALLBACK;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return DATE_CONFIG.INVALID;
    
    return date.toLocaleString(DATE_CONFIG.LOCALE, DATE_CONFIG.OPTIONS);
  } catch (error) {
    return DATE_CONFIG.INVALID;
  }
};

export const getStatusColor = (status, theme) => {
  const statusKey = status?.toLowerCase();
  
  if (STATUS_COLORS[statusKey]) {
    return STATUS_COLORS[statusKey];
  }
  
  // Fallback for theme-specific colors
  const cliniFinesseTheme = {
    textSecondary: theme === 'dark' ? '#b0b0b0' : '#6c757d',
  };
  
  return { 
    bg: `${cliniFinesseTheme.textSecondary}15`, 
    text: cliniFinesseTheme.textSecondary 
  };
};

export const getRoleColor = (role, theme) => {
  const roleKey = role?.toLowerCase();
  
  if (ROLE_COLORS[roleKey]) {
    return ROLE_COLORS[roleKey];
  }
  
  // Fallback for theme-specific colors
  const cliniFinesseTheme = {
    textSecondary: theme === 'dark' ? '#b0b0b0' : '#6c757d',
  };
  
  return { 
    bg: `${cliniFinesseTheme.textSecondary}15`, 
    text: cliniFinesseTheme.textSecondary 
  };
};

export const sortUsers = (users, sortField, sortDirection) => {
  return [...users].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle date sorting
    if (sortField === 'created_at' || sortField === 'lastlogged_in') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }

    // Handle string sorting
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterUsers = (users, searchTerm, roleFilter, statusFilter) => {
  return users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !roleFilter || roleFilter === USER_ROLES.ALL || user.user_role === roleFilter;
    const matchesStatus = !statusFilter || statusFilter === USER_STATUS.ALL || 
      (statusFilter === USER_STATUS.BLOCKED ? user.login_attempts > 0 : user.login_attempts === 0);
    
    return matchesSearch && matchesRole && matchesStatus;
  });
}; 