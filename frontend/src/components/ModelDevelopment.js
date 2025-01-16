import React from 'react';
import { FaDatabase, FaCode, FaBrain, FaRobot, FaServer, FaChartLine } from 'react-icons/fa';

const PhaseCard = ({ phase, description, steps, icon }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-xl font-semibold ml-3">{phase}</h3>
    </div>
    <p className="text-gray-600 mb-4">{description}</p>
    <ul className="list-disc list-inside text-gray-700 space-y-2">
      {steps.map((step, index) => (
        <li key={index}>{step}</li>
      ))}
    </ul>
  </div>
);

const ModelDevelopment = () => {
  const phases = [
    {
      phase: "System Design and Flowchart",
      description: "Initial planning and system architecture design",
      icon: <FaCode className="text-3xl text-blue-600" />,
      steps: [
        "Define automation objectives for signal timing",
        "Design data collection workflow",
        "Plan preprocessing pipeline",
        "Outline model training approach",
        "Design signal timing adjustment system"
      ]
    },
    {
      phase: "Data Collection",
      description: "Gathering and organizing training data",
      icon: <FaDatabase className="text-3xl text-green-600" />,
      steps: [
        "Install CCTV cameras at intersections",
        "Set up IoT sensors for additional data",
        "Label data using LabelImg/CVAT",
        "Create diverse dataset with various conditions",
        "Split data into training/validation/test sets"
      ]
    },
    {
      phase: "Data Preprocessing",
      description: "Preparing data for model training",
      icon: <FaChartLine className="text-3xl text-purple-600" />,
      steps: [
        "Clean and filter raw data",
        "Extract key features (vehicle count, density)",
        "Perform data augmentation",
        "Normalize and standardize data",
        "Generate training batches"
      ]
    },
    {
      phase: "Model Development",
      description: "Building and training the AI model",
      icon: <FaBrain className="text-3xl text-red-600" />,
      steps: [
        "Implement YOLOv8 for object detection",
        "Develop CNN for density analysis",
        "Train models using GPU acceleration",
        "Optimize hyperparameters",
        "Evaluate model performance"
      ]
    },
    {
      phase: "Signal Timing Algorithm",
      description: "Developing intelligent signal control",
      icon: <FaRobot className="text-3xl text-yellow-600" />,
      steps: [
        "Create rule-based baseline algorithm",
        "Implement Deep Q-Learning for optimization",
        "Define state-action-reward system",
        "Test using SUMO simulation",
        "Fine-tune timing parameters"
      ]
    },
    {
      phase: "Deployment",
      description: "System implementation and monitoring",
      icon: <FaServer className="text-3xl text-indigo-600" />,
      steps: [
        "Deploy model on edge devices",
        "Set up real-time processing pipeline",
        "Implement monitoring system",
        "Configure automatic updates",
        "Establish feedback collection"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Model Development Roadmap</h1>
        <p className="text-xl text-gray-600">
          Step-by-step process for developing our automated traffic signal system
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {phases.map((phase, index) => (
          <PhaseCard key={index} {...phase} />
        ))}
      </div>

      <div className="mt-12 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Tools and Frameworks Used</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Data Collection</h3>
            <ul className="text-gray-600 list-disc list-inside">
              <li>CCTV cameras</li>
              <li>IoT sensors</li>
              <li>LabelImg</li>
              <li>CVAT</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Model Development</h3>
            <ul className="text-gray-600 list-disc list-inside">
              <li>TensorFlow</li>
              <li>PyTorch</li>
              <li>OpenCV</li>
              <li>YOLO</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Simulation</h3>
            <ul className="text-gray-600 list-disc list-inside">
              <li>SUMO</li>
              <li>MATLAB</li>
              <li>Simulink</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Deployment</h3>
            <ul className="text-gray-600 list-disc list-inside">
              <li>NVIDIA Jetson</li>
              <li>AWS</li>
              <li>Google Cloud</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDevelopment;
