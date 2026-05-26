import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const EditApplicationModal = (props) => {
  const {
    showEditApplicationModal,
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
    editedApplicationFormData = { attachments: [] },
    handleEditedApplicationFormChange = () => {},
    fileInputRef = { current: null },
    setEditedApplicationFormData = () => {},
    modalTextareaStyle = {},
    modalFooterStyle = {},
    isSavingChanges = false,
    handleSaveEditedApplication = () => {},
    setShowEditApplicationModal
  } = props;

  return (
    <>
        <Modal show={showEditApplicationModal} onHide={() => setShowEditApplicationModal(false)} size="lg" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>Edit Job Application</Modal.Title>
          </Modal.Header>
          <Modal.Body style={modalBodyStyle}>
            <div style={modalFormGridStyle}>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job Title <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="jobTitle"
                  value={editedApplicationFormData.jobTitle}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                  required
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Company <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="company"
                  value={editedApplicationFormData.company}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                  required
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job Boards<span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="jobBoards"
                  value={editedApplicationFormData.jobBoards}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job Description URL <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="url"
                  name="jobDescriptionUrl"
                  value={editedApplicationFormData.jobDescriptionUrl}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                  required
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job Type</label>
                <select
                  name="jobType"
                  value={editedApplicationFormData.jobType}
                  onChange={handleEditedApplicationFormChange}
                  style={modalSelectStyle}
                >
                  <option value="">Select Job Type</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job Location</label>
                <input
                  type="text"
                  name="location"
                  value={editedApplicationFormData.location}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Job ID</label> {/* Edit Job ID field */}
                <input
                  type="text"
                  name="jobId"
                  value={editedApplicationFormData.jobId}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                  placeholder="e.g., ABC-12345"
                />
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Status <span style={{ color: 'red' }}>*</span></label>
                <select
                  name="status"
                  value={editedApplicationFormData.status}
                  onChange={handleEditedApplicationFormChange}
                  style={modalSelectStyle}
                  required
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  {/* <option value="Rejected">Rejected</option> */}
                  <option value="Offered">Offered</option>
                </select>
              </div>

              {/* Conditionally render Round and Interview Date fields */}
              {editedApplicationFormData.status === 'Interview' && (
                <>
                  <div style={modalFormFieldGroupStyle}>
                    <label style={modalLabelStyle}>Round<span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      name="round"
                      value={editedApplicationFormData.round || ''}
                      onChange={handleEditedApplicationFormChange}
                      style={modalInputStyle}
                      placeholder="e.g., 1st Round, Technical"
                    />
                  </div>
                  <div style={modalFormFieldGroupStyle}>
                    <label style={modalLabelStyle}>Recruiter Mail ID<span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="email"
                      name="recruiterMail"
                      value={editedApplicationFormData.recruiterMail || ''}
                      onChange={handleEditedApplicationFormChange}
                      style={modalInputStyle}
                    />
                  </div>
                  <div style={modalFormFieldGroupStyle}>
                    <label style={modalLabelStyle}>Interview Date<span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="date"
                      name="interviewDate"
                      value={editedApplicationFormData.interviewDate || ''}
                      onChange={handleEditedApplicationFormChange}
                      style={modalInputStyle}
                    />
                  </div>
                  <div style={modalFormFieldGroupStyle}>
                    <label style={modalLabelStyle}>Interview Time</label>
                    <input
                      type="time"
                      name="interviewTime"
                      value={editedApplicationFormData.interviewTime || ''}
                      onChange={handleEditedApplicationFormChange}
                      style={modalInputStyle}
                    />
                  </div>

                </>
              )}

              {/* Add this new field for attachments */}
              <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1' }}>
                <label style={modalLabelStyle}>Attachments</label>

                {/* Preview area for pasted/selected files */}
                {editedApplicationFormData.attachments.length > 0 && (
                  <div className="attachments-preview-container">
                    {(editedApplicationFormData.attachments || []).map((file, index) => (
                      <div key={index} className="attachment-item">
                        {file.file && typeof file.file.type === 'string' && file.file.type.startsWith('image/') ? (
                          <img src={URL.createObjectURL(file.file)} alt={file.name} className="attachment-image-preview" />
                        ) : (
                          <div className="attachment-file-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                              <polyline points="13 2 13 9 20 9"></polyline>
                            </svg>
                          </div>
                        )}
                        <span className="attachment-name">{file.name}</span>
                        <button
                          onClick={() => {
                            const updatedAttachments = [...editedApplicationFormData.attachments];
                            updatedAttachments.splice(index, 1);
                            setEditedApplicationFormData(prev => ({ ...prev, attachments: updatedAttachments }));
                          }}
                          className="attachment-remove-btn"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className="custom-file-input-container"
                >
                  {/* This button is now the only way to trigger the file dialog */}
                  <button
                    type="button"
                    className="add-attachment-btn"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    +
                  </button>
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    style={{ display: 'none' }} // Hide the actual input
                    onChange={(e) => {
                      const newFiles = Array.from(e.target.files).map(file => ({
                        name: file.name,
                        size: `${(file.size / 1024).toFixed(1)} KB`,
                        // If it's an image, classify it; otherwise, it's a general attachment.
                        type: file.type.startsWith('image/') ? 'interview screenshot' : 'application attachment',
                        uploadDate: new Date().toLocaleString(),
                        file: file
                      }));
                      setEditedApplicationFormData(prev => ({
                        ...prev,
                        attachments: [...(prev.attachments || []), ...newFiles]
                      }));
                    }}
                  />
                  <div className="file-input-facade">
                    <span className="file-input-placeholder">
                      Add file or paste a screenshot
                    </span>
                  </div>
                </div>
              </div>


              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Applied Date <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="date"
                  name="appliedDate"
                  value={editedApplicationFormData.appliedDate}
                  onChange={handleEditedApplicationFormChange}
                  style={modalInputStyle}
                  disabled
                />
              </div>
              {/* <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1' }}>
                <label style={modalLabelStyle}>Job Description</label>
                <textarea
                  name="jobDesc"
                  value={editedApplicationFormData.jobDesc}
                  onChange={handleEditedApplicationFormChange}
                  style={modalTextareaStyle}
                ></textarea>
              </div> */}
            </div>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            <button
              onClick={() => setShowEditApplicationModal(false)}
              style={modalCancelButtonStyle}
              disabled={isSavingChanges} // Disable if saving
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEditedApplication}
              style={modalAddButtonPrimaryStyle}
              disabled={isSavingChanges} // Disable if saving
            >
              {isSavingChanges ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span style={{ marginLeft: '5px' }}>Saving...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </Modal.Footer>
        </Modal>
    </>
  );
};

export default EditApplicationModal;
