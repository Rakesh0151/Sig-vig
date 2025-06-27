import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { useAdminApi } from '../hooks/useAdminApi';
import { sortUsers, filterUsers } from '../utils/adminUtils';
import AdminMessages from '../components/admin/AdminMessages';
import AdminFilters from '../components/admin/AdminFilters';
import UserTable from '../components/admin/UserTable';
import EditUserModal from '../components/admin/EditUserModal';
import CreateUserModal from '../components/admin/CreateUserModal';
import {
  USER_ROLES,
  USER_STATUS,
  ROUTES,
  FORM_DEFAULTS,
  DEFAULT_SORT
} from '../constants/adminConstants';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [sortField, setSortField] = useState(DEFAULT_SORT.FIELD);
  const [sortDirection, setSortDirection] = useState(DEFAULT_SORT.DIRECTION);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState(USER_ROLES.ALL);
  const [statusFilter, setStatusFilter] = useState(USER_STATUS.ALL);
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form states
  const [editFormData, setEditFormData] = useState(FORM_DEFAULTS.EDIT_USER);
  const [createFormData, setCreateFormData] = useState(FORM_DEFAULTS.CREATE_USER);

  // Theme configuration
  const cliniFinesseTheme = {
    primary: '#57c1ef',
    secondary: '#ee3739',
    background: theme === 'dark' ? '#1a1a1a' : '#f8f9fa',
    textPrimary: theme === 'dark' ? '#ffffff' : '#2c3e50',
    textSecondary: theme === 'dark' ? '#b0b0b0' : '#6c757d',
  };

  // API hook
  const { 
    loading, 
    error, 
    successMessage, 
    fetchUsers, 
    updateUser, 
    unblockUser, 
    createUser,
    deleteUser 
  } = useAdminApi();

  // Check admin access
  useEffect(() => {
    if (user?.userRole !== USER_ROLES.ADMIN) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [navigate, user?.userRole]);

  // Fetch users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const usersData = await fetchUsers();
    if (usersData.length > 0) {
      setUsers(usersData);
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      username: user.username,
      user_role: user.user_role,
      password: ''
    });
    setIsEditModalOpen(true);
  };

  // Handle update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    const updateData = {
      username: editFormData.username,
      user_role: editFormData.user_role
    };

    if (editFormData.password.trim()) {
      updateData.password = editFormData.password;
    }

    const success = await updateUser(selectedUser.uniqueid, updateData);
    if (success) {
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.uniqueid === selectedUser.uniqueid 
            ? { ...user, username: editFormData.username, user_role: editFormData.user_role }
            : user
        )
      );
      
      // Close modal and reset form
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setEditFormData(FORM_DEFAULTS.EDIT_USER);
    }
  };

  // Handle unblock user
  const handleUnblockUser = async (userId) => {
    const success = await unblockUser(userId);
    if (success) {
      await loadUsers(); // Refresh the list
    }
  };

  // Handle create user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!createFormData.email.trim()) {
      return;
    }

    const success = await createUser({
      email: createFormData.email,
      user_role: createFormData.user_role
    });

    if (success) {
      // Reset form and close modal
      setCreateFormData(FORM_DEFAULTS.CREATE_USER);
      setIsCreateModalOpen(false);
      
      // Refresh the users list
      await loadUsers();
    }
  };

  // Handle form changes
  const handleEditFormChange = (e) => {
    setEditFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCreateFormChange = (e) => {
    setCreateFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    const success = await deleteUser(userId);
    if (success) {
      // Remove user from local state
      setUsers(prevUsers => prevUsers.filter(user => user.uniqueid !== userId));
    }
  };

  // Filter and sort users
  const filteredUsers = filterUsers(users, searchTerm, roleFilter, statusFilter);
  const sortedUsers = sortUsers(filteredUsers, sortField, sortDirection);

  if (loading && users.length === 0) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center transition-colors duration-200 pt-16"
        style={{ backgroundColor: cliniFinesseTheme.background }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-t-transparent rounded-full"
          style={{ borderColor: cliniFinesseTheme.primary }}
        />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen transition-colors duration-200 pt-24 pb-8 sm:pt-28 md:pt-32"
      style={{ backgroundColor: cliniFinesseTheme.background }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
          <h1 className="text-3xl font-bold specimen-font-bold mb-2" style={{ color: cliniFinesseTheme.textPrimary }}>
            Admin Dashboard
          </h1>
          <p className="text-lg" style={{ color: cliniFinesseTheme.textSecondary }}>
            Manage users and system access
          </p>
            </div>
            <div className="flex items-center gap-3">
              <div 
                className="px-4 py-2 rounded-xl text-sm font-medium specimen-font-medium"
                style={{ 
                  backgroundColor: `${cliniFinesseTheme.primary}15`,
                  color: cliniFinesseTheme.primary
                }}
              >
                Total Users: {users.length}
              </div>
              <div 
                className="px-4 py-2 rounded-xl text-sm font-medium specimen-font-medium"
                style={{ 
                  backgroundColor: `${cliniFinesseTheme.primary}15`,
                  color: cliniFinesseTheme.primary
                }}
              >
                Active: {users.filter(u => !u.login_attempts).length}
              </div>
              <div 
                className="px-4 py-2 rounded-xl text-sm font-medium specimen-font-medium"
                style={{ 
                  backgroundColor: `${cliniFinesseTheme.secondary}15`,
                  color: cliniFinesseTheme.secondary
                }}
              >
                Blocked: {users.filter(u => u.login_attempts > 0).length}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Messages with enhanced styling */}
        <div className="mb-6">
        <AdminMessages 
          successMessage={successMessage} 
          error={error}
          onClearSuccess={() => setSuccessMessage('')}
          onClearError={() => setError('')}
        />
        </div>

        {/* Statistics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Total Users Card */}
          <div 
            className="p-6 rounded-2xl border relative overflow-hidden"
            style={{
              backgroundColor: cliniFinesseTheme.background,
              borderColor: `${cliniFinesseTheme.primary}30`,
              boxShadow: `0 4px 20px ${cliniFinesseTheme.primary}10`
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium specimen-font-medium mb-1" style={{ color: cliniFinesseTheme.textSecondary }}>
                  Total Users
                </p>
                <h3 className="text-2xl font-bold specimen-font-bold" style={{ color: cliniFinesseTheme.primary }}>
                  {users.length}
                </h3>
              </div>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${cliniFinesseTheme.primary}15` }}
              >
                <svg className="w-5 h-5" fill="none" stroke={cliniFinesseTheme.primary} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Users Card */}
          <div 
            className="p-6 rounded-2xl border relative overflow-hidden"
            style={{
              backgroundColor: cliniFinesseTheme.background,
              borderColor: `${cliniFinesseTheme.primary}30`,
              boxShadow: `0 4px 20px ${cliniFinesseTheme.primary}10`
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium specimen-font-medium mb-1" style={{ color: cliniFinesseTheme.textSecondary }}>
                  Active Users
                </p>
                <h3 className="text-2xl font-bold specimen-font-bold" style={{ color: cliniFinesseTheme.primary }}>
                  {users.filter(u => !u.login_attempts).length}
                </h3>
              </div>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${cliniFinesseTheme.primary}15` }}
              >
                <svg className="w-5 h-5" fill="none" stroke={cliniFinesseTheme.primary} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Today Card */}
          <div 
            className="p-6 rounded-2xl border relative overflow-hidden"
            style={{
              backgroundColor: cliniFinesseTheme.background,
              borderColor: `${cliniFinesseTheme.primary}30`,
              boxShadow: `0 4px 20px ${cliniFinesseTheme.primary}10`
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium specimen-font-medium mb-1" style={{ color: cliniFinesseTheme.textSecondary }}>
                  Active Today
                </p>
                <h3 className="text-2xl font-bold specimen-font-bold" style={{ color: cliniFinesseTheme.primary }}>
                  {users.filter(u => u.lastlogged_in && new Date(u.lastlogged_in) > new Date(Date.now() - 24*60*60*1000)).length}
                </h3>
              </div>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${cliniFinesseTheme.primary}15` }}
              >
                <svg className="w-5 h-5" fill="none" stroke={cliniFinesseTheme.primary} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-xs" style={{ color: cliniFinesseTheme.textSecondary }}>
              Users who logged in within the last 24 hours
            </div>
          </div>

          {/* Blocked Users Card */}
          <div 
            className="p-6 rounded-2xl border relative overflow-hidden"
            style={{
              backgroundColor: cliniFinesseTheme.background,
              borderColor: `${cliniFinesseTheme.secondary}30`,
              boxShadow: `0 4px 20px ${cliniFinesseTheme.secondary}10`
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium specimen-font-medium mb-1" style={{ color: cliniFinesseTheme.textSecondary }}>
                  Blocked Users
                </p>
                <h3 className="text-2xl font-bold specimen-font-bold" style={{ color: cliniFinesseTheme.secondary }}>
                  {users.filter(u => u.login_attempts > 0).length}
                </h3>
              </div>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${cliniFinesseTheme.secondary}15` }}
              >
                <svg className="w-5 h-5" fill="none" stroke={cliniFinesseTheme.secondary} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-xs" style={{ color: cliniFinesseTheme.textSecondary }}>
              Users who are locked out due to failed login attempts
            </div>
          </div>
        </motion.div>

        {/* Enhanced Filters */}
        <div className="mb-6">
        <AdminFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onCreateUser={() => setIsCreateModalOpen(true)}
        />
        </div>

        {/* Enhanced User Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border overflow-hidden shadow-lg"
          style={{
            backgroundColor: cliniFinesseTheme.background,
            borderColor: `${cliniFinesseTheme.textSecondary}15`,
            boxShadow: `0 4px 20px ${cliniFinesseTheme.textSecondary}10`
          }}
        >
          <UserTable
            users={sortedUsers}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onEditUser={handleEditUser}
            onUnblockUser={handleUnblockUser}
            onDeleteUser={handleDeleteUser}
            unblockLoading={loading}
          />
        </motion.div>

        {/* Modals */}
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
            setEditFormData(FORM_DEFAULTS.EDIT_USER);
          }}
          user={selectedUser}
          formData={editFormData}
          onFormChange={handleEditFormChange}
          onSubmit={handleUpdateUser}
          loading={loading}
        />

        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setCreateFormData(FORM_DEFAULTS.CREATE_USER);
          }}
          formData={createFormData}
          onFormChange={handleCreateFormChange}
          onSubmit={handleCreateUser}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AdminDashboard; 