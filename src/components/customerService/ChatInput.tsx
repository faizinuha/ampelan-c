
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  isTyping: boolean;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  setInputMessage,
  isTyping,
  onSendMessage,
  onKeyPress
}) => {
  return (
    <div className="border-t p-4">
      <div className="flex space-x-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Ketik pertanyaan Anda..."
          className="flex-1"
          disabled={isTyping}
        />
        <Button
          onClick={onSendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className="bg-green-600 hover:bg-green-700"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Tekan Enter untuk mengirim pesan
      </p>
    </div>
  );
};
