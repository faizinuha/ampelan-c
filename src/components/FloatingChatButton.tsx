
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FloatingChatButton = () => {
  return (
    <Link to="/customer-service">
      <Button
        className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        size="icon"
        title="Customer Service Chat"
      >
        <MessageCircle className="w-7 h-7" />
      </Button>
    </Link>
  );
};

export default FloatingChatButton;
