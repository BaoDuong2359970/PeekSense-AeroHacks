import { useEffect, useMemo, useState } from "react";
import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup,
    Polyline,
    useMap
} from "react-leaflet";
import L from "leaflet";
import { io } from "socket.io-client";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

const socket = io("http://localhost:5000");

function RecenterMap({ drone }) {
    const map = useMap();

    useEffect(() => {
        if (drone?.latitude && drone?.longitude) {
            map.setView([drone.latitude, drone.longitude], map.getZoom(), {
                animate: true
            });
        }
    }, [drone, map]);

    return null;
}

function DroneMarker({ drone }) {
    if (!drone) return null;

    const droneIcon = L.divIcon({
        className: "custom-drone-icon",
        html: `<div class="drone-pulse"></div><div class="drone-core"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    return (
        <CircleMarker
            center={[drone.latitude, drone.longitude]}
            radius={0}
            pathOptions={{ opacity: 0 }}
        >
            <Popup>
                <strong>Drone</strong>
                <br />
                Battery: {Number(drone.battery).toFixed(1)}%
                <br />
                Status: {drone.status}
            </Popup>
        </CircleMarker>
    );
}

export default function MapView() {
    const [drone, setDrone] = useState(null);
    const [path, setPath] = useState([]);
    const [humans, setHumans] = useState([]);
    const [animals, setAnimals] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [followDrone, setFollowDrone] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const droneRes = await fetch("http://localhost:5000/api/drone/state");
                const droneData = await droneRes.json();

                setDrone(droneData);
                setPath([[droneData.latitude, droneData.longitude]]);

                const mapRes = await fetch("http://localhost:5000/api/map/events");
                const mapData = await mapRes.json();

                setHumans(mapData.humans || []);
                setAnimals(mapData.animals || []);
                setAlerts(mapData.alerts || []);
            } catch (err) {
                console.error("Error loading initial map data:", err);
            }
        };

        loadInitialData();

        socket.on("drone_position_updated", (data) => {
            setDrone(data);
            setPath((prev) => {
                const next = [...prev, [data.latitude, data.longitude]];
                return next.slice(-40);
            });
        });

        socket.on("human_detected", (human) => {
            setHumans((prev) => [...prev, human]);
        });

        socket.on("animal_detected", (animal) => {
            setAnimals((prev) => [...prev, animal]);
        });

        socket.on("alert_created", (alert) => {
            setAlerts((prev) => [alert, ...prev]);
        });

        return () => {
            socket.off("drone_position_updated");
            socket.off("human_detected");
            socket.off("animal_detected");
            socket.off("alert_created");
        };
    }, []);

    const criticalAlerts = useMemo(
        () => alerts.filter((a) => a.severity === "critical").length,
        [alerts]
    );

    const recentAlerts = useMemo(() => alerts.slice(0, 5), [alerts]);

    if (!drone) {
        return (
            <div className="dashboard-shell">
                <div className="loading-card">Loading live map...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-shell">
            <div className="topbar">
                <div>
                    <p className="eyebrow">PeekSense</p>
                    <h1>Live Wilderness Safety Dashboard</h1>
                </div>

                <div className="topbar-actions">
                    <button
                        className={`toggle-btn ${followDrone ? "active" : ""}`}
                        onClick={() => setFollowDrone((prev) => !prev)}
                    >
                        {followDrone ? "Following Drone" : "Free Map"}
                    </button>
                </div>
            </div>

            <div className="stats-row">
                <div className="stat-card">
                    <span className="stat-label">Humans</span>
                    <span className="stat-value">{humans.length}</span>
                </div>

                <div className="stat-card">
                    <span className="stat-label">Animals</span>
                    <span className="stat-value">{animals.length}</span>
                </div>

                <div className="stat-card">
                    <span className="stat-label">Alerts</span>
                    <span className="stat-value">{alerts.length}</span>
                </div>

                <div className="stat-card danger">
                    <span className="stat-label">Critical</span>
                    <span className="stat-value">{criticalAlerts}</span>
                </div>
            </div>

            <div className="main-grid">
                <div className="map-card">
                    <div className="map-card-header">
                        <div>
                            <h2>Operational Map</h2>
                            <p>Live drone tracking, detections, and threat visualization</p>
                        </div>

                        <div className="legend">
                            <span><i className="dot drone"></i> Drone</span>
                            <span><i className="dot human"></i> Human</span>
                            <span><i className="dot animal"></i> Animal</span>
                            <span><i className="dot alert"></i> Alert</span>
                        </div>
                    </div>

                    <div className="map-wrapper">
                        <MapContainer
                            center={[drone.latitude, drone.longitude]}
                            zoom={16}
                            style={{ height: "100%", width: "100%" }}
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            />

                            {followDrone && <RecenterMap drone={drone} />}

                            <Polyline
                                positions={path}
                                pathOptions={{
                                    color: "#4f8cff",
                                    weight: 4,
                                    opacity: 0.7
                                }}
                            />

                            <CircleMarker
                                center={[drone.latitude, drone.longitude]}
                                radius={10}
                                pathOptions={{
                                    color: "#1d4ed8",
                                    fillColor: "#3b82f6",
                                    fillOpacity: 1,
                                    weight: 3
                                }}
                            >
                                <Popup>
                                    <strong>Drone</strong>
                                    <br />
                                    Battery: {Number(drone.battery).toFixed(1)}%
                                    <br />
                                    Status: {drone.status}
                                    <br />
                                    Lat: {drone.latitude.toFixed(6)}
                                    <br />
                                    Lon: {drone.longitude.toFixed(6)}
                                </Popup>
                            </CircleMarker>

                            {humans.map((human) => (
                                <CircleMarker
                                    key={human.id}
                                    center={[human.latitude, human.longitude]}
                                    radius={8}
                                    pathOptions={{
                                        color: "#1e40af",
                                        fillColor: "#2563eb",
                                        fillOpacity: 0.9,
                                        weight: 2
                                    }}
                                >
                                    <Popup>
                                        <strong>Human Detected</strong>
                                        <br />
                                        Lat: {human.latitude}
                                        <br />
                                        Lon: {human.longitude}
                                    </Popup>
                                </CircleMarker>
                            ))}

                            {animals.map((animal) => (
                                <CircleMarker
                                    key={animal.id}
                                    center={[animal.latitude, animal.longitude]}
                                    radius={8}
                                    pathOptions={{
                                        color: "#b45309",
                                        fillColor: "#f59e0b",
                                        fillOpacity: 0.95,
                                        weight: 2
                                    }}
                                >
                                    <Popup>
                                        <strong>{animal.type}</strong>
                                        <br />
                                        Lat: {animal.latitude}
                                        <br />
                                        Lon: {animal.longitude}
                                    </Popup>
                                </CircleMarker>
                            ))}

                            {alerts.map((alert) => {
                                const lat = alert.details?.latitude ?? alert.location?.latitude;
                                const lon = alert.details?.longitude ?? alert.location?.longitude;

                                if (lat == null || lon == null) return null;

                                return (
                                    <CircleMarker
                                        key={alert.id}
                                        center={[lat, lon]}
                                        radius={12}
                                        className="alert-pulse"
                                        pathOptions={{
                                            color: "#991b1b",
                                            fillColor: "#ef4444",
                                            fillOpacity: 0.95
                                        }}
                                    >
                                        <Popup>
                                            <strong>Alert</strong>
                                            <br />
                                            {alert.message}
                                            <br />
                                            Severity: {alert.severity}
                                        </Popup>
                                    </CircleMarker>
                                );
                            })}
                        </MapContainer>
                    </div>
                </div>

                <div className="side-panel">
                    <div className="panel-card">
                        <h3>Drone Status</h3>
                        <div className="status-grid">
                            <div>
                                <span className="mini-label">Battery</span>
                                <strong>{Number(drone.battery).toFixed(1)}%</strong>
                            </div>
                            <div>
                                <span className="mini-label">Status</span>
                                <strong>{drone.status}</strong>
                            </div>
                            <div>
                                <span className="mini-label">Latitude</span>
                                <strong>{drone.latitude.toFixed(5)}</strong>
                            </div>
                            <div>
                                <span className="mini-label">Longitude</span>
                                <strong>{drone.longitude.toFixed(5)}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="panel-card">
                        <h3>Recent Alerts</h3>
                        {recentAlerts.length === 0 ? (
                            <p className="empty-state">No active alerts yet.</p>
                        ) : (
                            <div className="alert-list">
                                {recentAlerts.map((alert) => (
                                    <div key={alert.id} className={`alert-item ${alert.severity}`}>
                                        <div className="alert-top">
                                            <span className="severity-pill">{alert.severity}</span>
                                            <span className="alert-type">{alert.type}</span>
                                        </div>
                                        <p>{alert.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="panel-card">
                        <h3>System Overview</h3>
                        <ul className="overview-list">
                            <li>Live telemetry streaming</li>
                            <li>Wildlife proximity detection</li>
                            <li>Human presence tracking</li>
                            <li>Threat alert aggregation</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}