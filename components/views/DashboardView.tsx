'use client';

import { useAppStore } from '@/lib/store';
import { motion } from 'motion/react';
import { Bell, BookOpen, CheckSquare, Clock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export default function DashboardView({ onNavigate }: { onNavigate: (tab: any) => void }) {
  const { user, attendance, assignments } = useAppStore();
  const [greeting, setGreeting] = useState('');
  const [shakeColor, setShakeColor] = useState('bg-blue-600');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Accelerometer integration (Bonus feature requested)
  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    const threshold = 15; // Shake threshold

    const handleMotion = (event: DeviceMotionEvent) => {
      const { x, y, z } = event.accelerationIncludingGravity || {};
      if (x === null || y === null || z === null || x === undefined || y === undefined || z === undefined) return;

      const deltaX = Math.abs(x - lastX);
      const deltaY = Math.abs(y - lastY);
      const deltaZ = Math.abs(z - lastZ);

      if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
        // Shake detected! Change header color randomly
        const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-purple-600', 'bg-emerald-600', 'bg-rose-600'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setShakeColor(randomColor);
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    if (typeof window !== 'undefined' && window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      if (typeof window !== 'undefined' && window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, []);

  const totalClasses = attendance.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const attendedClasses = attendance.reduce((acc, curr) => acc + curr.attendedClasses, 0);
  const overallAttendance = totalClasses === 0 ? 0 : Math.round((attendedClasses / totalClasses) * 100);
  
  const pendingAssignments = assignments.filter(a => !a.completed).length;

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className={`${shakeColor} transition-colors duration-500 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-md`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-blue-100 text-sm font-medium">{format(new Date(), 'EEEE, MMMM d')}</p>
            <h1 className="text-2xl font-bold mt-1">{greeting}, {user?.name}</h1>
          </div>
          <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-blue-600"></span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-8 space-y-6">
        {/* Attendance Card */}
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('attendance')}
          className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Overall Attendance</h2>
            </div>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{overallAttendance}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 mb-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${overallAttendance}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-2.5 rounded-full ${overallAttendance < 75 ? 'bg-red-500' : 'bg-emerald-500'}`}
            ></motion.div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {overallAttendance < 75 ? 'Warning: Attendance below 75%' : 'Great job! Keep it up.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {/* Assignments Card */}
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('assignments')}
            className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-3">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Assignments</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{pendingAssignments} pending tasks</p>
          </motion.div>

          {/* Timetable Card */}
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('timetable')}
            className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Timetable</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">3 classes today</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 px-1">Upcoming Today</h3>
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex flex-col items-center justify-center text-blue-600 dark:text-blue-400">
                <span className="text-xs font-bold">10:00</span>
                <span className="text-[10px]">AM</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Mobile App Dev</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Room 302 • Lab Session</p>
              </div>
            </div>
            <div className="h-px bg-gray-100 dark:bg-gray-800 w-full"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex flex-col items-center justify-center text-blue-600 dark:text-blue-400">
                <span className="text-xs font-bold">01:30</span>
                <span className="text-[10px]">PM</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Database Systems</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Lecture Hall A</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
