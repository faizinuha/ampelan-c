
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';

export const ChatHeader: React.FC = () => {
  return (
    <CardHeader className="bg-green-600 text-white rounded-t-lg">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <span>CS Desa Ampelan</span>
        </div>
        <Badge variant="secondary" className="bg-green-500 text-white">
          Online
        </Badge>
      </CardTitle>
    </CardHeader>
  );
};
