import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = ({ stats }) => {
  const chartData = {
    labels: stats?.congestedIntersections?.map((i) => i.name) || [],
    datasets: [
      {
        label: 'Wait Time (seconds)',
        data: stats?.congestedIntersections?.map((i) => i.waitTime) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Most Congested Intersections',
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600">Total Vehicles</h3>
          <p className="text-2xl font-bold text-blue-900">
            {stats?.totalVehicles || 0}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-600">
            Active Signals
          </h3>
          <p className="text-2xl font-bold text-green-900">
            {stats?.activeSignals || 0}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-600">
            Avg Wait Time
          </h3>
          <p className="text-2xl font-bold text-yellow-900">
            {stats?.avgWaitTime || 0}s
          </p>
        </div>
      </div>
      <div className="h-[300px]">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
};

export default Statistics;
