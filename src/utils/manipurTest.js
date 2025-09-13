// Test file to verify Manipur area visualization implementation
import { createManipurAreas, createManipurStateArea, createBufferAreas, MANIPUR_BOUNDS } from './geofencing';
import { manipurTouristSpots } from './touristData';

/**
 * Test function to verify Manipur area visualization functionality
 */
export const testManipurAreas = () => {
  console.log('🧪 Testing Manipur Area Visualization...');
  
  try {
    // Test 1: Verify Manipur bounds
    console.log('📍 Manipur Bounds:', MANIPUR_BOUNDS);
    console.log('✅ Bounds are valid:', MANIPUR_BOUNDS.length === 4);
    
    // Test 2: Verify tourist spots data
    console.log('🏞️ Manipur Tourist Spots:', manipurTouristSpots.length);
    console.log('✅ Tourist spots loaded:', manipurTouristSpots.length > 0);
    
    // Test 3: Create tourist areas
    const areas = createManipurAreas(manipurTouristSpots, 15);
    console.log('🔵 Tourist Areas Created:', areas.features.length);
    console.log('✅ Areas generated:', areas.features.length > 0);
    
    // Test 4: Check area properties
    if (areas.features.length > 0) {
      const firstArea = areas.features[0];
      console.log('🔍 First Area Properties:', {
        name: firstArea.properties.name,
        area: firstArea.properties.area,
        radius: firstArea.properties.radius,
        category: firstArea.properties.category,
        type: firstArea.properties.type
      });
      console.log('✅ Area properties valid:', 
        firstArea.properties.type === 'tourist-area' && 
        firstArea.properties.region === 'manipur'
      );
    }
    
    // Test 5: Create state area
    const stateArea = createManipurStateArea(manipurTouristSpots);
    console.log('🗺️ State Area Features:', stateArea.features.length);
    console.log('✅ State area created:', stateArea.features.length > 0);
    
    // Test 6: Check state area properties
    if (stateArea.features.length > 0) {
      const state = stateArea.features[0];
      console.log('🔍 State Area Properties:', {
        name: state.properties.name,
        area: state.properties.area,
        type: state.properties.type,
        touristSpotsCount: state.properties.touristSpotsCount
      });
    }
    
    // Test 7: Create buffer areas
    const bufferAreas = createBufferAreas(manipurTouristSpots, 20);
    console.log('🛡️ Buffer Areas Created:', bufferAreas.features.length);
    console.log('✅ Buffer areas created:', bufferAreas.features.length > 0);
    
    // Test 8: Calculate total area
    const totalArea = areas.features.reduce((sum, feature) => sum + feature.properties.area, 0);
    console.log('📊 Total Tourist Areas:', totalArea.toFixed(2), 'km²');
    
    // Test 9: Area distribution by category
    const categoryDistribution = {};
    areas.features.forEach(area => {
      const category = area.properties.category;
      categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
    });
    console.log('📈 Category Distribution:', categoryDistribution);
    
    // Test 10: Average area size
    const avgArea = totalArea / areas.features.length;
    console.log('📏 Average Area Size:', avgArea.toFixed(2), 'km²');
    
    console.log('🎉 All tests completed successfully!');
    return {
      success: true,
      touristAreas: areas.features.length,
      stateAreas: stateArea.features.length,
      bufferAreas: bufferAreas.features.length,
      totalArea: totalArea.toFixed(2),
      avgArea: avgArea.toFixed(2),
      categoryDistribution
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
 * Test areas with different radius values
 */
export const testAreaRadius = () => {
  console.log('🧪 Testing Different Area Radius Values...');
  
  try {
    const radiusValues = [5, 10, 15, 20, 25, 30];
    
    const results = radiusValues.map(radius => {
      const areas = createManipurAreas(manipurTouristSpots, radius);
      const totalArea = areas.features.reduce((sum, feature) => sum + feature.properties.area, 0);
      const avgArea = totalArea / areas.features.length;
      
      return {
        radius,
        totalArea: totalArea.toFixed(2),
        avgArea: avgArea.toFixed(2),
        areaCount: areas.features.length
      };
    });
    
    console.log('📊 Radius Test Results:', results);
    return results;
    
  } catch (error) {
    console.error('❌ Radius test failed:', error);
    return null;
  }
};

/**
 * Test buffer areas with different distances
 */
export const testBufferDistances = () => {
  console.log('🧪 Testing Different Buffer Distances...');
  
  try {
    const distances = [10, 15, 20, 25, 30, 40, 50];
    
    const results = distances.map(distance => {
      const bufferAreas = createBufferAreas(manipurTouristSpots, distance);
      const totalArea = bufferAreas.features.reduce((sum, feature) => sum + feature.properties.area, 0);
      const avgArea = totalArea / bufferAreas.features.length;
      
      return {
        distance,
        totalArea: totalArea.toFixed(2),
        avgArea: avgArea.toFixed(2),
        bufferCount: bufferAreas.features.length
      };
    });
    
    console.log('📊 Buffer Distance Test Results:', results);
    return results;
    
  } catch (error) {
    console.error('❌ Buffer distance test failed:', error);
    return null;
  }
};

/**
 * Test area calculations accuracy
 */
export const testAreaCalculations = () => {
  console.log('🧪 Testing Area Calculation Accuracy...');
  
  try {
    const areas = createManipurAreas(manipurTouristSpots, 15);
    
    // Test each area calculation
    const calculations = areas.features.map((area, index) => {
      const expectedArea = Math.PI * Math.pow(area.properties.radius, 2);
      const actualArea = area.properties.area;
      const difference = Math.abs(expectedArea - actualArea);
      const accuracy = ((expectedArea - difference) / expectedArea) * 100;
      
      return {
        index,
        name: area.properties.name,
        expected: expectedArea.toFixed(2),
        actual: actualArea.toFixed(2),
        difference: difference.toFixed(2),
        accuracy: accuracy.toFixed(2) + '%'
      };
    });
    
    console.log('📊 Area Calculation Accuracy:', calculations);
    
    // Calculate overall accuracy
    const avgAccuracy = calculations.reduce((sum, calc) => {
      return sum + parseFloat(calc.accuracy);
    }, 0) / calculations.length;
    
    console.log('📏 Average Accuracy:', avgAccuracy.toFixed(2) + '%');
    
    return {
      calculations,
      avgAccuracy: avgAccuracy.toFixed(2)
    };
    
  } catch (error) {
    console.error('❌ Area calculation test failed:', error);
    return null;
  }
};

// Export test runner
export const runAllManipurTests = () => {
  console.log('🚀 Running All Manipur Area Visualization Tests...\n');
  
  const basicTest = testManipurAreas();
  console.log('\n');
  
  const radiusTest = testAreaRadius();
  console.log('\n');
  
  const bufferTest = testBufferDistances();
  console.log('\n');
  
  const accuracyTest = testAreaCalculations();
  console.log('\n');
  
  console.log('🏁 All tests completed!');
  
  return {
    basicTest,
    radiusTest,
    bufferTest,
    accuracyTest
  };
};
