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
    setError(null);

    // Preview video
    if (file) {
      const url = URL.createObjectURL(file);
      if (videoRef.current) {
        videoRef.current.src = url;
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a video file first');
      return;
    }

    setProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('video', selectedFile);

    try {
      const response = await axios.post(`${BACKEND_URL}/video/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTaskId(response.data.task_id);
      startProgressPolling(response.data.task_id);
    } catch (err) {
      setError('Error uploading video: ' + err.message);
      setProcessing(false);
    }
  };

  const startProgressPolling = (id) => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    progressInterval.current = setInterval(async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/video/progress/${id}`);
        const { progress, current_results } = response.data;
        
        setProgress(progress);
        if (current_results) {
          setResults(current_results);
        }

        if (progress === 100) {
          clearInterval(progressInterval.current);
          setProcessing(false);
        }
      } catch (err) {
        console.error('Error checking progress:', err);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

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
        <h1 className="text-3xl font-bold mb-8">Video Analysis</h1>
        
        {/* Video Upload Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Upload Traffic Video</h2>
            <input
              type="file"
              accept=".mp4,.avi,.mov"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          {/* Video Preview */}
          {selectedFile && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Preview</h3>
              <video
                ref={videoRef}
                className="w-full max-h-[400px] rounded"
                controls
              />
            </div>
          )}

          {/* Upload Button & Progress */}
          <div className="space-y-4">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || processing}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                !selectedFile || processing
                  ? 'bg-gray-400'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {processing ? 'Processing...' : 'Analyze Video'}
            </button>

            {processing && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                />
                <p className="text-sm text-gray-600 mt-2">
                  Processing: {progress.toFixed(1)}%
                </p>
              </div>
            )}

            {error && (
              <p className="text-red-500">{error}</p>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        {renderResults()}
      </div>
    </div>
  );
};

export default VehicleAnalytics;
