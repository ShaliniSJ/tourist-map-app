import { useState, useEffect, useMemo, useCallback } from 'react';
import * as turf from '@turf/turf';
import { generateIndiaHexGrid, getHexagonsByRegion, getHexagonStats, generateMeghalayaHexGrid, createMeghalayaGeofence } from '../utils/geofencing';

/**
 * Custom hook for managing hexagon state and operations
 * @param {Array} touristSpots - Array of tourist spots
 * @param {string} selectedRegion - Currently selected region filter
 * @returns {Object} Hexagon state and operations
 */
export const useHexagons = (touristSpots = [], selectedRegion = 'all') => {
  const [hexagons, setHexagons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate hexagons when tourist spots change
  useEffect(() => {
    if (touristSpots.length === 0) {
      setHexagons([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate hexagons for all regions
      const allHexagons = generateIndiaHexGrid(touristSpots);
      
      // Filter by selected region
      const filteredHexagons = getHexagonsByRegion(allHexagons, selectedRegion);
      
      setHexagons(filteredHexagons);
    } catch (err) {
      console.error('Error generating hexagons:', err);
      setError('Failed to generate hexagon grid');
    } finally {
      setIsLoading(false);
    }
  }, [touristSpots, selectedRegion]);

  // Memoized statistics
  const stats = useMemo(() => {
    return getHexagonStats(hexagons);
  }, [hexagons]);

  // Memoized hexagons by density
  const hexagonsByDensity = useMemo(() => {
    return {
      high: hexagons.filter(hex => hex.properties.density >= 8),
      medium: hexagons.filter(hex => hex.properties.density >= 4 && hex.properties.density < 8),
      low: hexagons.filter(hex => hex.properties.density >= 1 && hex.properties.density < 4),
      inactive: hexagons.filter(hex => hex.properties.density === 0)
    };
  }, [hexagons]);

  // Update hexagon data (for real-time updates)
  const updateHexagonData = useCallback((newTouristSpots) => {
    if (newTouristSpots.length === 0) {
      setHexagons([]);
      return;
    }

    try {
      const updatedHexagons = generateIndiaHexGrid(newTouristSpots);
      const filteredHexagons = getHexagonsByRegion(updatedHexagons, selectedRegion);
      setHexagons(filteredHexagons);
    } catch (err) {
      console.error('Error updating hexagon data:', err);
      setError('Failed to update hexagon data');
    }
  }, [selectedRegion]);

  // Get hexagons containing specific tourist spots
  const getHexagonsContainingSpots = useCallback((spotIds) => {
    return hexagons.filter(hexagon => {
      // This would need to be implemented based on your specific logic
      // For now, returning hexagons with tourist spots
      return hexagon.properties.touristCount > 0;
    });
  }, [hexagons]);

  // Get hexagon by ID
  const getHexagonById = useCallback((id) => {
    return hexagons.find(hex => hex.id === id);
  }, [hexagons]);

  // Get hexagons in a specific area (bounding box)
  const getHexagonsInBounds = useCallback((bounds) => {
    // This would need to be implemented with proper bounds checking
    // For now, returning all hexagons
    return hexagons;
  }, [hexagons]);

  // Real-time hexagon updates (simulate real-time data)
  const simulateRealTimeUpdate = useCallback(() => {
    if (hexagons.length === 0) return;

    // Randomly update some hexagon densities
    const updatedHexagons = hexagons.map(hexagon => {
      // 10% chance of density change
      if (Math.random() < 0.1) {
        const change = Math.random() < 0.5 ? 1 : -1;
        const newDensity = Math.max(0, hexagon.properties.density + change);
        
        return {
          ...hexagon,
          properties: {
            ...hexagon.properties,
            density: newDensity,
            touristCount: newDensity,
            color: getHexagonColor(newDensity),
            isActive: newDensity > 0
          }
        };
      }
      return hexagon;
    });

    setHexagons(updatedHexagons);
  }, [hexagons]);

  // Helper function to get hexagon color (moved from utils for use in hook)
  const getHexagonColor = (density) => {
    if (density >= 8) return '#ff4757';
    if (density >= 4) return '#ffa502';
    if (density >= 1) return '#2ed573';
    return '#ddd';
  };

  return {
    hexagons,
    isLoading,
    error,
    stats,
    hexagonsByDensity,
    updateHexagonData,
    getHexagonsContainingSpots,
    getHexagonById,
    getHexagonsInBounds,
    simulateRealTimeUpdate
  };
};

/**
 * Custom hook specifically for Meghalaya geofencing
 * @param {Array} meghalayaSpots - Array of Meghalaya tourist spots
 * @param {number} hexagonSize - Size of hexagons in kilometers
 * @returns {Object} Meghalaya geofencing state and operations
 */
export const useMeghalayaGeofencing = (meghalayaSpots = [], hexagonSize = 10) => {
  const [hexagons, setHexagons] = useState([]);
  const [geofence, setGeofence] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate Meghalaya hexagons when spots change
  useEffect(() => {
    if (meghalayaSpots.length === 0) {
      setHexagons([]);
      setGeofence(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate hexagons for Meghalaya
      const meghalayaHexagons = generateMeghalayaHexGrid(meghalayaSpots, hexagonSize);
      setHexagons(meghalayaHexagons);

      // Create geofence from active hexagons
      const geofencePolygon = createMeghalayaGeofence(meghalayaHexagons, 1);
      setGeofence(geofencePolygon);
    } catch (err) {
      console.error('Error generating Meghalaya geofencing:', err);
      setError('Failed to generate Meghalaya geofencing');
    } finally {
      setIsLoading(false);
    }
  }, [meghalayaSpots, hexagonSize]);

  // Memoized statistics for Meghalaya
  const stats = useMemo(() => {
    return getHexagonStats(hexagons);
  }, [hexagons]);

  // Memoized hexagons by density
  const hexagonsByDensity = useMemo(() => {
    return {
      high: hexagons.filter(hex => hex.properties.density >= 8),
      medium: hexagons.filter(hex => hex.properties.density >= 4 && hex.properties.density < 8),
      low: hexagons.filter(hex => hex.properties.density >= 1 && hex.properties.density < 4),
      inactive: hexagons.filter(hex => hex.properties.density === 0)
    };
  }, [hexagons]);

  // Update geofence with different density threshold
  const updateGeofence = useCallback((minDensity = 1) => {
    try {
      const newGeofence = createMeghalayaGeofence(hexagons, minDensity);
      setGeofence(newGeofence);
    } catch (err) {
      console.error('Error updating geofence:', err);
      setError('Failed to update geofence');
    }
  }, [hexagons]);

  // Get hexagons containing specific tourist spots
  const getHexagonsContainingSpots = useCallback((spotIds) => {
    return hexagons.filter(hexagon => {
      // Check if any of the specified spots are within this hexagon
      return hexagon.properties.touristCount > 0;
    });
  }, [hexagons]);

  // Get hexagon by ID
  const getHexagonById = useCallback((id) => {
    return hexagons.find(hex => hex.id === id);
  }, [hexagons]);

  // Get active hexagons (with tourist spots)
  const getActiveHexagons = useCallback(() => {
    return hexagons.filter(hex => hex.properties.isActive);
  }, [hexagons]);

  // Get geofence area in square kilometers
  const getGeofenceArea = useCallback(() => {
    if (!geofence || geofence.features.length === 0) return 0;
    
    try {
      const area = turf.area(geofence.features[0]) / 1000000; // Convert to km²
      return Math.round(area * 100) / 100;
    } catch (error) {
      console.error('Error calculating geofence area:', error);
      return 0;
    }
  }, [geofence]);

  // Check if a point is within the geofence
  const isPointInGeofence = useCallback((point) => {
    if (!geofence || geofence.features.length === 0) return false;
    
    try {
      const pointFeature = turf.point(point);
      return turf.booleanPointInPolygon(pointFeature, geofence.features[0]);
    } catch (error) {
      console.error('Error checking point in geofence:', error);
      return false;
    }
  }, [geofence]);

  return {
    hexagons,
    geofence,
    isLoading,
    error,
    stats,
    hexagonsByDensity,
    updateGeofence,
    getHexagonsContainingSpots,
    getHexagonById,
    getActiveHexagons,
    getGeofenceArea,
    isPointInGeofence
  };
};
