import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaSync } from 'react-icons/fa';

const AdaptiveTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationData, setSimulationData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(fetchSimulationData, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const fetchSimulationData = async () => {
    try {
      const response = await axios.get('/api/simulation/status');
      setSimulationData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch simulation data');
      setIsRunning(false);
    }
  };

  const startSimulation = async () => {
    try {
      await axios.post('/api/simulation/start');
      setIsRunning(true);
      setError(null);
    } catch (err) {
      setError('Failed to start simulation');
    }
  };

  const stopSimulation = async () => {
    try {
      await axios.post('/api/simulation/stop');
      setIsRunning(false);
      setError(null);
    } catch (err) {
      setError('Failed to stop simulation');
    }
  };

  const resetSimulation = async () => {
    try {
      await axios.post('/api/simulation/reset');
      setSimulationData(null);
      setError(null);
    } catch (err) {
      setError('Failed to reset simulation');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Adaptive Traffic Signal Timer</h1>
        <p className="text-xl text-gray-600">
          Real-time traffic signal optimization using computer vision and vehicle detection
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-center space-x-4">
          <button
            onClick={isRunning ? stopSimulation : startSimulation}
            className={`flex items-center px-6 py-3 rounded-lg ${
              isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isRunning ? (
              <>
                <FaPause className="mr-2" /> Stop Simulation
              </>
            ) : (
              <>
                <FaPlay className="mr-2" /> Start Simulation
              </>
            )}
          </button>
          <button
            onClick={resetSimulation}
            className="flex items-center px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
          >
            <FaSync className="mr-2" /> Reset
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          {error}
        </div>
      )}

      {/* Simulation Display */}
      {simulationData && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Traffic View */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Traffic View</h2>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded">
              {simulationData.frame && (
                <img
                  src={`data:image/jpeg;base64,${simulationData.frame}`}
                  alt="Traffic Simulation"
                  className="rounded"
                />
              )}
            </div>
          </div>

          {/* Stats Panel */}
          <div className="space-y-6">
            {/* Vehicle Counts */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Vehicle Detection</h3>
              <div className="grid grid-cols-2 gap-4">
                {simulationData.vehicles && Object.entries(simulationData.vehicles).map(([type, count]) => (
                  <div key={type} className="bg-gray-50 p-4 rounded">
                    <div className="text-sm text-gray-600 capitalize">{type}</div>
                    <div className="text-2xl font-bold">{count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signal Timings */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Signal Timings</h3>
              <div className="grid grid-cols-2 gap-4">
                {simulationData.signals && simulationData.signals.map((signal, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded">
                    <div className="text-sm text-gray-600">Signal {index + 1}</div>
                    <div className="text-2xl font-bold">{signal.time}s</div>
                    <div className={`text-sm ${
                      signal.state === 'green' ? 'text-green-600' :
                      signal.state === 'yellow' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {signal.state.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdaptiveTimer;
