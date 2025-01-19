import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaCar, FaTrafficLight, FaVideo, FaChartLine } from 'react-icons/fa';
import { MdTimer, MdAutorenew } from 'react-icons/md';
import { BiCctv } from 'react-icons/bi';
import './SignalAutomation.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SignalAutomation = () => {
  const [junctions, setJunctions] = useState([
    { id: 1, name: 'North Junction', density: 0, signal: 'red', waitTime: 0 },
    { id: 2, name: 'South Junction', density: 0, signal: 'red', waitTime: 0 },
    { id: 3, name: 'East Junction', density: 0, signal: 'red', waitTime: 0 },
    { id: 4, name: 'West Junction', density: 0, signal: 'red', waitTime: 0 },
  ]);

  const [simulationActive, setSimulationActive] = useState(false);
  const [cctvActive, setCctvActive] = useState(true);
  const simulationRef = useRef(null);
  const videoRefs = useRef([]);

  // Chart configuration
  const chartData = {
    labels: junctions.map(j => j.name),
    datasets: [
      {
        label: 'Traffic Density (%)',
        data: junctions.map(j => j.density),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Wait Time (seconds)',
        data: junctions.map(j => j.waitTime),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Real-time Traffic Analysis',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  // Simulated YOLO detection results
  const detectTraffic = (videoElement) => {
    // Simulated YOLO detection - would be replaced with actual ML model
    return Math.floor(Math.random() * 100);
  };

  useEffect(() => {
    if (simulationActive) {
      simulationRef.current = setInterval(() => {
        setJunctions(prevJunctions => {
          return prevJunctions.map(junction => {
            const density = detectTraffic(videoRefs.current[junction.id - 1]);
            const waitTime = Math.floor(density * 0.5); // Simplified wait time calculation
            
            let newSignal = 'red';
            if (density > 70) {
              newSignal = 'green';
            } else if (density > 40) {
              newSignal = 'yellow';
            }

            return {
              ...junction,
              density,
              waitTime,
              signal: newSignal,
            };
          });
        });
      }, 2000);
    } else if (simulationRef.current) {
      clearInterval(simulationRef.current);
    }

    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
    };
  }, [simulationActive]);

  return (
    <div className="signal-automation-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <FaTrafficLight className="text-green-500" />
          Intelligent Traffic Signal Control
        </h1>

        <div className="cctv-grid">
          {junctions.map((junction, index) => (
            <motion.div
              key={junction.id}
              className="cctv-feed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <video
                ref={el => videoRefs.current[index] = el}
                autoPlay
                muted
                loop
                className="w-full h-48 object-cover"
                style={{ opacity: cctvActive ? 1 : 0.5 }}
              >
                <source src={`/traffic-feed-${index + 1}.mp4`} type="video/mp4" />
              </video>
              
              <div className="analytics-overlay">
                <BiCctv />
                <span className="live-indicator">LIVE</span>
                <span>{junction.density}% Density</span>
              </div>

              <div className="signal-controls mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{junction.name}</h3>
                  <div className={`signal-light ${junction.signal}`} />
                </div>
                
                <div className="density-bar">
                  <div
                    className="density-bar-fill"
                    style={{
                      width: `${junction.density}%`,
                      backgroundColor: junction.density > 70 ? '#ff4444' : 
                                    junction.density > 40 ? '#ffbb33' : '#00C851'
                    }}
                  />
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Wait Time: {junction.waitTime}s</span>
                  <span>Vehicles: {Math.floor(junction.density * 0.8)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-4 mb-8">
          <button
            className="control-button"
            onClick={() => setSimulationActive(!simulationActive)}
          >
            {simulationActive ? <MdTimer /> : <MdAutorenew />}
            {simulationActive ? 'Stop Automation' : 'Start Automation'}
          </button>
          
          <button
            className="control-button"
            onClick={() => setCctvActive(!cctvActive)}
          >
            <FaVideo />
            {cctvActive ? 'Pause CCTV' : 'Resume CCTV'}
          </button>
        </div>

        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      </motion.div>
    </div>
  );
};

export default SignalAutomation;
