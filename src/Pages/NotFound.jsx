import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center px-4">
      <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-base-content mb-2">Page Not Found</h2>
      <p className="text-base text-base-content/70 mb-6 text-center max-w-md">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-focus transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
