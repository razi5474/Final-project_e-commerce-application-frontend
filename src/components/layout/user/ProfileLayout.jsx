import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // You'll create this sidebar like SellerSidebar

const ProfileLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-base-100 text-base-content p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
  
    </div>
  );
};

export default ProfileLayout;
