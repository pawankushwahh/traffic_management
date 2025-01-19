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
    { id: 1, name: 'North Junction', density: 0, signal: 'red', waitTime: 0, timer: 0 },
    { id: 2, name: 'South Junction', density: 0, signal: 'red', waitTime: 0, timer: 0 },
    { id: 3, name: 'East Junction', density: 0, signal: 'red', waitTime: 0, timer: 0 },
    { id: 4, name: 'West Junction', density: 0, signal: 'red', waitTime: 0, timer: 0 },
  ]);

  const [currentGreenIndex, setCurrentGreenIndex] = useState(0);
  const [simulationActive, setSimulationActive] = useState(false);
  const [cctvActive, setCctvActive] = useState(true);
  const simulationRef = useRef(null);
  const timerRef = useRef(null);
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

  // Calculate signal timing based on traffic density
  const calculateGreenTime = (density) => {
    // Minimum time of 10 seconds, maximum of 60 seconds
    const minTime = 10;
    const maxTime = 60;
    // Calculate time based on density
    const calculatedTime = minTime + Math.floor((density / 100) * (maxTime - minTime));
    return calculatedTime;
  };

  // Calculate red time for other signals based on current green signal
  const calculateRedTime = (greenTime, position, currentGreen) => {
    // Calculate how many signals ahead this one is from the current green
    const distance = (position - currentGreen + 4) % 4;
    return greenTime * distance;
  };

  // Simulated YOLO detection results with more realistic patterns
  const detectTraffic = (videoElement, junctionId) => {
    // Simulate more realistic traffic patterns
    const timeOfDay = new Date().getHours();
    const isRushHour = (timeOfDay >= 8 && timeOfDay <= 10) || (timeOfDay >= 16 && timeOfDay <= 18);
    
    // Base density varies by time of day
    let baseDensity = isRushHour ? 70 : 40;
    
    // Add some randomization
    const variation = Math.random() * 30 - 15; // ±15
    
    // Ensure density stays within bounds
    return Math.max(10, Math.min(100, baseDensity + variation)); // Minimum 10% density
  };

  // Switch signals based on timer
  const switchSignals = () => {
    setJunctions(prevJunctions => {
      const newJunctions = [...prevJunctions];
      
      // Get density of current green junction
      const currentDensity = newJunctions[currentGreenIndex].density;
      
      // Calculate green time based on current density
      const greenTime = calculateGreenTime(currentDensity);
      
      // Update all junction timers and signals
      newJunctions.forEach((junction, index) => {
        if (index === currentGreenIndex) {
          junction.signal = 'green';
          junction.timer = greenTime;
        } else {
          junction.signal = 'red';
          junction.timer = calculateRedTime(greenTime, index, currentGreenIndex);
          
          // Set yellow signal for next junction in sequence
          if (index === (currentGreenIndex + 1) % 4) {
            junction.signal = 'yellow';
          }
        }
      });
      
      return newJunctions;
    });
    
    // Move to next junction after current green time expires
    const currentGreenTime = calculateGreenTime(junctions[currentGreenIndex].density);
    setTimeout(() => {
      setCurrentGreenIndex((prev) => (prev + 1) % 4);
    }, currentGreenTime * 1000);
  };

  useEffect(() => {
    if (simulationActive) {
      // Update traffic density every 2 seconds
      simulationRef.current = setInterval(() => {
        setJunctions(prevJunctions => {
          return prevJunctions.map(junction => {
            const density = detectTraffic(videoRefs.current[junction.id - 1], junction.id);
            return {
              ...junction,
              density,
              waitTime: Math.floor(junction.timer),
            };
          });
        });
      }, 2000);

      // Initialize signal switching
      switchSignals();
      
      // Update timers every second
      timerRef.current = setInterval(() => {
        setJunctions(prevJunctions => {
          return prevJunctions.map(junction => ({
            ...junction,
            timer: Math.max(0, junction.timer - 1),
          }));
        });
      }, 1000);
    } else {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [simulationActive, currentGreenIndex]);

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
              <div className="traffic-animation">
                <div className="road">
                  <div className="road-line" />
                </div>
                {[...Array(Math.ceil(junction.density / 20))].map((_, i) => (
                  <div
                    key={i}
                    className={`vehicle car${(i % 4) + 1} ${junction.signal === 'green' ? 'active' : ''}`}
                    style={{
                      '--speed': `${junction.signal === 'green' ? '2s' : '4s'}`,
                      animationDelay: `${i * 0.5}s`
                    }}
                  />
                ))}
              </div>
              
              <div className="analytics-overlay">
                <BiCctv />
                <span className="live-indicator">LIVE</span>
                <span>{Math.round(junction.density)}% Density</span>
              </div>

              <div className="signal-controls mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{junction.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`signal-light ${junction.signal}`}>
                      <span className="timer-display">{Math.ceil(junction.timer)}s</span>
                    </div>
                    <span className="signal-status">{junction.signal.toUpperCase()}</span>
                  </div>
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
                  <span>Density: {Math.round(junction.density)}%</span>
                  <span>Wait Time: {junction.timer > 0 ? Math.ceil(junction.timer) : 0}s</span>
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
