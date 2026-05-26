import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const defaultModalTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#1e293b',
};

const defaultModalFooterStyle = {
  borderTop: 'none',
  paddingTop: '15px',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '15px',
};

const DeleteFileModal = (props) => {
  const {
    showDeleteFileModal,
    fileToDelete,
    modalCancelButtonStyle,
    modalAddButtonPrimaryStyle,
    modalHeaderStyle,
    modalBodyStyle,
    modalTitleStyle = defaultModalTitleStyle,
    modalFooterStyle = defaultModalFooterStyle,
    setShowDeleteFileModal,
    handleConfirmDeleteFile,
    isDeleting = false,
  } = props;

  return (
    <>
      <Modal show={showDeleteFileModal} onHide={() => setShowDeleteFileModal(false)} centered size="md">
        <Modal.Header closeButton style={modalHeaderStyle}>
          <Modal.Title style={modalTitleStyle}>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalBodyStyle}>
          <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#475569' }}>
            Are you sure you want to permanently delete this file?
          </p>
          {fileToDelete && (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 15px', textAlign: 'center', color: '#1e293b', wordBreak: 'break-all' }}>
              <strong>{fileToDelete.file.name}</strong>
            </div>
          )}
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#ef4444', marginTop: '15px' }}>
            This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer style={modalFooterStyle}>
          <button
            onClick={() => setShowDeleteFileModal(false)}
            style={modalCancelButtonStyle}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDeleteFile}
            style={{ ...modalAddButtonPrimaryStyle, backgroundColor: '#ef4444' }}
            disabled={isDeleting} // Disable the button while loading
          >
            {isDeleting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span style={{ marginLeft: '5px' }}>Deleting...</span>
              </>
            ) : (
              'Confirm Delete'
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteFileModal;
