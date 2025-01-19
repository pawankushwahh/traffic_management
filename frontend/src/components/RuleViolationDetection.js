import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCar, FaExclamationTriangle, FaFileInvoiceDollar } from 'react-icons/fa';
import { MdSpeed, MdDirectionsRun } from 'react-icons/md';
import { BiCctv } from 'react-icons/bi';

const RuleViolationDetection = ({ junctionId, onViolationDetected }) => {
  const [violations, setViolations] = useState([]);
  const [processing, setProcessing] = useState(false);

  // Simulated violation detection (replace with actual ML model)
  const detectViolations = (frame) => {
    // Simulate different types of violations
    const violationTypes = [
      { type: 'Signal Jump', fine: 1000, icon: <FaExclamationTriangle className="text-red-500" /> },
      { type: 'Speed Limit', fine: 1500, icon: <MdSpeed className="text-orange-500" /> },
      { type: 'Wrong Lane', fine: 500, icon: <FaCar className="text-yellow-500" /> },
      { type: 'Jaywalking', fine: 200, icon: <MdDirectionsRun className="text-blue-500" /> }
    ];

    // Simulate detection with random violations
    if (Math.random() > 0.7) {
      const violation = violationTypes[Math.floor(Math.random() * violationTypes.length)];
      const vehicleNumber = generateRandomVehicleNumber();
      
      return {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        vehicleNumber,
        ...violation,
        location: `Junction ${junctionId}`,
        status: 'Detected',
        processed: false
      };
    }
    return null;
  };

  // Generate random vehicle number (replace with actual ANPR)
  const generateRandomVehicleNumber = () => {
    const states = ['MH', 'DL', 'KA', 'TN', 'UP'];
    const state = states[Math.floor(Math.random() * states.length)];
    const numbers = Math.floor(Math.random() * 90 + 10);
    const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                   String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const lastNumbers = Math.floor(Math.random() * 9000 + 1000);
    return `${state}-${numbers}-${letters}-${lastNumbers}`;
  };

  // Process violation and generate e-challan
  const processViolation = async (violation) => {
    // Simulate API call to RTO database and SMS gateway
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const challan = {
      challanNumber: `ECH${Math.floor(Math.random() * 1000000)}`,
      vehicleNumber: violation.vehicleNumber,
      violationType: violation.type,
      fine: violation.fine,
      location: violation.location,
      timestamp: violation.timestamp,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days from now
    };

    // Update violation status
    setViolations(prev => prev.map(v => 
      v.id === violation.id 
        ? { ...v, status: 'Processed', challan, processed: true }
        : v
    ));

    // Notify parent component
    onViolationDetected(challan);
  };

  useEffect(() => {
    const detectionInterval = setInterval(() => {
      if (!processing) {
        const violation = detectViolations();
        if (violation) {
          setViolations(prev => [...prev, violation]);
          processViolation(violation);
        }
      }
    }, 5000); // Check for violations every 5 seconds

    return () => clearInterval(detectionInterval);
  }, [processing]);

  return (
    <div className="violation-detection">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BiCctv className="text-2xl text-blue-500" />
          <span className="font-semibold">Rule Violation Detection</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {violations.length} violations detected
          </span>
        </div>
      </div>

      <div className="violations-list space-y-3">
        {violations.map(violation => (
          <motion.div
            key={violation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="violation-item bg-white p-3 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {violation.icon}
                <div>
                  <div className="font-semibold">{violation.type}</div>
                  <div className="text-sm text-gray-600">{violation.vehicleNumber}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-red-500">₹{violation.fine}</div>
                <div className="text-sm text-gray-500">
                  {new Date(violation.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
            {violation.processed && (
              <div className="mt-2 text-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <FaFileInvoiceDollar />
                  <span>E-Challan Generated: {violation.challan.challanNumber}</span>
                </div>
                <div className="text-gray-500 mt-1">
                  Due Date: {new Date(violation.challan.dueDate).toLocaleDateString()}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RuleViolationDetection;
