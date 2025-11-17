/**
 * Demo Context - Manages demo mode state and provides demo utilities
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import demoService from '@/services/demoService';

interface DemoContextType {
  isDemoMode: boolean;
  currentUser: any;
  demoAccounts: {
    tourist: string;
    guide: string;
    admin: string;
  };
  switchDemoAccount: (accountType: 'tourist' | 'guide' | 'admin') => Promise<void>;
  resetDemo: () => void;
  exitDemoMode: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const demoAccounts = {
    tourist: 'demo-tourist@explorepro.com',
    guide: 'demo-guide@explorepro.com',
    admin: 'demo-admin@explorepro.com',
  };

  // Check demo mode on mount
  useEffect(() => {
    const user = demoService.getCurrentDemoUser();
    if (user) {
      setIsDemoMode(true);
      setCurrentUser(user);
    }
  }, []);

  const switchDemoAccount = async (accountType: 'tourist' | 'guide' | 'admin') => {
    try {
      const email = demoAccounts[accountType];
      const response = await demoService.auth.login(email, 'demo123');

      if (response.success) {
        setIsDemoMode(true);
        setCurrentUser(response.data.user);
        // Reload to refresh UI
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to switch demo account:', error);
    }
  };

  const resetDemo = () => {
    if (window.confirm('Reset all demo data? This will clear all changes you made in demo mode.')) {
      demoService.resetDemoData();
    }
  };

  const exitDemoMode = () => {
    if (window.confirm('Exit demo mode? You will be logged out.')) {
      demoService.auth.logout();
      setIsDemoMode(false);
      setCurrentUser(null);
      window.location.href = '/';
    }
  };

  const value = {
    isDemoMode,
    currentUser,
    demoAccounts,
    switchDemoAccount,
    resetDemo,
    exitDemoMode,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};

export default DemoContext;
