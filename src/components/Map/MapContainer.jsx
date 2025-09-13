import React, { useRef, useEffect } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, useMap } from 'react-leaflet';
import { fitMapBounds } from '../../utils/mapUtils';

// Map controller component for handling map events
const MapController = ({ bounds, center, zoom }) => {
    const map = useMap();

    useEffect(() => {
        if (bounds) {
            fitMapBounds(map, bounds);
        } else if (center) {
            map.setView(center, zoom || map.getZoom());
        }
    }, [map, bounds, center, zoom]);

    return null;
};

// Main map container component
const MapContainer = ({
    children,
    center = [20.5937, 78.9629],
    zoom = 5,
    bounds = null,
    onMapReady = null
}) => {
    const mapRef = useRef(null);

    const handleMapReady = (map) => {
        mapRef.current = map;
        if (onMapReady) {
            onMapReady(map);
        }
    };

    return (
        <div className="map-wrapper">
            <LeafletMapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
                ref={handleMapReady}
                className="leaflet-container"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={18}
                    minZoom={3}
                />

                <MapController bounds={bounds} center={center} zoom={zoom} />

                {children}
            </LeafletMapContainer>
        </div>
    );
};

export default MapContainer;
