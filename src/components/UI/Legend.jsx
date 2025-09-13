import React from 'react';
import { MapPin, Hexagon, Info } from 'lucide-react';

const Legend = ({ hexagons, touristSpots, onLegendItemClick }) => {
    // Calculate statistics for legend
    const stats = React.useMemo(() => {
        if (!hexagons || !touristSpots) {
            return {
                totalHexagons: 0,
                activeHexagons: 0,
                totalSpots: 0,
                densityDistribution: { high: 0, medium: 0, low: 0, inactive: 0 }
            };
        }

        const totalHexagons = hexagons.length;
        const activeHexagons = hexagons.filter(hex => hex.properties.isActive).length;
        const totalSpots = touristSpots.length;

        const densityDistribution = {
            high: hexagons.filter(hex => hex.properties.density >= 8).length,
            medium: hexagons.filter(hex => hex.properties.density >= 4 && hex.properties.density < 8).length,
            low: hexagons.filter(hex => hex.properties.density >= 1 && hex.properties.density < 4).length,
            inactive: hexagons.filter(hex => hex.properties.density === 0).length
        };

        return {
            totalHexagons,
            activeHexagons,
            totalSpots,
            densityDistribution
        };
    }, [hexagons, touristSpots]);

    // Hexagon density colors
    const densityColors = {
        high: '#ff4757',
        medium: '#ffa502',
        low: '#2ed573',
        inactive: '#ddd'
    };

    // Category colors
    const categoryColors = {
        monument: '#e74c3c',
        palace: '#9b59b6',
        fort: '#f39c12',
        temple: '#27ae60',
        nature: '#2ecc71',
        beach: '#3498db',
        city: '#34495e',
        cave: '#8e44ad',
        memorial: '#e67e22',
        ruins: '#95a5a6'
    };

    const handleLegendItemClick = (type, value) => {
        if (onLegendItemClick) {
            onLegendItemClick(type, value);
        }
    };

    return (
        <div className="legend-panel">
            <div className="legend-header">
                <Info size={16} />
                <h3>Map Legend</h3>
            </div>

            {/* Hexagon Density Legend */}
            <div className="legend-section">
                <h4>Hexagon Density</h4>
                <div className="legend-items">
                    {Object.entries(densityColors).map(([density, color]) => (
                        <div
                            key={density}
                            className="legend-item"
                            onClick={() => handleLegendItemClick('density', density)}
                        >
                            <div
                                className="legend-color"
                                style={{ backgroundColor: color }}
                            />
                            <span className="legend-label">
                                {density.charAt(0).toUpperCase() + density.slice(1)}
                                ({stats.densityDistribution[density]})
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tourist Spot Categories */}
            <div className="legend-section">
                <h4>Tourist Spot Categories</h4>
                <div className="legend-items">
                    {Object.entries(categoryColors).map(([category, color]) => {
                        const count = touristSpots.filter(spot => spot.category === category).length;
                        if (count === 0) return null;

                        return (
                            <div
                                key={category}
                                className="legend-item"
                                onClick={() => handleLegendItemClick('category', category)}
                            >
                                <div
                                    className="legend-color"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="legend-label">
                                    {category.charAt(0).toUpperCase() + category.slice(1)} ({count})
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Map Statistics */}
            <div className="legend-section">
                <h4>Statistics</h4>
                <div className="legend-stats">
                    <div className="stat-item">
                        <Hexagon size={14} />
                        <span>Total Zones: {stats.totalHexagons}</span>
                    </div>
                    <div className="stat-item">
                        <Hexagon size={14} style={{ color: '#2ed573' }} />
                        <span>Active Zones: {stats.activeHexagons}</span>
                    </div>
                    <div className="stat-item">
                        <MapPin size={14} />
                        <span>Tourist Spots: {stats.totalSpots}</span>
                    </div>
                </div>
            </div>

            {/* Region Information */}
            <div className="legend-section">
                <h4>Regions</h4>
                <div className="region-info">
                    <div className="region-item">
                        <div className="region-color" style={{ backgroundColor: '#3498db' }} />
                        <span>North India</span>
                    </div>
                    <div className="region-item">
                        <div className="region-color" style={{ backgroundColor: '#e74c3c' }} />
                        <span>South India</span>
                    </div>
                    <div className="region-item">
                        <div className="region-color" style={{ backgroundColor: '#27ae60' }} />
                        <span>East India</span>
                    </div>
                    <div className="region-item">
                        <div className="region-color" style={{ backgroundColor: '#f39c12' }} />
                        <span>West India</span>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="legend-section">
                <h4>How to Use</h4>
                <div className="instructions">
                    <div className="instruction-item">
                        <span className="instruction-icon">🖱️</span>
                        <span>Click hexagons to view zone details</span>
                    </div>
                    <div className="instruction-item">
                        <span className="instruction-icon">📍</span>
                        <span>Click markers for spot information</span>
                    </div>
                    <div className="instruction-item">
                        <span className="instruction-icon">🔍</span>
                        <span>Use filters to narrow down results</span>
                    </div>
                    <div className="instruction-item">
                        <span className="instruction-icon">🔔</span>
                        <span>Check notifications for updates</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Legend;
