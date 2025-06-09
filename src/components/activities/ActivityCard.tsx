
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User } from 'lucide-react';
import type { Activity } from '@/types/activity';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={activity.image_url}
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-lg font-bold mb-1">{activity.title}</h3>
          <div className="flex items-center gap-1 text-sm opacity-90">
            <Calendar className="w-4 h-4" />
            {formatDate(activity.date)}
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {activity.description}
        </p>
        
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4" />
          {activity.location}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <User className="w-3 h-3" />
            {activity.uploader_name}
          </div>
          <Badge variant="outline" className="text-xs">
            {formatDate(activity.created_at)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
