'use client';

import { useAppStore } from '@/lib/store';
import { Moon, Bell, RefreshCw, LogOut, User as UserIcon, Shield, ChevronRight, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Device, DeviceInfo } from '@capacitor/device';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export default function SettingsView() {
  const { user, settings, updateSettings, logout } = useAppStore();
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    const checkDevice = async () => {
      if (Capacitor.isNativePlatform()) {
        const info = await Device.getInfo();
        setDeviceInfo(info);
      }
    };
    checkDevice();
  }, []);

  const triggerHaptic = async () => {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Medium });
    }
  };

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
    <button 
      onClick={() => {
        triggerHaptic();
        onChange(!checked);
      }}
      className={`w-12 h-6 rounded-full transition-colors relative ${checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${checked ? 'translate-x-6.5' : 'translate-x-0.5'}`}></div>
    </button>
  );

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950 p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pt-4">Settings</h1>

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-2xl font-bold">
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user?.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
        <button className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500">
          <UserIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Device Info */}
      {deviceInfo && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Device Info</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {deviceInfo.manufacturer} {deviceInfo.model} ({deviceInfo.operatingSystem})
            </p>
          </div>
        </div>
      )}

      {/* Preferences */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Moon className="w-4 h-4" />
            </div>
            <span className="font-medium text-gray-900 dark:text-white">Dark Mode</span>
          </div>
          <Toggle 
            checked={settings.darkMode} 
            onChange={(v) => updateSettings({ darkMode: v })} 
          />
        </div>

        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Bell className="w-4 h-4" />
            </div>
            <span className="font-medium text-gray-900 dark:text-white">Notifications</span>
          </div>
          <Toggle 
            checked={settings.notifications} 
            onChange={(v) => updateSettings({ notifications: v })} 
          />
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <RefreshCw className="w-4 h-4" />
            </div>
            <span className="font-medium text-gray-900 dark:text-white">Auto Sync</span>
          </div>
          <Toggle 
            checked={settings.autoSync} 
            onChange={(v) => updateSettings({ autoSync: v })} 
          />
        </div>
      </div>

      {/* Other Options */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8 overflow-hidden">
        <button className="w-full p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-medium text-gray-900 dark:text-white">Privacy Policy</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Logout */}
      <button 
        onClick={logout}
        className="w-full py-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
      
      <p className="text-center text-xs text-gray-400 mt-6 pb-4">
        Smart Campus Companion v1.0.0
      </p>
    </div>
  );
}
