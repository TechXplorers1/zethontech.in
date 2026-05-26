import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import AdvancedFilters, {
  APPLICATIONS_SORT_OPTIONS,
  FILES_SORT_OPTIONS,
  ACTIVITY_SORT_OPTIONS,
} from '../AdvancedFilters';

const ActiveClientsTab = (props) => {
  const {
    activeTab,
    searchTerm,
    sortOrder,
    statusFilter,
    filterDateRange,
    applicationsPage,
    activeClients,
    selectedClient,
    filteredActivities,
    allFilteredApplications,
    applicationsByDate,
    totalApplicationPages,
    APPLICATIONS_PAGE_SIZE,
    initialsCircleStyle,
    clientDetailIconStyle,
    applicationTableWrapperStyle,
    applicationTableStyle,
    applicationTableHeaderCellStyle,
    applicationTableDataCellStyle,
    actionButtonAppStyle,
    actionButtonSecondaryStyle,
    deleteButtonStyle,
    activityTimelineContainerStyle,
    activityItemStyle,
    activityIconContainerStyle,
    initialsCircleSmallStyle,
    activityContentStyle,
    activityDescriptionStyle,
    tabButtonStyle,
    tabButtonActiveStyle,
    activeSubTab,
    setActiveSubTab,
    handleOpenClientSelectModal,
    applicationsSectionStyle,
    sectionTitleStyle,
    subLabelStyle,
    clientSelectContainerStyle,
    filterLabelStyle,
    selectClientButtonStyle,
    tabsContainerStyle,
    overviewCardsContainerStyle,
    cardStyle,
    cardIconContainerStyle,
    cardLabelStyle,
    cardValueStyle,
    cardSubLabelStyle,
    clientsGridStyle,
    clientCardStyle,
    clientCardHeaderStyle,
    clientNameStyle,
    clientCodeStyle,
    statusBadgeStyle,
    priorityBadgeStyle,
    clientDetailStyle,
    clientCardFooterStyle,
    footerItemStyle,
    footerItemLabelStyle,
    footerItemValueStyle,
    footerItemIconStyle,
    viewButtonStyle,
    activityButtonStyle,
    clientDataGridStyle,
    clientDataSectionStyle,
    clientDataSectionTitleStyle,
    clientDataDetailStyle,
    clientApplicationsContainerStyle = {},
    clientApplicationsHeaderStyle = {},
    clientAppStatsStyle = {},
    addApplicationButtonStyle = {},
    applicationTableControlsStyle = {},
    searchInputStyle = {},
    statusFilterSelectStyle = {},
    downloadButtonStyle = {},
    filesGridStyle = {},
    fileCardStyle = {},
    fileCardHeaderStyle = {},
    fileIconStyle = {},
    fileNameStyle = {},
    fileSizeStyle = {},
    fileStatusStyle = {},
    fileUploadDateStyle = {},
    fileNotesStyle = {},
    fileActionsStyle = {},
    quickFilter = '',
    handleQuickFilterChange = () => {},
    areFiltersActive = () => false,
    handleClearFilters = () => {},
    simplifiedServices = [],
    deleteButtonAppStyle = {},
    activityDateStyle = {},
    handleDownloadResume,
    handleViewApplication,
    handleEditApplication,
    handleRequestDeleteFile = () => {},
    handleDeleteApplication,
    handleDateRangeChange = () => {},
    setSortOrder = () => {},
    setStatusFilter = () => {},
    handlePrevApplicationsPage = () => {},
    handleNextApplicationsPage = () => {},
    downloadApplicationsData = () => {},
    setShowViewApplicationModal = () => {},
    setViewedApplication = () => {},
    getLatestResumeUpdateDate = () => null,
    handleOpenAddApplicationModal = () => {},
    setSearchTerm = () => {},
    paginatedApplications = [],
    getFilteredAndSortedFiles = () => [],
    handleOpenUploadFileModal = () => {},
    fileTypeFilter = 'All File Types',
    setFileTypeFilter = () => {},
    getFileTypeBadgeStyle = () => ({}),
    handleViewFile = () => {},
    handleEditFile = () => {},
    formatToIST = () => '-',
    activityBadgeStyle = {},
    getActivityBadgeStyle = () => ({}),
    getActivityStatusStyle = () => ({}),
    activityStatusBadgeStyle = {}
  } = props;

  return (
    <>
      {activeTab === 'Active Clients' && (
        <div style={applicationsSectionStyle}>
          <h2 style={sectionTitleStyle}>Select Client</h2>
          <p style={subLabelStyle}>Choose a client to view their specific data across other tabs.</p>
          <div style={clientSelectContainerStyle}>
            <label style={filterLabelStyle}>Select Client:</label>
            <button onClick={handleOpenClientSelectModal} style={selectClientButtonStyle}>
              {selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName}` : 'Select a Client'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '8px' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
          {selectedClient && selectedClient.assignmentStatus === 'active' ? (
            <>
              <div style={{ marginTop: '20px', padding: '15px', background: '#e0effe', borderRadius: '8px', border: '1px solid #c4e0ff' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#3b82f6', margin: '0 0 10px 0' }}>
                  Currently viewing data for: {`${selectedClient.firstName} ${selectedClient.lastName}`}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0 }}>
                  Manager: {selectedClient.manager} | Job Location: {selectedClient.location} | Salary: {selectedClient.jobType}
                </p>
              </div>

              {/* Sub-tabs for selected client */}
              <div style={{ ...tabsContainerStyle, marginTop: '20px', justifyContent: 'flex-start' }}>
                {['Applications', 'Client data', 'Files', 'Activity'].map(subTab => (
                  <button
                    key={subTab}
                    style={{
                      ...tabButtonStyle,
                      ...(activeSubTab === subTab ? tabButtonActiveStyle : {})
                    }}
                    className={activeSubTab === subTab ? 'tab-button active' : 'tab-button'}
                    onClick={() => setActiveSubTab(subTab)}
                  >
                    {subTab}
                  </button>
                ))}
              </div>

              {/* Sub-tab content - conditionally rendered based on activeSubTab */}
              {activeSubTab === 'Overview' && (
                <>
                  {/* Overview Cards */}
                  <div style={{ ...overviewCardsContainerStyle, marginTop: '24px' }}>
                    <div style={cardStyle}>
                      <div style={cardIconContainerStyle}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#3b82f6' }}>
                          <path d="M17 21v-2a4 0 0 0-4-4H5a4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <p style={cardLabelStyle}>Assigned Clients</p>
                      <p style={cardValueStyle}>{activeClients.length}</p>
                      <p style={cardSubLabelStyle}>Active assignments</p>
                    </div>

                    <div style={cardStyle}>
                      <div style={cardIconContainerStyle}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10b981' }}>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                      <p style={cardLabelStyle}>Job Applications</p>
                      <p style={cardValueStyle}>
                        {(selectedClient.jobApplications || []).length}
                      </p>
                      <p style={cardSubLabelStyle}>Total submitted</p>
                    </div>

                    <div style={cardStyle}>
                      <div style={cardIconContainerStyle}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f97316' }}>
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </div>
                      <p style={cardLabelStyle}>Active Interviews</p>
                      <p style={cardValueStyle}>
                        {(selectedClient.jobApplications || []).filter(app => app.status === 'Interview').length}
                      </p>
                      <p style={cardSubLabelStyle}>In progress</p>
                    </div>

                    <div style={cardStyle}>
                      <div style={cardIconContainerStyle}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#8b5cf6' }}>
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                          <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                      </div>
                      <p style={cardLabelStyle}>Files Uploaded</p>
                      <p style={cardValueStyle}>
                        {(selectedClient.files || []).length}
                      </p>
                      <p style={cardSubLabelStyle}>Resumes & screenshots</p>
                    </div>
                  </div>

                  {/* My Assigned Clients Section (for the selected client) */}
                  <h2 style={sectionTitleStyle}>
                    Client Details
                  </h2>
                  <div style={clientsGridStyle}>
                    {/* Display only the selected client's card */}
                    {selectedClient && (
                      <div key={selectedClient.id} style={clientCardStyle} className="client-card-hover">
                        <div style={clientCardHeaderStyle}>
                          <div style={initialsCircleStyle}>{selectedClient.initials}</div>
                          <div style={{ flexGrow: 1 }}>
                            <p style={clientNameStyle}>{selectedClient.name} <span style={{ ...priorityBadgeStyle, backgroundColor: selectedClient.priority === 'high' ? '#fee2e2' : selectedClient.priority === 'medium' ? '#fef3c7' : '#e0f2fe', color: selectedClient.priority === 'high' ? '#dc2626' : selectedClient.priority === 'medium' ? '#d97706' : '#2563eb' }}>{selectedClient.priority}</span></p>
                            <p style={clientCodeStyle}>{selectedClient.role} - {selectedClient.location}</p>
                          </div>
                          <div style={{ ...statusBadgeStyle, backgroundColor: selectedClient.status === 'active' ? '#dcfce7' : '#fef2f2', color: selectedClient.status === 'active' ? '#16a34a' : '#ef4444' }}>
                            {selectedClient.status}
                          </div>
                          <div style={{ ...priorityBadgeStyle, backgroundColor: selectedClient.priority === 'high' ? '#fee2e2' : selectedClient.priority === 'medium' ? '#fef3c7' : '#e0f2fe', color: selectedClient.priority === 'high' ? '#dc2626' : selectedClient.priority === 'medium' ? '#d97706' : '#2563eb' }}>
                            {selectedClient.priority}
                          </div>
                        </div>
                        <p style={clientDetailStyle}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                          {selectedClient.role}
                        </p>
                        <p style={clientDetailStyle}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {selectedClient.location}
                        </p>
                        <p style={clientDetailStyle}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                          {selectedClient.jobType}
                        </p>
                        <p style={clientDetailStyle}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={clientDetailIconStyle}>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          Last activity: {selectedClient.lastActivity}
                        </p>

                        <div style={clientCardFooterStyle}>
                          <div style={footerItemStyle}>
                            <span style={footerItemLabelStyle}>Applications</span>
                            <span style={footerItemValueStyle}>{selectedClient.jobApplications.length}</span>
                            <button style={viewButtonStyle} className="view-button">View</button>
                          </div>
                          <div style={footerItemStyle}>
                            <span style={footerItemLabelStyle}>Files</span>
                            <span style={footerItemValueStyle}>{selectedClient.files.length}</span>
                            <button style={viewButtonStyle} className="view-button">View</button>
                          </div>
                          <div style={footerItemStyle}>
                            <span style={footerItemLabelStyle}>Resume</span>
                            {/* Conditionally render checkmark/cross based on resume availability */}
                            {(selectedClient.resumeUpdates || []).filter(u => u.type === 'Resume').length > 0 ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={footerItemIconStyle}>
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={footerItemIconStyle}>
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            )}
                            <button
                              onClick={() => handleDownloadResume(selectedClient.name)}
                              className="download-button"
                              disabled={(selectedClient.resumeUpdates || []).filter(u => u.type === 'Resume').length === 0}
                            >
                              Download
                            </button>
                            {getLatestResumeUpdateDate(selectedClient.resumeUpdates || []) && (
                              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', textAlign: 'center' }}>
                                Last updated: {getLatestResumeUpdateDate(selectedClient.resumeUpdates || [])}
                              </p>
                            )}
                          </div>
                          <div style={footerItemStyle}>
                            <span style={footerItemLabelStyle}>Activity</span>
                            <button style={activityButtonStyle} className="activity-button">Activity</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Applications Tab Content */}
              {activeSubTab === 'Applications' && (
                <div style={{ ...applicationsSectionStyle, marginTop: '24px' }}>
                  <AdvancedFilters
                    filterDateRange={filterDateRange}
                    sortOrder={sortOrder}
                    sortOptions={APPLICATIONS_SORT_OPTIONS}
                    quickFilter={quickFilter}
                    onDateRangeChange={handleDateRangeChange}
                    onSortOrderChange={(e) => setSortOrder(e.target.value)}
                    onQuickFilterChange={handleQuickFilterChange}
                    onClearFilters={handleClearFilters}
                    areFiltersActive={areFiltersActive}
                  />

                  <h2 style={sectionTitleStyle}>Client Job Applications</h2>
                  <p style={subLabelStyle}>Manage job applications for each assigned client</p>

                  <div key={selectedClient.id} style={clientApplicationsContainerStyle}>
                    <div style={clientApplicationsHeaderStyle}>
                      <div style={initialsCircleStyle}>{selectedClient.initials}</div>
                      <div style={{ flexGrow: 1 }}>
                        <p style={clientNameStyle}>
                          {selectedClient.name}
                          <span style={{
                            ...priorityBadgeStyle,
                            backgroundColor: selectedClient.priority === 'high' ? '#fee2e2' : selectedClient.priority === 'medium' ? '#fef3c7' : '#e0f2fe',
                            color: selectedClient.priority === 'high' ? '#dc2626' : selectedClient.priority === 'medium' ? '#d97706' : '#2563eb'
                          }}>
                            {selectedClient.priority}
                          </span>
                        </p>
                        <p style={clientCodeStyle}>{selectedClient.role || selectedClient.position} - {selectedClient.location}</p>
                      </div>
                      <div style={clientAppStatsStyle}>
                        <span>Total: <strong>{selectedClient?.jobApplications?.length ?? 0}</strong></span>
                        <span>Interviews: <strong>{selectedClient?.jobApplications?.filter(app => app.status === 'Interview').length ?? 0}</strong></span>
                        <span>Applied: <strong>{selectedClient?.jobApplications?.filter(app => app.status === 'Applied').length ?? 0}</strong></span>
                      </div>
                      <button
                        style={addApplicationButtonStyle}
                        onClick={() => handleOpenAddApplicationModal(selectedClient)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Application
                      </button>
                    </div>

                    {/* Search and Filter Controls */}
                    <div style={applicationTableControlsStyle}>
                      <input
                        type="text"
                        placeholder="Search applications..."
                        style={searchInputStyle}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={statusFilterSelectStyle}
                      >
                        <option value="All Statuses">All Statuses</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        {/* <option value="Rejected">Rejected</option> */}
                        <option value="Offered">Offered</option>
                      </select>
                      {/* NEW DOWNLOAD BUTTON - Placed below the status filter */}
                      <button onClick={downloadApplicationsData} style={downloadButtonStyle}>
                        {/* Download Icon */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download
                      </button>
                    </div>

                    {/* Date-wise Application Table */}
                    <div style={applicationTableWrapperStyle}>
                      {/* Get filtered and sorted applications, then group by date */}
                      {applicationsByDate.map(({ dateKey, applications }) => (
                        <div key={dateKey} style={{ marginBottom: '20px' }}>
                          <div style={{
                            background: '#f1f5f9',
                            color: '#475569',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            marginBottom: '10px',
                            fontWeight: '600'
                          }}>
                            {dateKey}
                            <span style={{ float: 'right' }}>
                              {applications.length} application(s)
                            </span>
                          </div>

                          <table style={applicationTableStyle}>
                            <thead>
                              <tr>
                                <th style={applicationTableHeaderCellStyle}>S.No</th>
                                <th style={applicationTableHeaderCellStyle}>Job Title</th>
                                <th style={applicationTableHeaderCellStyle}>Company</th>
                                <th style={applicationTableHeaderCellStyle}>Employment Type</th>
                                <th style={applicationTableHeaderCellStyle}>Job Boards</th>
                                <th style={applicationTableHeaderCellStyle}>Job ID</th>
                                <th style={applicationTableHeaderCellStyle}>Job Description Link</th>
                                <th style={applicationTableHeaderCellStyle}>Applied Date</th>
                                <th style={applicationTableHeaderCellStyle}>Attachments</th>
                                <th style={applicationTableHeaderCellStyle}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {allFilteredApplications.length === 0 ? (
                                <tr>
                                  <td
                                    colSpan="10"
                                    style={{
                                      textAlign: 'center',
                                      padding: '20px',
                                      color: '#64748b',
                                    }}
                                  >
                                    No applications found for this client.
                                  </td>
                                </tr>
                              ) : (
                                paginatedApplications.map((app, index) => {
                                  // Global S.No (descending across all pages)
                                  const globalIndex =
                                    allFilteredApplications.length -
                                    (applicationsPage * APPLICATIONS_PAGE_SIZE + index);

                                  return (
                                    <tr key={app.id}>
                                      <td style={applicationTableDataCellStyle}>
                                        {globalIndex}
                                      </td>
                                      <td style={applicationTableDataCellStyle}>
                                        {app.jobTitle}
                                      </td>
                                      <td style={applicationTableDataCellStyle}>
                                        {app.company}
                                      </td>
                                      <td style={applicationTableDataCellStyle}>
                                        {app.employment || '-'}
                                      </td>
                                      <td style={applicationTableDataCellStyle}>
                                        {app.jobBoards}
                                      </td>
                                      <td style={applicationTableDataCellStyle}>
                                        {app.jobId || '-'}
                                      </td>
                                      <td style={applicationTableDataCellStyle}>
                                        {app.jobDescriptionUrl && (
                                          <a
                                            href={app.jobDescriptionUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                              color: '#3b82f6',
                                              textDecoration: 'underline',
                                            }}
                                          >
                                            Description Link
                                          </a>
                                        )}
                                      </td>
                                      <td style={applicationTableDataCellStyle}>
                                        {app.appliedDate}
                                      </td>
                                      <td style={applicationTableDataCellStyle}>
                                        {app.attachments && app.attachments.length > 0 ? (
                                          <button
                                            onClick={() => {
                                              setViewedApplication(app);
                                              setShowViewApplicationModal(true);
                                            }}
                                            style={{
                                              background: 'none',
                                              border: 'none',
                                              color: '#3b82f6',
                                              textDecoration: 'underline',
                                              cursor: 'pointer',
                                            }}
                                          >
                                            View ({app.attachments.length})
                                          </button>
                                        ) : (
                                          'N/A'
                                        )}
                                      </td>
                                      <td style={applicationTableDataCellStyle}>
                                        <button
                                          onClick={() => handleViewApplication(app)}
                                          style={actionButtonAppStyle}
                                        >
                                          {/* existing view icon */}
                                          <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                          </svg>
                                        </button>
                                        <button
                                          onClick={() => handleEditApplication(app)}
                                          style={actionButtonSecondaryStyle}
                                        >
                                          {/* existing edit icon */}
                                          <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <path d="M12 20h9"></path>
                                            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                                          </svg>
                                        </button>
                                        <button
                                          onClick={() => handleDeleteApplication(app)}
                                          style={deleteButtonStyle}
                                        >
                                          {/* existing delete icon */}
                                          <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                          </svg>
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>

                          {/* Pagination controls for applications */}
                          {allFilteredApplications.length > APPLICATIONS_PAGE_SIZE && (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '12px',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '0.85rem',
                                  color: '#64748b',
                                }}
                              >
                                Showing{' '}
                                {applicationsPage * APPLICATIONS_PAGE_SIZE + 1}
                                {' - '}
                                {Math.min(
                                  (applicationsPage + 1) * APPLICATIONS_PAGE_SIZE,
                                  allFilteredApplications.length
                                )}{' '}
                                of {allFilteredApplications.length} applications
                              </span>

                              <div
                                style={{
                                  display: 'flex',
                                  gap: '8px',
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={handlePrevApplicationsPage}
                                  disabled={applicationsPage === 0}
                                  style={{
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    backgroundColor:
                                      applicationsPage === 0 ? '#e2e8f0' : '#ffffff',
                                    cursor:
                                      applicationsPage === 0
                                        ? 'not-allowed'
                                        : 'pointer',
                                    fontSize: '0.85rem',
                                  }}
                                >
                                  Prev
                                </button>
                                <button
                                  type="button"
                                  onClick={handleNextApplicationsPage}
                                  disabled={applicationsPage + 1 >= totalApplicationPages}
                                  style={{
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    backgroundColor:
                                      applicationsPage + 1 >= totalApplicationPages
                                        ? '#e2e8f0'
                                        : '#ffffff',
                                    cursor:
                                      applicationsPage + 1 >= totalApplicationPages
                                        ? 'not-allowed'
                                        : 'pointer',
                                    fontSize: '0.85rem',
                                  }}
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {selectedClient.jobApplications && selectedClient.jobApplications.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                          No applications found for this client.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Files Tab Content */}
              {activeSubTab === 'Files' && (
                <div style={{ ...applicationsSectionStyle, marginTop: '24px' }}> {/* Reusing applicationsSectionStyle for consistent padding/shadow */}
                  <AdvancedFilters
                    filterDateRange={filterDateRange}
                    sortOrder={sortOrder}
                    sortOptions={FILES_SORT_OPTIONS}
                    quickFilter={quickFilter}
                    onDateRangeChange={handleDateRangeChange}
                    onSortOrderChange={(e) => setSortOrder(e.target.value)}
                    onQuickFilterChange={handleQuickFilterChange}
                    onClearFilters={handleClearFilters}
                    areFiltersActive={areFiltersActive}
                  />

                  <h2 style={sectionTitleStyle}>Client File Management</h2>
                  <p style={subLabelStyle}>View, manage and download files for each assigned client</p>

                  <div key={selectedClient.id} style={clientApplicationsContainerStyle}> {/* Reusing for consistent styling */}
                    <div style={clientApplicationsHeaderStyle}>
                      <div style={initialsCircleStyle}>{selectedClient.initials}</div>
                      <div style={{ flexGrow: 1 }}>
                        <p style={clientNameStyle}>{selectedClient.name} <span style={{ ...priorityBadgeStyle, backgroundColor: selectedClient.priority === 'high' ? '#fee2e2' : selectedClient.priority === 'medium' ? '#fef3c7' : '#e0f2fe', color: selectedClient.priority === 'high' ? '#dc2626' : selectedClient.priority === 'medium' ? '#d97706' : '#2563eb' }}>{selectedClient.priority}</span></p>
                        <p style={clientCodeStyle}>{selectedClient.role} - {selectedClient.location}</p>
                      </div>
                      <div style={clientAppStatsStyle}> {/* Reusing for stats display */}
                        <span>Showing: <strong>{getFilteredAndSortedFiles(selectedClient.files).length}</strong></span>
                        <span>Total Files: <strong>{(selectedClient.files || []).length}</strong></span>
                        <span>Resumes: <strong>{(selectedClient.files || []).filter(file => file.type === 'resume').length}</strong></span>
                        <span>Screenshots: <strong>{(selectedClient.files || []).filter(file => file.type === 'interview screenshot').length}</strong></span>
                      </div>
                      <button
                        style={addApplicationButtonStyle} // Reusing for consistent button style
                        onClick={() => handleOpenUploadFileModal(selectedClient)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        Upload File
                      </button>
                    </div>

                    <div style={applicationTableControlsStyle}> {/* Reusing for search and filter */}
                      <input
                        type="text"
                        placeholder="Search files..."
                        style={searchInputStyle}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <select
                        value={fileTypeFilter}
                        onChange={(e) => setFileTypeFilter(e.target.value)}
                        style={statusFilterSelectStyle} // Reusing select style
                      >
                        <option value="All File Types">All File Types</option>
                        <option value="resume">Resume</option>
                        <option value="cover letter">Cover Letter</option>
                        {/* <option value="interview screenshot">Interview Screenshot</option> */}
                        <option value="portfolio">Portfolio</option>
                        <option value="offers">Offers</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div style={filesGridStyle}>
                      {getFilteredAndSortedFiles(selectedClient.files).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', gridColumn: '1 / -1' }}>
                          No files found for this client.
                        </div>
                      ) : (
                        getFilteredAndSortedFiles(selectedClient.files).map(file => (
                          <div key={file.id} style={fileCardStyle}>
                            <div style={fileCardHeaderStyle}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={fileIconStyle}>
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                <polyline points="13 2 13 9 20 9"></polyline>
                              </svg>
                              <div style={{ flexGrow: 1 }}>
                                <p style={fileNameStyle}>{file.name}</p>
                                <p style={fileSizeStyle}>{file.size}</p>
                              </div>
                              <span style={{ ...fileTypeBadgeStyle, ...getFileTypeBadgeStyle(file.type) }}>
                                {file.type}
                              </span>
                            </div>
                            <p style={fileStatusStyle}>
                              Status: <span style={{ fontWeight: '600', color: '#10b981' }}>{file.status}</span>
                            </p>
                            <p style={fileUploadDateStyle}>Uploaded: {file.uploadDate}</p>
                            {/* {file.jobDesc && (
                              <p style={fileNotesStyle}>Job Description: {file.jobDesc}</p>
                            )} */}
                            <div style={fileActionsStyle}>
                              <button onClick={() => handleViewFile(file)} style={actionButtonAppStyle}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                              </button>
                              <button onClick={() => handleEditFile(file)} style={actionButtonAppStyle}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 20h9"></path>
                                  <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                                </svg>
                              </button>
                              <button onClick={() => handleRequestDeleteFile(selectedClient, file)} style={deleteButtonAppStyle}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}


              {/* Activity Tab Content */}
              {activeSubTab === 'Activity' && (
                <div style={{ ...applicationsSectionStyle, marginTop: '24px' }}>
                  <AdvancedFilters
                    filterDateRange={filterDateRange}
                    sortOrder={sortOrder}
                    sortOptions={ACTIVITY_SORT_OPTIONS}
                    quickFilter={quickFilter}
                    onDateRangeChange={handleDateRangeChange}
                    onSortOrderChange={(e) => setSortOrder(e.target.value)}
                    onQuickFilterChange={handleQuickFilterChange}
                    onClearFilters={handleClearFilters}
                    areFiltersActive={areFiltersActive}
                  />

                  <h2 style={sectionTitleStyle}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle', color: '#3b82f6' }}>
                      <polygon points="13 10 3 14 10 21 21 3 13 10"></polygon>
                    </svg>
                    Recent Activity Timeline
                  </h2>
                  <div style={activityTimelineContainerStyle}>
                    {filteredActivities.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                        No activities found for this client.
                      </div>
                    ) : (
                      filteredActivities.map((activity, index) => (
                        <div key={index} style={activityItemStyle}>
                          <div style={activityIconContainerStyle}>
                            <div style={initialsCircleSmallStyle}>{activity.initials}</div>
                          </div>
                          <div style={activityContentStyle}>
                            <p style={activityDescriptionStyle}>
                              <span style={{ fontWeight: '600' }}>{activity.name}</span> - {activity.description}
                            </p>
                            <p style={activityDateStyle}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px', verticalAlign: 'middle', color: '#94a3b8' }}>
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                              {formatToIST(activity.timestamp)}
                            </p>
                          </div>
                          <div style={{ ...activityBadgeStyle, ...getActivityBadgeStyle(activity.type) }}>
                            {activity.type}
                          </div>
                          <div style={{ ...activityStatusBadgeStyle, ...getActivityStatusStyle(activity.status) }}>
                            {activity.status}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Notes Tab Content */}
              {activeSubTab === 'JobDesc' && (
                <div style={{ ...applicationsSectionStyle, marginTop: '24px', padding: '20px', textAlign: 'center', color: '#64748b' }}>
                  Notes content will go here for {selectedClient.name}.
                </div>
              )}

              {/* NEW: Client Data Tab Content */}
              {activeSubTab === 'Client data' && (
                <div style={{ ...applicationsSectionStyle, marginTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h2 style={sectionTitleStyle}>Full details of {selectedClient.name}</h2>
                      <p style={subLabelStyle}>Comprehensive information about the selected client.</p>
                    </div>
                    {/* Add Application Button for Client Data Tab */}
                    <button
                      style={addApplicationButtonStyle}
                      onClick={() => handleOpenAddApplicationModal(selectedClient)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add Application
                    </button>
                  </div>
                  {simplifiedServices.includes(selectedClient.service) ? (
                    // --- RENDER SIMPLIFIED VIEW for ServiceForm clients (View Only) ---
                    <div style={{ ...clientDataGridStyle, gridTemplateColumns: '1fr' }}>
                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Service Request Details</h3>
                        <p style={clientDataDetailStyle}><strong>First Name:</strong> {selectedClient.firstName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Last Name:</strong> {selectedClient.lastName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Mobile:</strong> {selectedClient.mobile || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Email:</strong> {selectedClient.email || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Service:</strong> {selectedClient.service || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Sub-Services:</strong> {(selectedClient.subServices || []).join(', ') || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>User Type:</strong> {selectedClient.userType || '-'}</p>
                      </div>
                    </div>
                  ) : (
                    <div style={clientDataGridStyle}>
                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Personal Information</h3>
                        <p style={clientDataDetailStyle}><strong>First Name:</strong> {selectedClient.firstName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Middle Name:</strong> {selectedClient.middleName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Last Name:</strong> {selectedClient.lastName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Date of Birth:</strong> {selectedClient.dob || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Gender:</strong> {selectedClient.gender || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Ethnicity:</strong> {selectedClient.ethnicity || '-'}</p>
                      </div>
                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Contact Information</h3>
                        <p style={clientDataDetailStyle}><strong>Address:</strong> {selectedClient.address || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>County:</strong> {selectedClient.county || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Zip Code:</strong> {selectedClient.zipCode || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Mobile:</strong> {selectedClient.mobile || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Email:</strong> {selectedClient.email || '-'}</p>
                      </div>
                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Employment Details</h3>
                        <p style={clientDataDetailStyle}><strong>Current Company:</strong> {selectedClient.currentCompany || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Current Designation:</strong> {selectedClient.currentDesignation || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Preferred Interview Time:</strong> {selectedClient.preferredInterviewTime || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Earliest Joining Date:</strong> {selectedClient.earliestJoiningDate || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Relieving Date:</strong> {selectedClient.relievingDate || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Years of Experience:</strong> {selectedClient.yearsOfExperience || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Notice Period:</strong> {selectedClient.noticePeriod || '-'}</p>
                      </div>
                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Job Preferences & Status</h3>
                        <p style={clientDataDetailStyle}><strong>Jobs to Apply:</strong> {selectedClient.jobsToApply || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Work Preference:</strong> {selectedClient.workPreference || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Willing to Relocate:</strong> {selectedClient.willingToRelocate || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Current Salary:</strong> {selectedClient.currentSalary || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Expected Salary:</strong> {selectedClient.expectedSalary || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Visa Status:</strong> {selectedClient.visaStatus || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Security Clearance:</strong> {selectedClient.securityClearance || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Clearance Level:</strong> {selectedClient.clearanceLevel || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Restricted Companies:</strong> {selectedClient.restrictedCompanies || '-'}</p>
                      </div>
                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Education Details</h3>
                        {(selectedClient.educationDetails || []).length > 0 ? (
                          (selectedClient.educationDetails || []).map((edu, index) => (
                            <div key={index} style={{ marginBottom: '15px', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '10px' }}>Entry {index + 1}</h4>
                              <p style={clientDataDetailStyle}><strong>University Name:</strong> {edu.universityName || '-'}</p>
                              <p style={clientDataDetailStyle}><strong>University Address:</strong> {edu.universityAddress || '-'}</p>
                              <p style={clientDataDetailStyle}><strong>Course of Study:</strong> {edu.courseOfStudy || '-'}</p>
                              <p style={clientDataDetailStyle}><strong>Graduation From Date:</strong> {edu.graduationFromDate || '-'}</p>
                              <p style={clientDataDetailStyle}><strong>Graduation To Date:</strong> {edu.graduationToDate || '-'}</p>
                            </div>
                          ))
                        ) : (
                          <p style={clientDataDetailStyle}>No education details provided.</p>
                        )}
                      </div>
                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>References</h3>
                        <p style={clientDataDetailStyle}><strong>Reference Name:</strong> {selectedClient.referenceName || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Reference Phone:</strong> {selectedClient.referencePhone || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Reference Address:</strong> {selectedClient.referenceAddress || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Reference Email:</strong> {selectedClient.referenceEmail || '-'}</p>
                        <p style={clientDataDetailStyle}><strong>Reference Role:</strong> {selectedClient.referenceRole || '-'}</p>
                      </div>
                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Job Portal Accounts</h3>
                        <p style={clientDataDetailStyle}><strong>Account Info:</strong> {selectedClient.jobPortalAccountNameandCredentials || '-'}</p>
                      </div>
                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Resume(s)</h3>
                        <p style={clientDataDetailStyle}>
                          <strong>Resume(s):</strong>
                          {(selectedClient.resumes || []).length > 0 ? (
                            (selectedClient.resumes || []).map((resume, index) => (
                              <a key={index} href={resume.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '8px', color: '#3b82f6', textDecoration: 'underline' }}>
                                {resume.name || `Resume ${index + 1}`}
                              </a>
                            ))
                          ) : (
                            <span style={{ marginLeft: '8px', color: '#64748b' }}>No resumes on file.</span>
                          )}
                        </p>
                      </div>
                      <div style={clientDataSectionStyle}>
                        <h3 style={clientDataSectionTitleStyle}>Cover Letter</h3>
                        <p style={clientDataDetailStyle}>
                          <strong>Cover Letter:</strong>
                          {selectedClient.coverLetterUrl ? (
                            <a href={selectedClient.coverLetterUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '8px', color: '#3b82f6', textDecoration: 'underline' }}>
                              {selectedClient.coverLetterFileName || 'Download Cover Letter'}
                            </a>
                          ) : (
                            <span style={{ marginLeft: '8px', color: '#64748b' }}>No cover letter on file.</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
              Please select a client from the dropdown to view their specific data.
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ActiveClientsTab;
