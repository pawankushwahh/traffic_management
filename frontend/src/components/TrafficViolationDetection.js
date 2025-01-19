import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaMotorcycle, 
  FaCarCrash, 
  FaExclamationTriangle, 
  FaFileInvoiceDollar,
  FaHardHat
} from 'react-icons/fa';
import { MdSpeed, MdWrongLocation, MdNotificationsActive } from 'react-icons/md';
import { BiCctv } from 'react-icons/bi';
import { GiCctvCamera } from 'react-icons/gi';
import './TrafficViolationDetection.css';

const TrafficViolationDetection = () => {
  const [violations, setViolations] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(1);
  const [isDetecting, setIsDetecting] = useState(false);
  const [stats, setStats] = useState({
    totalViolations: 0,
    totalFines: 0,
    violationTypes: {}
  });

  // List of available CCTV cameras
  const cameras = [
    { id: 1, location: 'Main Market Junction' },
    { id: 2, location: 'Highway Crossing' },
    { id: 3, location: 'School Zone' },
    { id: 4, location: 'Commercial Area' }
  ];

  // Define violation types with their details
  const violationTypes = {
    NO_HELMET: {
      type: 'No Helmet',
      fine: 1000,
      icon: <FaHardHat className="text-red-500" />,
      description: 'Riding two-wheeler without helmet'
    },
    WRONG_SIDE: {
      type: 'Wrong Side Driving',
      fine: 1500,
      icon: <MdWrongLocation className="text-orange-500" />,
      description: 'Driving on wrong side of road'
    },
    OVER_SPEEDING: {
      type: 'Over Speeding',
      fine: 2000,
      icon: <MdSpeed className="text-yellow-500" />,
      description: 'Exceeding speed limit'
    },
    TRIPLE_RIDING: {
      type: 'Triple Riding',
      fine: 1000,
      icon: <FaMotorcycle className="text-blue-500" />,
      description: 'More than 2 persons on two-wheeler'
    },
    RED_LIGHT: {
      type: 'Red Light Jump',
      fine: 2000,
      icon: <FaExclamationTriangle className="text-red-600" />,
      description: 'Crossing signal during red light'
    }
  };

  // Simulated ANPR (Automatic Number Plate Recognition)
  const detectLicensePlate = async (frame) => {
    // Simulate API call to ANPR service
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const states = ['MH', 'DL', 'KA', 'TN', 'UP'];
    const state = states[Math.floor(Math.random() * states.length)];
    const numbers = Math.floor(Math.random() * 90 + 10);
    const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                   String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const lastNumbers = Math.floor(Math.random() * 9000 + 1000);
    
    return `${state}-${numbers}-${letters}-${lastNumbers}`;
  };

  // Simulated violation detection (replace with actual ML model)
  const detectViolations = async (frame) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Randomly detect violations (replace with actual ML detection)
    const violations = [];
    const types = Object.keys(violationTypes);
    
    if (Math.random() > 0.7) {
      const violationType = types[Math.floor(Math.random() * types.length)];
      const licensePlate = await detectLicensePlate(frame);
      
      violations.push({
        type: violationType,
        licensePlate,
        timestamp: new Date().toISOString(),
        location: cameras.find(c => c.id === selectedCamera).location,
        confidence: Math.round((0.85 + Math.random() * 0.14) * 100) / 100 // 85-99% confidence
      });
    }
    
    return violations;
  };

  // Process violation and generate e-challan
  const processViolation = async (violation) => {
    const violationInfo = violationTypes[violation.type];
    
    // Simulate API calls to RTO database and SMS gateway
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const challan = {
      id: `ECH${Date.now()}`,
      licensePlate: violation.licensePlate,
      violationType: violationInfo.type,
      fine: violationInfo.fine,
      location: violation.location,
      timestamp: violation.timestamp,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      evidenceImage: `violation_${Date.now()}.jpg`, // In real system, this would be actual CCTV snapshot
      confidence: violation.confidence
    };

    // Update statistics
    setStats(prev => ({
      totalViolations: prev.totalViolations + 1,
      totalFines: prev.totalFines + violationInfo.fine,
      violationTypes: {
        ...prev.violationTypes,
        [violation.type]: (prev.violationTypes[violation.type] || 0) + 1
      }
    }));

    // Add violation with challan to the list
    setViolations(prev => [{
      ...violation,
      challan,
      status: 'Processed',
      violationInfo
    }, ...prev].slice(0, 50)); // Keep last 50 violations

    // Simulate sending notifications
    console.log(`SMS sent to police: New ${violationInfo.type} violation detected at ${violation.location}`);
    console.log(`SMS sent to vehicle owner ${violation.licensePlate}: E-challan generated for ${violationInfo.type}`);
  };

  useEffect(() => {
    let detectionInterval;
    
    if (isDetecting) {
      detectionInterval = setInterval(async () => {
        const newViolations = await detectViolations();
        for (const violation of newViolations) {
          await processViolation(violation);
        }
      }, 3000);
    }

    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [isDetecting, selectedCamera]);

  return (
    <div className="traffic-violation-container">
      <div className="header-section">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <GiCctvCamera className="text-blue-500" />
          Traffic Rule Violation Detection
        </h1>
        
        <div className="controls flex gap-4 mb-6">
          <select
            className="camera-select"
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(Number(e.target.value))}
          >
            {cameras.map(camera => (
              <option key={camera.id} value={camera.id}>
                {camera.location}
              </option>
            ))}
          </select>
          
          <button
            className={`control-button ${isDetecting ? 'active' : ''}`}
            onClick={() => setIsDetecting(!isDetecting)}
          >
            <BiCctv />
            {isDetecting ? 'Stop Detection' : 'Start Detection'}
          </button>
        </div>
      </div>

      <div className="content-grid">
        <div className="violation-feed">
          <div className="camera-view">
            <div className="camera-overlay">
              <div className="camera-info">
                <BiCctv className="text-2xl" />
                <span>CCTV {selectedCamera}</span>
                {isDetecting && <span className="recording-indicator">●</span>}
              </div>
              {isDetecting && (
                <div className="detection-overlay">
                  <div className="detection-box" />
                </div>
              )}
            </div>
          </div>

          <div className="violations-list">
            <h2 className="text-xl font-semibold mb-4">Recent Violations</h2>
            {violations.map((violation, index) => (
              <motion.div
                key={violation.challan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="violation-card"
              >
                <div className="violation-header">
                  {violation.violationInfo.icon}
                  <div className="violation-info">
                    <h3>{violation.violationInfo.type}</h3>
                    <p className="text-sm text-gray-600">{violation.licensePlate}</p>
                  </div>
                  <div className="violation-meta">
                    <span className="fine">₹{violation.violationInfo.fine}</span>
                    <span className="confidence">{(violation.confidence * 100).toFixed(1)}% confident</span>
                  </div>
                </div>
                
                <div className="violation-details">
                  <p>{violation.violationInfo.description}</p>
                  <div className="challan-info">
                    <FaFileInvoiceDollar className="text-green-500" />
                    <span>Challan: {violation.challan.id}</span>
                    <span>Due: {new Date(violation.challan.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="statistics-panel">
          <h2 className="text-xl font-semibold mb-4">Detection Statistics</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Violations</h3>
              <span className="stat-value">{stats.totalViolations}</span>
            </div>
            
            <div className="stat-card">
              <h3>Total Fines</h3>
              <span className="stat-value">₹{stats.totalFines}</span>
            </div>
          </div>

          <div className="violation-types-list">
            <h3 className="text-lg font-semibold mb-3">Violation Types</h3>
            {Object.entries(violationTypes).map(([key, info]) => (
              <div key={key} className="violation-type-item">
                <div className="flex items-center gap-2">
                  {info.icon}
                  <span>{info.type}</span>
                </div>
                <span className="count">{stats.violationTypes[key] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficViolationDetection;
