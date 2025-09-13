import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Marker, Popup } from 'react-leaflet';
import { createManipurAreas, createManipurStateArea, createBufferAreas } from '../../utils/geofencing';
import { manipurTouristSpots } from '../../utils/touristData';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to handle map updates
const MapUpdater = ({ areas, stateArea }) => {
    const map = useMap();

    useEffect(() => {
        if (areas && areas.features.length > 0) {
            // Fit map to Manipur bounds
            const bounds = [
                [23.83, 93.73], // Southwest corner
                [25.68, 94.78]  // Northeast corner
            ];
            map.fitBounds(bounds, { padding: [20, 20] });
        }
    }, [areas, map]);

    return null;
};

// Component to render tourist areas
const TouristAreasLayer = ({ areas }) => {
    const getAreaStyle = (feature) => {
        const color = feature.properties.color || '#e67e22';
        return {
            fillColor: color,
            color: '#333',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.4
        };
    };

    const onEachArea = (feature, layer) => {
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
    };

    if (!areas || areas.features.length === 0) return null;

    return (
        <GeoJSON
            data={areas}
            style={getAreaStyle}
            onEachFeature={onEachArea}
        />
    );
};

// Component to render state boundary
const StateAreaLayer = ({ stateArea }) => {
    const getStateStyle = () => {
        return {
            fillColor: '#e67e22',
            color: '#d35400',
            weight: 3,
            opacity: 0.8,
            fillOpacity: 0.1
        };
    };

    const onEachState = (feature, layer) => {
        const props = feature.properties;

        layer.bindPopup(`
      <div style="min-width: 200px;">
        <h4 style="margin: 0 0 8px 0; color: #333;">${props.name}</h4>
        <p style="margin: 4px 0;"><strong>Total Area:</strong> ${props.area} km²</p>
        <p style="margin: 4px 0;"><strong>Tourist Spots:</strong> ${props.touristSpotsCount}</p>
        <p style="margin: 4px 0; font-size: 12px; color: #666;">${props.description}</p>
      </div>
    `);
    };

    if (!stateArea || stateArea.features.length === 0) return null;

    return (
        <GeoJSON
            data={stateArea}
            style={getStateStyle}
            onEachFeature={onEachState}
        />
    );
};

// Component to render buffer areas
const BufferAreasLayer = ({ bufferAreas }) => {
    const getBufferStyle = () => {
        return {
            fillColor: '#f39c12',
            color: '#e67e22',
            weight: 1,
            opacity: 0.6,
            fillOpacity: 0.2
        };
    };

    const onEachBuffer = (feature, layer) => {
        const props = feature.properties;

        layer.bindPopup(`
      <div style="min-width: 200px;">
        <h4 style="margin: 0 0 8px 0; color: #333;">${props.name}</h4>
        <p style="margin: 4px 0;"><strong>Buffer Distance:</strong> ${props.bufferDistance} km</p>
        <p style="margin: 4px 0;"><strong>Area:</strong> ${props.area} km²</p>
        <p style="margin: 4px 0; font-size: 12px; color: #666;">${props.description}</p>
      </div>
    `);
    };

    if (!bufferAreas || bufferAreas.features.length === 0) return null;

    return (
        <GeoJSON
            data={bufferAreas}
            style={getBufferStyle}
            onEachFeature={onEachBuffer}
        />
    );
};

