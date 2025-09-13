import * as turf from '@turf/turf';

// Bounding boxes for different regions of India
export const INDIA_BOUNDS = {
  west: [68, 15, 78, 28],    // [minLng, minLat, maxLng, maxLat]
  east: [85, 18, 97, 28],
  north: [74, 28, 80, 37],
  south: [74, 6, 80, 20],
  all: [68, 6, 97, 37]       // Full India bounds
};

// Meghalaya specific bounding box
export const MEGHALAYA_BOUNDS = [89.61, 24.58, 92.51, 26.07]; // [minLng, minLat, maxLng, maxLat]

// Hexagon size in kilometers
export const HEXAGON_SIZE = 50;

// Color coding for tourist density
export const hexagonColors = {
  high: '#ff4757',      // Red - High tourist density (8+ spots)
  medium: '#ffa502',    // Orange - Medium density (4-7 spots)
  low: '#2ed573',       // Green - Low density (1-3 spots)
  inactive: '#ddd'      // Gray - No data (0 spots)
};

/**
 * Generate hexagonal grid for a given bounding box
 * @param {Array} bbox - Bounding box [minLng, minLat, maxLng, maxLat]
 * @param {number} cellSide - Size of hexagon in kilometers
 * @returns {Object} GeoJSON FeatureCollection of hexagons
 */
export const generateHexGrid = (bbox, cellSide = HEXAGON_SIZE) => {
  try {
    const bboxPolygon = turf.bboxPolygon(bbox);
    const hexGrid = turf.hexGrid(bboxPolygon, cellSide, { units: 'kilometers' });
    
    return hexGrid;
  } catch (error) {
    console.error('Error generating hex grid:', error);
    return turf.featureCollection([]);
  }
};

/**
 * Calculate tourist density for a hexagon
 * @param {Object} hexagon - GeoJSON polygon feature
 * @param {Array} touristSpots - Array of tourist spot objects
 * @returns {number} Number of tourist spots within the hexagon
 */
export const getTouristDensity = (hexagon, touristSpots) => {
  try {
    // Convert tourist spots to GeoJSON points
    const points = touristSpots.map(spot => 
      turf.point(spot.coords, { 
        id: spot.id, 
        name: spot.name, 
        category: spot.category,
        region: spot.region,
        rating: spot.rating
      })
    );
    
    const pointsCollection = turf.featureCollection(points);
    
    // Find points within the hexagon
    const pointsWithin = turf.pointsWithinPolygon(pointsCollection, hexagon);
    
    return pointsWithin.features.length;
  } catch (error) {
    console.error('Error calculating tourist density:', error);
    return 0;
  }
};

/**
 * Get color for hexagon based on tourist density
 * @param {number} density - Number of tourist spots
 * @returns {string} Hex color code
 */
export const getHexagonColor = (density) => {
  if (density >= 8) return hexagonColors.high;
  if (density >= 4) return hexagonColors.medium;
  if (density >= 1) return hexagonColors.low;
  return hexagonColors.inactive;
};

/**
 * Check if a point is within a hexagon
 * @param {Array} point - [lng, lat] coordinates
 * @param {Object} hexagon - GeoJSON polygon feature
 * @returns {boolean} True if point is within hexagon
 */
export const checkPointInHexagon = (point, hexagon) => {
  try {
    const pointFeature = turf.point(point);
    return turf.booleanPointInPolygon(pointFeature, hexagon);
  } catch (error) {
    console.error('Error checking point in hexagon:', error);
    return false;
  }
};

/**
 * Update hexagon data with tourist density and metadata
 * @param {Object} hexagons - GeoJSON FeatureCollection
 * @param {Array} touristSpots - Array of tourist spots
 * @returns {Array} Array of hexagon objects with metadata
 */
export const updateHexagonData = (hexagons, touristSpots) => {
  return hexagons.features.map((hexagon, index) => {
    const density = getTouristDensity(hexagon, touristSpots);
    const centroid = turf.centroid(hexagon);
    const bbox = turf.bbox(hexagon);
    
    return {
      id: `hex-${index}`,
      geometry: hexagon.geometry,
      properties: {
        ...hexagon.properties,
        density,
        color: getHexagonColor(density),
        centroid: centroid.geometry.coordinates,
        bbox,
        touristCount: density,
        area: turf.area(hexagon) / 1000000, // Convert to km²
        isActive: density > 0
      }
    };
  });
};

/**
 * Generate hexagons for all regions of India
 * @param {Array} touristSpots - Array of tourist spots
 * @returns {Array} Array of hexagon objects with metadata
 */
