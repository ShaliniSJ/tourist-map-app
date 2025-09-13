import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './styles/globals.css';

// Components
import Header from './components/UI/Header';
import HexagonLayer from './components/Map/HexagonLayer';
import TouristMarkers from './components/Map/TouristMarkers';
import NotificationPanel from './components/Notifications/NotificationPanel';

// Utils and Hooks
import { touristSpots } from './utils/touristData';
import { useHexagons } from './hooks/useHexagons';
import { useNotifications } from './hooks/useNotifications';

function App() {
    const [selectedHexagon, setSelectedHexagon] = useState(null);
    const [filteredSpots, setFilteredSpots] = useState(touristSpots);
    const [filters, setFilters] = useState({ region: 'all', category: 'all' });

    // Custom hooks
    const { hexagons, updateHexagonData } = useHexagons();
    const { notifications, addNotification, removeNotification } = useNotifications();

    // Filter tourist spots based on current filters
    useEffect(() => {
        let filtered = touristSpots;

        if (filters.region !== 'all') {
            filtered = filtered.filter(spot => spot.region === filters.region);
        }

        if (filters.category !== 'all') {
            filtered = filtered.filter(spot => spot.category === filters.category);
        }

        setFilteredSpots(filtered);
    }, [filters]);

    // Handle hexagon click
    const handleHexagonClick = (hexagon) => {
        setSelectedHexagon(hexagon);

        // Add notification for hexagon selection
        addNotification({
            id: Date.now(),
            type: 'travel',
            priority: 'medium',
            title: 'Zone Selected',
            message: `Selected zone with ${hexagon.touristCount} tourist spots`,
            location: hexagon.centroid,
            timestamp: new Date()
        });
    };

    // Handle marker click
    const handleMarkerClick = (spot) => {
        addNotification({
            id: Date.now(),
            type: 'travel',
            priority: 'high',
            title: spot.name,
            message: `Located in ${spot.region} region`,
            location: spot.coords,
            timestamp: new Date()
        });
    };

    // Filter handlers
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    return (
        <div className="app-container">
            <Header
                filters={filters}
                onFilterChange={handleFilterChange}
                selectedHexagon={selectedHexagon}
            />

            <div className="main-content">
                <div className="map-container">
                    <MapContainer
                        center={[20.5937, 78.9629]} // India center
                        zoom={5}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <HexagonLayer
                            hexagons={hexagons}
                            onHexagonClick={handleHexagonClick}
                            selectedHexagon={selectedHexagon}
                        />

                        <TouristMarkers
                            spots={filteredSpots}
                            onMarkerClick={handleMarkerClick}
                            selectedHexagon={selectedHexagon}
                        />
                    </MapContainer>
                </div>

                <NotificationPanel
                    notifications={notifications}
                    onRemoveNotification={removeNotification}
                    onNotificationClick={(notification) => {
                        // Handle notification click - could pan map to location
                        console.log('Notification clicked:', notification);
                    }}
                />
            </div>
        </div>
    );
}

export default App;
