import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaVideo, FaBrain, FaTrafficLight, FaChartLine, FaCode, FaPlay, FaPause } from 'react-icons/fa';

const CCTVAutomation = () => {
  const [activeDemo, setActiveDemo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [vehicleCount, setVehicleCount] = useState({ lane1: 0, lane2: 0, lane3: 0, lane4: 0 });
  const [signalTiming, setSignalTiming] = useState({ lane1: 30, lane2: 30, lane3: 30, lane4: 30 });

  const simulateProcessing = () => {
    setIsProcessing(true);
    const interval = setInterval(() => {
      setVehicleCount({
        lane1: Math.floor(Math.random() * 50),
        lane2: Math.floor(Math.random() * 50),
        lane3: Math.floor(Math.random() * 50),
        lane4: Math.floor(Math.random() * 50)
      });
    }, 2000);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (isProcessing) {
      // Adjust signal timing based on vehicle count
      const totalVehicles = Object.values(vehicleCount).reduce((a, b) => a + b, 0);
      const baseTime = 30; // Base time in seconds
      
      setSignalTiming({
        lane1: Math.max(20, Math.floor((vehicleCount.lane1 / totalVehicles) * 120)),
        lane2: Math.max(20, Math.floor((vehicleCount.lane2 / totalVehicles) * 120)),
        lane3: Math.max(20, Math.floor((vehicleCount.lane3 / totalVehicles) * 120)),
        lane4: Math.max(20, Math.floor((vehicleCount.lane4 / totalVehicles) * 120))
      });
    }
  }, [vehicleCount, isProcessing]);

  const steps = [
    {
      title: "Video Feed Processing",
      icon: <FaVideo className="text-4xl text-blue-500" />,
      description: "Live CCTV feeds are processed in real-time using computer vision",
      details: [
        "Process 30 frames per second from each camera",
        "Apply image preprocessing techniques",
        "Handle different lighting conditions",
        "Detect and track vehicles across frames"
      ]
    },
    {
      title: "AI Model Analysis",
      icon: <FaBrain className="text-4xl text-purple-500" />,
      description: "AI models analyze the processed video to count vehicles and detect patterns",
      details: [
        "Use YOLOv8 for vehicle detection",
        "Track vehicle movement across frames",
        "Calculate lane occupancy rates",
        "Detect traffic patterns and anomalies"
      ]
    },
    {
      title: "Signal Timing Calculation",
      icon: <FaTrafficLight className="text-4xl text-green-500" />,
      description: "Dynamic calculation of optimal signal timing based on traffic density",
      details: [
        "Consider vehicle count per lane",
        "Factor in waiting time",
        "Adjust for emergency vehicles",
        "Maintain minimum green time"
      ]
    },
    {
      title: "Real-time Monitoring",
      icon: <FaChartLine className="text-4xl text-red-500" />,
      description: "Continuous monitoring and adjustment of signal timing",
      details: [
        "Track performance metrics",
        "Monitor system health",
        "Generate traffic reports",
        "Alert on anomalies"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">CCTV-Based Signal Automation</h1>
        <p className="text-xl text-gray-600">
          Real-time traffic signal automation using computer vision and AI
        </p>
      </div>

      {/* Live Demo Section */}
      <div className="bg-gray-100 p-6 rounded-lg mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Live Demo</h2>
          <button
            onClick={() => setIsProcessing(!isProcessing)}
            className={`flex items-center px-4 py-2 rounded ${
              isProcessing ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isProcessing ? (
              <>
                <FaPause className="mr-2" /> Stop Processing
              </>
            ) : (
              <>
                <FaPlay className="mr-2" /> Start Processing
              </>
            )}
          </button>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(vehicleCount).map(([lane, count], index) => (
            <div key={lane} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Lane {index + 1}</h3>
              <div className="text-2xl font-bold mb-2">{count}</div>
              <div className="text-sm text-gray-600">Vehicles</div>
              <div className="mt-2 text-green-600">
                {signalTiming[lane]}s green time
              </div>
            </div>
          ))}
        </div>

        {/* Mock CCTV Display */}
        <div className="bg-black h-64 rounded-lg flex items-center justify-center text-white">
          {isProcessing ? (
            <div className="text-center">
              <div className="animate-pulse mb-2">Processing Live Feed</div>
              <div className="text-sm text-gray-400">Detecting and counting vehicles...</div>
            </div>
          ) : (
            <div className="text-center">
              <FaVideo className="text-4xl mb-2 mx-auto" />
              <div>Click Start Processing to begin demo</div>
            </div>
          )}
        </div>
      </div>

      {/* Process Steps */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg"
            onMouseEnter={() => setActiveDemo(index)}
            onMouseLeave={() => setActiveDemo(null)}
          >
            <div className="flex justify-center mb-4">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">{step.title}</h3>
            <p className="text-gray-600 mb-4 text-center">{step.description}</p>
            {activeDemo === index && (
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-700 space-y-2"
              >
                {step.details.map((detail, i) => (
                  <li key={i} className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {detail}
                  </li>
                ))}
              </motion.ul>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CCTVAutomation;
