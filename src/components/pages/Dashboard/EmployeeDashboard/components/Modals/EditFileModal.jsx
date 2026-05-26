import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const EditFileModal = (props) => {
  const {
    showEditFileModal,
    modalFormGridStyle,
    modalFormFieldGroupStyle,
    modalLabelStyle,
    modalInputStyle,
    modalSelectStyle,
    modalCancelButtonStyle,
    modalAddButtonPrimaryStyle,
    modalHeaderStyle,
    modalBodyStyle,
    modalTitleStyle = { fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' },
    editedFileFormData = {},
    handleEditedFileFormChange = () => {},
    modalFooterStyle = {},
    handleSaveEditedFile = () => {},
    setShowEditFileModal
  } = props;

  return (
    <>
        <Modal show={showEditFileModal} onHide={() => setShowEditFileModal(false)} size="lg" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>Edit File Details</Modal.Title>
          </Modal.Header>
          <Modal.Body style={modalBodyStyle}>
            <div style={modalFormGridStyle}>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>File Name <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="name"
                  value={editedFileFormData.name}
                  onChange={handleEditedFileFormChange}
                  style={modalInputStyle}
                  required
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>File Type <span style={{ color: 'red' }}>*</span></label>
                <select
                  name="type"
                  value={editedFileFormData.type}
                  onChange={handleEditedFileFormChange}
                  style={modalSelectStyle}
                  required
                >
                  <option value="resume">Resume</option>
                  <option value="cover letter">Cover Letter</option>
                  {/* <option value="interview screenshot">Interview Screenshot</option> */}
                  <option value="portfolio">Portfolio</option>
                  <option value="offers">Offers</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>File Size</label>
                <input
                  type="text"
                  name="size"
                  value={editedFileFormData.size}
                  onChange={handleEditedFileFormChange}
                  style={modalInputStyle}
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Status</label>
                <input
                  type="text"
                  name="status"
                  value={editedFileFormData.status}
                  onChange={handleEditedFileFormChange}
                  style={modalInputStyle}
                  disabled // Status is usually derived or set internally
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Upload Date</label>
                <input
                  type="date"
                  name="uploadDate"
                  value={editedFileFormData.uploadDate}
                  onChange={handleEditedFileFormChange}
                  style={modalInputStyle}
                />
              </div>
              {/* <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1' }}>
                <label style={modalLabelStyle}>Job Description</label>
                <textarea
                  name="jobDesc"
                  value={editedFileFormData.jobDesc}
                  onChange={handleEditedFileFormChange}
                  style={modalTextareaStyle}
                ></textarea>
              </div> */}
            </div>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            <button
              onClick={() => setShowEditFileModal(false)}
              style={modalCancelButtonStyle}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEditedFile}
              style={modalAddButtonPrimaryStyle}
            >
              Save Changes
            </button>
          </Modal.Footer>
        </Modal>
    </>
  );
};

export default EditFileModal;
