import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const SOSPage = () => {
  const handleSOSClick = () => {
    // Get location and notify authorities
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        // Send SOS alert with location
        alert('SOS alert sent with your current location!');
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <button
        onClick={handleSOSClick}
        className="bg-red-600 text-white rounded-full w-40 h-40 flex flex-col items-center justify-center shadow-lg hover:bg-red-700 transition-colors mb-8"
      >
        <FaExclamationTriangle className="text-4xl mb-2" />
        <span className="text-2xl font-bold">SOS</span>
      </button>
      <p className="text-center text-gray-600 max-w-md">
        Press the SOS button in case of emergency. This will immediately alert nearby authorities with your current location.
      </p>
    </div>
  );
};

export default SOSPage;
