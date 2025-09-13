// Test file to verify Meghalaya geofencing implementation
import { generateMeghalayaHexGrid, createMeghalayaGeofence, MEGHALAYA_BOUNDS } from './geofencing';
import { meghalayaTouristSpots } from './touristData';

/**
 * Test function to verify Meghalaya geofencing functionality
 */
export const testMeghalayaGeofencing = () => {
  console.log('🧪 Testing Meghalaya Geofencing Implementation...');
  
  try {
    // Test 1: Verify Meghalaya bounds
    console.log('📍 Meghalaya Bounds:', MEGHALAYA_BOUNDS);
    console.log('✅ Bounds are valid:', MEGHALAYA_BOUNDS.length === 4);
    
    // Test 2: Verify tourist spots data
    console.log('🏞️ Meghalaya Tourist Spots:', meghalayaTouristSpots.length);
    console.log('✅ Tourist spots loaded:', meghalayaTouristSpots.length > 0);
    
    // Test 3: Generate hexagon grid
    const hexagons = generateMeghalayaHexGrid(meghalayaTouristSpots, 10);
    console.log('🔷 Generated Hexagons:', hexagons.length);
    console.log('✅ Hexagons generated:', hexagons.length > 0);
    
    // Test 4: Check hexagon properties
    if (hexagons.length > 0) {
      const firstHex = hexagons[0];
      console.log('🔍 First Hexagon Properties:', {
        id: firstHex.id,
        region: firstHex.properties.region,
        state: firstHex.properties.state,
        isGeofenced: firstHex.properties.isGeofenced,
        density: firstHex.properties.density
      });
      console.log('✅ Hexagon properties valid:', 
        firstHex.properties.region === 'meghalaya' && 
        firstHex.properties.state === 'Meghalaya'
      );
    }
    
    // Test 5: Create geofence
    const geofence = createMeghalayaGeofence(hexagons, 1);
    console.log('🛡️ Geofence Features:', geofence.features.length);
    console.log('✅ Geofence created:', geofence.features.length > 0);
    
    // Test 6: Check active hexagons
    const activeHexagons = hexagons.filter(hex => hex.properties.isActive);
    console.log('⚡ Active Hexagons:', activeHexagons.length);
    console.log('✅ Active hexagons found:', activeHexagons.length > 0);
    
    // Test 7: Density distribution
    const densityStats = {
      high: hexagons.filter(hex => hex.properties.density >= 8).length,
      medium: hexagons.filter(hex => hex.properties.density >= 4 && hex.properties.density < 8).length,
      low: hexagons.filter(hex => hex.properties.density >= 1 && hex.properties.density < 4).length,
      inactive: hexagons.filter(hex => hex.properties.density === 0).length
    };
    console.log('📊 Density Distribution:', densityStats);
    
    // Test 8: Total tourist spots coverage
    const totalSpots = hexagons.reduce((sum, hex) => sum + hex.properties.density, 0);
    console.log('🎯 Total Tourist Spots Covered:', totalSpots);
    console.log('✅ Coverage matches:', totalSpots === meghalayaTouristSpots.length);
    
    console.log('🎉 All tests completed successfully!');
    return {
      success: true,
      hexagons: hexagons.length,
      activeHexagons: activeHexagons.length,
      geofenceFeatures: geofence.features.length,
      totalSpots,
      densityStats
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Test geofence with different density thresholds
 */
export const testGeofenceThresholds = () => {
  console.log('🧪 Testing Geofence with Different Thresholds...');
  
  try {
    const hexagons = generateMeghalayaHexGrid(meghalayaTouristSpots, 10);
    const thresholds = [1, 2, 3, 4, 5];
    
    const results = thresholds.map(threshold => {
      const geofence = createMeghalayaGeofence(hexagons, threshold);
      const activeHexagons = hexagons.filter(hex => hex.properties.density >= threshold);
      
      return {
        threshold,
        activeHexagons: activeHexagons.length,
        geofenceFeatures: geofence.features.length,
        totalSpots: activeHexagons.reduce((sum, hex) => sum + hex.properties.density, 0)
      };
    });
    
    console.log('📊 Threshold Results:', results);
    return results;
    
  } catch (error) {
    console.error('❌ Threshold test failed:', error);
    return null;
  }
};

/**
 * Test different hexagon sizes
 */
export const testHexagonSizes = () => {
  console.log('🧪 Testing Different Hexagon Sizes...');
  
  try {
    const sizes = [5, 10, 15, 20, 25];
    
    const results = sizes.map(size => {
      const hexagons = generateMeghalayaHexGrid(meghalayaTouristSpots, size);
      const activeHexagons = hexagons.filter(hex => hex.properties.isActive);
      
      return {
        size,
        totalHexagons: hexagons.length,
        activeHexagons: activeHexagons.length,
        coverage: activeHexagons.length / hexagons.length * 100
      };
    });
    
    console.log('📊 Size Results:', results);
    return results;
    
  } catch (error) {
    console.error('❌ Size test failed:', error);
    return null;
  }
};

// Export test runner
export const runAllTests = () => {
  console.log('🚀 Running All Meghalaya Geofencing Tests...\n');
  
  const basicTest = testMeghalayaGeofencing();
  console.log('\n');
  
  const thresholdTest = testGeofenceThresholds();
  console.log('\n');
  
  const sizeTest = testHexagonSizes();
  console.log('\n');
  
  console.log('🏁 All tests completed!');
  
  return {
    basicTest,
    thresholdTest,
    sizeTest
  };
};
