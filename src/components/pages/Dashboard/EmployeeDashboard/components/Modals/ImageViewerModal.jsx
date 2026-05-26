import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const defaultModalTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#1e293b',
};

const ImageViewerModal = (props) => {
  const {
    showImageViewer,
    modalHeaderStyle,
    modalBodyStyle,
    modalTitleStyle = defaultModalTitleStyle,
    imageUrlToView,
    setShowImageViewer
  } = props;

  return (
    <>
      <Modal show={showImageViewer} onHide={() => setShowImageViewer(false)} size="lg" centered>
        <Modal.Header closeButton style={modalHeaderStyle}>
          <Modal.Title style={modalTitleStyle}>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ ...modalBodyStyle, textAlign: 'center', padding: '10px' }}>
          <img
            src={imageUrlToView}
            alt="Attachment Preview"
            style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: '8px' }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ImageViewerModal;
