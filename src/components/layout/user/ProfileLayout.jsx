import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const ProfileLayout = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-base-200">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProfileLayout;
