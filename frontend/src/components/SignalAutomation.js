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
import { FaCar, FaTrafficLight, FaLeaf } from 'react-icons/fa';
import { MdEmergency } from 'react-icons/md';

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
  const [trafficData, setTrafficData] = useState({
    junction1: { density: 0, signal: 'red' },
    junction2: { density: 0, signal: 'red' },
    junction3: { density: 0, signal: 'red' },
    junction4: { density: 0, signal: 'red' },
  });

  const [simulationActive, setSimulationActive] = useState(false);
  const simulationRef = useRef(null);

  const chartData = {
    labels: ['Junction 1', 'Junction 2', 'Junction 3', 'Junction 4'],
    datasets: [
      {
        label: 'Traffic Density',
        data: Object.values(trafficData).map(j => j.density),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
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
        text: 'Real-time Traffic Density',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  useEffect(() => {
    if (simulationActive) {
      simulationRef.current = setInterval(() => {
        setTrafficData(prev => {
          const newData = { ...prev };
          Object.keys(newData).forEach(junction => {
            // Simulate random traffic density changes
            newData[junction].density = Math.min(
              100,
              Math.max(0, newData[junction].density + (Math.random() - 0.5) * 20)
            );
            
            // Automate signal based on density
            if (newData[junction].density > 70) {
              newData[junction].signal = 'green';
            } else if (newData[junction].density > 30) {
              newData[junction].signal = 'yellow';
            } else {
              newData[junction].signal = 'red';
            }
          });
          return newData;
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

  const benefits = [
    {
      icon: <FaCar className="text-3xl text-blue-500" />,
      title: 'Reduced Congestion',
      description: 'Smart signal timing reduces traffic buildup and improves flow'
    },
    {
      icon: <MdEmergency className="text-3xl text-red-500" />,
      title: 'Emergency Response',
      description: 'Priority routing for emergency vehicles through automated signal control'
    },
    {
      icon: <FaLeaf className="text-3xl text-green-500" />,
      title: 'Eco-Friendly',
      description: 'Less idle time means reduced emissions and fuel consumption'
    },
    {
      icon: <FaTrafficLight className="text-3xl text-yellow-500" />,
      title: 'Adaptive Control',
      description: 'Signals adjust in real-time based on actual traffic conditions'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold text-center mb-8">Signal Automation System</h1>
      
      {/* Introduction */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Smart Traffic Management</h2>
        <p className="text-gray-700 leading-relaxed">
          Inspired by Singapore's advanced traffic systems, our signal automation technology 
          uses real-time vehicle density data to optimize traffic flow. Through a network of 
          sensors and smart algorithms, traffic signals automatically adjust their timing to 
          accommodate varying traffic patterns throughout the day.
        </p>
      </div>

      {/* Simulation Control */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Real-time Simulation</h2>
          <button
            onClick={() => setSimulationActive(!simulationActive)}
            className={`px-6 py-2 rounded-lg font-semibold ${
              simulationActive
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {simulationActive ? 'Stop Simulation' : 'Start Simulation'}
          </button>
        </div>

        {/* Traffic Visualization */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.entries(trafficData).map(([junction, data]) => (
            <div key={junction} className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{junction.replace(/([A-Z])/g, ' $1').trim()}</h3>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Density: {Math.round(data.density)}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${data.density}%` }}
                    ></div>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full ml-4 ${
                    data.signal === 'red' ? 'bg-red-500' :
                    data.signal === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Density Chart */}
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 text-center"
          >
            <div className="flex justify-center mb-4">{benefit.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SignalAutomation;
