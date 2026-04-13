'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { motion } from 'motion/react';
import { Plus, Minus, BookOpen } from 'lucide-react';

export default function AttendanceView() {
  const { attendance, updateAttendance, addAttendance } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newSubject, setNewSubject] = useState('');

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubject.trim()) {
      addAttendance({
        subject: newSubject,
        totalClasses: 0,
        attendedClasses: 0
      });
      setNewSubject('');
      setShowAdd(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950 p-6">
      <div className="flex justify-between items-center mb-6 pt-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showAdd && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6"
          onSubmit={handleAddSubject}
        >
          <input
            type="text"
            placeholder="Subject Name"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none mb-3"
            autoFocus
          />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-medium">Add</button>
            <button type="button" onClick={() => setShowAdd(false)} className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 rounded-xl font-medium">Cancel</button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {attendance.map((record) => {
          const percentage = record.totalClasses === 0 ? 0 : Math.round((record.attendedClasses / record.totalClasses) * 100);
          const isWarning = percentage < 75;

          return (
            <motion.div 
              key={record.id}
              layout
              className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{record.subject}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {record.attendedClasses} / {record.totalClasses} Classes
                    </p>
                  </div>
                </div>
                <span className={`text-xl font-bold ${isWarning ? 'text-red-500' : 'text-emerald-500'}`}>
                  {percentage}%
                </span>
              </div>

              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-4 overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${isWarning ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center gap-4">
                <div className="flex gap-2 flex-1">
                  <button 
                    onClick={() => updateAttendance(record.id, record.attendedClasses + 1, record.totalClasses + 1)}
                    className="flex-1 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-medium text-sm flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Present
                  </button>
                  <button 
                    onClick={() => updateAttendance(record.id, record.attendedClasses, record.totalClasses + 1)}
                    className="flex-1 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium text-sm flex items-center justify-center gap-1"
                  >
                    <Minus className="w-4 h-4" /> Absent
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
