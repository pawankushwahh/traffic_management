import React, { useState } from 'react';
import { FaShieldAlt, FaMobileAlt } from 'react-icons/fa';
import ComplaintForm from './ComplaintForm';
import SOSPage from './SOSPage';

const WomenSafetyPage = () => {
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [showSOS, setShowSOS] = useState(true); // Set to true by default

  if (showEmergencyForm) {
    return <ComplaintForm isEmergencyButton={true} />;
  }

  if (showMobileForm) {
    return (
      <div>
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setShowSOS(true)}
            className={`px-4 py-2 rounded ${showSOS ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          >
            SOS
          </button>
          <button
            onClick={() => setShowSOS(false)}
            className={`px-4 py-2 rounded ${!showSOS ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          >
            File Complaint
          </button>
        </div>
        {showSOS ? <SOSPage /> : <ComplaintForm />}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Women Safety Portal</h1>
        <p className="text-xl text-gray-600">Choose your reporting method</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Emergency Button Feature */}
        <div 
          onClick={() => setShowEmergencyForm(true)}
          className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
        >
          <div className="text-red-600 text-4xl mb-4">
            <FaShieldAlt />
          </div>
          <h3 className="text-xl font-semibold mb-2">Emergency Button</h3>
          <p className="text-gray-600 mb-4">
            Emergency buttons installed at traffic signals and major road intersections for immediate assistance. Press to:
          </p>
          <ul className="text-gray-600 list-disc list-inside">
            <li>Instantly alert nearby authorities</li>
            <li>Automatic location detection</li>
            <li>Quick complaint registration</li>
            <li>Immediate response system</li>
          </ul>
        </div>

        {/* Mobile App Feature */}
        <div 
          onClick={() => {
            setShowMobileForm(true);
            setShowSOS(true); // Ensure SOS is shown by default
          }}
          className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
        >
          <div className="text-blue-600 text-4xl mb-4">
            <FaMobileAlt />
          </div>
          <h3 className="text-xl font-semibold mb-2">Mobile App</h3>
          <p className="text-gray-600 mb-4">
            Use our mobile app for comprehensive incident reporting and emergency assistance:
          </p>
          <ul className="text-gray-600 list-disc list-inside">
            <li>SOS emergency alert system</li>
            <li>Detailed incident reporting</li>
            <li>Track complaint status</li>
            <li>24/7 helpline access</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WomenSafetyPage;
