import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import VehiclePlateAnalytics from './components/VehiclePlateAnalytics';
import TrafficMap from './components/TrafficMap';
import SignalStatus from './components/SignalStatus';
import Statistics from './components/Statistics';
import VehicleAnalytics from './components/VehicleAnalytics';
import TrafficDashboard from './components/TrafficDashboard';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';

const BACKEND_URL = 'http://localhost:5000';
const socket = io(BACKEND_URL);

function App() {
  const [trafficData, setTrafficData] = useState({
    locations: [
      {
        id: 1,
        name: "Junction A",
        coordinates: { lat: 12.9716, lng: 77.5946 },
        status: "High",
        count: 150
      },
      {
        id: 2,
        name: "Junction B",
        coordinates: { lat: 12.9766, lng: 77.5993 },
        status: "Medium",
        count: 80
      }
    ]
  });

  const [signalStatuses, setSignalStatuses] = useState([]);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    averageSpeed: 0,
    violations: 0
  });

  useEffect(() => {
    // Socket connection for real-time updates
    socket.on('trafficUpdate', (data) => {
      setTrafficData(data);
    });

    socket.on('signalUpdate', (data) => {
      setSignalStatuses(data);
    });

    socket.on('statsUpdate', (data) => {
      setStats(data);
    });

    // Initial data fetch
    const fetchData = async () => {
      try {
        const [trafficRes, signalRes, statsRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/traffic-data`),
          axios.get(`${BACKEND_URL}/api/signal-status`),
          axios.get(`${BACKEND_URL}/api/statistics`)
        ]);

        setTrafficData(trafficRes.data);
        setSignalStatuses(signalRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      socket.off('trafficUpdate');
      socket.off('signalUpdate');
      socket.off('statsUpdate');
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex items-center">
                  <span className="text-xl font-semibold text-gray-800">
                    Traffic Management
                  </span>
                </Link>
              </div>
              <div className="flex items-center">
                <Link
                  to="/"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Home
                </Link>
                <Link
                  to="/vehicle-plate"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Vehicle Analytics
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vehicle-plate" element={<VehiclePlateAnalytics />} />
          <Route path="/traffic-dashboard" element={
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TrafficMap data={trafficData} />
                <SignalStatus data={signalStatuses} />
                <Statistics data={stats} />
              </div>
            </div>
          } />
          <Route path="/vehicle-analytics" element={<VehicleAnalytics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
