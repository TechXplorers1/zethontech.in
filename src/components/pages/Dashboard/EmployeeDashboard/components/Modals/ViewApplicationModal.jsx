import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const ViewApplicationModal = (props) => {
  const {
    showViewApplicationModal,
    modalCancelButtonStyle,
    modalViewDetailsGridStyle,
    modalViewDetailItemStyle,
    modalHeaderStyle,
    modalBodyStyle,
    modalTitleStyle = { fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' },
    viewedApplication = {},
    applicationStatusBadgeStyle = {},
    getApplicationStatusStyle = () => ({}),
    setImageUrlToView = () => {},
    setShowImageViewer = () => {},
    formatDateTime = () => ({ date: '-', time: '-' }),
    modalFooterStyle = {},
    setShowViewApplicationModal
  } = props;

  return (
    <>
        <Modal show={showViewApplicationModal} onHide={() => setShowViewApplicationModal(false)} size="lg" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>Job Application Details</Modal.Title>
          </Modal.Header>
          <Modal.Body style={modalBodyStyle}>
            <div style={modalViewDetailsGridStyle}>
              <p style={modalViewDetailItemStyle}><strong>Job Title:</strong> {viewedApplication.jobTitle}</p>
              <p style={modalViewDetailItemStyle}><strong>Company:</strong> {viewedApplication.company}</p>
              <p style={modalViewDetailItemStyle}><strong>Employment Type:</strong> {viewedApplication.employment || '-'}</p>
              <p style={modalViewDetailItemStyle}><strong>Job Boards:</strong> {viewedApplication.jobBoards}</p>
              <p style={modalViewDetailItemStyle}><strong>Job ID:</strong> {viewedApplication.jobId || '-'}</p> {/* Display Job ID */}
              <p style={modalViewDetailItemStyle}><strong>Job Description URL:</strong> <a href={viewedApplication.jobDescriptionUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>{viewedApplication.jobDescriptionUrl}</a></p>
              <p style={modalViewDetailItemStyle}><strong>Job Type:</strong> {viewedApplication.jobType || '-'}</p>
              <p style={modalViewDetailItemStyle}><strong>Job Location:</strong> {viewedApplication.location || '-'}</p>
              <p style={modalViewDetailItemStyle}><strong>Status:</strong> <span style={{ ...applicationStatusBadgeStyle, ...getApplicationStatusStyle(viewedApplication.status) }}>{viewedApplication.status}</span></p>
              {viewedApplication.status === 'Interview' && (
                <>
                  <p style={modalViewDetailItemStyle}><strong>Round:</strong> {viewedApplication.round || '-'}</p>
                  <p style={modalViewDetailItemStyle}><strong>Interview Date:</strong> {viewedApplication.interviewDate || '-'}</p>
                  <p style={modalViewDetailItemStyle}><strong>Interview Time:</strong> {viewedApplication.interviewTime || '-'}</p>
                  <p style={modalViewDetailItemStyle}><strong>Recruiter Mail ID:</strong> {viewedApplication.recruiterMail || '-'}</p>
                </>
              )}
              <div style={{ ...modalViewDetailItemStyle, gridColumn: '1 / -1' }}>
                <strong>Attachments:</strong>
                {viewedApplication.attachments && viewedApplication.attachments.length > 0 ? (
                  <div style={{ marginTop: '10px' }}>
                    {viewedApplication.attachments.map((file, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px',
                        background: '#f8fafc',
                        borderRadius: '6px',
                        marginBottom: '8px'
                      }}>
                        {/* ... file icon and info ... */}
                        <div style={{ flexGrow: 1 }}>{file.name}</div>
                        <button
                          onClick={() => {
                            // Open the image viewer with the download URL
                            setImageUrlToView(file.downloadUrl);
                            setShowImageViewer(true);
                          }}
                          style={{
                            background: '#3b82f6', color: 'white', border: 'none',
                            padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'
                          }}
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                ) : 'N/A'}
              </div>
              <p style={modalViewDetailItemStyle}><strong>Applied Date:</strong> {formatDateTime(viewedApplication.timestamp).date}</p>
              <p style={modalViewDetailItemStyle}><strong>Applied Time:</strong> {formatDateTime(viewedApplication.timestamp).time}</p>
              {/* <p style={{ ...modalViewDetailItemStyle, gridColumn: '1 / -1' }}><strong>Job Description:</strong> {viewedApplication.jobDesc || '-'}</p> */}
            </div>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            <button
              onClick={() => setShowViewApplicationModal(false)}
              style={modalCancelButtonStyle}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
    </>
  );
};

export default ViewApplicationModal;
