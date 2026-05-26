import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const defaultModalTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#1e293b',
};

const defaultModalTextareaStyle = {
  padding: '10px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#1e293b',
  width: '100%',
  minHeight: '80px',
  resize: 'vertical',
};

const defaultModalFooterStyle = {
  borderTop: 'none',
  paddingTop: '15px',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '15px',
};

const EmployeeProfileModal = (props) => {
  const {
    showEmployeeProfileModal,
    modalFormGridStyle,
    modalFormFieldGroupStyle,
    modalLabelStyle,
    modalInputStyle,
    modalCancelButtonStyle,
    modalAddButtonPrimaryStyle,
    modalHeaderStyle,
    modalBodyStyle,
    modalTitleStyle = defaultModalTitleStyle,
    modalTextareaStyle = defaultModalTextareaStyle,
    modalFooterStyle = defaultModalFooterStyle,
    setShowEmployeeProfileModal,
    isEditingProfile,
    editedEmployeeDetails = {},
    employeeDetails = {},
    handleProfileFormChange,
    handleCancelEditProfile,
    handleSaveProfileChanges,
  } = props;

  return (
    <>
      <Modal show={showEmployeeProfileModal} onHide={() => setShowEmployeeProfileModal(false)} size="lg" centered>
        <Modal.Header closeButton style={modalHeaderStyle}>
          <Modal.Title style={modalTitleStyle}>My Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ ...modalBodyStyle, maxHeight: '70vh', overflowY: 'auto' }}>
          <div style={modalFormGridStyle}>
            {/* Personal Info Section */}
            <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '15px' }}>
              <h5 style={{ fontWeight: 600, color: '#3b82f6' }}>Personal Information</h5>
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>First Name</label>
              <input type="text" name="firstName" value={isEditingProfile ? editedEmployeeDetails.firstName : employeeDetails.firstName} onChange={handleProfileFormChange} style={modalInputStyle} disabled={!isEditingProfile} />
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Last Name</label>
              <input type="text" name="lastName" value={isEditingProfile ? editedEmployeeDetails.lastName : employeeDetails.lastName} onChange={handleProfileFormChange} style={modalInputStyle} disabled={!isEditingProfile} />
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Date of Birth</label>
              <input type="date" name="dateOfBirth" value={isEditingProfile ? editedEmployeeDetails.dateOfBirth : employeeDetails.dateOfBirth} onChange={handleProfileFormChange} style={modalInputStyle} disabled={!isEditingProfile} />
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Gender</label>
              <input type="text" name="gender" value={isEditingProfile ? editedEmployeeDetails.gender : employeeDetails.gender} onChange={handleProfileFormChange} style={modalInputStyle} disabled={!isEditingProfile} />
            </div>

            {/* Contact Info Section */}
            <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', margin: '15px 0' }}>
              <h5 style={{ fontWeight: 600, color: '#3b82f6' }}>Contact Details</h5>
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Personal Email</label>
              <input type="email" name="personalEmail" value={isEditingProfile ? editedEmployeeDetails.personalEmail : employeeDetails.personalEmail} onChange={handleProfileFormChange} style={modalInputStyle} disabled={!isEditingProfile} />
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Work Email</label>
              <input type="email" name="workEmail" value={employeeDetails.workEmail} style={modalInputStyle} disabled />
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Personal Number</label>
              <input type="tel" name="personalNumber" value={isEditingProfile ? editedEmployeeDetails.personalNumber : employeeDetails.personalNumber} onChange={handleProfileFormChange} style={modalInputStyle} disabled={!isEditingProfile} />
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Alternative Number</label>
              <input type="tel" name="alternativeNumber" value={isEditingProfile ? editedEmployeeDetails.alternativeNumber : employeeDetails.alternativeNumber} onChange={handleProfileFormChange} style={modalInputStyle} disabled={!isEditingProfile} />
            </div>
            <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1' }}>
              <label style={modalLabelStyle}>Address</label>
              <textarea name="address" value={isEditingProfile ? editedEmployeeDetails.address : employeeDetails.address} onChange={handleProfileFormChange} style={modalTextareaStyle} disabled={!isEditingProfile}></textarea>
            </div>

            {/* Employment Info Section */}
            <div style={{ ...modalFormFieldGroupStyle, gridColumn: '1 / -1', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', margin: '15px 0' }}>
              <h5 style={{ fontWeight: 600, color: '#3b82f6' }}>Employment Details</h5>
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Employee ID</label>
              <input type="text" value={employeeDetails.firebaseKey} style={modalInputStyle} disabled />
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Date of Joining</label>
              <input type="date" name="dateOfJoin" value={employeeDetails.dateOfJoin} style={modalInputStyle} disabled />
            </div>
            <div style={modalFormFieldGroupStyle}>
              <label style={modalLabelStyle}>Roles</label>
              <input type="text" value={(employeeDetails.roles || []).join(', ')} style={modalInputStyle} disabled />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={modalFooterStyle}>
          {isEditingProfile ? (
            <>
              <button onClick={handleCancelEditProfile} style={modalCancelButtonStyle}>Cancel</button>
              <button onClick={handleSaveProfileChanges} style={modalAddButtonPrimaryStyle}>Save Changes</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditingProfile(true)} style={modalAddButtonPrimaryStyle}>Edit Profile</button>
              <button onClick={() => setShowEmployeeProfileModal(false)} style={modalCancelButtonStyle}>Close</button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EmployeeProfileModal;
