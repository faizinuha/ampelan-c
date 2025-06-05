
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerService = () => {
  return (
    <Link to="/customer-service">
      <Button
        className="fixed bottom-6 left-6 z-50 bg-green-600 hover:bg-green-700 rounded-full w-14 h-14 shadow-lg"
        size="icon"
        title="Customer Service Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </Link>
  );
};

export default CustomerService;
