import React from 'react';
import FilterComponent from './FilterComponent';

const InterviewsTab = ({
  filteredInterviewData,
  interviewFilterDateRange,
  setInterviewFilterDateRange,
  sortOrder,
  setSortOrder,
  quickFilter,
  handleQuickFilterChange,
  areInterviewsFiltersActive,
  handleClearInterviewsFilters,
  interviewSearchQuery,
  handleInterviewSearchChange,
  interviewFilterRound,
  handleInterviewFilterRoundChange,
  paginatedInterviewData,
  allEmployees,
  getInitials,
  handleAttachmentClick,
  formatDateToDDMMYYYY,
  INTERVIEWS_PAGE_SIZE,
  interviewsPage,
  handlePrevInterviewsPage,
  handleNextInterviewsPage,
  totalInterviewPages
}) => {
  return (
    <section className="interviews-section client-assignment-overview">
      <div className="client-assignment-header interviews-header">
        <h2 className="client-assignment-title">Interview Management</h2>
        <span className="total-interviews-badge">{filteredInterviewData.length} total interviews</span>
      </div>

      <FilterComponent
        filterDateRange={interviewFilterDateRange}
        handleDateRangeChange={(e) => setInterviewFilterDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }))}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        quickFilter={quickFilter}
        handleQuickFilterChange={handleQuickFilterChange}
        areFiltersActive={areInterviewsFiltersActive}
        handleClearFilters={handleClearInterviewsFilters}
        sortOptions={['Newest First', 'Oldest First']}
      />

      <div className="applications-filters">
        <div className="search-input-wrapper">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search interviews..."
            value={interviewSearchQuery}
            onChange={handleInterviewSearchChange}
          />
        </div>
        <div className="filter-dropdown">
          <select
            value={interviewFilterRound}
            onChange={handleInterviewFilterRoundChange}
          >
            <option value="All Rounds">All Rounds</option>
            <option value="1st Round">Round 1</option>
            <option value="2st Round">Round 2</option>
            <option value="3rd Round">Round 3</option>
          </select>
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>

      <div className="table-responsive">
        <table className="interview-table">
          <thead><tr>
            <th>EMPLOYEE</th>
            <th>CLIENT</th>
            <th>JOB TITLE</th>
            <th>COMPANY</th>
            <th>ROUND</th>
            <th>ATTACHMENTS</th>
            <th>TIME</th>
            <th>DATE</th>
            <th>STATUS</th>
          </tr></thead>
          <tbody>
            {paginatedInterviewData.map((interview) => {
              const assignedEmployee = allEmployees.find(
                (emp) => emp.firebaseKey === interview.assignedTo
              );

              const employeeName = assignedEmployee
                ? `${assignedEmployee.firstName} ${assignedEmployee.lastName}`
                : 'N/A';
              const employeeInitials = assignedEmployee
                ? getInitials(employeeName)
                : '??';

              return (
                <tr key={interview.id}>
                  <td className="employee-cell">
                    <div className="employee-avatar">{employeeInitials}</div>
                    {employeeName}
                  </td>
                  <td>{interview.clientName}</td>
                  <td>{interview.jobTitle}</td>
                  <td>{interview.company}</td>
                  <td>
                    <span className="round-badge">{interview.round}</span>
                  </td>
                  <td className="action-buttons">
                    {interview.attachments && interview.attachments.length > 0 ? (
                      <button
                        onClick={() => handleAttachmentClick(interview.attachments)}
                        className="action-button"
                        title="View Attachments"
                      >
                        <i className="fas fa-paperclip"></i> ({interview.attachments.length})
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-color)', opacity: 0.6 }}>N/A</span>
                    )}
                  </td>
                  <td className="date-cell">
                    {formatDateToDDMMYYYY(interview.interviewTime)}
                  </td>
                  <td className="date-cell">
                    {formatDateToDDMMYYYY(interview.interviewDate)}
                  </td>
                  <td>
                    {interview.status}
                  </td>
                </tr>
              );
            })}

            {filteredInterviewData.length === 0 && (
              <tr>
                <td
                  colSpan="9"
                  style={{ textAlign: 'center', color: 'var(--text-color)' }}
                >
                  No interviews to display matching your criteria.
                </td>
              </tr>
            )}
          </tbody>

        </table>
        {filteredInterviewData.length > INTERVIEWS_PAGE_SIZE && (
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
              {interviewsPage * INTERVIEWS_PAGE_SIZE + 1}
              {' - '}
              {Math.min(
                (interviewsPage + 1) * INTERVIEWS_PAGE_SIZE,
                filteredInterviewData.length
              )}{' '}
              of {filteredInterviewData.length} interviews
            </span>

            <div
              style={{
                display: 'flex',
                gap: '8px',
              }}
            >
              <button
                type="button"
                onClick={handlePrevInterviewsPage}
                disabled={interviewsPage === 0}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor:
                    interviewsPage === 0 ? '#e2e8f0' : '#ffffff',
                  cursor:
                    interviewsPage === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Prev
              </button>
              <button
                type="button"
                onClick={handleNextInterviewsPage}
                disabled={interviewsPage + 1 >= totalInterviewPages}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor:
                    interviewsPage + 1 >= totalInterviewPages
                      ? '#e2e8f0'
                      : '#ffffff',
                  cursor:
                    interviewsPage + 1 >= totalInterviewPages
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
    </section>
  );
};

export default InterviewsTab;
