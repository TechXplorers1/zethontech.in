import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const ViewFileModal = (props) => {
  const {
    showViewFileModal,
    viewedApplication,
    modalCancelButtonStyle,
    modalHeaderStyle,
    modalBodyStyle,
    modalTitleStyle = { fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' },
    viewedFile = {},
    modalFooterStyle = {},
    modalViewDetailsGridStyle = {},
    modalViewDetailItemStyle = {},
    setShowViewApplicationModal = () => {},
    setShowViewFileModal = () => {}
  } = props;

  return (
    <>
        <Modal show={showViewFileModal} onHide={() => setShowViewFileModal(false)} size="lg" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>File Viewer: {viewedFile.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={modalBodyStyle}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              minHeight: '300px',
              justifyContent: 'center'
            }}>
              {/* File preview content - simplified to just show file info */}
              <div style={{
                width: '100%',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px'
              }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                <p style={{ color: '#64748b' }}>File preview not available in demo</p>
                <button
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => alert(`Downloading ${viewedFile.name}... (Demo mode)`)}
                >
                  Download File (Demo)
                </button>
              </div>
            </div>

            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: '#f8fafc',
              borderRadius: '8px'
            }}>
              <p style={{ marginBottom: '10px' }}><strong>File Details:</strong></p>
              <div style={modalViewDetailsGridStyle}>
                <p style={modalViewDetailItemStyle}><strong>File Name:</strong> {viewedFile.name}</p>
                <p style={modalViewDetailItemStyle}><strong>File Type:</strong> {viewedFile.type}</p>
                <p style={modalViewDetailItemStyle}><strong>File Size:</strong> {viewedFile.size}</p>
                <p style={modalViewDetailItemStyle}><strong>Upload Date:</strong> {viewedFile.uploadDate}</p>
                {viewedFile.jobDesc && (
                  <p style={{ ...modalViewDetailItemStyle, gridColumn: '1 / -1' }}>
                    {/* <strong>Job Description:</strong> {viewedFile.jobDesc} */}
                  </p>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            <button
              onClick={() => {
                setShowViewFileModal(false);
                if (viewedApplication) {
                  setShowViewApplicationModal(true);
                }
              }}
              style={modalCancelButtonStyle}
            >
              Back to Application
            </button>
            <button
              onClick={() => setShowViewFileModal(false)}
              style={modalCancelButtonStyle}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
    </>
  );
};

export default ViewFileModal;
