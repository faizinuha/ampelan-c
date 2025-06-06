
import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { useCustomerServiceChat } from '@/hooks/useCustomerServiceChat';
import { ChatMessage } from '@/components/customerService/ChatMessage';
import { TypingIndicator } from '@/components/customerService/TypingIndicator';
import { ChatInput } from '@/components/customerService/ChatInput';
import { ChatHeader } from '@/components/customerService/ChatHeader';

const CustomerServiceChat = () => {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    isLoading,
    handleSendMessage,
    handleKeyPress
  } = useCustomerServiceChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Service</h1>
          <p className="text-gray-600">Chat dengan asisten virtual Desa Ampelan</p>
        </div>

        <Card className="h-[600px] flex flex-col">
          <ChatHeader />

          <CardContent className="flex-1 flex flex-col p-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {isTyping && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            <ChatInput
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              isTyping={isTyping}
              onSendMessage={handleSendMessage}
              onKeyPress={handleKeyPress}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerServiceChat;
