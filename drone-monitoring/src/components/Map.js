import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');  // Backend server URL

const Map = () => {
  const [dronePosition, setDronePosition] = useState({ latitude: 45.5017, longitude: -73.5673 });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Listen for drone position updates
    socket.on('drone_position', (data) => {
      setDronePosition(data);
    });

    // Listen for new alerts
    socket.on('new_alert', (alert) => {
      setAlerts((prevAlerts) => [...prevAlerts, alert]);
    });

    return () => {
      socket.off('drone_position');
      socket.off('new_alert');
    };
  }, []);

  return (
    <MapContainer center={[dronePosition.latitude, dronePosition.longitude]} zoom={13} style={{ height: '100vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Drone Marker */}
      <Marker position={[dronePosition.latitude, dronePosition.longitude]}>
        <Popup>Drone Position</Popup>
      </Marker>
      {/* Alert Markers */}
      {alerts.map((alert, index) => (
        <Marker key={index} position={[alert.latitude, alert.longitude]} icon={L.icon({ iconUrl: 'alert-icon.png', iconSize: [25, 25] })}>
          <Popup>{`Alert: ${alert.type}, Severity: ${alert.severity}`}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;