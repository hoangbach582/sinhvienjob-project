import React, { createContext, useContext, useState, useEffect } from 'react';
import { jobService } from '../services/jobService';
import { useAuth } from './AuthContext';

const SavedJobsContext = createContext();

export const SavedJobsProvider = ({ children }) => {
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, userRole } = useAuth(); // Fix: use correct context values

  const fetchSavedJobs = async () => {
    if (isLoggedIn && userRole === 'student') {
      try {
        setLoading(true);
        const data = await jobService.getSavedJobs();
        // data.data because of Laravel pagination
        const ids = data.data.map(item => item.job_id);
        setSavedJobIds(ids);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setSavedJobIds([]);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, [isLoggedIn, userRole]);

  const toggleSave = async (jobId) => {
    if (!isLoggedIn || userRole !== 'student') return false;

    // Optimistic update
    const isCurrentlySaved = savedJobIds.includes(jobId);
    if (isCurrentlySaved) {
      setSavedJobIds(prev => prev.filter(id => id !== jobId));
    } else {
      setSavedJobIds(prev => [...prev, jobId]);
    }

    try {
      const response = await jobService.toggleSaveJob(jobId);
      // Sync with server response if needed, but optimistic usually enough
      return response.is_saved;
    } catch (error) {
      // Revert if error
      if (isCurrentlySaved) {
        setSavedJobIds(prev => [...prev, jobId]);
      } else {
        setSavedJobIds(prev => prev.filter(id => id !== jobId));
      }
      console.error('Error toggling save job:', error);
      throw error;
    }
  };

  const isSaved = (jobId) => savedJobIds.includes(jobId);

  return (
    <SavedJobsContext.Provider value={{ savedJobIds, toggleSave, isSaved, fetchSavedJobs, loading }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error('useSavedJobs must be used within a SavedJobsProvider');
  }
  return context;
};
