import React, { useState } from 'react';
import MeghalayaGeofencing from '../components/Map/MeghalayaGeofencing';
import { runAllTests } from '../utils/meghalayaTest';

const MeghalayaDemo = () => {
    const [showTests, setShowTests] = useState(false);
    const [testResults, setTestResults] = useState(null);

    const handleRunTests = () => {
        setShowTests(true);
        const results = runAllTests();
        setTestResults(results);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">Meghalaya Geofencing Demo</h1>
                    <p className="text-xl opacity-90">
                        Hexagonal geofencing implementation using Turf.js for Meghalaya tourist spots
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
                            <h3 className="text-lg font-semibold mb-2 text-purple-700">Features</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Hexagonal grid generation using Turf.js</li>
                                <li>• Dynamic geofence creation based on tourist density</li>
                                <li>• Real-time density visualization</li>
                                <li>• Interactive map with popup information</li>
                                <li>• Adjustable hexagon sizes (5-25 km)</li>
                                <li>• Configurable density thresholds</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-purple-700">Technical Details</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• <strong>Bounding Box:</strong> [89.61, 24.58, 92.51, 26.07]</li>
                                <li>• <strong>Tourist Spots:</strong> 10 locations in Meghalaya</li>
                                <li>• <strong>Hexagon Size:</strong> 10km (configurable)</li>
                                <li>• <strong>Geofence Type:</strong> Union of active hexagons</li>
                                <li>• <strong>Density Colors:</strong> Red (8+), Orange (4-7), Green (1-3), Gray (0)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Test Controls */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Test Implementation</h3>
                            <p className="text-gray-600">Run automated tests to verify the geofencing functionality</p>
                        </div>
                        <button
                            onClick={handleRunTests}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
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
                                        <p>✅ Basic Test: {testResults.basicTest.success ? 'PASSED' : 'FAILED'}</p>
                                        <p>✅ Threshold Test: {testResults.thresholdTest ? 'COMPLETED' : 'FAILED'}</p>
                                        <p>✅ Size Test: {testResults.sizeTest ? 'COMPLETED' : 'FAILED'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Geofencing Component */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <MeghalayaGeofencing />
                </div>

                {/* Usage Instructions */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">How to Use</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-purple-700">Controls</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li><strong>Hexagon Size:</strong> Adjust the size of hexagons (5-25 km)</li>
                                <li><strong>Min Density:</strong> Set minimum tourist spots to include in geofence</li>
                                <li><strong>Show Geofence:</strong> Toggle the geofence polygon visibility</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-purple-700">Interactions</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li><strong>Click Hexagons:</strong> View detailed information</li>
                                <li><strong>Click Geofence:</strong> See geofence statistics</li>
                                <li><strong>Zoom/Pan:</strong> Explore different areas</li>
                                <li><strong>Statistics:</strong> Monitor real-time data</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Code Example */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Code Example</h2>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-sm">
                            {`import { useMeghalayaGeofencing } from './hooks/useHexagons';
import { meghalayaTouristSpots } from './utils/touristData';

const MyComponent = () => {
  const {
    hexagons,
    geofence,
    isLoading,
    stats,
    updateGeofence,
    getGeofenceArea
  } = useMeghalayaGeofencing(meghalayaTouristSpots, 10);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <p>Total Hexagons: {stats.totalHexagons}</p>
          <p>Active Hexagons: {stats.activeHexagons}</p>
          <p>Geofence Area: {getGeofenceArea()} km²</p>
          {/* Render your map with hexagons and geofence */}
        </div>
      )}
    </div>
  );
};`}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeghalayaDemo;
