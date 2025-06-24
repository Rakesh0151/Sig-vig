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
    createUser 
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
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold specimen-font-bold mb-2" style={{ color: cliniFinesseTheme.textPrimary }}>
            Admin Dashboard
          </h1>
          <p className="text-lg" style={{ color: cliniFinesseTheme.textSecondary }}>
            Manage users and system access
          </p>
        </motion.div>

        {/* Messages */}
        <AdminMessages successMessage={successMessage} error={error} />

        {/* Filters */}
        <AdminFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onCreateUser={() => setIsCreateModalOpen(true)}
        />

        {/* User Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: cliniFinesseTheme.background,
            borderColor: `${cliniFinesseTheme.textSecondary}15`
          }}
        >
          <UserTable
            users={sortedUsers}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onEditUser={handleEditUser}
            onUnblockUser={handleUnblockUser}
            unblockLoading={loading}
          />
        </motion.div>

        {/* Edit User Modal */}
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

        {/* Create User Modal */}
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