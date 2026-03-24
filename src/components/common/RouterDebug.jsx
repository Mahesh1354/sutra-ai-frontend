import React from 'react';
import { useLocation } from 'react-router-dom';

const RouterDebug = () => {
  const location = useLocation();
  
  if (process.env.NODE_ENV === 'production') return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded z-50">
      Current Path: {location.pathname}
    </div>
  );
};

export default RouterDebug;