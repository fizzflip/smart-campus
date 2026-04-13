'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  Map as MapIcon, 
  Settings as SettingsIcon,
  BookOpen
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import AttendanceView from './views/AttendanceView';
import AssignmentsView from './views/AssignmentsView';
import TimetableView from './views/TimetableView';
import MapView from './views/MapView';
import SettingsView from './views/SettingsView';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'dashboard' | 'attendance' | 'assignments' | 'timetable' | 'map' | 'settings';

export default function AppShell() {
  const { user, settings } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Gyroscope integration for tab navigation (Bonus feature requested)
  useEffect(() => {
    let lastTilt = 0;
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const gamma = event.gamma; // Left/Right tilt
      if (gamma === null || gamma === undefined) return;
      
      // Simple threshold to switch tabs based on tilt
      if (gamma > 45 && lastTilt <= 45) {
        // Tilt right
        const tabs: Tab[] = ['dashboard', 'attendance', 'assignments', 'timetable', 'map', 'settings'];
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) {
          setActiveTab(tabs[currentIndex + 1]);
        }
      } else if (gamma < -45 && lastTilt >= -45) {
        // Tilt left
        const tabs: Tab[] = ['dashboard', 'attendance', 'assignments', 'timetable', 'map', 'settings'];
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex > 0) {
          setActiveTab(tabs[currentIndex - 1]);
        }
      }
      lastTilt = gamma;
    };

    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [activeTab]);

  if (!isMounted) return null;

  if (!user) {
    return <LoginView />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView onNavigate={setActiveTab} />;
      case 'attendance': return <AttendanceView />;
      case 'assignments': return <AssignmentsView />;
      case 'timetable': return <TimetableView />;
      case 'map': return <MapView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView onNavigate={setActiveTab} />;
    }
  };

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'attendance', icon: BookOpen, label: 'Attendance' },
    { id: 'assignments', icon: CheckSquare, label: 'Tasks' },
    { id: 'timetable', icon: Calendar, label: 'Schedule' },
    { id: 'map', icon: MapIcon, label: 'Map' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ] as const;

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-white dark:bg-gray-950 shadow-2xl relative">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-2 py-2 pb-safe">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={cn(
                  "flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200",
                  isActive 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <div className="relative">
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"
                    />
                  )}
                </div>
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