export const generateIndiaHexGrid = (touristSpots) => {
  const allHexagons = [];
  
  // Generate hexagons for each region
  Object.entries(INDIA_BOUNDS).forEach(([region, bbox]) => {
    if (region === 'all') return; // Skip the combined bounds
    
    const hexGrid = generateHexGrid(bbox, HEXAGON_SIZE);
    const regionHexagons = updateHexagonData(hexGrid, touristSpots);
    
    // Add region information to each hexagon
    regionHexagons.forEach(hexagon => {
      hexagon.properties.region = region;
    });
    
    allHexagons.push(...regionHexagons);
  });
  
  return allHexagons;
};

/**
 * Generate hexagonal grid specifically for Meghalaya
 * @param {Array} touristSpots - Array of tourist spots (filtered for Meghalaya)
 * @param {number} cellSide - Size of hexagon in kilometers (default: 10km for finer granularity)
 * @returns {Array} Array of hexagon objects with metadata for Meghalaya
 */
export const generateMeghalayaHexGrid = (touristSpots = [], cellSide = 10) => {
  try {
    // Generate hex grid for Meghalaya
    const hexGrid = generateHexGrid(MEGHALAYA_BOUNDS, cellSide);
    
    // Update hexagon data with tourist density
    const meghalayaHexagons = updateHexagonData(hexGrid, touristSpots);
    
    // Add Meghalaya-specific metadata
    meghalayaHexagons.forEach(hexagon => {
      hexagon.properties.region = 'meghalaya';
      hexagon.properties.state = 'Meghalaya';
      hexagon.properties.isGeofenced = true;
    });
    
    return meghalayaHexagons;
  } catch (error) {
    console.error('Error generating Meghalaya hex grid:', error);
    return [];
  }
};

/**
 * Create a geofence polygon for Meghalaya using hexagons
 * @param {Array} hexagons - Array of hexagon objects
 * @param {number} minDensity - Minimum density to include in geofence
 * @returns {Object} GeoJSON FeatureCollection representing the geofence
 */
export const createMeghalayaGeofence = (hexagons, minDensity = 1) => {
  try {
    // Filter hexagons with minimum density
    const activeHexagons = hexagons.filter(hex => hex.properties.density >= minDensity);
    
    if (activeHexagons.length === 0) {
      return turf.featureCollection([]);
    }
    
    // Create a union of all active hexagons to form the geofence
    let geofence = activeHexagons[0].geometry;
    
    for (let i = 1; i < activeHexagons.length; i++) {
      try {
        geofence = turf.union(geofence, activeHexagons[i].geometry);
      } catch (error) {
        // If union fails, continue with next hexagon
        console.warn('Union failed for hexagon:', i, error);
      }
    }
    
    return turf.featureCollection([{
      type: 'Feature',
      geometry: geofence,
      properties: {
        name: 'Meghalaya Geofence',
        type: 'geofence',
        hexagonCount: activeHexagons.length,
        minDensity,
        totalTouristSpots: activeHexagons.reduce((sum, hex) => sum + hex.properties.density, 0)
      }
    }]);
  } catch (error) {
    console.error('Error creating Meghalaya geofence:', error);
    return turf.featureCollection([]);
  }
};

/**
 * Get hexagons within a specific region
 * @param {Array} hexagons - Array of hexagon objects
 * @param {string} region - Region name ('north', 'south', 'east', 'west')
 * @returns {Array} Filtered hexagons
 */
export const getHexagonsByRegion = (hexagons, region) => {
  if (region === 'all') return hexagons;
  return hexagons.filter(hex => hex.properties.region === region);
};

/**
 * Get hexagons with minimum tourist density
 * @param {Array} hexagons - Array of hexagon objects
 * @param {number} minDensity - Minimum density threshold
 * @returns {Array} Filtered hexagons
 */
export const getHexagonsByDensity = (hexagons, minDensity = 1) => {
  return hexagons.filter(hex => hex.properties.density >= minDensity);
};

/**
 * Calculate statistics for hexagon data
 * @param {Array} hexagons - Array of hexagon objects
 * @returns {Object} Statistics object
 */
export const getHexagonStats = (hexagons) => {
  const totalHexagons = hexagons.length;
  const activeHexagons = hexagons.filter(hex => hex.properties.isActive).length;
  const totalTouristSpots = hexagons.reduce((sum, hex) => sum + hex.properties.density, 0);
  const avgDensity = totalHexagons > 0 ? totalTouristSpots / totalHexagons : 0;
  
  const densityDistribution = {
    high: hexagons.filter(hex => hex.properties.density >= 8).length,
    medium: hexagons.filter(hex => hex.properties.density >= 4 && hex.properties.density < 8).length,
    low: hexagons.filter(hex => hex.properties.density >= 1 && hex.properties.density < 4).length,
    inactive: hexagons.filter(hex => hex.properties.density === 0).length
  };
  
  return {
    totalHexagons,
    activeHexagons,
    totalTouristSpots,
    avgDensity: Math.round(avgDensity * 100) / 100,
    densityDistribution
  };
};
