import React, { useState } from 'react';
import { FaUser, FaPhone, FaCar, FaClock } from 'react-icons/fa';

const ComplaintForm = ({ isEmergencyButton = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    vehicleNumber: '',
    justHappened: true,
    timeRange: '0-1',
    location: '',
    description: ''
  });

  const timeRanges = [
    { value: '0-1', label: 'Last 1 hour' },
    { value: '1-2', label: '1-2 hours ago' },
    { value: '2-3', label: '2-3 hours ago' },
    { value: '3-4', label: '3-4 hours ago' },
    { value: '4-5', label: '4-5 hours ago' },
    { value: '5-6', label: '5-6 hours ago' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/safety/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert('Complaint registered successfully');
        // Reset form or redirect
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Error submitting complaint. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEmergencyButton ? 'Emergency Complaint Registration' : 'Complaint Registration'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Input */}
          <div>
            <label className="flex items-center mb-2">
              <FaUser className="mr-2" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Contact Input */}
          <div>
            <label className="flex items-center mb-2">
              <FaPhone className="mr-2" />
              <span>Contact Number</span>
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>

        {/* Vehicle Number */}
        <div>
          <label className="flex items-center mb-2">
            <FaCar className="mr-2" />
            <span>Vehicle Number (if applicable)</span>
          </label>
          <input
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Time Selection */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="justHappened"
              checked={formData.justHappened}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label>Just Happened</label>
          </div>

          {!formData.justHappened && (
            <div>
              <label className="flex items-center mb-2">
                <FaClock className="mr-2" />
                <span>Time Range</span>
              </label>
              <select
                name="timeRange"
                value={formData.timeRange}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                required
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {!isEmergencyButton && (
          <div>
            <label className="block mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block mb-2">Incident Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 h-32"
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Submit Complaint
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintForm;
