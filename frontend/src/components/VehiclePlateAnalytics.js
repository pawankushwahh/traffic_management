import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FaCar, FaUpload, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { BsSpeedometer } from 'react-icons/bs';
import { MdPayment } from 'react-icons/md';

const VehiclePlateAnalytics = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showDemo, setShowDemo] = useState(false);

  // Example cases for demo
  const demoExamples = [
    {
      title: "Speed Violation Detection",
      image: "/demo/speed_violation.jpg",
      description: "AI detects vehicles exceeding speed limits",
      result: {
        plate_number: "KA01MX2022",
        vehicle_type: "Sedan",
        registration_valid: true,
        tax_status: "Paid",
        violations: [{
          type: "Speed Violation",
          date: "2024-01-12",
          status: "Pending",
          description: "Speed: 80km/h in 50km/h zone",
          fine: 1000
        }]
      }
    },
    {
      title: "Expired Registration",
      image: "/demo/expired_reg.jpg",
      description: "System identifies vehicles with expired registration",
      result: {
        plate_number: "MH02AB1234",
        vehicle_type: "SUV",
        registration_valid: false,
        tax_status: "Due",
        violations: [],
        action_required: "Registration renewal required",
        due_amount: 5000
      }
    }
  ];

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'video/*': ['.mp4', '.avi', '.mov']
    },
    multiple: false
  });

  const handleAnalyze = async () => {
    setProcessing(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:5000/api/anpr/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.error) {
        setError(response.data.error);
        setResults(null);
      } else {
        setResults(response.data);
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error analyzing image. Please try again.');
      setResults(null);
    } finally {
      setProcessing(false);
    }
  };

  const renderViolationCard = (violation) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-4 rounded-lg shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold flex items-center">
            <BsSpeedometer className="mr-2" />
            {violation.type}
          </h4>
          <p className="text-sm text-gray-600">{violation.date}</p>
        </div>
        <div className={`px-3 py-1 rounded-full ${
          violation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          violation.status === 'Paid' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {violation.status}
        </div>
      </div>
      <p className="mt-2 text-gray-700">{violation.description}</p>
      {violation.fine && (
        <div className="mt-2 flex items-center justify-between">
          <p className="text-gray-600">Fine Amount:</p>
          <p className="font-semibold text-red-600">₹{violation.fine}</p>
        </div>
      )}
    </motion.div>
  );

  const renderDemoSection = () => (
    <div className="mt-8 bg-gray-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">How It Works - Demo Examples</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {demoExamples.map((example, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold mb-2">{example.title}</h3>
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <img
                src={example.image}
                alt={example.title}
                className="rounded-lg object-cover"
              />
            </div>
            <p className="text-gray-600 mb-4">{example.description}</p>
            <button
              onClick={() => {
                setResults(example.result);
                setShowDemo(false);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              View Example Results
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          <FaCar className="inline-block mr-2 mb-1" />
          Smart ANPR Analysis Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Upload an image or video for instant AI-powered number plate analysis
        </p>
      </motion.div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: <FaCar className="text-blue-500" />,
            title: "Instant Recognition",
            description: "Real-time number plate detection and verification"
          },
          {
            icon: <BsSpeedometer className="text-green-500" />,
            title: "Violation Detection",
            description: "Automatic detection of traffic rule violations"
          },
          {
            icon: <MdPayment className="text-purple-500" />,
            title: "Quick Payments",
            description: "Easy fine payment and tax management"
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-lg shadow-md text-center"
          >
            <div className="text-3xl mb-2 flex justify-center">{feature.icon}</div>
            <h3 className="font-semibold mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 cursor-pointer text-center
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            ${error ? 'border-red-500' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <FaUpload className="text-4xl mx-auto text-gray-400" />
            {isDragActive ? (
              <p className="text-blue-500">Drop the file here</p>
            ) : (
              <>
                <p>Drag & drop an image/video or click to select</p>
                <p className="text-sm text-gray-500">Supported formats: JPG, PNG, MP4</p>
              </>
            )}
          </div>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-red-500 text-sm flex items-center"
          >
            <FaExclamationTriangle className="mr-1" /> {error}
          </motion.p>
        )}
      </motion.div>

      {/* Preview Section with Fixed Dimensions */}
      {preview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="max-w-3xl mx-auto">
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
              {file.type.startsWith('image/') ? (
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-full object-contain"
                  style={{
                    maxHeight: '400px',
                    backgroundColor: '#f3f4f6'
                  }}
                />
              ) : (
                <video 
                  src={preview} 
                  controls 
                  className="w-full h-full object-contain"
                  style={{
                    maxHeight: '400px',
                    backgroundColor: '#f3f4f6'
                  }}
                />
              )}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500 mb-2">
                File: {file.name} | Type: {file.type}
              </p>
              <button
                onClick={handleAnalyze}
                disabled={processing}
                className={`px-6 py-2 rounded-full font-semibold text-white
                  ${processing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}
                  transition-colors duration-200`}
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Analyze'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Section with Fixed Width Cards */}
      {results && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8 max-w-4xl mx-auto"
        >
          {/* Vehicle Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaCar className="mr-2" />
              Vehicle Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">License Plate</p>
                <p className="text-lg font-semibold">{results.plate_number}</p>
              </div>
              <div>
                <p className="text-gray-600">Vehicle Type</p>
                <p className="text-lg font-semibold">{results.vehicle_type}</p>
              </div>
              <div>
                <p className="text-gray-600">Registration Status</p>
                <p className={`text-lg font-semibold flex items-center ${
                  results.registration_valid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {results.registration_valid ? (
                    <><FaCheckCircle className="mr-1" /> Valid</>
                  ) : (
                    <><FaExclamationTriangle className="mr-1" /> Expired</>
                  )}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Tax Status</p>
                <p className={`text-lg font-semibold ${
                  results.tax_status === 'Paid' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {results.tax_status}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Violations with Fixed Width */}
          {results.violations?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Violations</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {results.violations.map((violation, index) => (
                  <div key={index} className="w-full">
                    {renderViolationCard(violation)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Required Section */}
          {results.action_required && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaExclamationTriangle className="text-yellow-400 text-xl" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-yellow-800">Action Required</h3>
                  <p className="mt-2 text-yellow-700">{results.action_required}</p>
                  {results.due_amount && (
                    <p className="mt-2 text-yellow-700 font-semibold">
                      Total Due: ₹{results.due_amount}
                    </p>
                  )}
                  <button className="mt-4 bg-yellow-800 text-white px-6 py-2 rounded-full hover:bg-yellow-700 transition-colors flex items-center justify-center">
                    <MdPayment className="mr-2" />
                    Pay Now
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Demo Section remains the same */}
      {!results && !preview && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {showDemo ? 'Hide Demo Examples' : 'View Demo Examples'}
          </button>
        </div>
      )}

      {/* Demo Examples Section */}
      {showDemo && renderDemoSection()}
    </div>
  );
};

export default VehiclePlateAnalytics;
