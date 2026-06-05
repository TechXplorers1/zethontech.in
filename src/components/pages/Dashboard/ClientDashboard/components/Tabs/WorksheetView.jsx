import React from 'react';
import Applications from './Applications';
import Documents from './Documents';
import InterviewsScheduled from './InterviewsScheduled';

const WorksheetView = ({ setActiveTab, activeWorksheetTab, setActiveWorksheetTab,
  selectedDate, setSelectedDate, dateRange, currentStartDate, setCurrentStartDate,
  showPreviousWeek, showNextWeek, searchTerm, setSearchTerm,
  startDateFilter, setStartDateFilter, endDateFilter, setEndDateFilter,
  showDateRangeModal, setShowDateRangeModal, tempStartDate, setTempStartDate, tempEndDate, setTempEndDate,
  handleDateRangeChangeFromCalendar, handleApplyDateRange, handleClearDateRangeInModal, handleOpenDateRangeModal,
  showJobDescriptionModal, setShowJobDescriptionModal, currentJobDescription, setCurrentJobDescription,
  handleOpenJobDescriptionModal, handleCloseJobDescriptionModal,
  filterWebsites, setFilterWebsites, filterPositions, setFilterPositions, filterCompanies, setFilterCompanies,
  uniqueWebsites, uniquePositions, uniqueCompanies,
  showFilterModal, setShowFilterModal, tempSelectedWebsites, setTempSelectedWebsites, tempSelectedPositions, setTempSelectedPositions, tempSelectedCompanies, setTempSelectedCompanies,
  handleOpenFilterModal, handleCloseFilterModal, handleApplyCategoricalFilters, handleClearTempFiltersInModal,
  handleWebsiteCheckboxChange, handlePositionCheckboxChange, handleCompanyCheckboxChange,
  isGlobalFilterActive, clearAllFilters, getApplicationsSectionTitle, filteredApplicationsForDisplay,
  downloadApplicationsData, applicationsData, allApplicationsFlattened,
  activeSubTab, setActiveSubTab, clientData, // New prop to pass sub-tab state for Documents
  setIsInWorksheetView, onImageView, // New prop to allow WorksheetView to set its own visibility
  scheduledInterviews, handleAttachmentClick, closeAttachmentModal, currentAttachments, showAttachmentModal,
  employeeLeaves, totalPages,
  currentPage,
  handleNextPage,
  handlePreviousPage, handlePageChange,
}) => {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
    }}>
      {/* Back button for the entire worksheet view */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px'
      }}>
        <button
          onClick={() => setIsInWorksheetView(false)} // Go back to the main Dashboard view
          style={{
            background: '#ffffff',
            color: '#3b82f6',
            border: '1px solid #e2e8f0',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            transition: 'background-color 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '6px' }}>
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        {/* Removed the "Job Applications Worksheet" title here, it's now inside the Applications component */}
        <div style={{ width: '100px' }}></div> {/* Spacer */}
      </div>

      {/* Tabs for Applications and Documents within the Worksheet View */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: 'wrap', // Allow tabs to wrap on smaller screens
        }}
      >
        <button
          style={{
            padding: "10px 20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            backgroundColor: activeWorksheetTab === "Applications" ? "#007bff" : "#e9ecef",
            color: activeWorksheetTab === "Applications" ? "#fff" : "#333",
            borderColor: activeWorksheetTab === "Applications" ? "#007bff" : "#ccc",
          }}
          onClick={() => setActiveWorksheetTab("Applications")}
        >
          Applications
        </button>
        <button
          style={{
            padding: "10px 20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            backgroundColor: activeWorksheetTab === "Documents" ? "#007bff" : "#e9ecef",
            color: activeWorksheetTab === "Documents" ? "#fff" : "#333",
            borderColor: activeWorksheetTab === "Documents" ? "#007bff" : "#ccc",
          }}
          onClick={() => setActiveWorksheetTab("Documents")}
        >
          Documents
        </button>
        <button
          style={{
            padding: "10px 20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            backgroundColor: activeWorksheetTab === "Interviews Scheduled" ? "#007bff" : "#e9ecef",
            color: activeWorksheetTab === "Interviews Scheduled" ? "#fff" : "#333",
            borderColor: activeWorksheetTab === "Interviews Scheduled" ? "#007bff" : "#ccc",
          }}
          onClick={() => setActiveWorksheetTab("Interviews Scheduled")}
        >
          Interviews Scheduled
        </button>
      </div>

      {/* Conditional Rendering based on activeWorksheetTab */}
      {activeWorksheetTab === "Applications" && (
        <Applications
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          dateRange={dateRange}
          currentStartDate={currentStartDate}
          setCurrentStartDate={setCurrentStartDate}
          showPreviousWeek={showPreviousWeek}
          showNextWeek={showNextWeek}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          startDateFilter={startDateFilter}
          setStartDateFilter={setStartDateFilter}
          endDateFilter={endDateFilter}
          setEndDateFilter={setEndDateFilter}
          showDateRangeModal={showDateRangeModal}
          setShowDateRangeModal={setShowDateRangeModal}
          tempStartDate={tempStartDate}
          setTempStartDate={setTempStartDate}
          tempEndDate={tempEndDate}
          setTempEndDate={setTempEndDate}
          handleDateRangeChangeFromCalendar={handleDateRangeChangeFromCalendar}
          handleApplyDateRange={handleApplyDateRange}
          handleClearDateRangeInModal={handleClearDateRangeInModal}
          handleOpenDateRangeModal={handleOpenDateRangeModal}
          showJobDescriptionModal={showJobDescriptionModal}
          setShowJobDescriptionModal={setShowJobDescriptionModal}
          currentJobDescription={currentJobDescription}
          setCurrentJobDescription={setCurrentJobDescription}
          handleOpenJobDescriptionModal={handleOpenJobDescriptionModal}
          handleCloseJobDescriptionModal={handleCloseJobDescriptionModal}
          filterWebsites={filterWebsites}
          setFilterWebsites={setFilterWebsites}
          filterPositions={filterPositions}
          setFilterPositions={setFilterPositions}
          filterCompanies={filterCompanies}
          setFilterCompanies={setFilterCompanies}
          uniqueWebsites={uniqueWebsites}
          uniquePositions={uniquePositions}
          uniqueCompanies={uniqueCompanies}
          showFilterModal={showFilterModal}
          setShowFilterModal={setShowFilterModal}
          tempSelectedWebsites={tempSelectedWebsites}
          setTempSelectedWebsites={setTempSelectedWebsites}
          tempSelectedPositions={tempSelectedPositions}
          setTempSelectedPositions={setTempSelectedPositions}
          tempSelectedCompanies={tempSelectedCompanies}
          setTempSelectedCompanies={setTempSelectedCompanies}
          handleOpenFilterModal={() => setShowFilterModal(true)}
          handleCloseFilterModal={() => setShowFilterModal(false)}
          handleApplyCategoricalFilters={() => {
            setFilterWebsites(tempSelectedWebsites);
            setFilterPositions(tempSelectedPositions);
            setFilterCompanies(tempSelectedCompanies);
            setShowFilterModal(false);
          }}
          handleClearTempFiltersInModal={() => {
            setTempSelectedWebsites([]);
            setTempSelectedPositions([]);
            setTempSelectedCompanies([]);
          }}
          handleWebsiteCheckboxChange={handleWebsiteCheckboxChange}
          handlePositionCheckboxChange={handlePositionCheckboxChange}
          handleCompanyCheckboxChange={handleCompanyCheckboxChange}
          isGlobalFilterActive={isGlobalFilterActive}
          clearAllFilters={clearAllFilters}
          getApplicationsSectionTitle={getApplicationsSectionTitle}
          filteredApplicationsForDisplay={filteredApplicationsForDisplay}
          downloadApplicationsData={downloadApplicationsData}
          applicationsData={applicationsData}
          allApplicationsFlattened={allApplicationsFlattened}
          activeWorksheetTab={activeWorksheetTab} // Pass down
          setActiveWorksheetTab={setActiveWorksheetTab} // Pass down
          employeeLeaves={employeeLeaves}
          totalPages={totalPages}
          currentPage={currentPage}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
          onPageChange={handlePageChange}
        />
      )}

      {activeWorksheetTab === "Documents" && (
        <Documents
          activeSubTab={activeSubTab}
          handleSubTabChange={setActiveSubTab}
          clientFiles={clientData ? clientData.files : []}
          onImageView={onImageView}
        />
      )}

      {activeWorksheetTab === "Interviews Scheduled" && (
        <InterviewsScheduled
          interviews={scheduledInterviews}
          onAttachmentClick={handleAttachmentClick}
        />
      )}
    </div>
  );
};


// --- ClientDashboard Main Component ---

export default WorksheetView;
