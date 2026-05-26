import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getDatabase, ref, update, remove, set, get, push } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import { database, storage } from '../../../../../../firebase';
import { Modal, Button, Form, Row, Col, Carousel } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import { formatDate } from '../../helpers';
import { modalClearButtonStyle } from '../../styles';

const DateRangeCalendar = ({ initialStartDate, initialEndDate, onSelectRange }) => {
  const [start, setStart] = useState(initialStartDate);
  const [end, setEnd] = useState(initialEndDate);

  useEffect(() => {
    onSelectRange(start, end);
  }, [start, end, onSelectRange]);

  const handleStartDateChange = (e) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    setStart(newDate);
  };

  const handleEndDateChange = (e) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    setEnd(newDate);
  };

  const formatToInputDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
      <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Select Date Range:</p>
      <Form.Group controlId="tempStartDate" className="mb-3">
        <Form.Label>From Date:</Form.Label>
        <Form.Control
          type="date"
          value={formatToInputDate(start)}
          onChange={handleStartDateChange}
        />
      </Form.Group>
      <Form.Group controlId="tempEndDate" className="mb-3">
        <Form.Label>To Date:</Form.Label>
        <Form.Control
          type="date"
          value={formatToInputDate(end)}
          onChange={handleEndDateChange}
        />
      </Form.Group>
    </div>
  );
};

// --- HELPER FUNCTIONS ---

// Format date as DD-MM-YYYY



// Generate 7-day date range for the ribbon
// FIX: Rewritten generateDateRange function to center the current date



const isDateOnLeave = (dateStr, leaves = []) => {
  const checkDate = new Date(dateStr.split("-").reverse().join("-"));
  return leaves.some(leave => {
    const start = new Date(leave.fromDate.split("-").reverse().join("-"));
    const end = new Date(leave.toDate.split("-").reverse().join("-"));
    return checkDate >= start && checkDate <= end;
  });
};

// --- SAMPLE APPLICATIONS DATA ---



// --- Applications Tab Content ---

