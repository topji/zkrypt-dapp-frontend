import React from 'react';

const DesktopMessage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-purple-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-purple-800 mb-4">Zkrypt is a Mobile-Dedicated Service</h1>
        <p className="text-gray-600">Please access Zkrypt on your mobile device for the best experience.</p>
      </div>
    </div>
  );
};

export default DesktopMessage;
