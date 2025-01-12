import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const TrafficMap = ({ trafficData }) => {
  const getColor = (density) => {
    switch (density) {
      case 'low':
        return '#22c55e';
      case 'medium':
        return '#eab308';
      case 'high':
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  };

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[12.9716, 77.5946]} // Default center (Bangalore)
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {trafficData?.map((location) => (
          <Circle
            key={location.id}
            center={[location.lat, location.lng]}
            radius={500}
            pathOptions={{
              color: getColor(location.density),
              fillColor: getColor(location.density),
              fillOpacity: 0.6,
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">Traffic Density: {location.density}</h3>
                <p>Vehicle Count: {location.vehicleCount}</p>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
};

export default TrafficMap;
