import { useState, useCallback } from 'react';
import {
  API_CONFIG,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES
} from '../constants/adminConstants';

export const useAdminApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = useCallback(() => {
    setError('');
    setSuccessMessage('');
  }, []);

  const getAuthHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('Access-Token')}`
  }), []);

  const parseUsersResponse = useCallback((responseText) => {
    const data = JSON.parse(responseText);
    if (Array.isArray(data)) {
      return data;
    } else if (data.users && Array.isArray(data.users)) {
      return data.users;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    clearMessages();
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.FETCH_USERS);
      }

      const responseText = await response.text();
      return parseUsersResponse(responseText);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || ERROR_MESSAGES.FETCH_USERS);
      return [];
    } finally {
      setLoading(false);
    }
  }, [clearMessages, getAuthHeaders, parseUsersResponse]);

  const updateUser = useCallback(async (userId, updateData) => {
    setLoading(true);
    clearMessages();
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPDATE_USER(userId)}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.UPDATE_USER);
      }

      setSuccessMessage(SUCCESS_MESSAGES.USER_UPDATED);
      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      setError(ERROR_MESSAGES.UPDATE_USER);
      return false;
    } finally {
      setLoading(false);
    }
  }, [clearMessages, getAuthHeaders]);

  const unblockUser = useCallback(async (userId) => {
    setLoading(true);
    clearMessages();
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UNBLOCK_USER(userId)}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.UNBLOCK_USER);
      }

      setSuccessMessage(SUCCESS_MESSAGES.USER_UNBLOCKED);
      return true;
    } catch (err) {
      console.error('Error unblocking user:', err);
      setError(ERROR_MESSAGES.UNBLOCK_USER);
      return false;
    } finally {
      setLoading(false);
    }
  }, [clearMessages, getAuthHeaders]);

  const createUser = useCallback(async (userData) => {
    setLoading(true);
    clearMessages();
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CREATE_USER}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || ERROR_MESSAGES.CREATE_USER);
      }

      setSuccessMessage(SUCCESS_MESSAGES.USER_CREATED);
      return true;
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.message || ERROR_MESSAGES.CREATE_USER);
      return false;
    } finally {
      setLoading(false);
    }
  }, [clearMessages, getAuthHeaders]);

  return {
    loading,
    error,
    successMessage,
    clearMessages,
    fetchUsers,
    updateUser,
    unblockUser,
    createUser
  };
}; 