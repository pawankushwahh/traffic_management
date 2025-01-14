import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import VehiclePlateAnalytics from './components/VehiclePlateAnalytics';
import TrafficMap from './components/TrafficMap';
import SignalStatus from './components/SignalStatus';
import Statistics from './components/Statistics';
import VehicleAnalytics from './components/VehicleAnalytics';
import TrafficDashboard from './components/TrafficDashboard';
import SignalAutomation from './components/SignalAutomation';
import io from 'socket.io-client';
import axios from 'axios';
import WomenSafetyPage from './components/WomenSafety/WomenSafetyPage';
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
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-4 items-center">
                <Link to="/" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link to="/traffic-dashboard" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/vehicle-analytics" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                  Vehicle Analytics
                </Link>
                <Link to="/signal-automation" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                  Signal Automation
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/traffic-dashboard" element={<TrafficDashboard />} />
          <Route path="/vehicle-analytics" element={<VehicleAnalytics />} />
          <Route path="/signal-automation" element={<SignalAutomation />} />
          <Route
            path="/vehicle-plate-analytics"
            element={<VehiclePlateAnalytics />}
          />
          <Route path="/traffic-map" element={<TrafficMap locations={trafficData.locations} />} />
          <Route path="/signal-status" element={<SignalStatus statuses={signalStatuses} />} />
          <Route path="/statistics" element={<Statistics stats={stats} />} />
          <Route path="/women-safety" element={<WomenSafetyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
