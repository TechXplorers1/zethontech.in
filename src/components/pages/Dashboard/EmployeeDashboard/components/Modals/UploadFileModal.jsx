import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const UploadFileModal = (props) => {
  const {
    activeClients,
    inactiveClients,
    selectedClient,
    showUploadFileModal,
    selectedClientForFile = {},
    modalFormGridStyle,
    modalFormFieldGroupStyle,
    modalLabelStyle,
    modalSelectStyle,
    modalCancelButtonStyle,
    modalAddButtonPrimaryStyle,
    modalHeaderStyle,
    modalBodyStyle,
    modalTitleStyle = { fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' },
    newFileFormData = {},
    handleNewFileFormChange = () => {},
    newFilesToUpload = [],
    setNewFilesToUpload = () => {},
    fileInputRef = { current: null },
    modalTextareaStyle = {},
    modalFooterStyle = {},
    handleSaveNewFile = () => {},
    isUploading = false,
    setShowUploadFileModal,
    setSelectedClient
  } = props;

  return (
    <>
        <Modal show={showUploadFileModal} onHide={() => setShowUploadFileModal(false)} size="lg" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>Upload File</Modal.Title>
          </Modal.Header>
   // In EmployeeData.jsx, find the `showUploadFileModal` block and replace its Modal.Body with this:
          <Modal.Body style={modalBodyStyle}>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '20px' }}>Upload resume, interview screenshot, or other documents for your clients. Files will be automatically sent to clients.</p>
            <div style={modalFormGridStyle}>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>Client <span style={{ color: 'red' }}>*</span></label>
                <select
                  name="clientId"
                  value={selectedClientForFile.registrationKey}
                  onChange={(e) => {
                    const selected = [...activeClients, ...inactiveClients].find(
                      (c) => c.registrationKey === e.target.value
                    );
                    setSelectedClientForFile(selected);
                  }}
                  style={modalSelectStyle}
                  required
                  disabled
                >
                  {[...activeClients, ...inactiveClients].map(client => (
                    <option key={client.registrationKey} value={client.registrationKey}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div style={modalFormFieldGroupStyle}>
                <label style={modalLabelStyle}>File Type <span style={{ color: 'red' }}>*</span></label>
                <select
                  name="fileType"
                  value={newFileFormData.fileType}
                  onChange={handleNewFileFormChange}
                  style={modalSelectStyle}
                  required
                >
                  <option value="">Select file type</option>
                  <option value="resume">Resume</option>
                  <option value="cover letter">Cover Letter</option>
                  {/* <option value="interview screenshot">Interview Screenshot</option> */}
                  <option value="portfolio">Portfolio</option>
                  <option value="offers">Offers</option>
                  <option value="other">Others</option>
                </select>
              </div>
              <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1' }}>
                <label style={modalLabelStyle}>File <span style={{ color: 'red' }}>*</span></label>

                {/* NEW: Attachment Preview */}
                {newFilesToUpload.length > 0 && (
                  <div className="attachments-preview-container">
                    {newFilesToUpload.map((file, index) => (
                      <div key={file.id} className="attachment-item">
                        {file.type === 'interview screenshot' ? (
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
                            setNewFilesToUpload(prev => prev.filter(f => f.id !== file.id));
                          }}
                          className="attachment-remove-btn"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* NEW: Custom file input for drag/drop and paste */}
                <div className="custom-file-input-container">
                  <button
                    type="button"
                    className="add-attachment-btn"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    +
                  </button>
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const newFiles = Array.from(e.target.files).map(file => ({
                        id: Date.now() + Math.random(),
                        name: file.name,
                        size: `${(file.size / 1024).toFixed(1)} KB`,
                        type: newFileFormData.fileType || 'other',
                        uploadDate: new Date().toISOString().split('T')[0],
                        file: file,
                      }));
                      setNewFilesToUpload(prev => [...prev, ...newFiles]);
                    }}
                  />
                  <div className="file-input-facade">
                    <span className="file-input-placeholder">
                      Add file or paste a screenshot
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1' }}>
                <label style={modalLabelStyle}>Details</label>
                <textarea
                  name="notes"
                  value={newFileFormData.notes}
                  onChange={(e) => setNewFileFormData(prev => ({ ...prev, notes: e.target.value }))}
                  style={modalTextareaStyle}
                  placeholder="Any additional notes about this file..."
                ></textarea>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            <button
              onClick={() => setShowUploadFileModal(false)}
              style={modalCancelButtonStyle}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNewFile}
              style={modalAddButtonPrimaryStyle}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span style={{ marginLeft: '5px' }}>Uploading...</span>
                </>
              ) : (
                'Upload File'
              )}
            </button>
          </Modal.Footer>
        </Modal>
    </>
  );
};

export default UploadFileModal;
