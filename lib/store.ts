import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  name: string;
  email: string;
}

export interface AttendanceRecord {
  id: string;
  subject: string;
  totalClasses: number;
  attendedClasses: number;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
}

export interface Settings {
  darkMode: boolean;
  notifications: boolean;
  autoSync: boolean;
}

interface AppState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;

  attendance: AttendanceRecord[];
  addAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  updateAttendance: (id: string, attended: number, total: number) => void;

  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  toggleAssignment: (id: string) => void;
  deleteAssignment: (id: string) => void;

  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),

      attendance: [
        { id: '1', subject: 'Mobile App Dev', totalClasses: 20, attendedClasses: 18 },
        { id: '2', subject: 'Database Systems', totalClasses: 15, attendedClasses: 10 },
        { id: '3', subject: 'Software Engineering', totalClasses: 18, attendedClasses: 15 },
      ],
      addAttendance: (record) =>
        set((state) => ({
          attendance: [...state.attendance, { ...record, id: Math.random().toString(36).substring(7) }],
        })),
      updateAttendance: (id, attended, total) =>
        set((state) => ({
          attendance: state.attendance.map((a) =>
            a.id === id ? { ...a, attendedClasses: attended, totalClasses: total } : a
          ),
        })),

      assignments: [
        { id: '1', title: 'MAD Project Proposal', subject: 'Mobile App Dev', dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), completed: false },
        { id: '2', title: 'SQL Queries Assignment', subject: 'Database Systems', dueDate: new Date(Date.now() - 86400000).toISOString(), completed: true },
      ],
      addAssignment: (assignment) =>
        set((state) => ({
          assignments: [...state.assignments, { ...assignment, id: Math.random().toString(36).substring(7) }],
        })),
      toggleAssignment: (id) =>
        set((state) => ({
          assignments: state.assignments.map((a) =>
            a.id === id ? { ...a, completed: !a.completed } : a
          ),
        })),
      deleteAssignment: (id) =>
        set((state) => ({
          assignments: state.assignments.filter((a) => a.id !== id),
        })),

      settings: {
        darkMode: false,
        notifications: true,
        autoSync: true,
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'campus-companion-storage',
    }
  )
);
