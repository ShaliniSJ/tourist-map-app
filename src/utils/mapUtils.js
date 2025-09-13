import L from 'leaflet';
import * as turf from '@turf/turf';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

/**
 * Fit map bounds to show all tourist spots
 * @param {Object} map - Leaflet map instance
 * @param {Array} spots - Array of tourist spots
 */
export const fitMapBounds = (map, spots) => {
  if (!map || !spots || spots.length === 0) return;
  
  try {
    const coordinates = spots.map(spot => spot.coords);
    const bbox = turf.bbox(turf.points(coordinates.map(coord => turf.point(coord))));
    
    // Add some padding to the bounds
    const padding = 0.1;
    const latPadding = (bbox[3] - bbox[1]) * padding;
    const lngPadding = (bbox[2] - bbox[0]) * padding;
    
    const paddedBounds = [
      bbox[0] - lngPadding, // minLng
      bbox[1] - latPadding, // minLat
      bbox[2] + lngPadding, // maxLng
      bbox[3] + latPadding  // maxLat
    ];
    
    map.fitBounds([
      [paddedBounds[1], paddedBounds[0]], // [minLat, minLng]
      [paddedBounds[3], paddedBounds[2]]  // [maxLat, maxLng]
    ]);
  } catch (error) {
    console.error('Error fitting map bounds:', error);
  }
};

/**
 * Create custom marker icon based on category
 * @param {string} category - Tourist spot category
 * @param {string} color - Marker color
 * @returns {Object} Leaflet icon
 */
export const createCustomMarker = (category, color = '#e74c3c') => {
  const iconHtml = `
    <div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: white;
      font-weight: bold;
    ">
      ${getCategoryIcon(category)}
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });
};

/**
 * Get icon symbol for category
 * @param {string} category - Tourist spot category
 * @returns {string} Icon symbol
 */
export const getCategoryIcon = (category) => {
  const icons = {
    monument: '🏛️',
    palace: '🏰',
    fort: '🏯',
    temple: '🛕',
    nature: '🌿',
    beach: '🏖️',
    city: '🏙️',
    cave: '🕳️',
    memorial: '🪦',
    ruins: '🏛️'
  };
  return icons[category] || '📍';
};

/**
 * Create cluster marker for multiple spots
 * @param {number} count - Number of spots in cluster
 * @param {string} color - Cluster color
 * @returns {Object} Leaflet icon
 */
export const createClusterMarker = (count, color = '#3498db') => {
  const size = Math.min(40, 20 + count * 2);
  
  const iconHtml = `
    <div style="
      background-color: ${color};
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
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'cluster-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

/**
 * Calculate distance between two points
 * @param {Array} point1 - [lng, lat]
 * @param {Array} point2 - [lng, lat]
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (point1, point2) => {
  try {
    const from = turf.point(point1);
    const to = turf.point(point2);
    return turf.distance(from, to, { units: 'kilometers' });
  } catch (error) {
    console.error('Error calculating distance:', error);
    return 0;
  }
};

/**
 * Find nearest tourist spots to a point
 * @param {Array} point - [lng, lat]
 * @param {Array} spots - Array of tourist spots
 * @param {number} limit - Maximum number of results
 * @returns {Array} Sorted array of nearest spots with distances
 */
export const findNearestSpots = (point, spots, limit = 5) => {
  try {
    const spotsWithDistance = spots.map(spot => ({
      ...spot,
      distance: calculateDistance(point, spot.coords)
    }));
    
    return spotsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  } catch (error) {
    console.error('Error finding nearest spots:', error);
    return [];
  }
};

/**
 * Create popup content for tourist spot
 * @param {Object} spot - Tourist spot object
 * @returns {string} HTML content for popup
 */
export const createSpotPopup = (spot) => {
  return `
    <div style="min-width: 200px;">
      <h3 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 16px;">
        ${spot.name}
      </h3>
      <p style="margin: 0 0 8px 0; color: #7f8c8d; font-size: 12px;">
        ${spot.description || 'Tourist destination'}
      </p>
      <div style="display: flex; justify-content: space-between; align-items: center; margin: 8px 0;">
        <span style="
          background-color: ${getRegionColor(spot.region)};
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          text-transform: uppercase;
        ">
          ${spot.region}
        </span>
        <span style="color: #f39c12; font-size: 12px;">
          ⭐ ${spot.rating}
        </span>
      </div>
      <div style="margin-top: 8px;">
        <span style="
          background-color: #ecf0f1;
          color: #2c3e50;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 10px;
          text-transform: capitalize;
        ">
          ${spot.category}
        </span>
      </div>
    </div>
  `;
};

/**
 * Get region color
 * @param {string} region - Region name
 * @returns {string} Hex color code
 */
export const getRegionColor = (region) => {
  const colors = {
    north: '#3498db',
    south: '#e74c3c',
    east: '#27ae60',
    west: '#f39c12'
  };
  return colors[region] || '#95a5a6';
};

/**
 * Create popup content for hexagon
 * @param {Object} hexagon - Hexagon object
 * @returns {string} HTML content for popup
 */
export const createHexagonPopup = (hexagon) => {
  const { density, area, region, touristCount } = hexagon.properties;
  
  return `
    <div style="min-width: 180px;">
      <h3 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 14px;">
        Zone ${hexagon.id}
      </h3>
      <div style="margin: 4px 0;">
        <span style="color: #7f8c8d; font-size: 12px;">Tourist Spots:</span>
        <span style="color: #2c3e50; font-weight: bold; margin-left: 8px;">
          ${touristCount}
        </span>
      </div>
      <div style="margin: 4px 0;">
        <span style="color: #7f8c8d; font-size: 12px;">Area:</span>
        <span style="color: #2c3e50; margin-left: 8px;">
          ${Math.round(area)} km²
        </span>
      </div>
      <div style="margin: 4px 0;">
        <span style="color: #7f8c8d; font-size: 12px;">Region:</span>
        <span style="
          background-color: ${getRegionColor(region)};
          color: white;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 10px;
          text-transform: uppercase;
          margin-left: 8px;
        ">
          ${region}
        </span>
      </div>
      <div style="margin: 8px 0 0 0;">
        <span style="color: #7f8c8d; font-size: 12px;">Density:</span>
        <span style="
          background-color: ${hexagon.properties.color};
          color: white;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 10px;
          margin-left: 8px;
        ">
          ${density >= 8 ? 'High' : density >= 4 ? 'Medium' : density >= 1 ? 'Low' : 'None'}
        </span>
      </div>
    </div>
  `;
};

/**
 * Pan map to a specific location
 * @param {Object} map - Leaflet map instance
 * @param {Array} coords - [lng, lat] coordinates
 * @param {number} zoom - Zoom level (optional)
 */
export const panToLocation = (map, coords, zoom = null) => {
  if (!map || !coords) return;
  
  try {
    if (zoom) {
      map.setView(coords, zoom);
    } else {
      map.panTo(coords);
    }
  } catch (error) {
    console.error('Error panning to location:', error);
  }
};
