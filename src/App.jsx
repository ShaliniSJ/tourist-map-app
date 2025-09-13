import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './styles/globals.css';

// Components
import Header from './components/UI/Header';
import HexagonLayer from './components/Map/HexagonLayer';
import TouristMarkers from './components/Map/TouristMarkers';
import NotificationPanel from './components/Notifications/NotificationPanel';

// Utils and Hooks
import { touristSpots, manipurTouristSpots } from './utils/touristData';
import { useHexagons } from './hooks/useHexagons';
import { useNotifications } from './hooks/useNotifications';
import { createManipurAreas, createManipurStateArea } from './utils/geofencing';

function App() {
    const [selectedHexagon, setSelectedHexagon] = useState(null);
    const [filteredSpots, setFilteredSpots] = useState(touristSpots);
    const [filters, setFilters] = useState({ region: 'all', category: 'all' });
    const [showManipurAreas, setShowManipurAreas] = useState(false);
    const [manipurAreas, setManipurAreas] = useState(null);
    const [manipurStateArea, setManipurStateArea] = useState(null);

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

    // Generate Manipur areas when toggled
    useEffect(() => {
        if (showManipurAreas) {
            try {
                const areas = createManipurAreas(manipurTouristSpots, 15);
                const stateArea = createManipurStateArea(manipurTouristSpots);
                setManipurAreas(areas);
                setManipurStateArea(stateArea);
            } catch (error) {
                console.error('Error generating Manipur areas:', error);
            }
        }
    }, [showManipurAreas]);

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

            {/* Manipur Areas Toggle */}
            <div className="bg-white p-4 shadow-md mb-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Map Views</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setShowManipurAreas(!showManipurAreas)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${showManipurAreas
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {showManipurAreas ? 'Hide Manipur Areas' : 'Show Manipur Areas'}
                        </button>
                    </div>
                </div>
                {showManipurAreas && (
                    <div className="mt-2 text-sm text-gray-600">
                        <p>✅ Manipur areas loaded! You can see circular areas around tourist spots.</p>
                        <p>Click on the colored circles to see area details.</p>
                    </div>
                )}
            </div>

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

                        {/* Manipur Areas */}
                        {showManipurAreas && manipurAreas && (
                            <GeoJSON
                                data={manipurAreas}
                                style={(feature) => ({
                                    fillColor: feature.properties.color || '#e67e22',
                                    color: '#333',
                                    weight: 2,
                                    opacity: 0.8,
                                    fillOpacity: 0.4
                                })}
                                onEachFeature={(feature, layer) => {
                                    const props = feature.properties;
                                    layer.bindPopup(`
                                        <div style="min-width: 200px;">
                                            <h4 style="margin: 0 0 8px 0; color: #333;">${props.name}</h4>
                                            <p style="margin: 4px 0;"><strong>Category:</strong> ${props.category}</p>
                                            <p style="margin: 4px 0;"><strong>Rating:</strong> ⭐ ${props.rating}</p>
                                            <p style="margin: 4px 0;"><strong>Area:</strong> ${props.area} km²</p>
                                            <p style="margin: 4px 0;"><strong>Radius:</strong> ${props.radius} km</p>
                                            <p style="margin: 4px 0; font-size: 12px; color: #666;">${props.description}</p>
                                        </div>
                                    `);
                                }}
                            />
                        )}

                        {/* Manipur State Boundary */}
                        {showManipurAreas && manipurStateArea && (
                            <GeoJSON
                                data={manipurStateArea}
                                style={{
                                    fillColor: '#e67e22',
                                    color: '#d35400',
                                    weight: 3,
                                    opacity: 0.8,
                                    fillOpacity: 0.1
                                }}
                                onEachFeature={(feature, layer) => {
                                    const props = feature.properties;
                                    layer.bindPopup(`
                                        <div style="min-width: 200px;">
                                            <h4 style="margin: 0 0 8px 0; color: #333;">${props.name}</h4>
                                            <p style="margin: 4px 0;"><strong>Total Area:</strong> ${props.area} km²</p>
                                            <p style="margin: 4px 0;"><strong>Tourist Spots:</strong> ${props.touristSpotsCount}</p>
                                            <p style="margin: 4px 0; font-size: 12px; color: #666;">${props.description}</p>
                                        </div>
                                    `);
                                }}
                            />
                        )}

                        {/* Manipur Tourist Markers */}
                        {showManipurAreas && manipurTouristSpots.map(spot => (
                            <Marker key={spot.id} position={[spot.coords[1], spot.coords[0]]}>
                                <Popup>
                                    <div style={{ minWidth: '200px' }}>
                                        <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{spot.name}</h4>
                                        <p style={{ margin: '4px 0' }}><strong>Category:</strong> {spot.category}</p>
                                        <p style={{ margin: '4px 0' }}><strong>Rating:</strong> ⭐ {spot.rating}</p>
                                        <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>{spot.description}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
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
