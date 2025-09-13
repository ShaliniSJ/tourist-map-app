import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useMeghalayaGeofencing } from '../../hooks/useHexagons';
import { meghalayaTouristSpots } from '../../utils/touristData';
import 'leaflet/dist/leaflet.css';

// Component to handle map updates
const MapUpdater = ({ hexagons, geofence }) => {
    const map = useMap();

    useEffect(() => {
        if (hexagons.length > 0) {
            // Fit map to Meghalaya bounds
            const bounds = [
                [24.58, 89.61], // Southwest corner
                [26.07, 92.51]  // Northeast corner
            ];
            map.fitBounds(bounds, { padding: [20, 20] });
        }
    }, [hexagons, map]);

    return null;
};

// Component to render hexagons
const HexagonLayer = ({ hexagons }) => {
    const getHexagonStyle = (feature) => {
        const density = feature.properties.density || 0;
        let color = '#ddd'; // inactive

        if (density >= 8) color = '#ff4757'; // high
        else if (density >= 4) color = '#ffa502'; // medium
        else if (density >= 1) color = '#2ed573'; // low

        return {
            fillColor: color,
            color: '#333',
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.6
        };
    };

    const onEachHexagon = (feature, layer) => {
        const density = feature.properties.density || 0;
        const area = feature.properties.area || 0;

        layer.bindPopup(`
      <div>
        <h4>Hexagon ${feature.id}</h4>
        <p><strong>Tourist Density:</strong> ${density} spots</p>
        <p><strong>Area:</strong> ${area.toFixed(2)} km²</p>
        <p><strong>Region:</strong> ${feature.properties.region}</p>
        <p><strong>Status:</strong> ${feature.properties.isActive ? 'Active' : 'Inactive'}</p>
      </div>
    `);
    };

    if (!hexagons || hexagons.length === 0) return null;

    // Convert hexagons to GeoJSON format
    const hexagonFeatures = hexagons.map(hex => ({
        type: 'Feature',
        id: hex.id,
        geometry: hex.geometry,
        properties: hex.properties
    }));

    const hexagonCollection = {
        type: 'FeatureCollection',
        features: hexagonFeatures
    };

    return (
        <GeoJSON
            data={hexagonCollection}
            style={getHexagonStyle}
            onEachFeature={onEachHexagon}
        />
    );
};

// Component to render geofence
const GeofenceLayer = ({ geofence }) => {
    const getGeofenceStyle = () => {
        return {
            fillColor: '#8e44ad',
            color: '#6c3483',
            weight: 3,
            opacity: 0.8,
            fillOpacity: 0.3
        };
    };

    const onEachGeofence = (feature, layer) => {
        const hexagonCount = feature.properties.hexagonCount || 0;
        const totalSpots = feature.properties.totalTouristSpots || 0;

        layer.bindPopup(`
      <div>
        <h4>Meghalaya Geofence</h4>
        <p><strong>Active Hexagons:</strong> ${hexagonCount}</p>
        <p><strong>Total Tourist Spots:</strong> ${totalSpots}</p>
        <p><strong>Type:</strong> ${feature.properties.type}</p>
      </div>
    `);
    };

    if (!geofence || geofence.features.length === 0) return null;

    return (
        <GeoJSON
            data={geofence}
            style={getGeofenceStyle}
            onEachFeature={onEachGeofence}
        />
    );
};

// Main Meghalaya Geofencing Component
const MeghalayaGeofencing = () => {
    const [hexagonSize, setHexagonSize] = useState(10);
    const [showGeofence, setShowGeofence] = useState(true);
    const [minDensity, setMinDensity] = useState(1);

    const {
        hexagons,
        geofence,
        isLoading,
        error,
        stats,
        hexagonsByDensity,
        updateGeofence,
        getGeofenceArea,
        isPointInGeofence
    } = useMeghalayaGeofencing(meghalayaTouristSpots, hexagonSize);

    // Update geofence when minDensity changes
    useEffect(() => {
        if (hexagons.length > 0) {
            updateGeofence(minDensity);
        }
    }, [minDensity, hexagons, updateGeofence]);

    const handleHexagonSizeChange = (e) => {
        setHexagonSize(parseInt(e.target.value));
    };

    const handleMinDensityChange = (e) => {
        setMinDensity(parseInt(e.target.value));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-lg">Generating Meghalaya geofencing...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-red-500 text-lg">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            {/* Controls */}
            <div className="bg-white p-4 shadow-md mb-4 rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-purple-800">Meghalaya Geofencing</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Hexagon Size: {hexagonSize} km
                        </label>
                        <input
                            type="range"
                            min="5"
                            max="25"
                            value={hexagonSize}
                            onChange={handleHexagonSizeChange}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Min Density: {minDensity} spots
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={minDensity}
                            onChange={handleMinDensityChange}
                            className="w-full"
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={showGeofence}
                                onChange={(e) => setShowGeofence(e.target.checked)}
                                className="mr-2"
                            />
                            Show Geofence
                        </label>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-gray-100 p-3 rounded">
                        <div className="font-semibold">Total Hexagons</div>
                        <div className="text-2xl font-bold text-purple-600">{stats.totalHexagons}</div>
                    </div>
                    <div className="bg-gray-100 p-3 rounded">
                        <div className="font-semibold">Active Hexagons</div>
                        <div className="text-2xl font-bold text-green-600">{stats.activeHexagons}</div>
                    </div>
                    <div className="bg-gray-100 p-3 rounded">
                        <div className="font-semibold">Tourist Spots</div>
                        <div className="text-2xl font-bold text-blue-600">{stats.totalTouristSpots}</div>
                    </div>
                    <div className="bg-gray-100 p-3 rounded">
                        <div className="font-semibold">Geofence Area</div>
                        <div className="text-2xl font-bold text-orange-600">{getGeofenceArea()} km²</div>
                    </div>
                </div>

                {/* Density Distribution */}
                <div className="mt-4">
                    <h3 className="font-semibold mb-2">Density Distribution</h3>
                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-red-500 mr-2"></div>
                            High (8+): {hexagonsByDensity.high.length}
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-orange-500 mr-2"></div>
                            Medium (4-7): {hexagonsByDensity.medium.length}
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-green-500 mr-2"></div>
                            Low (1-3): {hexagonsByDensity.low.length}
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-gray-400 mr-2"></div>
                            Inactive (0): {hexagonsByDensity.inactive.length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="h-96 border rounded-lg overflow-hidden">
                <MapContainer
                    center={[25.5, 91.0]}
                    zoom={8}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    <MapUpdater hexagons={hexagons} geofence={geofence} />
                    <HexagonLayer hexagons={hexagons} />
                    {showGeofence && <GeofenceLayer geofence={geofence} />}
                </MapContainer>
            </div>

            {/* Tourist Spots Info */}
            <div className="mt-4 bg-white p-4 shadow-md rounded-lg">
                <h3 className="font-semibold mb-2">Meghalaya Tourist Spots</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                    {meghalayaTouristSpots.map(spot => (
                        <div key={spot.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="font-medium">{spot.name}</span>
                            <span className="text-gray-600">★ {spot.rating}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MeghalayaGeofencing;
