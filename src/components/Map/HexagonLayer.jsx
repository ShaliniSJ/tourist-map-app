import React, { useMemo } from 'react';
import { GeoJSON } from 'react-leaflet';
import { createHexagonPopup } from '../../utils/mapUtils';

const HexagonLayer = ({
    hexagons,
    onHexagonClick,
    selectedHexagon,
    onHexagonHover
}) => {
    // Memoize the GeoJSON data to prevent unnecessary re-renders
    const geoJsonData = useMemo(() => {
        if (!hexagons || hexagons.length === 0) {
            return { type: 'FeatureCollection', features: [] };
        }

        return {
            type: 'FeatureCollection',
            features: hexagons.map(hexagon => ({
                type: 'Feature',
                id: hexagon.id,
                geometry: hexagon.geometry,
                properties: {
                    ...hexagon.properties,
                    isSelected: selectedHexagon?.id === hexagon.id
                }
            }))
        };
    }, [hexagons, selectedHexagon]);

    // Style function for hexagons
    const getHexagonStyle = (feature) => {
        const { density, color, isSelected } = feature.properties;

        return {
            fillColor: color,
            fillOpacity: isSelected ? 0.8 : 0.4,
            color: isSelected ? '#2c3e50' : '#34495e',
            weight: isSelected ? 3 : 1,
            opacity: 0.8,
            dashArray: isSelected ? '5, 5' : null
        };
    };

    // Handle hexagon click
    const handleHexagonClick = (event) => {
        const { feature } = event.target;
        const hexagon = hexagons.find(h => h.id === feature.id);

        if (hexagon && onHexagonClick) {
            onHexagonClick(hexagon);
        }
    };

    // Handle hexagon hover
    const handleHexagonHover = (event) => {
        const { feature } = event.target;
        const hexagon = hexagons.find(h => h.id === feature.id);

        if (hexagon && onHexagonHover) {
            onHexagonHover(hexagon);
        }
    };

    // Handle mouse leave
    const handleMouseLeave = (event) => {
        // Reset hover state if needed
        if (onHexagonHover) {
            onHexagonHover(null);
        }
    };

    // Create popup content
    const createPopup = (feature) => {
        const hexagon = hexagons.find(h => h.id === feature.id);
        if (!hexagon) return '';

        return createHexagonPopup(hexagon);
    };

    if (!hexagons || hexagons.length === 0) {
        return null;
    }

    return (
        <GeoJSON
            data={geoJsonData}
            style={getHexagonStyle}
            onEachFeature={(feature, layer) => {
                // Add click event
                layer.on('click', handleHexagonClick);

                // Add hover events
                layer.on('mouseover', handleHexagonHover);
                layer.on('mouseout', handleMouseLeave);

                // Add popup
                const popupContent = createPopup(feature);
                if (popupContent) {
                    layer.bindPopup(popupContent, {
                        className: 'hexagon-popup',
                        closeButton: true,
                        autoClose: false,
                        closeOnClick: false
                    });
                }

                // Add tooltip for quick info
                const { density, region, touristCount } = feature.properties;
                layer.bindTooltip(`
          <div style="text-align: center;">
            <strong>Zone ${feature.id}</strong><br/>
            <span style="color: ${feature.properties.color}; font-weight: bold;">
              ${touristCount} spots
            </span><br/>
            <small>${region} region</small>
          </div>
        `, {
                    className: 'hexagon-tooltip',
                    direction: 'top',
                    offset: [0, -10],
                    opacity: 0.9
                });
            }}
        />
    );
};

export default HexagonLayer;
