import React from 'react';

export const APPLICATIONS_SORT_OPTIONS = [
  { value: 'Newest First', label: 'Newest First' },
  { value: 'Oldest First', label: 'Oldest First' },
  { value: 'Job Title A-Z', label: 'Job Title A-Z' },
  { value: 'Company A-Z', label: 'Company A-Z' },
];

export const FILES_SORT_OPTIONS = [
  { value: 'Newest First', label: 'Newest First' },
  { value: 'Oldest First', label: 'Oldest First' },
  { value: 'File Name A-Z', label: 'File Name A-Z' },
  { value: 'File Size (Asc)', label: 'File Size (Asc)' },
  { value: 'File Size (Desc)', label: 'File Size (Desc)' },
];

export const ACTIVITY_SORT_OPTIONS = [
  { value: 'Newest First', label: 'Newest First' },
  { value: 'Oldest First', label: 'Oldest First' },
  { value: 'Activity Type A-Z', label: 'Activity Type A-Z' },
];

const QUICK_FILTERS = ['Last 7 Days', 'Last 30 Days', 'All Time'];

const DateInput = ({ name, value, onChange }) => (
  <div style={dateInputWrapperStyle}>
    {!value && <span style={datePlaceholderStyle}>dd-mm-yyyy</span>}
    <input
      type="date"
      name={name}
      value={value}
      onChange={onChange}
      style={dateInputStyle}
      className="employee-dashboard-date-input"
    />
  </div>
);

const AdvancedFilters = ({
  filterDateRange = { startDate: '', endDate: '' },
  sortOrder = 'Newest First',
  sortOptions = APPLICATIONS_SORT_OPTIONS,
  quickFilter = '',
  onDateRangeChange = () => {},
  onSortOrderChange = () => {},
  onQuickFilterChange = () => {},
  onClearFilters = () => {},
  areFiltersActive = () => false,
}) => (
  <>
    <h2 style={advancedFiltersTitleStyle}>Advanced Filters</h2>
    <div style={filterContainerStyle}>
      <div style={{ ...filterGroupStyle, flex: '1 1 300px', maxWidth: '420px' }}>
        <label style={filterLabelStyle}>Date Range</label>
        <div style={dateRangeInputGroupStyle}>
          <DateInput
            name="startDate"
            value={filterDateRange.startDate}
            onChange={onDateRangeChange}
          />
          <span style={dateRangeSeparatorStyle}>to</span>
          <DateInput
            name="endDate"
            value={filterDateRange.endDate}
            onChange={onDateRangeChange}
          />
        </div>
      </div>

      <div style={{ ...filterGroupStyle, flex: '0 0 220px' }}>
        <label style={filterLabelStyle}>Sort Order</label>
        <select
          value={sortOrder}
          onChange={onSortOrderChange}
          style={selectFilterStyle}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ ...filterGroupStyle, flex: '0 0 auto' }}>
        <label style={filterLabelStyle}>Quick Filters</label>
        <div style={quickFilterButtonsStyle}>
          {QUICK_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onQuickFilterChange(filter)}
              style={{
                ...quickFilterButtonStyle,
                ...(quickFilter === filter ? quickFilterButtonActiveStyle : {}),
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>

    {areFiltersActive() && (
      <div style={clearFiltersRowStyle}>
        <button type="button" onClick={onClearFilters} style={clearFiltersButtonStyle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Clear Filters
        </button>
      </div>
    )}
  </>
);

const advancedFiltersTitleStyle = {
  fontSize: '1.35rem',
  fontWeight: '700',
  color: '#102a43',
  textAlign: 'center',
  margin: '0 0 28px 0',
};

const filterContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'flex-end',
  gap: '48px 56px',
  marginBottom: '24px',
  paddingBottom: '24px',
  borderBottom: '1px solid #e5e7eb',
  width: '100%',
};

const filterGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
  minWidth: 0,
};

const filterLabelStyle = {
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#64748b',
  textAlign: 'center',
  margin: 0,
};

const dateRangeInputGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
};

const dateInputWrapperStyle = {
  position: 'relative',
  flex: 1,
  minWidth: '130px',
};

const datePlaceholderStyle = {
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#94a3b8',
  fontSize: '0.9rem',
  pointerEvents: 'none',
  zIndex: 1,
};

const dateInputStyle = {
  width: '100%',
  padding: '10px 36px 10px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  fontSize: '0.9rem',
  color: '#102a43',
  backgroundColor: '#ffffff',
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%3E%3Cpath%20fill=%22%2364748b%22%20d=%22M19%204h-1V2h-2v2H8V2H6v2H5c-1.1%200-2%20.9-2%202v14c0%201.1.9%202%202%202h14c1.1%200%202-.9%202-2V6c0-1.1-.9-2-2-2zm0%2016H5V9h14v11zm0-13H5V6h14v1z%22/%3E%3C/svg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  backgroundSize: '16px',
  boxSizing: 'border-box',
};

const dateRangeSeparatorStyle = {
  color: '#94a3b8',
  fontSize: '0.875rem',
  fontWeight: '500',
  flexShrink: 0,
};

const selectFilterStyle = {
  width: '100%',
  minWidth: '200px',
  padding: '10px 36px 10px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  fontSize: '0.9rem',
  color: '#102a43',
  fontWeight: '500',
  backgroundColor: '#ffffff',
  appearance: 'none',
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20320%20512%22%3E%3Cpath%20fill=%22%23102a43%22%20d=%22M143%20352.3L7.7%20199.7c-4.7-4.7-12.3-4.7-17%200l-19.4%2019.4c-4.7%204.7-4.7%2012.3%200%2017L159%20448.3c9.4%209.4%2024.6%209.4%2033.9%200l151.3-151.3c4.7-4.7%204.7-12.3%200-17l-19.4-19.4c-4.7-4.7-12.3-4.7-17%200L160%20352.3c-9.4%209.4-24.6%209.4-33.9%200z%22/%3E%3C/svg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '12px',
  cursor: 'pointer',
};

const quickFilterButtonsStyle = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
  justifyContent: 'center',
};

const quickFilterButtonStyle = {
  background: '#e2e8f0',
  color: '#102a43',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s, color 0.2s',
  whiteSpace: 'nowrap',
};

const quickFilterButtonActiveStyle = {
  background: '#cbd5e1',
  color: '#0f172a',
};

const clearFiltersRowStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '24px',
};

const clearFiltersButtonStyle = {
  background: '#fef2f2',
  color: '#ef4444',
  border: '1px solid #fecaca',
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

export default AdvancedFilters;
