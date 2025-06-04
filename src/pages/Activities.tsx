
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useActivities } from '@/hooks/useActivities';
import { ActivityHero } from '@/components/activities/ActivityHero';
import { ActivityForm } from '@/components/activities/ActivityForm';
import { ActivityCard } from '@/components/activities/ActivityCard';

const Activities = () => {
  const { user } = useAuth();
  const { activities, uploadActivity } = useActivities();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <ActivityHero user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <ActivityForm onUpload={uploadActivity} />

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>

        {activities.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl mt-8">
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum ada kegiatan</h3>
              <p className="text-gray-500">Upload kegiatan pertama Anda!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Activities;
