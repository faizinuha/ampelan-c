
import React from 'react';

interface ActivityHeroProps {
  user: any;
}

export const ActivityHero: React.FC<ActivityHeroProps> = ({ user }) => {
  return (
    <div className="relative h-64 bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
      <div className="absolute inset-0 bg-black/30"></div>
      <img 
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
        alt="Village activities" 
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kegiatan Desa Ampelan</h1>
          <p className="text-xl md:text-2xl opacity-90">
            {user ? 'Bagikan dan lihat kegiatan desa terbaru' : 'Lihat kegiatan desa terbaru'}
          </p>
        </div>
      </div>
    </div>
  );
};
