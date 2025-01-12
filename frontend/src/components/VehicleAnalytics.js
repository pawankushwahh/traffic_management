import React, { useState, useEffect, useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BACKEND_URL = 'http://localhost:5000';

const VehicleAnalytics = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const progressInterval = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const renderResults = () => {
    if (!results) return null;

    const vehicleData = {
      labels: Object.keys(results.vehicle_counts),
      datasets: [{
        label: 'Vehicle Counts',
        data: Object.values(results.vehicle_counts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      }],
    };

    const densityData = {
      labels: results.traffic_density.map(d => d.time.toFixed(1) + 's'),
      datasets: [{
        label: 'Traffic Density',
        data: results.traffic_density.map(d => d.density),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      }],
    };

    return (
      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-bold">Analysis Results</h2>
        
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800">Total Vehicles</h3>
            <p className="text-2xl font-bold text-blue-600">{results.total_vehicles}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800">Video Duration</h3>
            <p className="text-2xl font-bold text-green-600">{results.duration.toFixed(1)}s</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium text-yellow-800">Average Density</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {(results.average_density * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800">Peak Density</h3>
            <p className="text-2xl font-bold text-purple-600">
              {(results.peak_density * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Vehicle Distribution</h3>
            <Bar data={vehicleData} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Traffic Density Over Time</h3>
            <Line data={densityData} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Vehicle Analytics</h1>
        
        <div>
          <h2>Vehicle Analytics</h2>
          <p>Demo Animation: (Here you can include a demo animation or example)</p>
          <div className="demo-animation">
            {/* Include your demo animation component or code here */}
          </div>
          <h3>Examples:</h3>
          <ul>
            <li>Example 1: Description of the first example.</li>
            <li>Example 2: Description of the second example.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VehicleAnalytics;
