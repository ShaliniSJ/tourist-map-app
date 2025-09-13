import React, { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { createCustomMarker, createSpotPopup, getCategoryIcon } from '../../utils/mapUtils';
import { categoryColors } from '../../utils/touristData';

const TouristMarkers = ({
    spots,
    onMarkerClick,
    selectedHexagon,
    showClusters = false,
    clusterRadius = 50
}) => {
    // Memoize markers to prevent unnecessary re-renders
    const markers = useMemo(() => {
        if (!spots || spots.length === 0) return [];

        return spots.map(spot => {
            const color = categoryColors[spot.category] || '#e74c3c';
            const icon = createCustomMarker(spot.category, color);

            return {
                ...spot,
                icon,
                popupContent: createSpotPopup(spot)
            };
        });
    }, [spots]);

    // Handle marker click
    const handleMarkerClick = (spot) => {
        if (onMarkerClick) {
            onMarkerClick(spot);
        }
    };

    // Check if marker should be highlighted
    const isMarkerHighlighted = (spot) => {
        if (!selectedHexagon) return false;

        // Simple check - in a real implementation, you'd check if the marker
        // is within the selected hexagon bounds
        return selectedHexagon.properties.touristCount > 0;
    };

    if (!spots || spots.length === 0) {
        return null;
    }

    return (
        <>
            {markers.map(spot => (
                <Marker
                    key={spot.id}
                    position={spot.coords}
                    icon={spot.icon}
                    eventHandlers={{
                        click: () => handleMarkerClick(spot),
                        mouseover: (e) => {
                            // Highlight marker on hover
                            e.target.setOpacity(0.8);
                        },
                        mouseout: (e) => {
                            // Reset marker opacity
                            e.target.setOpacity(1);
                        }
                    }}
                >
                    <Popup
                        className="tourist-popup"
                        closeButton={true}
                        autoClose={false}
                        closeOnClick={false}
                    >
                        <div dangerouslySetInnerHTML={{ __html: spot.popupContent }} />

                        {/* Additional actions */}
                        <div style={{
                            marginTop: '12px',
                            paddingTop: '12px',
                            borderTop: '1px solid #ecf0f1',
                            display: 'flex',
                            gap: '8px'
                        }}>
                            <button
                                style={{
                                    background: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    flex: 1
                                }}
                                onClick={() => {
                                    // Handle directions action
                                    console.log('Get directions to:', spot.name);
                                }}
                            >
                                Directions
                            </button>
                            <button
                                style={{
                                    background: '#27ae60',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    flex: 1
                                }}
                                onClick={() => {
                                    // Handle more info action
                                    console.log('More info for:', spot.name);
                                }}
                            >
                                More Info
                            </button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
};

// Cluster markers component (simplified implementation)
const ClusterMarkers = ({ spots, clusterRadius = 50 }) => {
    // This is a simplified clustering implementation
    // In a real application, you'd use a proper clustering library like Leaflet.markercluster

    const clusters = useMemo(() => {
        if (!spots || spots.length === 0) return [];

        const clusters = [];
        const processed = new Set();

        spots.forEach(spot => {
            if (processed.has(spot.id)) return;

            const cluster = [spot];
            processed.add(spot.id);

            // Find nearby spots
            spots.forEach(otherSpot => {
                if (processed.has(otherSpot.id)) return;

                const distance = calculateDistance(spot.coords, otherSpot.coords);
                if (distance <= clusterRadius) {
                    cluster.push(otherSpot);
                    processed.add(otherSpot.id);
                }
            });

            if (cluster.length > 1) {
                clusters.push({
                    center: calculateClusterCenter(cluster),
                    spots: cluster,
                    count: cluster.length
                });
            }
        });

        return clusters;
    }, [spots, clusterRadius]);

    return (
        <>
            {clusters.map((cluster, index) => (
                <Marker
                    key={`cluster-${index}`}
                    position={cluster.center}
                    icon={createClusterMarker(cluster.count)}
                >
                    <Popup>
                        <div>
                            <h4>Tourist Spots Cluster</h4>
                            <p>{cluster.count} spots in this area:</p>
                            <ul>
                                {cluster.spots.map(spot => (
                                    <li key={spot.id}>{spot.name}</li>
                                ))}
                            </ul>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
};

// Helper functions for clustering
const calculateDistance = (coord1, coord2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
    const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const calculateClusterCenter = (spots) => {
    const sumLat = spots.reduce((sum, spot) => sum + spot.coords[1], 0);
    const sumLng = spots.reduce((sum, spot) => sum + spot.coords[0], 0);
    return [sumLng / spots.length, sumLat / spots.length];
};

const createClusterMarker = (count) => {
    const size = Math.min(40, 20 + count * 2);

    return L.divIcon({
        html: `
      <div style="
        background-color: #e74c3c;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${Math.min(14, 10 + count)}px;
        color: white;
        font-weight: bold;
      ">
        ${count}
      </div>
    `,
        className: 'cluster-marker',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2]
    });
};

export default TouristMarkers;
export { ClusterMarkers };
