'use client';

import { useState, useEffect } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';
import { motion } from 'motion/react';

const LOCATIONS = [
  { id: 1, name: 'Main Library', type: 'Facility' },
  { id: 2, name: 'Computer Science Block', type: 'Academic' },
  { id: 3, name: 'Student Center', type: 'Facility' },
  { id: 4, name: 'Engineering Lab 1', type: 'Academic' },
  { id: 5, name: 'Cafeteria', type: 'Food' },
];

export default function MapView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    // Simulate getting user location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log('Error getting location', error)
      );
    }
  }, []);

  const filteredLocations = LOCATIONS.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950 flex flex-col h-[calc(100vh-80px)]">
      <div className="p-6 pb-4 bg-white dark:bg-gray-900 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Campus Map</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search classrooms, labs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Map Area (Simulated) */}
      <div className="flex-1 relative bg-blue-50 dark:bg-gray-800 overflow-hidden">
        {/* Simulated Map Background */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10" 
             style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {/* Simulated Map Markers */}
        <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
          <MapPin className="w-8 h-8 text-red-500 drop-shadow-md" />
          <span className="text-xs font-bold bg-white dark:bg-gray-900 px-2 py-1 rounded-md shadow-sm mt-1">CS Block</span>
        </div>

        <div className="absolute top-1/2 right-1/3 flex flex-col items-center">
          <MapPin className="w-8 h-8 text-blue-500 drop-shadow-md" />
          <span className="text-xs font-bold bg-white dark:bg-gray-900 px-2 py-1 rounded-md shadow-sm mt-1">Library</span>
        </div>

        {userLocation && (
          <div className="absolute bottom-1/3 left-1/2 flex flex-col items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full shadow-sm mt-1">You</span>
          </div>
        )}

        {/* Search Results Overlay */}
        {searchQuery && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-4 right-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 max-h-60 overflow-y-auto z-20"
          >
            {filteredLocations.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">No locations found</div>
            ) : (
              filteredLocations.map(loc => (
                <div key={loc.id} className="p-3 border-b border-gray-100 dark:border-gray-800 last:border-0 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900 dark:text-white">{loc.name}</div>
                    <div className="text-xs text-gray-500">{loc.type}</div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Floating Action Button */}
        <button className="absolute bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-10">
          <Navigation className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
