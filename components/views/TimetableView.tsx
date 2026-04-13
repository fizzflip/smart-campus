'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const MOCK_TIMETABLE = {
  'Mon': [
    { id: 1, time: '09:00 AM', subject: 'Data Structures', room: 'Lab 1', type: 'Lab' },
    { id: 2, time: '11:00 AM', subject: 'Mobile App Dev', room: 'Room 302', type: 'Lecture' },
  ],
  'Tue': [
    { id: 3, time: '10:00 AM', subject: 'Database Systems', room: 'Hall A', type: 'Lecture' },
    { id: 4, time: '02:00 PM', subject: 'Software Eng.', room: 'Room 205', type: 'Lecture' },
  ],
  'Wed': [
    { id: 5, time: '09:00 AM', subject: 'Mobile App Dev', room: 'Lab 2', type: 'Lab' },
    { id: 6, time: '01:00 PM', subject: 'Data Structures', room: 'Room 101', type: 'Lecture' },
  ],
  'Thu': [
    { id: 7, time: '11:00 AM', subject: 'Database Systems', room: 'Lab 3', type: 'Lab' },
  ],
  'Fri': [
    { id: 8, time: '10:00 AM', subject: 'Software Eng.', room: 'Room 205', type: 'Lecture' },
    { id: 9, time: '02:00 PM', subject: 'Project Work', room: 'Lab 1', type: 'Lab' },
  ]
};

export default function TimetableView() {
  const [activeDay, setActiveDay] = useState('Mon');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate background sync service
    setTimeout(() => {
      setIsSyncing(false);
    }, 1500);
  };

  const todayClasses = MOCK_TIMETABLE[activeDay as keyof typeof MOCK_TIMETABLE] || [];

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950 p-6">
      <div className="flex justify-between items-center mb-6 pt-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timetable</h1>
        <button 
          onClick={handleSync}
          className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Day Selector */}
      <div className="flex justify-between mb-8 bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
              activeDay === day 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-800 space-y-8">
        {todayClasses.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No classes scheduled for {activeDay}.
          </div>
        ) : (
          todayClasses.map((cls, index) => (
            <motion.div 
              key={cls.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white dark:border-gray-950"></div>
              
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 ml-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">{cls.subject}</h3>
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                    cls.type === 'Lab' 
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {cls.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{cls.time}</span>
                  <span>•</span>
                  <span>{cls.room}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
