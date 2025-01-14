import React, { useState } from 'react';
import { FaMicrophone, FaCar, FaExclamationCircle } from 'react-icons/fa';

const EmergencyButton = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [justHappened, setJustHappened] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleEmergencyPress = () => {
    setShowForm(true);
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        // Store coordinates for submission
      });
    }
  };

  const handleAudioRecord = () => {
    setIsRecording(!isRecording);
    // Implement audio recording logic
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit complaint with location, time, and other details
    const complaintData = {
      vehicleNumber,
      justHappened,
      location: {}, // Add coordinates
      timestamp: new Date().toISOString(),
    };
    
    try {
      const response = await fetch('/api/safety/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaintData),
      });
      
      if (response.ok) {
        setShowForm(false);
        // Show success message
      }
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {!showForm ? (
        <button
          onClick={handleEmergencyPress}
          className="bg-red-600 text-white rounded-full p-4 shadow-lg hover:bg-red-700"
        >
          <FaExclamationCircle className="text-2xl" />
        </button>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-xl">
          <h3 className="text-xl font-bold mb-4">Emergency Report</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Vehicle Number</label>
              <div className="flex items-center">
                <FaCar className="mr-2" />
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="border p-2 rounded"
                  placeholder="Enter vehicle number"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <button
                type="button"
                onClick={handleAudioRecord}
                className={`flex items-center ${isRecording ? 'bg-red-500' : 'bg-gray-200'} p-2 rounded`}
              >
                <FaMicrophone className="mr-2" />
                {isRecording ? 'Stop Recording' : 'Record Audio'}
              </button>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={justHappened}
                  onChange={(e) => setJustHappened(e.target.checked)}
                  className="mr-2"
                />
                Just Happened
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="mr-2 px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmergencyButton;
