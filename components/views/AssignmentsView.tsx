'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { motion } from 'motion/react';
import { Plus, Calendar, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';

export default function AssignmentsView() {
  const { assignments, addAssignment, toggleAssignment, deleteAssignment } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && subject && dueDate) {
      addAssignment({
        title,
        subject,
        dueDate: new Date(dueDate).toISOString(),
        completed: false
      });
      setTitle('');
      setSubject('');
      setDueDate('');
      setShowAdd(false);
      
      // Simulate local notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Assignment Added', {
          body: `${title} due on ${format(new Date(dueDate), 'MMM d')}`
        });
      }
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const getDueDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d, yyyy');
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950 p-6">
      <div className="flex justify-between items-center mb-6 pt-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assignments</h1>
        <div className="flex gap-2">
          <button 
            onClick={requestNotificationPermission}
            className="w-10 h-10 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
            title="Enable Notifications"
          >
            <Calendar className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showAdd && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 space-y-3"
          onSubmit={handleAdd}
        >
          <input
            type="text"
            placeholder="Assignment Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium">Save</button>
            <button type="button" onClick={() => setShowAdd(false)} className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-medium">Cancel</button>
          </div>
        </motion.form>
      )}

      <div className="space-y-3">
        {sortedAssignments.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No assignments yet. You're all caught up!</p>
          </div>
        ) : (
          sortedAssignments.map((assignment) => {
            const isOverdue = !assignment.completed && isPast(new Date(assignment.dueDate)) && !isToday(new Date(assignment.dueDate));
            
            return (
              <motion.div 
                key={assignment.id}
                layout
                className={`bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border ${
                  assignment.completed ? 'border-gray-100 dark:border-gray-800 opacity-60' : 
                  isOverdue ? 'border-red-200 dark:border-red-900/50' : 'border-gray-100 dark:border-gray-800'
                } flex items-center gap-4`}
              >
                <button 
                  onClick={() => toggleAssignment(assignment.id)}
                  className={`flex-shrink-0 transition-colors ${
                    assignment.completed ? 'text-emerald-500' : 'text-gray-300 dark:text-gray-600 hover:text-blue-500'
                  }`}
                >
                  {assignment.completed ? <CheckCircle2 className="w-7 h-7" /> : <Circle className="w-7 h-7" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium truncate ${assignment.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                    {assignment.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs mt-1">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">{assignment.subject}</span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className={`${isOverdue ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                      {isOverdue ? 'Overdue: ' : 'Due: '} {getDueDateLabel(assignment.dueDate)}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => deleteAssignment(assignment.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
