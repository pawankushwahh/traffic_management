import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import TrafficMap from './TrafficMap';
import SignalStatus from './SignalStatus';
import Statistics from './Statistics';

const BACKEND_URL = 'http://localhost:5000';
const socket = io(BACKEND_URL);

const TrafficDashboard = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [signals, setSignals] = useState([]);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeSignals: 0,
    avgWaitTime: 0,
    congestedIntersections: []
  });

  useEffect(() => {
    // Initial data fetch
    const fetchData = async () => {
      try {
        const [trafficRes, signalRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/traffic-density`),
          axios.get(`${BACKEND_URL}/api/signal-status`)
        ]);
        setTrafficData(trafficRes.data.locations);
        setSignals(signalRes.data.signals);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Socket listeners for real-time updates
    socket.on('trafficUpdate', (data) => {
      setTrafficData(data.locations);
      // Update statistics
      setStats(prev => ({
        ...prev,
        totalVehicles: data.locations.reduce((acc, loc) => acc + loc.vehicleCount, 0),
        congestedIntersections: data.locations
          .sort((a, b) => b.vehicleCount - a.vehicleCount)
          .slice(0, 5)
          .map(loc => ({
            name: `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`,
            waitTime: Math.floor(Math.random() * 120) // Mock wait time
          }))
      }));
    });

    return () => {
      socket.off('trafficUpdate');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Traffic Control Dashboard</h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TrafficMap trafficData={trafficData} />
          </div>
          <div>
            <SignalStatus signals={signals} />
          </div>
        </div>
        <div className="mt-6">
          <Statistics stats={stats} />
        </div>

        {/* YOLO Detection Info */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">AI-Powered Traffic Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Vehicle Detection</h3>
              <p className="text-sm text-blue-600 mt-2">
                Using YOLOv8 for real-time vehicle detection and classification
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Traffic Density</h3>
              <p className="text-sm text-green-600 mt-2">
                AI analysis of traffic density and flow patterns
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Signal Optimization</h3>
              <p className="text-sm text-purple-600 mt-2">
                Dynamic signal timing based on real-time traffic conditions
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800">Emergency Detection</h3>
              <p className="text-sm text-yellow-600 mt-2">
                Priority routing for emergency vehicles
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrafficDashboard;
