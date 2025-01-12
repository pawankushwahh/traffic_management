import React from 'react';

const SignalStatus = ({ signals }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'red':
        return 'bg-red-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">Signal Status</h2>
      <div className="grid gap-4">
        {signals?.map((signal) => (
          <div
            key={signal.id}
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold">{signal.intersection}</h3>
              <p className="text-sm text-gray-600">
                Wait Time: {signal.waitTime}s
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${getStatusColor(
                  signal.status
                )}`}
              />
              <span className="text-sm font-medium">{signal.timer}s</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignalStatus;
