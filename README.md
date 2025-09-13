# Tourist Spots Map with Hexagonal Geofencing

A modern React application for discovering tourist spots in India with hexagonal geofencing using OpenStreetMap and Turf.js.

## Features

- 🗺️ **Interactive Map**: OpenStreetMap integration with react-leaflet
- 🔷 **Hexagonal Geofencing**: Turf.js powered hexagonal grid system
- 📍 **Tourist Spots**: 30+ popular destinations across India
- 🔔 **Real-time Notifications**: Smart notification system with filtering
- 🎨 **Modern UI**: Glassmorphism design with responsive layout
- 🔍 **Advanced Filtering**: Filter by region, category, and rating
- 📊 **Statistics**: Real-time hexagon density and tourist spot analytics

## Project Structure

```
tourist-map-app/
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapContainer.jsx
│   │   │   ├── TouristMarkers.jsx
│   │   │   └── HexagonLayer.jsx
│   │   ├── Notifications/
│   │   │   ├── NotificationPanel.jsx
│   │   │   └── NotificationItem.jsx
│   │   └── UI/
│   │       ├── Header.jsx
│   │       └── Legend.jsx
│   ├── utils/
│   │   ├── geofencing.js
│   │   ├── touristData.js
│   │   └── mapUtils.js
│   ├── hooks/
│   │   ├── useHexagons.js
│   │   └── useNotifications.js
│   ├── styles/
│   │   └── globals.css
│   └── App.jsx
```

## Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:3000`

## Dependencies

- **React 18**: Modern React with hooks
- **react-leaflet**: React wrapper for Leaflet maps
- **@turf/turf**: Geospatial analysis library
- **lucide-react**: Modern icon library
- **leaflet**: Interactive maps library

## Key Features

### 🗺️ Map Integration
- OpenStreetMap tiles with custom styling
- Centered on India coordinates: [20.5937, 78.9629]
- Responsive design with zoom controls
- Custom markers for different tourist spot categories

### 🔷 Hexagonal Geofencing
- 50km diameter hexagons covering India
- Real-time tourist density calculations
- Color-coded zones based on spot density:
  - 🔴 Red: High density (8+ spots)
  - 🟠 Orange: Medium density (4-7 spots)
  - 🟢 Green: Low density (1-3 spots)
  - ⚪ Gray: No data (0 spots)

### 📍 Tourist Spots
- 30+ popular destinations across India
- Categorized by type (monuments, palaces, forts, temples, etc.)
- Regional distribution (North, South, East, West)
- Rating system and detailed information

### 🔔 Notification System
- Real-time alerts for weather, travel, festivals, and offers
- Priority-based filtering (High, Medium, Low)
- Interactive notifications with location data
- Auto-dismiss for low-priority notifications

### 🎨 Modern UI Design
- Glassmorphism design with backdrop blur effects
- Gradient backgrounds and smooth animations
- Responsive layout for desktop, tablet, and mobile
- Custom CSS with modern styling patterns

## Usage

### Map Interactions
- **Click Hexagons**: View zone details and contained tourist spots
- **Click Markers**: Get detailed information about tourist spots
- **Hover Effects**: Quick tooltips with zone statistics
- **Zoom/Pan**: Navigate around India's tourist destinations

### Filtering Options
- **Region Filter**: North, South, East, West India
- **Category Filter**: Monuments, Palaces, Forts, Temples, etc.
- **Rating Filter**: Filter by minimum rating (3.5+, 4.0+, 4.5+)
- **Distance Filter**: Filter by distance from center

### Notifications
- **Real-time Updates**: Weather alerts, travel updates, festival notifications
- **Priority System**: High, medium, and low priority notifications
- **Interactive Actions**: Click to view location, dismiss notifications
- **Filtering**: Filter by type, priority, or read status

## Technical Implementation

### Geofencing Logic
```javascript
// Generate hexagonal grid for India
const hexagons = generateIndiaHexGrid(touristSpots);

// Calculate tourist density per hexagon
const density = getTouristDensity(hexagon, touristSpots);

// Color code based on density
const color = getHexagonColor(density);
```

### State Management
- React hooks for local state management
- Custom hooks for hexagon and notification logic
- Memoized calculations for performance optimization
- Real-time updates with simulated data

### Performance Optimizations
- React.memo for component optimization
- useMemo for expensive calculations
- Debounced map interactions
- Lazy loading of marker details

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Available Scripts
- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

### Code Structure
- **Components**: Reusable UI components
- **Hooks**: Custom React hooks for business logic
- **Utils**: Utility functions for geospatial operations
- **Styles**: Modern CSS with glassmorphism design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- OpenStreetMap contributors for map data
- Turf.js for geospatial calculations
- React Leaflet for map integration
- Lucide React for beautiful icons

---

**Built with ❤️ for exploring India's amazing tourist destinations**
