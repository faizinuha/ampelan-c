
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerServiceChat from '@/pages/CustomerServiceChat';

const CustomerServiceRoute = () => {
  return (
    <Routes>
      <Route path="/customer-service" element={<CustomerServiceChat />} />
    </Routes>
  );
};

export default CustomerServiceRoute;