const Applications = ({
  selectedDate, setSelectedDate, dateRange, currentStartDate, setCurrentStartDate,
  showPreviousWeek, showNextWeek, searchTerm, setSearchTerm,
  startDateFilter, setStartDateFilter, endDateFilter, setEndDateFilter,
  showDateRangeModal, setShowDateRangeModal, tempStartDate, setTempStartDate, tempEndDate, setTempEndDate,
  handleDateRangeChangeFromCalendar, handleApplyDateRange, handleClearDateRangeInModal,
  showJobDescriptionModal, setShowJobDescriptionModal, currentJobDescription, setCurrentJobDescription,
  handleOpenJobDescriptionModal, handleCloseJobDescriptionModal,
  filterWebsites, setFilterWebsites, filterPositions, setFilterPositions, filterCompanies, setFilterCompanies,
  uniqueWebsites, uniquePositions, uniqueCompanies,
  showFilterModal, setShowFilterModal, tempSelectedWebsites, setTempSelectedWebsites, tempSelectedPositions, setTempSelectedPositions, tempSelectedCompanies, setTempSelectedCompanies,
  handleOpenFilterModal, handleCloseFilterModal, handleApplyCategoricalFilters, handleClearTempFiltersInModal,
  handleWebsiteCheckboxChange, handlePositionCheckboxChange, handleCompanyCheckboxChange,
  isGlobalFilterActive, clearAllFilters, getApplicationsSectionTitle, filteredApplicationsForDisplay,
  downloadApplicationsData, applicationsData, allApplicationsFlattened,
  activeWorksheetTab, setActiveWorksheetTab, employeeLeaves, totalPages,
  currentPage,
  handleNextPage,
  handlePreviousPage, onPageChange, // New prop to control worksheet tabs // --- 1. RECEIVE THE FUNCTION AS A PROP ---
}) => {

  const renderPageButtons = () => {
    const buttons = [];
    const maxVisible = 5; // how many numbers to show in the middle
    let start = 1;
    let end = totalPages;

    if (totalPages > maxVisible) {
      const half = Math.floor(maxVisible / 2);
      start = Math.max(1, currentPage - half);
      end = start + maxVisible - 1;

      if (end > totalPages) {
        end = totalPages;
        start = end - maxVisible + 1;
      }
    }

    for (let page = start; page <= end; page++) {
      buttons.push(
        <Button
          key={page}
          variant={page === currentPage ? "primary" : "outline-secondary"}
          onClick={() => handlePageChange(page)}
          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
        >
          {page}
        </Button>
      );
    }

    // If there are more pages beyond the visible range, show "..."
    if (end < totalPages) {
      buttons.push(
        <span key="ellipsis" style={{ padding: '0 4px', color: '#666' }}>...</span>
      );
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "primary" : "outline-secondary"}
          onClick={() => handlePageChange(totalPages)}
          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
        >
          {totalPages}
        </Button>
      );
    }

    return buttons;
  };



  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
    }}>
      {/* Date navigation with arrows and horizontal scroll */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        background: '#fff',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <button
          onClick={showPreviousWeek}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px',
            fontSize: '16px',
            flexShrink: 0
          }}
        >
          ◀
        </button>

        <div style={{
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          padding: '10px 0',
          flexGrow: 1,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          textAlign: 'center',
        }}>
          <div style={{ display: 'inline-flex', gap: '8px' }}>
            {/* --- FIX 2: SYNTAX ERROR FIX & IMPLEMENTATION --- */}
            {dateRange.map((dateObj) => {
              // Logic is now inside the map callback, before the return
              const isLeaveDay = isDateOnLeave(dateObj.date, employeeLeaves || []);

              return (
                <div
                  key={dateObj.date}
                  onClick={() => setSelectedDate(dateObj.date)}
                  style={{
                    display: 'inline-block',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    // Apply red background/border/color if it's a leave day
                    backgroundColor: isLeaveDay ? '#f8d7da' : (selectedDate === dateObj.date ? '#007bff' : '#e9ecef'),
                    color: isLeaveDay ? '#721c24' : (selectedDate === dateObj.date ? 'white' : '#333'),
                    border: isLeaveDay ? '1px solid #f5c6cb' : 'none',
                    minWidth: '100px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedDate === dateObj.date ? '0 2px 5px rgba(0,123,255,0.3)' : 'none',
                    flexShrink: 0
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{dateObj.date}</div>
                  <div style={{
                    fontSize: '12px',
                    marginTop: '2px',
                    // Adjust text color for leave day
                    color: (isLeaveDay || selectedDate === dateObj.date) ? (isLeaveDay ? '#721c24' : 'rgba(255,255,255,0.8)') : '#666'
                  }}>
                    {dateObj.dayOfWeek}
                  </div>
                  {applicationsData[dateObj.date] && (
                    <div style={{
                      fontSize: '12px',
                      marginTop: '5px',
                      fontWeight: 'bold',
                      // --- FIX 3: ADDED MISSING COMMA ---
                      color: selectedDate === dateObj.date ? 'rgba(255,255,255,0.8)' : '#666',
                    }}>
                      {/* {applicationsData[dateObj.date].length} application(s) */}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={showNextWeek}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '10px',
            fontSize: '16px',
            flexShrink: 0
          }}
        >
          ▶
        </button>
      </div>

      {/* Applications section */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Centered Heading */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 auto', color: '#333' }}>
            {getApplicationsSectionTitle(filteredApplicationsForDisplay.length)}
          </h3>
        </div>

        {/* Download Button (Left), and Search Bar + Date Range (Right) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between', // Pushes left group and right group to ends
          alignItems: 'center',
          marginBottom: '15px',
          flexWrap: 'wrap', // Allows wrapping on smaller screens
          gap: '10px' // Gap between items when wrapped
        }}>
          {/* Left Group: Download button */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={downloadApplicationsData}
              disabled={!filteredApplicationsForDisplay.length}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: !filteredApplicationsForDisplay.length ? 0.5 : 1,
                transition: 'all 0.2s',
                flexShrink: 0 // Prevent shrinking
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download
            </button>

            {/* Clear All Filters Button (Always present with global filters) */}
            {isGlobalFilterActive && (
              <button
                onClick={clearAllFilters}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <i className="bi bi-x-circle"></i>
                Clear All Filters
              </button>
            )}
          </div>

          {/* Right Group: Search Bar + Date Range (Always open) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px', // Gap between search and date picker
            flexWrap: 'wrap', // Allow wrapping for responsiveness
            justifyContent: 'flex-end', // Aligns this entire group to the right
            flexGrow: 1, // Allows this group to take available space
          }}>
            {/* Search Bar (Always open at fixed size) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#ffffff',
                borderRadius: '25px',
                padding: '8px 18px',
                border: '1px solid #ccc',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                width: '250px', // Fixed width as requested
                transition: 'width 0.3s ease-in-out',
              }}
            >
              <input
                type="text"
                placeholder="Search data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  flexGrow: 1,
                  fontSize: '1rem',
                  padding: '0',
                  width: '100%', // Take full width of its container
                  color: '#333',
                  whiteSpace: 'nowrap',
                }}
              />
              {/* Removed FaSearch icon here as per request 1 */}
            </div>

            {/* Combined Date Range Picker Icon Trigger */}
            <div
              onClick={() => setShowDateRangeModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', // Center the icon
                background: '#ffffff',
                borderRadius: '6px',
                padding: '8px 12px',
                border: '1px solid #ccc',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                flexShrink: 0,
                width: '40px', // Fixed width for icon only
                height: '40px', // Fixed height for icon only
                cursor: 'pointer',
              }}
            >
              <FaCalendarAlt style={{
                fontSize: '1.1rem',
                color: (startDateFilter && endDateFilter) ? '#007bff' : '#666', // Dynamic color
                transition: 'color 0.2s', // Smooth color transition
              }} />
            </div>
          </div>
        </div>

        {filteredApplicationsForDisplay.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              minWidth: '700px',
              borderCollapse: 'collapse',
            }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'center' }}>S.No</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Applied Date</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Job Boards</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Job Title</th>
                  {/* <th style={{ padding: '12px', textAlign: 'center' }}>Job ID</th> */}
                  <th style={{ padding: '12px', textAlign: 'center' }}>Company</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Job Type</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>JD Link</th>
                  {/* <th style={{ padding: '12px', textAlign: 'center' }}>Job Description</th> */}
                </tr>
              </thead>
              <tbody>
                {filteredApplicationsForDisplay.map((app, index) => (
                  <tr
                    key={app.id}
                    style={{
                      borderBottom: '1px solid #eee',
                      backgroundColor: index % 2 === 0 ? '#fdfdfd' : '#f0f8ff' // Light alternating colors
                    }}
                  >
                    <td style={{ padding: '12px' }}>{(currentPage - 1) * 5 + index + 1}</td>
                    <td style={{ padding: '12px' }}>
                      {app.dateAdded} {/* Display Applied Date */}
                    </td>
                    <td style={{ padding: '12px' }}>{app.website}</td>
                    <td style={{ padding: '12px' }}>{app.position}</td>
                    {/* <td style={{ padding: '12px' }}>{app.jobId}</td> */}
                    <td style={{ padding: '12px' }}>{app.company}</td>
                    <td style={{ padding: '12px' }}>{app.jobType || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>
                      {/* FIX 4: Ensure the href attribute is using the correct, mapped property */}
                      {app.link ? (
                        <a
                          href={app.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#007bff', textDecoration: 'none' }}
                        >
                          Link
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    {/* <td style={{ padding: '12px' }}>
                      <Button
                        variant="link"
                        onClick={() => handleOpenJobDescriptionModal(app.jobDescription)}
                        style={{ padding: '0', border: 'none', color: '#007bff', textDecoration: 'underline' }}
                      >
                        View
                      </Button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // --- FIX 4: CONDITIONAL "NO APPLICATIONS" MESSAGE ---
          <p style={{ textAlign: 'center', color: '#666' }}>
            {isDateOnLeave(selectedDate, employeeLeaves)
              ? 'Employee might currently leave on this day.'
              : 'No applications found for this date with the current filters.'
            }
          </p>
        )}
        {/* --- START: PAGINATION CONTROLS (Moved here from previous step for visual confirmation) --- */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
            padding: '10px 20px',
            borderTop: '1px solid #eee',
            backgroundColor: '#fff',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 -2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>
              Page {currentPage} of {totalPages}
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Previous */}
              <Button
                variant="outline-primary"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  fontSize: '0.85rem',
                }}
              >
                Previous
              </Button>

              {/* Numbered page buttons */}
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                const isActive = page === currentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => {
                      if (!isActive && typeof onPageChange === 'function') {
                        onPageChange(page);      // ✅ safe call
                      }
                    }}
                    disabled={isActive}
                    style={{
                      minWidth: '32px',
                      padding: '6px 10px',
                      fontSize: '0.85rem',
                      borderRadius: '4px',
                      border: isActive ? '1px solid #007bff' : '1px solid #ddd',
                      backgroundColor: isActive ? '#007bff' : '#fff',
                      color: isActive ? '#fff' : '#333',
                      cursor: isActive ? 'default' : 'pointer',
                    }}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next */}
              <Button
                variant="outline-primary"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  fontSize: '0.85rem',
                }}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        {/* --- END: PAGINATION CONTROLS --- */}
      </div>

      {/* --- Date Range Picker Modal --- */}
      <Modal show={showDateRangeModal} onHide={() => setShowDateRangeModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Date Range</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DateRangeCalendar
            initialStartDate={tempStartDate}
            initialEndDate={tempEndDate}
            onSelectRange={handleDateRangeChangeFromCalendar}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClearDateRangeInModal} style={modalClearButtonStyle}>
            Clear
          </Button>
          <Button variant="primary" onClick={handleApplyDateRange}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- Job Description View Modal --- */}
      <Modal show={showJobDescriptionModal} onHide={handleCloseJobDescriptionModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Job Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ whiteSpace: 'pre-wrap' }}>{currentJobDescription}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseJobDescriptionModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- Consolidated Categorical Filter Modal (Still present, but not accessible from a button) --- */}
      {/* Keeping this modal and its related states/logic in case you wish to re-enable categorical filtering later */}
      <Modal show={showFilterModal} onHide={handleCloseFilterModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Apply Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              {/* Website Filter Column */}
              <Col md={4} style={{ borderRight: '1px solid #eee', paddingRight: '15px' }}>
                <h5 style={{ marginBottom: '15px' }}>Filter by Website</h5>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {uniqueWebsites.map(website => (
                    <Form.Check
                      key={website}
                      type="checkbox"
                      id={`modal-website-${website}`}
                      label={website}
                      value={website}
                      checked={tempSelectedWebsites.includes(website)}
                      onChange={handleWebsiteCheckboxChange}
                      style={{ marginBottom: '8px' }}
                    />
                  ))}
                </div>
              </Col>

              {/* Position Filter Column */}
              <Col md={4} style={{ borderRight: '1px solid #eee', paddingRight: '15px' }}>
                <h5 style={{ marginBottom: '15px' }}>Filter by Position</h5>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {uniquePositions.map(position => (
                    <Form.Check
                      key={position}
                      type="checkbox"
                      id={`modal-position-${position}`}
                      label={position}
                      value={position}
                      checked={tempSelectedPositions.includes(position)}
                      onChange={handlePositionCheckboxChange}
                      style={{ marginBottom: '8px' }}
                    />
                  ))}
                </div>
              </Col>

              {/* Company Filter Column */}
              <Col md={4}>
                <h5 style={{ marginBottom: '15px' }}>Filter by Company</h5>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {uniqueCompanies.map(company => (
                    <Form.Check
                      key={company}
                      type="checkbox"
                      id={`modal-company-${company}`}
                      label={company}
                      value={company}
                      checked={tempSelectedCompanies.includes(company)}
                      onChange={handleCompanyCheckboxChange}
                      style={{ marginBottom: '8px' }}
                    />
                  ))}
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClearTempFiltersInModal} style={modalClearButtonStyle}>
            <i className="bi bi-trash"></i> Clear Selections
          </Button>
          <Button variant="primary" onClick={handleApplyCategoricalFilters}>
            Apply Filters
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

// --- Documents Tab Content ---

export default Applications;
