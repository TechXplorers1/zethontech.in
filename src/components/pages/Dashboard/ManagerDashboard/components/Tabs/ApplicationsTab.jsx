import React from 'react';

const ApplicationsTab = ({
  applicationData = [],
  employees = [],
  uniqueClientNames = [],
  applicationFilterEmployee = '',
  handleApplicationFilterEmployeeChange = () => {},
  applicationFilterClient = '',
  handleApplicationFilterClientChange = () => {},
  clientStatusFilter = 'active',
  handleClientStatusFilterChange = () => {},
  handleDateRangeChange = () => {},
  sortOrder = 'Newest First',
  setSortOrder = () => {},
  areFiltersActive = () => false,
  handleClearFilters = () => {},
  dailyApplicationCount = 0,
  filteredApplicationCount = 0,
  selectedEmployeeDailyCount = 0,
  applicationFilterDateRange = { startDate: '', endDate: '' },
  downloadApplicationsData = () => {},
  applicationSearchQuery = '',
  setApplicationSearchQuery = () => {}
}) => {
  const showClear = typeof areFiltersActive === 'function' ? areFiltersActive() : areFiltersActive;

  const employeeOptions = employees.map((employee) => ({
    value: employee.firebaseKey || `${employee.firstName || ''}-${employee.lastName || ''}`,
    label: employee.fullName || `${employee.firstName || ''} ${employee.lastName || ''}`.trim()
  }));

  return (
    <section className="applications-management-section">
      <div className="applications-header">
        <div>
          <h2 className="client-assignment-title">Client Applications</h2>
          <p className="applications-summary-text">
            Showing {applicationData.length} application{applicationData.length === 1 ? '' : 's'}.
          </p>
        </div>
        <div className="applications-actions-row">
          <button className="assign-client-button" onClick={downloadApplicationsData} disabled={!applicationData.length}>
            <i className="fas fa-download" /> Download {applicationData.length} Entries
          </button>
          {showClear && (
            <button className="clear-filters-button-style" onClick={handleClearFilters}>
              <i className="fas fa-times-circle" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="applications-filters" style={{ gap: '12px', flexWrap: 'wrap' }}>
        <div className="search-input-wrapper" style={{ flex: '1 1 240px' }}>
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder="Search by Employee, Client, Job Title..."
            value={applicationSearchQuery}
            onChange={(e) => setApplicationSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-dropdown">
          <select value={applicationFilterEmployee} onChange={handleApplicationFilterEmployeeChange}>
            <option value="">Filter by Employee</option>
            {employeeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <i className="fas fa-chevron-down" />
        </div>

        <div className="filter-dropdown">
          <select value={applicationFilterClient} onChange={handleApplicationFilterClientChange}>
            <option value="">Filter by Client</option>
            {uniqueClientNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <i className="fas fa-chevron-down" />
        </div>

        <div className="filter-dropdown" style={{ minWidth: '160px' }}>
          <select value={clientStatusFilter} onChange={handleClientStatusFilterChange}>
            <option value="active">Active Clients</option>
            <option value="inactive">Inactive Clients</option>
          </select>
          <i className="fas fa-chevron-down" />
        </div>

        <div className="filter-dropdown" style={{ minWidth: '180px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem', color: 'var(--subtitle-color)' }}>Sort Order</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="Newest First">Newest First</option>
            <option value="Oldest First">Oldest First</option>
            <option value="Job Title A-Z">Job Title A-Z</option>
            <option value="Company A-Z">Company A-Z</option>
          </select>
          <i className="fas fa-chevron-down" />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: '1 1 200px' }}>
          <label style={{ whiteSpace: 'nowrap', color: 'var(--subtitle-color)', fontSize: '0.85rem' }}>Date Range</label>
          <input
            type="date"
            name="startDate"
            value={applicationFilterDateRange.startDate}
            onChange={handleDateRangeChange}
            className="form-input"
          />
          <span style={{ color: 'var(--subtitle-color)' }}>to</span>
          <input
            type="date"
            name="endDate"
            value={applicationFilterDateRange.endDate}
            onChange={handleDateRangeChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="application-counts-display" style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {!applicationFilterEmployee && (
          <span className="count-badge">Today's Applications: <strong>{dailyApplicationCount}</strong></span>
        )}
        {applicationFilterEmployee && (
          <span className="count-badge">Applications for this employee (Today): <strong>{selectedEmployeeDailyCount}</strong></span>
        )}
        {(applicationFilterDateRange.startDate || applicationFilterDateRange.endDate) && (
          <span className="count-badge">Applications for selected dates: <strong>{filteredApplicationCount}</strong></span>
        )}
      </div>

      <div className="table-responsive" style={{ marginTop: '20px' }}>
        {applicationData.length === 0 ? (
          <p style={{ padding: '1rem', color: 'var(--text-color)', textAlign: 'center' }}>No applications found for the current filters.</p>
        ) : (
          <table className="applications-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Client</th>
                <th>Applied Date</th>
                <th>Company</th>
                <th>Job Title</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applicationData.map((app) => (
                <tr key={app.id || `${app.clientName}-${app.jobId}-${app.appliedDate}`}>
                  <td>{app.assignedToName || app.assignedTo || 'Unassigned'}</td>
                  <td>{app.clientName || 'N/A'}</td>
                  <td>{app.appliedDate || 'N/A'}</td>
                  <td>{app.company || 'N/A'}</td>
                  <td>{app.jobTitle || 'N/A'}</td>
                  <td>{app.status || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default ApplicationsTab;