// Component to render tourist spot markers
const TouristMarkers = ({ spots }) => {
    return (
        <>
            {spots.map(spot => (
                <Marker key={spot.id} position={[spot.coords[1], spot.coords[0]]}>
                    <Popup>
                        <div style="min-width: 200px;">
                            <h4 style="margin: 0 0 8px 0; color: #333;">{spot.name}</h4>
                            <p style="margin: 4px 0;"><strong>Category:</strong> {spot.category}</p>
                            <p style="margin: 4px 0;"><strong>Rating:</strong> ⭐ {spot.rating}</p>
                            <p style="margin: 4px 0; font-size: 12px; color: #666;">{spot.description}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
};

// Main Manipur Areas Component
const ManipurAreas = () => {
    const [areas, setAreas] = useState(null);
    const [stateArea, setStateArea] = useState(null);
    const [bufferAreas, setBufferAreas] = useState(null);
    const [radius, setRadius] = useState(15);
    const [bufferDistance, setBufferDistance] = useState(20);
    const [showStateArea, setShowStateArea] = useState(true);
    const [showTouristAreas, setShowTouristAreas] = useState(true);
    const [showBufferAreas, setShowBufferAreas] = useState(false);
    const [showMarkers, setShowMarkers] = useState(true);

    // Generate areas when radius or buffer distance changes
    useEffect(() => {
        try {
            // Create tourist areas
            const touristAreas = createManipurAreas(manipurTouristSpots, radius);
            setAreas(touristAreas);

            // Create state area
            const state = createManipurStateArea(manipurTouristSpots);
            setStateArea(state);

            // Create buffer areas
            const buffers = createBufferAreas(manipurTouristSpots, bufferDistance);
            setBufferAreas(buffers);
        } catch (error) {
            console.error('Error generating areas:', error);
        }
    }, [radius, bufferDistance]);

    const handleRadiusChange = (e) => {
        setRadius(parseInt(e.target.value));
    };

    const handleBufferDistanceChange = (e) => {
        setBufferDistance(parseInt(e.target.value));
    };

    // Calculate total area
    const getTotalArea = () => {
        if (!areas) return 0;
        return areas.features.reduce((sum, feature) => sum + feature.properties.area, 0);
    };

    return (
        <div className="w-full h-full">
            {/* Controls */}
            <div className="bg-white p-4 shadow-md mb-4 rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-orange-800">Manipur Area Visualization</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Tourist Area Radius: {radius} km
                        </label>
                        <input
                            type="range"
                            min="5"
                            max="30"
                            value={radius}
                            onChange={handleRadiusChange}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Buffer Distance: {bufferDistance} km
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="50"
                            value={bufferDistance}
                            onChange={handleBufferDistanceChange}
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={showStateArea}
                                onChange={(e) => setShowStateArea(e.target.checked)}
                                className="mr-2"
                            />
                            State Boundary
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={showTouristAreas}
                                onChange={(e) => setShowTouristAreas(e.target.checked)}
                                className="mr-2"
                            />
                            Tourist Areas
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={showBufferAreas}
                                onChange={(e) => setShowBufferAreas(e.target.checked)}
                                className="mr-2"
                            />
                            Buffer Zones
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={showMarkers}
                                onChange={(e) => setShowMarkers(e.target.checked)}
                                className="mr-2"
                            />
                            Tourist Markers
                        </label>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-gray-100 p-3 rounded">
                        <div className="font-semibold">Tourist Spots</div>
                        <div className="text-2xl font-bold text-orange-600">{manipurTouristSpots.length}</div>
                    </div>
                    <div className="bg-gray-100 p-3 rounded">
                        <div className="font-semibold">Total Area</div>
                        <div className="text-2xl font-bold text-green-600">{getTotalArea().toFixed(1)} km²</div>
                    </div>
                    <div className="bg-gray-100 p-3 rounded">
                        <div className="font-semibold">State Area</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {stateArea ? stateArea.features[0]?.properties.area : 0} km²
                        </div>
                    </div>
                    <div className="bg-gray-100 p-3 rounded">
                        <div className="font-semibold">Average Rating</div>
                        <div className="text-2xl font-bold text-purple-600">
                            {(manipurTouristSpots.reduce((sum, spot) => sum + spot.rating, 0) / manipurTouristSpots.length).toFixed(1)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="h-96 border rounded-lg overflow-hidden">
                <MapContainer
                    center={[24.8, 94.0]}
                    zoom={9}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    <MapUpdater areas={areas} stateArea={stateArea} />

                    {showStateArea && <StateAreaLayer stateArea={stateArea} />}
                    {showTouristAreas && <TouristAreasLayer areas={areas} />}
                    {showBufferAreas && <BufferAreasLayer bufferAreas={bufferAreas} />}
                    {showMarkers && <TouristMarkers spots={manipurTouristSpots} />}
                </MapContainer>
            </div>

            {/* Tourist Spots Info */}
            <div className="mt-4 bg-white p-4 shadow-md rounded-lg">
                <h3 className="font-semibold mb-2">Manipur Tourist Spots</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                    {manipurTouristSpots.map(spot => (
                        <div key={spot.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="font-medium">{spot.name}</span>
                            <span className="text-gray-600">★ {spot.rating}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Area Details */}
            {areas && (
                <div className="mt-4 bg-white p-4 shadow-md rounded-lg">
                    <h3 className="font-semibold mb-2">Area Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {areas.features.map((area, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded">
                                <div className="font-medium">{area.properties.name}</div>
                                <div className="text-gray-600">
                                    Area: {area.properties.area} km² |
                                    Radius: {area.properties.radius} km |
                                    Category: {area.properties.category}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManipurAreas;
