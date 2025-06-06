
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-center space-x-2">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-green-600 text-white text-xs">
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
        <div className="bg-white border rounded-lg p-3 shadow">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
