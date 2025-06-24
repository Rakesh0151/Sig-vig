// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://signal-app-748522437054.us-central1.run.app',
  ENDPOINTS: {
    USERS: '/admin/users',
    CREATE_USER: '/admin/createuser',
    UPDATE_USER: (userId) => `/admin/users/${userId}`,
    UNBLOCK_USER: (userId) => `/admin/users/${userId}/unlock`,
  }
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  NORMAL: 'normal',
  ALL: 'all'
};

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  BLOCKED: 'blocked',
  PENDING: 'pending',
  ALL: 'all'
};

// Sort Directions
export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc'
};

// Default Sort Configuration
export const DEFAULT_SORT = {
  FIELD: 'created_at',
  DIRECTION: SORT_DIRECTIONS.DESC
};

// Form Default Values
export const FORM_DEFAULTS = {
  CREATE_USER: {
    email: '',
    user_role: USER_ROLES.NORMAL
  },
  EDIT_USER: {
    username: '',
    user_role: '',
    password: ''
  }
};

// Table Configuration
export const TABLE_CONFIG = {
  SORTABLE_FIELDS: ['username', 'user_role', 'created_at', 'lastlogged_in'],
  ITEMS_PER_PAGE: 10
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#57c1ef',
  SECONDARY: '#ee3739',
  SUCCESS: '#4caf50',
  WARNING: '#ffc107',
  ERROR: '#f44336'
};

// Status Colors Configuration
export const STATUS_COLORS = {
  [USER_STATUS.ACTIVE]: {
    bg: `${THEME_COLORS.SUCCESS}15`,
    text: THEME_COLORS.SUCCESS
  },
  [USER_STATUS.BLOCKED]: {
    bg: `${THEME_COLORS.SECONDARY}15`,
    text: THEME_COLORS.SECONDARY
  },
  [USER_STATUS.PENDING]: {
    bg: `${THEME_COLORS.WARNING}15`,
    text: THEME_COLORS.WARNING
  }
};

// Role Colors Configuration
export const ROLE_COLORS = {
  [USER_ROLES.ADMIN]: {
    bg: `${THEME_COLORS.PRIMARY}15`,
    text: THEME_COLORS.PRIMARY
  },
  [USER_ROLES.NORMAL]: {
    bg: `${THEME_COLORS.SUCCESS}15`,
    text: THEME_COLORS.SUCCESS
  }
};

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully!',
  USER_UPDATED: 'User updated successfully!',
  USER_UNBLOCKED: 'User unblocked successfully!'
};

// Error Messages
export const ERROR_MESSAGES = {
  FETCH_USERS: 'Failed to fetch users',
  UPDATE_USER: 'Failed to update user. Please try again.',
  UNBLOCK_USER: 'Failed to unblock user. Please try again.',
  CREATE_USER: 'Failed to create user. Please try again.',
  ACCESS_DENIED: 'You do not have access to this feature. Showing demo data for reference. Contact your administrator for access.'
};

// Modal Configuration
export const MODAL_CONFIG = {
  ANIMATION: {
    INITIAL: { scale: 0.9, opacity: 0 },
    ANIMATE: { scale: 1, opacity: 1 },
    EXIT: { scale: 0.9, opacity: 0 }
  },
  OVERLAY_STYLE: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
};

// Date Format Configuration
export const DATE_CONFIG = {
  LOCALE: 'en-US',
  OPTIONS: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  },
  FALLBACK: 'Never',
  INVALID: 'Invalid Date'
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    REQUIRED: 'Please enter an email address',
    INVALID: 'Please enter a valid email address'
  },
  USERNAME: {
    REQUIRED: 'Username is required',
    MIN_LENGTH: 3,
    MAX_LENGTH: 50
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    OPTIONAL: 'Leave blank to keep current password'
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'Access-Token',
  THEME: 'clinfinesse-theme'
};

// Route Paths
export const ROUTES = {
  ADMIN_DASHBOARD: '/admin-dashboard',
  DASHBOARD: '/dashboard',
  LOGIN: '/login'
}; 