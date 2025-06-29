import { useEffect, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useNavigationPrompt(shouldBlock) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDialog, setShowDialog] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);

  const handleBeforeUnload = useCallback((event) => {
    if (shouldBlock) {
      event.preventDefault();
      event.returnValue = '';
      return '';
    }
  }, [shouldBlock]);

  const handleUserConfirm = useCallback(() => {
    setShowDialog(false);
    if (pendingLocation) {
      navigate(pendingLocation);
      setPendingLocation(null);
    }
  }, [navigate, pendingLocation]);

  useEffect(() => {
    if (!shouldBlock) return;

    // Handle browser back/forward buttons and tab close
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Handle history changes (back/forward buttons)
    const unblock = window.history.pushState(null, '', location.pathname);
    const handlePopState = (event) => {
      if (shouldBlock) {
        // Prevent the immediate navigation
        event.preventDefault();
        window.history.pushState(null, '', location.pathname);
        
        // Show our custom dialog
        setPendingLocation(-1); // -1 means go back
        setShowDialog(true);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [shouldBlock, location.pathname, handleBeforeUnload]);

  return {
    showDialog,
    onConfirm: handleUserConfirm,
    onCancel: () => {
      setShowDialog(false);
      setPendingLocation(null);
    }
  };
} 