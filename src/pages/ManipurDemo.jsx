import React, { useState } from 'react';
import ManipurAreas from '../components/Map/ManipurAreas';
import { createManipurAreas, createManipurStateArea, createBufferAreas } from '../utils/geofencing';
import { manipurTouristSpots } from '../utils/touristData';

const ManipurDemo = () => {
    const [showTests, setShowTests] = useState(false);
    const [testResults, setTestResults] = useState(null);

    const handleRunTests = () => {
        setShowTests(true);

        console.log('🧪 Testing Manipur Area Visualization...');

        try {
            // Test 1: Create tourist areas
            const areas = createManipurAreas(manipurTouristSpots, 15);
            console.log('✅ Tourist Areas Created:', areas.features.length);

            // Test 2: Create state area
            const stateArea = createManipurStateArea(manipurTouristSpots);
            console.log('✅ State Area Created:', stateArea.features.length);

            // Test 3: Create buffer areas
            const bufferAreas = createBufferAreas(manipurTouristSpots, 20);
            console.log('✅ Buffer Areas Created:', bufferAreas.features.length);

            // Test 4: Calculate total area
            const totalArea = areas.features.reduce((sum, feature) => sum + feature.properties.area, 0);
            console.log('✅ Total Area Calculated:', totalArea.toFixed(2), 'km²');

            // Test 5: Check area properties
            const firstArea = areas.features[0];
            console.log('✅ First Area Properties:', {
                name: firstArea.properties.name,
                area: firstArea.properties.area,
                radius: firstArea.properties.radius,
                category: firstArea.properties.category
            });

            const results = {
                success: true,
                touristAreas: areas.features.length,
                stateAreas: stateArea.features.length,
                bufferAreas: bufferAreas.features.length,
                totalArea: totalArea.toFixed(2)
            };

            setTestResults(results);
            console.log('🎉 All tests completed successfully!', results);

        } catch (error) {
            console.error('❌ Test failed:', error);
            setTestResults({ success: false, error: error.message });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">Manipur Area Visualization</h1>
                    <p className="text-xl opacity-90">
                        Visible area polygons using Turf.js area API for Manipur tourist spots
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6">
                {/* Info Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">About This Implementation</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-orange-700">Features</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• <strong>Visible Areas:</strong> Circular areas around each tourist spot</li>
                                <li>• <strong>State Boundary:</strong> Complete Manipur state polygon</li>
                                <li>• <strong>Buffer Zones:</strong> Configurable buffer areas</li>
                                <li>• <strong>Area Calculation:</strong> Using Turf.js area API</li>
                                <li>• <strong>Interactive Map:</strong> Click areas for detailed information</li>
                                <li>• <strong>Real-time Updates:</strong> Adjust radius and buffer distance</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-orange-700">Technical Details</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• <strong>Bounding Box:</strong> [93.73, 23.83, 94.78, 25.68]</li>
                                <li>• <strong>Tourist Spots:</strong> 8 locations in Manipur</li>
                                <li>• <strong>Area Types:</strong> Circles, polygons, buffers</li>
                                <li>• <strong>Turf.js Functions:</strong> circle(), area(), buffer(), bboxPolygon()</li>
                                <li>• <strong>Area Calculation:</strong> Real-time in km²</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Test Controls */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Test Implementation</h3>
                            <p className="text-gray-600">Run automated tests to verify the area visualization functionality</p>
                        </div>
                        <button
                            onClick={handleRunTests}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Run Tests
                        </button>
                    </div>

                    {showTests && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-2">Test Results:</h4>
                            <div className="text-sm text-gray-600">
                                <p>Check the browser console for detailed test results.</p>
                                {testResults && (
                                    <div className="mt-2">
                                        {testResults.success ? (
                                            <div>
                                                <p>✅ Tourist Areas: {testResults.touristAreas}</p>
                                                <p>✅ State Areas: {testResults.stateAreas}</p>
                                                <p>✅ Buffer Areas: {testResults.bufferAreas}</p>
                                                <p>✅ Total Area: {testResults.totalArea} km²</p>
                                            </div>
                                        ) : (
                                            <p>❌ Test Failed: {testResults.error}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Area Visualization Component */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <ManipurAreas />
                </div>

                {/* Usage Instructions */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">How to Use</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-orange-700">Controls</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li><strong>Tourist Area Radius:</strong> Adjust circle size around spots (5-30 km)</li>
                                <li><strong>Buffer Distance:</strong> Set buffer zone size (10-50 km)</li>
                                <li><strong>Toggle Layers:</strong> Show/hide different area types</li>
                                <li><strong>Tourist Markers:</strong> Display individual spot markers</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-orange-700">Interactions</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li><strong>Click Areas:</strong> View detailed area information</li>
                                <li><strong>Click Markers:</strong> See tourist spot details</li>
                                <li><strong>Zoom/Pan:</strong> Explore different areas</li>
                                <li><strong>Statistics:</strong> Monitor real-time area calculations</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Code Example */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Code Example</h2>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-sm">
                            {`import { createManipurAreas, createManipurStateArea } from './utils/geofencing';
import { manipurTouristSpots } from './utils/touristData';

const MyComponent = () => {
  // Create circular areas around tourist spots
  const areas = createManipurAreas(manipurTouristSpots, 15);
  
  // Create state boundary polygon
  const stateArea = createManipurStateArea(manipurTouristSpots);
  
  // Calculate total area
  const totalArea = areas.features.reduce(
    (sum, feature) => sum + feature.properties.area, 0
  );
  
  return (
    <div>
      <p>Total Area: {totalArea.toFixed(2)} km²</p>
      {/* Render your map with areas */}
    </div>
  );
};`}
                        </pre>
                    </div>
                </div>

                {/* Area Types Explanation */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Area Types Explained</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-green-50 rounded-lg">
                            <h3 className="font-semibold text-green-800 mb-2">Tourist Areas</h3>
                            <p className="text-sm text-gray-600">
                                Circular areas around each tourist spot. Size is configurable (5-30 km radius).
                                Each area shows the coverage zone for that location.
                            </p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                            <h3 className="font-semibold text-orange-800 mb-2">State Boundary</h3>
                            <p className="text-sm text-gray-600">
                                Complete polygon covering Manipur state. Shows the total state area
                                and includes all tourist spots within the boundary.
                            </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-blue-800 mb-2">Buffer Zones</h3>
                            <p className="text-sm text-gray-600">
                                Extended areas around tourist spots for planning purposes.
                                Useful for infrastructure planning and service coverage.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManipurDemo;
