
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FloatingChatButton = () => {
  return (
    <Link to="/customer-service">
      <Button
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-50 flex items-center justify-center"
        size="icon"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </Button>
    </Link>
  );
};

export default FloatingChatButton;
