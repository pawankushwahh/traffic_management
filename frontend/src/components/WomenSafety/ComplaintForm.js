import React, { useState, useRef } from 'react';
import { FaUser, FaPhone, FaCar, FaClock, FaMicrophone, FaStop, FaFileAudio } from 'react-icons/fa';

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
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [useAudio, setUseAudio] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const timeRanges = [
    { value: '0-1', label: 'Last 1 hour' },
    { value: '1-2', label: '1-2 hours ago' },
    { value: '2-3', label: '2-3 hours ago' },
    { value: '3-4', label: '3-4 hours ago' },
    { value: '4-5', label: '4-5 hours ago' },
    { value: '5-6', label: '5-6 hours ago' }
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Add all form fields
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    // Add audio if present
    if (audioBlob) {
      formDataToSend.append('audio', audioBlob, 'complaint.wav');
    }

    try {
      const response = await fetch('/api/safety/report', {
        method: 'POST',
        body: formDataToSend,
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

      <div className="mb-6">
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => setUseAudio(false)}
            className={`px-4 py-2 rounded-lg ${!useAudio ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Text Report
          </button>
          <button
            type="button"
            onClick={() => setUseAudio(true)}
            className={`px-4 py-2 rounded-lg ${useAudio ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Audio Report
          </button>
        </div>
      </div>

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

        {/* Optional Vehicle Number */}
        <div>
          <label className="flex items-center mb-2">
            <FaCar className="mr-2" />
            <span>Vehicle Number (optional)</span>
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

        {/* Report Input - Text or Audio */}
        {useAudio ? (
          <div className="space-y-4">
            <label className="block mb-2">Audio Report</label>
            <div className="flex items-center space-x-4">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <FaMicrophone className="mr-2" />
                  Start Recording
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  <FaStop className="mr-2" />
                  Stop Recording
                </button>
              )}
              {audioBlob && (
                <div className="flex items-center text-green-600">
                  <FaFileAudio className="mr-2" />
                  Audio recorded
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <label className="block mb-2">Incident Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 h-32"
              required={!useAudio}
            />
          </div>
        )}

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
