import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Message } from '@/types/customerService';
import { Bot, User } from 'lucide-react';
import React from 'react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { profile } = useAuthStore();

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`flex ${
        message.sender_type === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`flex items-start space-x-2 max-w-[80%] ${
          message.sender_type === 'user'
            ? 'flex-row-reverse space-x-reverse'
            : ''
        }`}
      >
        <Avatar className="w-8 h-8">
          {message.sender_type === 'user' ? (
            <>
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-blue-600 text-white text-xs">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </>
          ) : (
            <AvatarFallback className="bg-green-600 text-white text-xs">
              <Bot className="w-4 h-4" />
            </AvatarFallback>
          )}
        </Avatar>

        <div
          className={`rounded-lg p-3 ${
            message.sender_type === 'user'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-800 shadow border'
          }`}
        >
          <div className="whitespace-pre-wrap text-sm">{message.message}</div>
          <div
            className={`text-xs mt-1 ${
              message.sender_type === 'user' ? 'text-blue-100' : 'text-gray-500'
            }`}
          >
            {formatTime(message.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
};
