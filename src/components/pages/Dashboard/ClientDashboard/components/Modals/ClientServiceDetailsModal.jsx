import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { allJobSupportFields, simplifiedServices } from '../../helpers';

const ClientServiceDetailsModal = ({ show, onHide, serviceDetails }) => {
  if (!serviceDetails) return null;

  const combinedDetails = {
    ...allJobSupportFields,
    ...serviceDetails,
  };

  const isSimpleService = simplifiedServices.includes(serviceDetails.service);

  const renderSimpleDetails = () => (
    <div>
      <h4 className="border-bottom pb-2 mb-3">Service Request Details</h4>
      <Row>
        <Col md={6} className="mb-3"><Form.Label>First Name</Form.Label><div className="previewValueDisplay">{serviceDetails.firstName || 'N/A'}</div></Col>
        <Col md={6} className="mb-3"><Form.Label>Last Name</Form.Label><div className="previewValueDisplay">{serviceDetails.lastName || 'N/A'}</div></Col>
      </Row>
      <Row>
        <Col md={6} className="mb-3"><Form.Label>Mobile</Form.Label><div className="previewValueDisplay">{serviceDetails.mobile || 'N/A'}</div></Col>
        <Col md={6} className="mb-3"><Form.Label>Email</Form.Label><div className="previewValueDisplay">{serviceDetails.email || 'N/A'}</div></Col>
      </Row>
      <Row>
        <Col className="mb-3"><Form.Label>Service</Form.Label><div className="previewValueDisplay">{serviceDetails.service || 'N/A'}</div></Col>
      </Row>
      <Row>
        <Col className="mb-3"><Form.Label>Sub-Services</Form.Label><div className="previewTextAreaDisplay">{(serviceDetails.subServices || []).join(', ') || 'N/A'}</div></Col>
      </Row>
      <Row>
        <Col className="mb-3"><Form.Label>User Type</Form.Label><div className="previewValueDisplay">{serviceDetails.userType || 'N/A'}</div></Col>
      </Row>
    </div>
  );

  const renderJobSupportDetails = () => (
    <div>
      <h4 className="border-bottom pb-2 mb-3">Personal Information</h4>
      <Row className="mb-3"><Col><Form.Label>First Name:</Form.Label><div className="previewValueDisplay">{combinedDetails.firstName}</div></Col><Col><Form.Label>Middle Name:</Form.Label><div className="previewValueDisplay">{combinedDetails.middleName}</div></Col><Col><Form.Label>Last Name:</Form.Label><div className="previewValueDisplay">{combinedDetails.lastName}</div></Col></Row>
      <Row className="mb-3"><Col><Form.Label>Date of Birth:</Form.Label><div className="previewValueDisplay">{combinedDetails.dob}</div></Col><Col><Form.Label>Gender:</Form.Label><div className="previewValueDisplay">{combinedDetails.gender}</div></Col><Col><Form.Label>Ethnicity:</Form.Label><div className="previewValueDisplay">{combinedDetails.ethnicity}</div></Col></Row>

      <h4 className="border-bottom pb-2 mb-3 mt-4">Contact Information</h4>
      <Row className="mb-3"><Col><Form.Label>Address:</Form.Label><div className="previewValueDisplay">{combinedDetails.address}</div></Col><Col><Form.Label>County:</Form.Label><div className="previewValueDisplay">{combinedDetails.county}</div></Col><Col md={4}><Form.Label>Zip Code:</Form.Label><div className="previewValueDisplay">{combinedDetails.zipCode}</div></Col></Row>
      <Row className="mb-3"><Col><Form.Label>Country:</Form.Label><div className="previewValueDisplay">{combinedDetails.country || 'N/A'}</div></Col><Col><Form.Label>Mobile:</Form.Label><div className="previewValueDisplay">{combinedDetails.mobile}</div></Col><Col><Form.Label>Email:</Form.Label><div className="previewValueDisplay">{combinedDetails.email}</div></Col></Row>

      <h4 className="border-bottom pb-2 mb-3 mt-4">Employment Information</h4>
      <Row className="mb-3"><Col><Form.Label>Security Clearance:</Form.Label><div className="previewValueDisplay">{combinedDetails.securityClearance}</div></Col>{combinedDetails.securityClearance === 'yes' && (<Col><Form.Label>Clearance Level:</Form.Label><div className="previewValueDisplay">{combinedDetails.clearanceLevel}</div></Col>)}<Col><Form.Label>Willing to Relocate:</Form.Label><div className="previewValueDisplay">{combinedDetails.willingToRelocate}</div></Col></Row>
      <Row className="mb-3">
        <Col><Form.Label>Work Preference:</Form.Label><div className="previewValueDisplay">{combinedDetails.workPreference}</div></Col>
        <Col><Form.Label>Years of Experience:</Form.Label><div className="previewValueDisplay">{combinedDetails.yearsOfExperience}</div></Col>
      </Row>
      <Row className="mb-3">
        <Col><Form.Label>Restricted Companies:</Form.Label><div className="previewValueDisplay">{combinedDetails.restrictedCompanies}</div></Col>
      </Row>

      <h4 className="border-bottom pb-2 mb-3 mt-4">Job Preferences</h4>
      <Row className="mb-3"><Col><Form.Label>Jobs to Apply For:</Form.Label><div className="previewValueDisplay">{combinedDetails.jobsToApply}</div></Col></Row>
      <Row className="mb-3"><Col><Form.Label>Current Salary:</Form.Label><div className="previewValueDisplay">{combinedDetails.currentSalary}</div></Col><Col><Form.Label>Expected Salary:</Form.Label><div className="previewValueDisplay">{combinedDetails.expectedSalary}</div></Col><Col><Form.Label>Visa Status:</Form.Label><div className="previewValueDisplay">{combinedDetails.visaStatus}</div></Col></Row>

      <h4 className="border-bottom pb-2 mb-3 mt-4">Education</h4>
      {combinedDetails.educationDetails && combinedDetails.educationDetails.length > 0 ? (
        combinedDetails.educationDetails.map((edu, index) => (
          <div key={index} style={{ marginBottom: '15px', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h5 style={{ fontSize: '1rem', marginBottom: '10px', fontWeight: 600 }}>Education Entry {index + 1}</h5>
            <Row className="mb-2"><Col><Form.Label>University Name:</Form.Label><div className="previewValueDisplay">{edu.universityName || 'N/A'}</div></Col><Col><Form.Label>University Address:</Form.Label><div className="previewValueDisplay">{edu.universityAddress || 'N/A'}</div></Col></Row>
            <Row className="mb-2"><Col><Form.Label>Course of Study:</Form.Label><div className="previewValueDisplay">{edu.courseOfStudy || 'N/A'}</div></Col><Col><Form.Label>Graduation From Date:</Form.Label><div className="previewValueDisplay">{edu.graduationFromDate || 'N/A'}</div></Col></Row>
            <Row className="mb-2"><Col><Form.Label>Graduation To Date:</Form.Label><div className="previewValueDisplay">{edu.graduationToDate || 'N/A'}</div></Col><Col><Form.Label>Notice Period:</Form.Label><div className="previewValueDisplay">{edu.noticePeriod || 'N/A'}</div></Col></Row>
          </div>
        ))
      ) : (
        <div className="previewValueDisplay">No education details provided.</div>
      )}

      <h4 className="border-bottom pb-2 mb-3 mt-4">Current Employment</h4>
      <Row className="mb-3"><Col><Form.Label>Current Company:</Form.Label><div className="previewValueDisplay">{combinedDetails.currentCompany}</div></Col><Col><Form.Label>Current Designation:</Form.Label><div className="previewValueDisplay">{combinedDetails.currentDesignation}</div></Col>        <Col><Form.Label>Notice Period:</Form.Label><div className="previewValueDisplay">{combinedDetails.noticePeriod}</div></Col>
      </Row>
      <Row className="mb-3"><Col><Form.Label>Preferred Interview Time:</Form.Label><div className="previewValueDisplay">{combinedDetails.preferredInterviewTime}</div></Col><Col><Form.Label>Earliest Joining Date:</Form.Label><div className="previewValueDisplay">{combinedDetails.earliestJoiningDate}</div></Col><Col><Form.Label>Relieving Date:</Form.Label><div className="previewValueDisplay">{combinedDetails.relievingDate}</div></Col></Row>

      <h4 className="border-bottom pb-2 mb-3 mt-4">References</h4>
      <Row className="mb-3"><Col><Form.Label>Reference Name:</Form.Label><div className="previewValueDisplay">{combinedDetails.referenceName}</div></Col><Col><Form.Label>Reference Phone:</Form.Label><div className="previewValueDisplay">{combinedDetails.referencePhone}</div></Col><Col><Form.Label>Reference Address:</Form.Label><div className="previewValueDisplay">{combinedDetails.referenceAddress}</div></Col></Row>
      <Row className="mb-3"><Col><Form.Label>Reference Email:</Form.Label><div className="previewValueDisplay">{combinedDetails.referenceEmail}</div></Col><Col><Form.Label>Reference Role:</Form.Label><div className="previewValueDisplay">{combinedDetails.referenceRole}</div></Col></Row>

      <h4 className="border-bottom pb-2 mb-3 mt-4">Job Portal Information</h4>
      <Form.Group className="mb-3"><Form.Label>Account Name & Credentials:</Form.Label><div className="previewTextAreaDisplay">{combinedDetails.jobPortalAccountNameandCredentials}</div></Form.Group>

      <h4 className="border-bottom pb-2 mb-3 mt-4">Uploaded Resume(s) & Cover Letter</h4>
      <Form.Group className="mb-3">
        <Form.Label>Resume File(s):</Form.Label>
        <div className="previewValueDisplay">
          {combinedDetails.resumes && combinedDetails.resumes.length > 0 ? (
            combinedDetails.resumes.map((resume, index) => (
              <a key={index} href={resume.url} target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px', textDecoration: 'underline' }}>
                {resume.name}
              </a>
            ))
          ) : (
            'N/A'
          )}
        </div>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Cover Letter File Name:</Form.Label>
        <div className="previewValueDisplay">
          {combinedDetails.coverLetterFileName ? <a href={combinedDetails.coverLetterUrl} target="_blank" rel="noopener noreferrer">{combinedDetails.coverLetterFileName}</a> : 'N/A'}
        </div>
      </Form.Group>
    </div>
  );

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Your Profile Details for "{serviceDetails.service}"</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {isSimpleService ? renderSimpleDetails() : renderJobSupportDetails()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClientServiceDetailsModal;
