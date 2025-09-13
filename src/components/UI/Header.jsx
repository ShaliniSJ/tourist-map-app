import React, { useState } from 'react';
import { MapPin, Filter, Search, Settings, Info } from 'lucide-react';

const Header = ({
    filters,
    onFilterChange,
    selectedHexagon,
    onSearch,
    onSettings
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        }
    };

    const handleFilterChange = (filterType, value) => {
        if (onFilterChange) {
            onFilterChange(filterType, value);
        }
    };

    return (
        <header className="app-header">
            <div className="header-content">
                {/* Logo and Title */}
                <div className="header-left">
                    <div className="logo">
                        <MapPin size={24} />
                        <h1>Tourist Map India</h1>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="header-center">
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-input-wrapper">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search tourist spots..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </form>
                </div>

                {/* Filters and Actions */}
                <div className="header-right">
                    {/* Region Filter */}
                    <div className="filter-group">
                        <label htmlFor="region-filter">Region:</label>
                        <select
                            id="region-filter"
                            value={filters.region}
                            onChange={(e) => handleFilterChange('region', e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Regions</option>
                            <option value="north">North India</option>
                            <option value="south">South India</option>
                            <option value="east">East India</option>
                            <option value="west">West India</option>
                        </select>
                    </div>

                    {/* Category Filter */}
                    <div className="filter-group">
                        <label htmlFor="category-filter">Category:</label>
                        <select
                            id="category-filter"
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Categories</option>
                            <option value="monument">Monuments</option>
                            <option value="palace">Palaces</option>
                            <option value="fort">Forts</option>
                            <option value="temple">Temples</option>
                            <option value="nature">Nature</option>
                            <option value="beach">Beaches</option>
                            <option value="city">Cities</option>
                            <option value="cave">Caves</option>
                            <option value="memorial">Memorials</option>
                            <option value="ruins">Ruins</option>
                        </select>
                    </div>

                    {/* Settings Button */}
                    <button
                        className="header-btn"
                        onClick={onSettings}
                        title="Settings"
                    >
                        <Settings size={18} />
                    </button>

                    {/* Info Button */}
                    <button
                        className="header-btn"
                        onClick={() => setShowFilters(!showFilters)}
                        title="Show/Hide Filters"
                    >
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Selected Hexagon Info */}
            {selectedHexagon && (
                <div className="selected-hexagon-info">
                    <div className="hexagon-info-content">
                        <span className="hexagon-label">Selected Zone:</span>
                        <span className="hexagon-id">{selectedHexagon.id}</span>
                        <span className="hexagon-stats">
                            {selectedHexagon.properties.touristCount} tourist spots
                        </span>
                        <span className="hexagon-region">
                            {selectedHexagon.properties.region} region
                        </span>
                    </div>
                </div>
            )}

            {/* Advanced Filters Panel */}
            {showFilters && (
                <div className="advanced-filters">
                    <div className="filters-content">
                        <h3>Advanced Filters</h3>

                        <div className="filter-row">
                            <div className="filter-item">
                                <label>Rating:</label>
                                <select
                                    value={filters.minRating || 'all'}
                                    onChange={(e) => handleFilterChange('minRating', e.target.value)}
                                >
                                    <option value="all">All Ratings</option>
                                    <option value="4.5">4.5+ Stars</option>
                                    <option value="4.0">4.0+ Stars</option>
                                    <option value="3.5">3.5+ Stars</option>
                                </select>
                            </div>

                            <div className="filter-item">
                                <label>Distance from center:</label>
                                <select
                                    value={filters.distance || 'all'}
                                    onChange={(e) => handleFilterChange('distance', e.target.value)}
                                >
                                    <option value="all">Any Distance</option>
                                    <option value="100">Within 100km</option>
                                    <option value="200">Within 200km</option>
                                    <option value="500">Within 500km</option>
                                </select>
                            </div>
                        </div>

                        <div className="filter-actions">
                            <button
                                className="btn-secondary"
                                onClick={() => {
                                    handleFilterChange('region', 'all');
                                    handleFilterChange('category', 'all');
                                    handleFilterChange('minRating', 'all');
                                    handleFilterChange('distance', 'all');
                                }}
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
