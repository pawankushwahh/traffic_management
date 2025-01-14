import React from 'react';
import EmergencyButton from './EmergencyButton';
import { FaShieldAlt, FaMobileAlt, FaMapMarkedAlt } from 'react-icons/fa';

const WomenSafetyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Women Safety Portal</h1>
        <p className="text-xl text-gray-600">Your safety is our priority. Report incidents quickly and securely.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Emergency Button Feature */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="text-red-600 text-4xl mb-4">
            <FaShieldAlt />
          </div>
          <h3 className="text-xl font-semibold mb-2">Emergency Button</h3>
          <p className="text-gray-600 mb-4">
            Press the emergency button to instantly alert authorities with your location.
          </p>
        </div>

        {/* Mobile App Feature */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="text-blue-600 text-4xl mb-4">
            <FaMobileAlt />
          </div>
          <h3 className="text-xl font-semibold mb-2">Mobile App Integration</h3>
          <p className="text-gray-600 mb-4">
            Use our mobile app to report incidents and track complaint status.
          </p>
        </div>

        {/* Location Tracking */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="text-green-600 text-4xl mb-4">
            <FaMapMarkedAlt />
          </div>
          <h3 className="text-xl font-semibold mb-2">Location Tracking</h3>
          <p className="text-gray-600 mb-4">
            Automatic location detection for quick response from nearest authorities.
          </p>
        </div>
      </div>

      <div className="bg-gray-100 p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Report Incident</h3>
            <p className="text-gray-600">Press emergency button or use the app to report an incident</p>
          </div>
          <div className="text-center">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Instant Alert</h3>
            <p className="text-gray-600">Authorities are immediately notified with your location</p>
          </div>
          <div className="text-center">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Quick Response</h3>
            <p className="text-gray-600">Nearest police unit is dispatched to your location</p>
          </div>
        </div>
      </div>

      {/* Emergency Button Component */}
      <EmergencyButton />
    </div>
  );
};

export default WomenSafetyPage;
