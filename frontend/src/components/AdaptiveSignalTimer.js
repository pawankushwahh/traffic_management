import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaCar, FaBus, FaMotorcycle, FaStopwatch, FaPlay, FaPause } from 'react-icons/fa';
import { BiCctv } from 'react-icons/bi';

const AdaptiveSignalTimer = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [vehicleCounts, setVehicleCounts] = useState({
    cars: 0,
    bikes: 0,
    buses: 0,
    trucks: 0
  });
  const [signalTimes, setSignalTimes] = useState({
    north: 30,
    south: 30,
    east: 30,
    west: 30
  });
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Simulation parameters
  const laneWidth = 40;
  const vehicleLength = 30;
  const vehicleSpeed = 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let vehicles = [];

    const drawRoad = () => {
      ctx.fillStyle = '#333';
      // Horizontal road
      ctx.fillRect(0, canvas.height/2 - laneWidth, canvas.width, laneWidth * 2);
      // Vertical road
      ctx.fillRect(canvas.width/2 - laneWidth, 0, laneWidth * 2, canvas.height);
      
      // Lane markings
      ctx.setLineDash([20, 20]);
      ctx.strokeStyle = '#fff';
      ctx.beginPath();
      // Horizontal lines
      ctx.moveTo(0, canvas.height/2);
      ctx.lineTo(canvas.width, canvas.height/2);
      // Vertical lines
      ctx.moveTo(canvas.width/2, 0);
      ctx.lineTo(canvas.width/2, canvas.height);
      ctx.stroke();
    };

    const drawTrafficLights = () => {
      const lights = [
        { x: canvas.width/2 - 60, y: canvas.height/2 - 60, time: signalTimes.north },
        { x: canvas.width/2 + 60, y: canvas.height/2 + 60, time: signalTimes.south },
        { x: canvas.width/2 + 60, y: canvas.height/2 - 60, time: signalTimes.east },
        { x: canvas.width/2 - 60, y: canvas.height/2 + 60, time: signalTimes.west }
      ];

      lights.forEach(light => {
        ctx.fillStyle = '#000';
        ctx.fillRect(light.x - 20, light.y - 20, 40, 40);
        ctx.fillStyle = light.time > 0 ? '#00ff00' : '#ff0000';
        ctx.beginPath();
        ctx.arc(light.x, light.y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw timer
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.fillText(Math.max(0, light.time), light.x - 6, light.y + 4);
      });
    };

    const addVehicle = () => {
      if (Math.random() < 0.02) {
        const direction = Math.floor(Math.random() * 4);
        const type = Math.random() < 0.7 ? 'car' : Math.random() < 0.9 ? 'bike' : 'bus';
        let x, y, dx, dy;
        
        switch(direction) {
          case 0: // North
            x = canvas.width/2 - laneWidth/2;
            y = canvas.height;
            dx = 0;
            dy = -vehicleSpeed;
            break;
          case 1: // South
            x = canvas.width/2 + laneWidth/2;
            y = 0;
            dx = 0;
            dy = vehicleSpeed;
            break;
          case 2: // East
            x = 0;
            y = canvas.height/2 + laneWidth/2;
            dx = vehicleSpeed;
            dy = 0;
            break;
          case 3: // West
            x = canvas.width;
            y = canvas.height/2 - laneWidth/2;
            dx = -vehicleSpeed;
            dy = 0;
            break;
        }

        vehicles.push({ x, y, dx, dy, type });
        
        // Update vehicle counts
        setVehicleCounts(prev => ({
          ...prev,
          [type + 's']: prev[type + 's'] + 1
        }));
      }
    };

    const moveVehicles = () => {
      vehicles = vehicles.filter(vehicle => {
        vehicle.x += vehicle.dx;
        vehicle.y += vehicle.dy;
        return vehicle.x >= 0 && vehicle.x <= canvas.width && 
               vehicle.y >= 0 && vehicle.y <= canvas.height;
      });
    };

    const drawVehicles = () => {
      vehicles.forEach(vehicle => {
        ctx.fillStyle = vehicle.type === 'car' ? '#4a90e2' : 
                       vehicle.type === 'bike' ? '#f5a623' : '#7ed321';
        const width = vehicle.type === 'bike' ? vehicleLength/2 : 
                     vehicle.type === 'bus' ? vehicleLength*1.5 : vehicleLength;
        const height = vehicle.type === 'bike' ? vehicleLength/2 : vehicleLength;
        ctx.fillRect(vehicle.x - width/2, vehicle.y - height/2, width, height);
      });
    };

    const updateSignalTimes = () => {
      const totalVehicles = Object.values(vehicleCounts).reduce((a, b) => a + b, 0);
      if (totalVehicles > 0) {
        const getTime = (count) => Math.max(20, Math.min(60, Math.floor((count / totalVehicles) * 120)));
        setSignalTimes({
          north: getTime(vehicles.filter(v => v.dy < 0).length),
          south: getTime(vehicles.filter(v => v.dy > 0).length),
          east: getTime(vehicles.filter(v => v.dx > 0).length),
          west: getTime(vehicles.filter(v => v.dx < 0).length)
        });
      }
    };

    const animate = () => {
      if (!isSimulating) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawRoad();
      drawTrafficLights();
      addVehicle();
      moveVehicles();
      drawVehicles();
      updateSignalTimes();
      
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isSimulating) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSimulating, signalTimes]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Adaptive Signal Timer</h1>
        <p className="text-xl text-gray-600">
          Real-time traffic signal optimization using vehicle detection and adaptive timing
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Simulation Canvas */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Traffic Simulation</h2>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`flex items-center px-4 py-2 rounded ${
                isSimulating ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              {isSimulating ? (
                <>
                  <FaPause className="mr-2" /> Stop Simulation
                </>
              ) : (
                <>
                  <FaPlay className="mr-2" /> Start Simulation
                </>
              )}
            </button>
          </div>
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="border border-gray-200 rounded"
          />
        </div>

        {/* Stats and Info */}
        <div className="space-y-6">
          {/* Vehicle Counts */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Vehicle Detection</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <FaCar className="text-2xl text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Cars</p>
                  <p className="text-xl font-bold">{vehicleCounts.cars}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaMotorcycle className="text-2xl text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Bikes</p>
                  <p className="text-xl font-bold">{vehicleCounts.bikes}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaBus className="text-2xl text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Buses</p>
                  <p className="text-xl font-bold">{vehicleCounts.buses}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Signal Timings */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Signal Timings</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(signalTimes).map(([direction, time]) => (
                <div key={direction} className="flex items-center space-x-3">
                  <FaStopwatch className="text-2xl text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600 capitalize">{direction}</p>
                    <p className="text-xl font-bold">{time}s</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">How it Works</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <BiCctv className="text-2xl text-blue-500 mt-1" />
                <div>
                  <p className="font-semibold">Vehicle Detection</p>
                  <p className="text-sm text-gray-600">YOLO-based detection system identifies and classifies vehicles in real-time</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaStopwatch className="text-2xl text-purple-500 mt-1" />
                <div>
                  <p className="font-semibold">Adaptive Timing</p>
                  <p className="text-sm text-gray-600">Signal timings automatically adjust based on traffic density and vehicle types</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveSignalTimer;
