import React from 'react';

const FilterComponent = ({
  filterDateRange,
  handleDateRangeChange,
  sortOrder,
  setSortOrder,
  quickFilter,
  handleQuickFilterChange,
  areFiltersActive,
  handleClearFilters,
  sortOptions = []
}) => {
  return (
    <div className="filter-controls-container" style={{
      backgroundColor: 'var(--bg-color)',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid var(--header-border-color)',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',
      alignItems: 'end'
    }}>
      <div className="filter-group">
        <label className="filter-label" style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: 'var(--subtitle-color)' }}>Date Range</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="date"
            name="startDate"
            value={filterDateRange.startDate}
            onChange={handleDateRangeChange}
            className="form-input"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--header-border-color)' }}
          />
          <span style={{ alignSelf: 'center', color: 'var(--subtitle-color)' }}>to</span>
          <input
            type="date"
            name="endDate"
            value={filterDateRange.endDate}
            onChange={handleDateRangeChange}
            className="form-input"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--header-border-color)' }}
          />
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label" style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: 'var(--subtitle-color)' }}>Sort By</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="form-select"
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--header-border-color)', minWidth: '150px' }}
        >
          {sortOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {quickFilter && (
        <div className="filter-group">
          <label className="filter-label" style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: 'var(--subtitle-color)' }}>Filter</label>
          <div className="quick-filter-buttons" style={{ display: 'flex', gap: '5px' }}>
            <button
              className={`quick-filter-btn ${quickFilter === 'All' ? 'active' : ''}`}
              onClick={() => handleQuickFilterChange('All')}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid var(--header-border-color)',
                backgroundColor: quickFilter === 'All' ? 'var(--button-hover-bg)' : 'transparent',
                cursor: 'pointer'
              }}
            >
              All
            </button>
          </div>
        </div>
      )}

      {areFiltersActive && (
        <button
          onClick={handleClearFilters}
          className="clear-filters-btn"
          style={{
            padding: '8px 15px',
            borderRadius: '4px',
            border: '1px solid #dc3545',
            backgroundColor: 'transparent',
            color: '#dc3545',
            cursor: 'pointer',
            height: 'fit-content',
            marginBottom: '2px'
          }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterComponent;
