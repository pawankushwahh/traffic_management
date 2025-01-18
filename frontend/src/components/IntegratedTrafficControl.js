import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaVideo, FaTrafficLight, FaChartLine, FaPlay, FaPause, FaCarSide } from 'react-icons/fa';
import './SignalAutomation.css';

const IntegratedTrafficControl = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeLane, setActiveLane] = useState(0); // 0-3 representing the four lanes
  const [vehicleDensity, setVehicleDensity] = useState({
    lane0: 0,
    lane1: 0,
    lane2: 0,
    lane3: 0
  });
  const [signalTiming, setSignalTiming] = useState({
    lane0: 30,
    lane1: 30,
    lane2: 30,
    lane3: 30
  });
  const [signalStates, setSignalStates] = useState({
    lane0: 'red',
    lane1: 'red',
    lane2: 'red',
    lane3: 'red'
  });
  
  const processingInterval = useRef(null);
  const signalInterval = useRef(null);

  // Function to calculate signal timing based on vehicle density
  const calculateSignalTiming = (density) => {
    const minTime = 5; // minimum 5 seconds
    const maxTime = 60; // maximum 1 minute
    const normalizedDensity = Math.min(density / 100, 1); // Normalize density to 0-1
    return Math.floor(minTime + (maxTime - minTime) * normalizedDensity);
  };

  // Start CCTV processing and signal automation
  const startProcessing = () => {
    setIsProcessing(true);
    
    // Simulate CCTV processing with random vehicle density
    processingInterval.current = setInterval(() => {
      setVehicleDensity(prev => ({
        lane0: Math.floor(Math.random() * 100),
        lane1: Math.floor(Math.random() * 100),
        lane2: Math.floor(Math.random() * 100),
        lane3: Math.floor(Math.random() * 100)
      }));
    }, 2000);

    // Start signal rotation
    updateSignalStates(0);
  };

  // Stop processing
  const stopProcessing = () => {
    setIsProcessing(false);
    if (processingInterval.current) clearInterval(processingInterval.current);
    if (signalInterval.current) clearInterval(signalInterval.current);
    setSignalStates({
      lane0: 'red',
      lane1: 'red',
      lane2: 'red',
      lane3: 'red'
    });
  };

  // Update signal states based on active lane
  const updateSignalStates = (currentLane) => {
    setActiveLane(currentLane);
    
    // Calculate timing for current lane based on density
    const timing = calculateSignalTiming(vehicleDensity['lane' + currentLane]);
    
    // Update signal states (only one green at a time)
    const newStates = {
      lane0: 'red',
      lane1: 'red',
      lane2: 'red',
      lane3: 'red'
    };
    newStates['lane' + currentLane] = 'green';
    setSignalStates(newStates);
    
    // Schedule next lane change
    if (signalInterval.current) clearInterval(signalInterval.current);
    signalInterval.current = setTimeout(() => {
      updateSignalStates((currentLane + 1) % 4);
    }, timing * 1000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (processingInterval.current) clearInterval(processingInterval.current);
      if (signalInterval.current) clearInterval(signalInterval.current);
    };
  }, []);

  // Update timing whenever density changes
  useEffect(() => {
    if (isProcessing) {
      setSignalTiming({
        lane0: calculateSignalTiming(vehicleDensity.lane0),
        lane1: calculateSignalTiming(vehicleDensity.lane1),
        lane2: calculateSignalTiming(vehicleDensity.lane2),
        lane3: calculateSignalTiming(vehicleDensity.lane3)
      });
    }
  }, [vehicleDensity, isProcessing]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6">Integrated Traffic Control System</h1>
        
        {/* Control buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={isProcessing ? stopProcessing : startProcessing}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
              isProcessing ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } text-white transition-colors`}
          >
            {isProcessing ? (
              <>
                <FaPause /> Stop Processing
              </>
            ) : (
              <>
                <FaPlay /> Start Processing
              </>
            )}
          </button>
        </div>

        {/* CCTV Processing Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaVideo className="text-blue-500" /> CCTV Processing
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(vehicleDensity).map(([lane, density]) => (
                <div key={lane} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-medium mb-2">Lane {lane.slice(-1)}</h3>
                  <div className="flex items-center gap-2">
                    <FaCarSide className="text-gray-600" />
                    <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full transition-all duration-500"
                        style={{ width: `${density}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{density}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Signal Status */}
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaTrafficLight className="text-blue-500" /> Traffic Signals
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(signalStates).map(([lane, state]) => (
                <div key={lane} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-medium mb-2">Lane {lane.slice(-1)}</h3>
                  <div className="flex items-center justify-between">
                    <div className={`w-6 h-6 rounded-full bg-${state === 'green' ? 'green' : 'red'}-500`}></div>
                    <span className="font-medium">
                      {state === 'green' ? `${signalTiming[lane]}s` : 'Stopped'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaChartLine className="text-blue-500" /> Real-time Analytics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(vehicleDensity).map(([lane, density]) => (
              <div key={lane} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium mb-2">Lane {lane.slice(-1)} Statistics</h3>
                <div className="space-y-2">
                  <p>Density: {density}%</p>
                  <p>Wait Time: {signalTiming[lane]}s</p>
                  <p>Status: {signalStates[lane]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedTrafficControl;
