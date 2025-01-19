import React from 'react';
import { Link } from 'react-router-dom';
import { FaCarSide, FaVideo, FaCamera, FaExclamationTriangle, FaUserShield, FaChartLine, FaTrafficLight, FaStopwatch, FaShieldAlt } from 'react-icons/fa';

const FeatureCard = ({ title, description, icon, link }) => (
  <Link to={link} className="block">
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </Link>
);

const TechItem = ({ title, description }) => (
  <div className="text-center">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const ProcessStep = ({ number, title, description }) => (
  <div className="text-center">
    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
      {number}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const HomePage = () => {
  const features = [
    {
      title: "Smart Traffic Management",
      description: "AI-powered traffic signal control using real-time CCTV analysis and YOLO vehicle detection",
      icon: <FaCarSide />,
      link: "/traffic-dashboard"
    },
    {
      title: "Signal Automation",
      description: "Advanced traffic signal automation system inspired by Singapore's smart traffic management",
      icon: <FaTrafficLight />,
      link: "/signal-automation"
    },
    {
      title: "Vehicle Plate Analytics",
      description: "AI-powered number plate recognition for traffic rule compliance and tax management",
      icon: <FaVideo />,
      link: "/vehicle-plate-analytics"
    },
    {
      title: "Women Safety",
      description: "Emergency reporting system for women's safety with instant authority notification",
      icon: <FaUserShield />,
      link: "/women-safety"
    },
    {
      title: "CCTV Automation",
      description: "Real-time traffic signal automation using computer vision and AI analysis of CCTV feeds",
      icon: <FaVideo />,
      link: "/cctv-automation"
    },
    {
      title: "Adaptive Signal Timer",
      description: "Intelligent traffic signal timing system using vehicle detection and real-time adaptation",
      icon: <FaStopwatch />,
      link: "/adaptive-timer"
    },
    {
      title: "Rule Violation Detection",
      description: "AI-powered traffic rule violation detection with automatic e-challan",
      icon: <FaShieldAlt />,
      link: "/violations"
    }
  ];

  const anprFeatures = [
    {
      icon: "🔍",
      title: "Real-time ANPR",
      description: "Instant number plate detection and verification"
    },
    {
      icon: "📋",
      title: "Violation History",
      description: "Comprehensive database of vehicle violations"
    },
    {
      icon: "⚡",
      title: "Smart Alerts",
      description: "Instant notifications for rule violations"
    },
    {
      icon: "💰",
      title: "Easy Payments",
      description: "Quick fine payment and tax management"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            Smart Traffic Management System
          </h1>
          <p className="text-xl">
            AI-Powered Traffic Control & Analysis Platform
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* ANPR Features Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Advanced ANPR Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {anprFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <TechItem title="YOLO v8" description="Real-time object detection" />
            <TechItem title="OpenCV" description="Computer vision processing" />
            <TechItem title="TensorFlow" description="Deep learning models" />
            <TechItem title="Python" description="Backend processing" />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProcessStep 
              number="1"
              title="Video Input"
              description="CCTV cameras capture real-time traffic footage"
            />
            <ProcessStep 
              number="2"
              title="AI Processing"
              description="YOLO-based detection identifies vehicles and number plates"
            />
            <ProcessStep 
              number="3"
              title="Smart Control"
              description="Automated violation detection and fine generation"
            />
          </div>
        </div>
      </div>

      {/* Community Engagement Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Community Engagement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Public Awareness</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Regular traffic safety workshops
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Digital awareness campaigns
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Community feedback system
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Incentive Program</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">🏆</span>
                  Rewards for rule compliance
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🎯</span>
                  Early payment discounts
                </li>
                <li className="flex items-center">
                  <span className="mr-2">⭐</span>
                  Recognition for safe drivers
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
