import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const AddApplicationModal = (props) => {
  const {
    selectedClient,
    showAddApplicationModal,
    newApplicationFormData,
    newApplicationErrors,
    currentModalStep,
    isSubmittingApplication,
    modalFormGridStyle,
    modalFormFieldGroupStyle,
    modalLabelStyle,
    modalInputStyle,
    modalSelectStyle,
    errorTextStyle,
    modalCancelButtonStyle,
    modalAddButtonPrimaryStyle,
    modalHeaderStyle,
    modalBodyStyle,
    modalTitleStyle,
    modalFooterStyle,
    handleNewApplicationFormChange,
    validateApplicationConflicts,
    handleSaveNewApplication,
    handleNextStep,
    setShowAddApplicationModal,
    setCurrentModalStep
  } = props;

  return (
    <>
        <Modal show={showAddApplicationModal} onHide={() => setShowAddApplicationModal(false)} size="lg" centered>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title style={modalTitleStyle}>
              {currentModalStep === 1 ? 'Step 1 of 2: Essential Details' : 'Step 2 of 2: Links and Details'}
              {` for ${selectedClient.name}`}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={modalBodyStyle}>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '20px' }}>
              Apply for a job on behalf of {selectedClient.name}.
            </p>
            <div style={modalFormGridStyle}>
              {/* --- STEP 1 FIELDS (Only visible on step 1) --- */}
              {currentModalStep === 1 && (
                <>
                  <div style={modalFormFieldGroupStyle}>
                    <label style={modalLabelStyle}>Job Title <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={newApplicationFormData.jobTitle}
                      onChange={handleNewApplicationFormChange}
                      onBlur={() => validateApplicationConflicts('jobTitle', newApplicationFormData)}
                      style={{ ...modalInputStyle, borderColor: newApplicationErrors.jobTitle ? 'red' : '#cbd5e1' }}
                      placeholder="e.g., Senior Frontend Developer"
                      required
                    />
                    {newApplicationErrors.jobTitle && <p style={errorTextStyle}>{newApplicationErrors.jobTitle}</p>}
                  </div>

                  <div style={modalFormFieldGroupStyle}>
                    <label style={modalLabelStyle}>Company <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      name="company"
                      value={newApplicationFormData.company}
                      onChange={handleNewApplicationFormChange}
                      onBlur={() => validateApplicationConflicts('company', newApplicationFormData)}
                      style={{ ...modalInputStyle, borderColor: newApplicationErrors.company ? 'red' : '#cbd5e1' }}
                      placeholder="e.g., TechCorp"
                      required
                    />
                    {newApplicationErrors.company && <p style={errorTextStyle}>{newApplicationErrors.company}</p>}
                  </div>

                  <div style={modalFormFieldGroupStyle}>
                    <label style={modalLabelStyle}>Employment Type <span style={{ color: 'red' }}>*</span></label>
                    <select
                      name="employment"
                      value={newApplicationFormData.employment}
                      onChange={handleNewApplicationFormChange}
                      style={{ ...modalSelectStyle, borderColor: newApplicationErrors.employment ? 'red' : '#cbd5e1' }}
                      required
                    >
                      <option value="">Select Employment Type</option>
                      <option value="W2">W2</option>
                      <option value="C2C">C2C</option>
                    </select>
                    {newApplicationErrors.employment && <p style={errorTextStyle}>{newApplicationErrors.employment}</p>}
                  </div>

                  <div style={modalFormFieldGroupStyle}>
                    <label style={modalLabelStyle}>Job ID</label>
                    <input
                      type="text"
                      name="jobId"
                      value={newApplicationFormData.jobId}
                      onChange={handleNewApplicationFormChange}
                      onBlur={() => validateApplicationConflicts('jobId', newApplicationFormData)}
                      style={{ ...modalInputStyle, borderColor: newApplicationErrors.jobId ? 'red' : '#cbd5e1' }}
                      placeholder="e.g., ABC-12345"

                    />
                    {newApplicationErrors.jobId && <p style={errorTextStyle}>{newApplicationErrors.jobId}</p>}
                  </div>

                </>
              )}


              {/* --- STEP 2 FIELDS (Only visible on step 2) --- */}
              {currentModalStep === 2 && (
                <>
                  <div style={modalFormFieldGroupStyle}>
                    <label style={modalLabelStyle}>Job Boards <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      name="jobBoards"
                      value={newApplicationFormData.jobBoards}
                      onChange={handleNewApplicationFormChange}
                      list="jobBoards-options"
                      style={{ ...modalInputStyle, borderColor: newApplicationErrors.jobBoards ? 'red' : '#cbd5e1' }}
                      placeholder="e.g., LinkedIn, Indeed"
                      required
                    />
                    {newApplicationErrors.jobBoards && <p style={errorTextStyle}>{newApplicationErrors.jobBoards}</p>}
                    <datalist id="jobBoards-options">
                      <option value="Linkedin" />
                      <option value="Indeed" />
                      <option value="Glassdoor" />
                      <option value="Simplyhired" />
                      <option value="Ziprecruiter" />
                      <option value="Jobright" />
                    </datalist>
                  </div>

                  <div style={modalFormFieldGroupStyle}>
                    <label style={modalLabelStyle}>Job Description URL <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="url"
                      name="jobDescriptionUrl"
                      value={newApplicationFormData.jobDescriptionUrl}
                      onChange={handleNewApplicationFormChange}
                      style={{ ...modalInputStyle, borderColor: newApplicationErrors.jobDescriptionUrl ? 'red' : '#cbd5e1' }}
                      placeholder="https://job-description.com/..."
                      required
                    />
                    {newApplicationErrors.jobDescriptionUrl && <p style={errorTextStyle}>{newApplicationErrors.jobDescriptionUrl}</p>}
                  </div>


                  <div style={modalFormFieldGroupStyle}>
                    <label style={modalLabelStyle}>Job Type<span style={{ color: 'red' }}>*</span></label>
                    <select
                      name="jobType"
                      value={newApplicationFormData.jobType}
                      onChange={handleNewApplicationFormChange}
                      style={modalSelectStyle}
                      required
                    >
                      <option value="">Select Job Type</option>
                      <option value="Remote">Remote</option>
                      <option value="On-site">On-site</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                    {newApplicationErrors.jobType && <p style={errorTextStyle}>{newApplicationErrors.jobType}</p>}
                  </div>
                  <div style={modalFormFieldGroupStyle}>
                    <label style={modalLabelStyle}>Job Location</label>
                    <input
                      type="text"
                      name="location"
                      value={newApplicationFormData.location}
                      onChange={handleNewApplicationFormChange}
                      style={modalInputStyle}
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>

                </>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            {currentModalStep === 1 && (
              <>
                <button
                  onClick={() => setShowAddApplicationModal(false)}
                  style={modalCancelButtonStyle}
                >
                  Cancel
                </button>
                <button
                  onClick={handleNextStep}
                  style={modalAddButtonPrimaryStyle}
                >
                  Next
                </button>
              </>
            )}

            {currentModalStep === 2 && (
              <>
                <button
                  onClick={() => setCurrentModalStep(1)}
                  style={modalCancelButtonStyle}
                  disabled={isSubmittingApplication}
                >
                  Back
                </button>
                <button
                  onClick={handleSaveNewApplication}
                  style={{
                    ...modalAddButtonPrimaryStyle,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: isSubmittingApplication ? 0.7 : 1,
                    pointerEvents: isSubmittingApplication ? 'none' : 'auto'
                  }}
                  disabled={isSubmittingApplication}
                >
                  {isSubmittingApplication && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      style={{ width: '16px', height: '16px' }}
                    />
                  )}
                  {isSubmittingApplication ? 'Submitting...' : 'Submit'}
                </button>
              </>
            )}
          </Modal.Footer>
        </Modal>
    </>
  );
};

export default AddApplicationModal;
