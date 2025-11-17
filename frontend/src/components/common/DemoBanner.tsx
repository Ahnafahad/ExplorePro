/**
 * Demo Banner - Shows at the top of the screen in demo mode
 */

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { X, RotateCcw, LogOut, Users } from 'lucide-react';

const DemoBanner: React.FC = () => {
  const { isDemoMode, resetDemo, exitDemoMode, currentUser } = useDemo();

  if (!isDemoMode) {
    return null;
  }

  const getRoleColor = () => {
    switch (currentUser?.role) {
      case 'TOURIST':
        return 'bg-blue-600';
      case 'GUIDE':
        return 'bg-green-600';
      case 'ADMIN':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getRoleBadge = () => {
    switch (currentUser?.role) {
      case 'TOURIST':
        return '🧳 Tourist Demo';
      case 'GUIDE':
        return '🎒 Guide Demo';
      case 'ADMIN':
        return '👔 Admin Demo';
      default:
        return 'Demo Mode';
    }
  };

  return (
    <div className={`${getRoleColor()} text-white shadow-lg fixed top-0 left-0 right-0 z-50`}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎭</span>
              <div>
                <div className="font-semibold text-sm">
                  {getRoleBadge()}
                </div>
                <div className="text-xs opacity-90">
                  No charges will be made • All data is simulated
                </div>
              </div>
            </div>

            {currentUser && (
              <div className="hidden md:flex items-center gap-2 text-xs opacity-90">
                <Users className="w-3 h-3" />
                <span>Logged in as: {currentUser.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetDemo}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-xs font-medium transition-colors"
              title="Reset all demo data"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            <button
              onClick={exitDemoMode}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-xs font-medium transition-colors"
              title="Exit demo mode"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Exit Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoBanner;
