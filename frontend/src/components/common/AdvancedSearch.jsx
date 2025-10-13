import React, { useState } from 'react';

const AdvancedSearch = ({ onSearch, placeholder = "Search...", filters = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleSearch = () => {
    onSearch({
      term: searchTerm,
      filters: selectedFilters
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedFilters({});
    onSearch({ term: '', filters: {} });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Basic Search */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
        >
          Search
        </button>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          {showAdvanced ? 'Hide' : 'Advanced'}
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-gray-400 text-sm mb-2">
                  {filter.label}
                </label>
                {filter.type === 'select' ? (
                  <select
                    value={selectedFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : filter.type === 'range' ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={selectedFilters[`${filter.key}_min`] || ''}
                        onChange={(e) => handleFilterChange(`${filter.key}_min`, e.target.value)}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={selectedFilters[`${filter.key}_max`] || ''}
                        onChange={(e) => handleFilterChange(`${filter.key}_max`, e.target.value)}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <input
                    type={filter.type}
                    value={selectedFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
