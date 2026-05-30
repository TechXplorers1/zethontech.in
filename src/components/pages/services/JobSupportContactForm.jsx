import React, { useState, useRef } from 'react';
import { Container, Form, Button, Row, Col, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../../styles/JobSupportForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from '../../../components/Navbar';
import { ref, update } from 'firebase/database';
import { database, auth } from '../../../firebase';

const TOTAL_STEPS = 5;

const STEP_TITLES = [
  'Step 1: Personal & Contact Information',
  'Step 2: Employment & Job Preferences',
  'Step 3: Education & Current Employment (Optional)',
  'Step 4: References (Optional)',
  'Step 5: Job Portal (Optional)',
];

const INITIAL_FORM_DATA = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  gender: '',
  email: '',
  countryCode: 'United States (+1)',
  mobile: '',
  ethnicity: '',
  county: '',
  address: '',
  zipCode: '',
  securityClearance: '',
  clearanceLevel: '',
  willingToRelocate: '',
  workPreference: '',
  yearsOfExperience: '',
  jobsToApply: '',
  restrictedCompanies: '',
  currentSalary: '',
  expectedSalary: '',
  visaStatus: '',
  otherVisaStatus: '',
  technologySkills: '',
  currentCompany: '',
  currentDesignation: '',
  noticePeriod: '',
  preferredInterviewTime: '',
  earliestJoiningDate: '',
  relievingDate: '',
  referenceName: '',
  referencePhone: '',
  referenceAddress: '',
  referenceEmail: '',
  referenceRole: '',
  jobPortalAccountNameandCredentials: '',
  universityName: '',
  universityAddress: '',
  courseOfStudy: '',
  graduationFromDate: '',
  graduationToDate: '',
};

const createEducationEntry = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  universityName: '',
  universityAddress: '',
  courseOfStudy: '',
  graduationFromDate: '',
  graduationToDate: '',
});

const RequiredMark = () => <span className="text-danger"> *</span>;

const CenteredLabel = ({ children, required = false }) => (
  <Form.Label className="jsc-label">
    {children}
    {required && <RequiredMark />}
  </Form.Label>
);

const JobSupportContactForm = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [educationEntries, setEducationEntries] = useState([createEducationEntry()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const [stepError, setStepError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (index, field, value) => {
    setEducationEntries((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry))
    );
  };

  const handleAddEducation = () => {
    setEducationEntries((prev) => [...prev, createEducationEntry()]);
  };

  const syncEducationToFormData = () => {
    const first = educationEntries[0] || createEducationEntry();
    setFormData((prev) => ({
      ...prev,
      universityName: first.universityName,
      universityAddress: first.universityAddress,
      courseOfStudy: first.courseOfStudy,
      graduationFromDate: first.graduationFromDate,
      graduationToDate: first.graduationToDate,
    }));
    return educationEntries;
  };

  const validateStep = (step) => {
    const missing = (label) => `Please fill in ${label}.`;

    if (step === 1) {
      if (!formData.firstName.trim()) return missing('First Name');
      if (!formData.lastName.trim()) return missing('Last Name');
      if (!formData.dob) return missing('Date of Birth');
      if (!formData.gender) return missing('Gender');
      if (!formData.email.trim()) return missing('Email');
      if (!formData.countryCode) return missing('Country Code');
      if (!formData.mobile) return missing('Mobile');
      if (!formData.ethnicity.trim()) return missing('Ethnicity');
      if (!formData.county.trim()) return missing('County');
      if (!formData.address.trim()) return missing('Address');
      if (!formData.zipCode.trim()) return missing('Zip Code');
    }

    if (step === 2) {
      if (!formData.securityClearance) return missing('Security Clearance');
      if (formData.securityClearance === 'yes' && !formData.clearanceLevel.trim()) {
        return missing('Clearance Level');
      }
      if (!formData.willingToRelocate) return missing('Willing to Relocate');
      if (!formData.workPreference.trim()) return missing('Work Preference');
      if (!formData.yearsOfExperience.trim()) return missing('Years of Experience');
      if (!formData.jobsToApply.trim()) return missing('Jobs to Apply');
      if (!formData.currentSalary.trim()) return missing('Current Salary');
      if (!formData.expectedSalary.trim()) return missing('Expected Salary');
      if (!formData.visaStatus) return missing('Visa Status');
      if (formData.visaStatus === 'other' && !formData.otherVisaStatus.trim()) {
        return missing('Visa Status (Other)');
      }
    }

    if (step === 3) {
      for (let i = 0; i < educationEntries.length; i += 1) {
        const entry = educationEntries[i];
        const prefix = `Education Entry ${i + 1}`;
        if (!entry.universityName.trim()) return missing(`${prefix} - University Name`);
        if (!entry.universityAddress.trim()) return missing(`${prefix} - University Address`);
        if (!entry.courseOfStudy.trim()) return missing(`${prefix} - Course of Study`);
        if (!entry.graduationFromDate) return missing(`${prefix} - Graduation From Date`);
        if (!entry.graduationToDate) return missing(`${prefix} - Graduation To Date`);
      }
      if (!formData.noticePeriod) return missing('Notice Period');
    }

    return '';
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setStepError('');
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(-1);
    }
  };

  const handleNext = () => {
    const error = validateStep(currentStep);
    if (error) {
      setStepError(error);
      return;
    }
    setStepError('');
    if (currentStep === 3) syncEducationToFormData();
    setCurrentStep((s) => Math.min(TOTAL_STEPS, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    setStepError('');
    setCurrentStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    const authUser = auth.currentUser;
    let loggedInUser = authUser
      ? { firebaseKey: authUser.uid, email: authUser.email }
      : JSON.parse(sessionStorage.getItem('loggedInClient'));

    if (!loggedInUser) {
      loggedInUser = JSON.parse(localStorage.getItem('user'));
    }

    if (!loggedInUser?.firebaseKey) {
      alert('Please log in to submit this application.');
      setIsSubmitting(false);
      return;
    }

    if (!authUser) {
      alert('Your Firebase auth session is not active. Please refresh the page and log in again.');
      setIsSubmitting(false);
      return;
    }

    try {
      const education = syncEducationToFormData();
      const registrationKey = Date.now().toString();
      const clientFirebaseKey = loggedInUser.firebaseKey;

      const submissionData = {
        ...formData,
        education,
        resume: [],
        resumes: [],
        coverLetter: null,
        service: 'Job Supporting',
        serviceType: 'Job Supporting',
        status: 'New',
        assignmentStatus: 'registered',
        appliedDate: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        registrationKey,
        clientFirebaseKey,
      };

      const updates = {};
      updates[`clients/${clientFirebaseKey}/serviceRegistrations/${registrationKey}`] = submissionData;
      updates[`service_registrations_index/${clientFirebaseKey}_${registrationKey}`] = submissionData;
      updates[`clients/${clientFirebaseKey}/firstName`] = formData.firstName;
      updates[`clients/${clientFirebaseKey}/lastName`] = formData.lastName;
      updates[`users/${clientFirebaseKey}/firstName`] = formData.firstName;
      updates[`users/${clientFirebaseKey}/lastName`] = formData.lastName;

      await update(ref(database), updates);

      setFormData(INITIAL_FORM_DATA);
      setEducationEntries([createEducationEntry()]);
      setCurrentStep(1);
      if (formRef.current) formRef.current.reset();

      setSubmitStatus({
        success: true,
        message: 'Form submitted successfully! Your application has been recorded.',
      });
      setShowPreviewModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Submission Error:', error);
      const errorMsg = error?.message || 'Please try again.';
      setSubmitStatus({ success: false, message: `Submission failed: ${errorMsg}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviewSubmit = () => {
    const error = validateStep(3);
    if (error) {
      setStepError(error);
      setCurrentStep(3);
      return;
    }
    syncEducationToFormData();
    setStepError('');
    setShowPreviewModal(true);
  };

  const progressPercent = (currentStep / TOTAL_STEPS) * 100;

  const renderStep1 = () => (
    <>
      <Row className="jsc-row">
        <Col md={4}>
          <CenteredLabel required>First Name</CenteredLabel>
          <Form.Control name="firstName" value={formData.firstName} onChange={handleChange} required />
        </Col>
        <Col md={4}>
          <CenteredLabel>Middle Name</CenteredLabel>
          <Form.Control name="middleName" value={formData.middleName} onChange={handleChange} />
        </Col>
        <Col md={4}>
          <CenteredLabel required>Last Name</CenteredLabel>
          <Form.Control name="lastName" value={formData.lastName} onChange={handleChange} required />
        </Col>
      </Row>
      <Row className="jsc-row">
        <Col md={4}>
          <CenteredLabel required>Date of Birth</CenteredLabel>
          <Form.Control name="dob" type="date" value={formData.dob} onChange={handleChange} required />
        </Col>
        <Col md={4}>
          <CenteredLabel required>Gender</CenteredLabel>
          <Form.Select name="gender" value={formData.gender} onChange={handleChange} required className="jsc-select">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <CenteredLabel required>Email</CenteredLabel>
          <Form.Control name="email" type="email" value={formData.email} onChange={handleChange} required />
        </Col>
      </Row>
      <Row className="jsc-row">
        <Col md={4}>
          <CenteredLabel required>Country Code</CenteredLabel>
          <Form.Select name="countryCode" value={formData.countryCode} onChange={handleChange} required className="jsc-select">
            <option value="United States (+1)">United States (+1)</option>
            <option value="India (+91)">India (+91)</option>
            <option value="United Kingdom (+44)">United Kingdom (+44)</option>
            <option value="Canada (+1)">Canada (+1)</option>
            <option value="Australia (+61)">Australia (+61)</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <CenteredLabel required>Mobile</CenteredLabel>
          <Form.Control
            name="mobile"
            type="tel"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </Col>
        <Col md={4}>
          <CenteredLabel required>Ethnicity</CenteredLabel>
          <Form.Control name="ethnicity" value={formData.ethnicity} onChange={handleChange} required />
        </Col>
      </Row>
      <Row className="jsc-row">
        <Col md={4}>
          <CenteredLabel required>County</CenteredLabel>
          <Form.Control name="county" value={formData.county} onChange={handleChange} required />
        </Col>
        <Col md={4}>
          <CenteredLabel required>Address</CenteredLabel>
          <Form.Control name="address" value={formData.address} onChange={handleChange} required />
        </Col>
        <Col md={4}>
          <CenteredLabel required>Zip Code</CenteredLabel>
          <Form.Control name="zipCode" value={formData.zipCode} onChange={handleChange} required />
        </Col>
      </Row>
    </>
  );

  const renderStep2 = () => (
    <>
      <Row className="jsc-row">
        <Col md={6}>
          <CenteredLabel required>Security Clearance</CenteredLabel>
          <Form.Select name="securityClearance" value={formData.securityClearance} onChange={handleChange} required className="jsc-select">
            <option value="">Select Option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="not-applicable">Not Applicable</option>
          </Form.Select>
        </Col>
        <Col md={6}>
          <CenteredLabel required>Willing to Relocate</CenteredLabel>
          <Form.Select name="willingToRelocate" value={formData.willingToRelocate} onChange={handleChange} required className="jsc-select">
            <option value="">Select Option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Form.Select>
        </Col>
      </Row>
      {formData.securityClearance === 'yes' && (
        <Row className="jsc-row">
          <Col md={6}>
            <CenteredLabel required>Clearance Level</CenteredLabel>
            <Form.Control name="clearanceLevel" value={formData.clearanceLevel} onChange={handleChange} required />
          </Col>
        </Row>
      )}
      <Row className="jsc-row">
        <Col md={6}>
          <CenteredLabel required>Work Preference</CenteredLabel>
          <Form.Control
            name="workPreference"
            value={formData.workPreference}
            onChange={handleChange}
            list="work-preference-options"
            placeholder="Select or type..."
            required
          />
          <datalist id="work-preference-options">
            <option value="Remote" />
            <option value="Hybrid" />
            <option value="Onsite" />
            <option value="Remote+Hybrid" />
            <option value="Remote-Hybrid-Onsite" />
            <option value="Hybrid-Onsite" />
          </datalist>
        </Col>
        <Col md={6}>
          <CenteredLabel required>Years of Experience</CenteredLabel>
          <Form.Control
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            placeholder="e.g., 5"
            required
          />
        </Col>
      </Row>
      <Row className="jsc-row">
        <Col md={6}>
          <CenteredLabel required>Jobs to Apply</CenteredLabel>
          <Form.Control
            name="jobsToApply"
            value={formData.jobsToApply}
            onChange={handleChange}
            as="textarea"
            rows={3}
            placeholder="e.g., Software Engineer, Project Manager"
            required
          />
        </Col>
        <Col md={6}>
          <CenteredLabel>Restricted Companies</CenteredLabel>
          <Form.Control
            name="restrictedCompanies"
            value={formData.restrictedCompanies}
            onChange={handleChange}
            as="textarea"
            rows={3}
          />
        </Col>
      </Row>
      <Row className="jsc-row">
        <Col md={4}>
          <CenteredLabel required>Current Salary</CenteredLabel>
          <Form.Control name="currentSalary" value={formData.currentSalary} onChange={handleChange} required />
        </Col>
        <Col md={4}>
          <CenteredLabel required>Expected Salary</CenteredLabel>
          <Form.Control name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} required />
        </Col>
        <Col md={4}>
          <CenteredLabel required>Visa Status</CenteredLabel>
          <Form.Select name="visaStatus" value={formData.visaStatus} onChange={handleChange} required className="jsc-select">
            <option value="">Select Status</option>
            <option value="citizen">Citizen</option>
            <option value="green-card">Green Card</option>
            <option value="h1b">H1B</option>
            <option value="opt">OPT</option>
            <option value="other">Other</option>
          </Form.Select>
          {formData.visaStatus === 'other' && (
            <Form.Control
              name="otherVisaStatus"
              value={formData.otherVisaStatus}
              onChange={handleChange}
              className="mt-2"
              placeholder="Specify visa status"
              required
            />
          )}
        </Col>
      </Row>
    </>
  );

  const renderStep3 = () => (
    <>
      {educationEntries.map((entry, index) => (
        <div key={entry.id} className="jsc-education-box">
          <h3 className="jsc-education-title">Education Entry {index + 1}</h3>
          <Row className="jsc-row">
            <Col md={4}>
              <CenteredLabel required>University Name</CenteredLabel>
              <Form.Control
                value={entry.universityName}
                onChange={(e) => handleEducationChange(index, 'universityName', e.target.value)}
                required
              />
            </Col>
            <Col md={4}>
              <CenteredLabel required>University Address</CenteredLabel>
              <Form.Control
                value={entry.universityAddress}
                onChange={(e) => handleEducationChange(index, 'universityAddress', e.target.value)}
                required
              />
            </Col>
            <Col md={4}>
              <CenteredLabel required>Course of Study</CenteredLabel>
              <Form.Control
                value={entry.courseOfStudy}
                onChange={(e) => handleEducationChange(index, 'courseOfStudy', e.target.value)}
                required
              />
            </Col>
          </Row>
          <Row className="jsc-row">
            <Col md={6}>
              <CenteredLabel required>Graduation From Date</CenteredLabel>
              <Form.Control
                type="date"
                value={entry.graduationFromDate}
                onChange={(e) => handleEducationChange(index, 'graduationFromDate', e.target.value)}
                required
              />
            </Col>
            <Col md={6}>
              <CenteredLabel required>Graduation To Date</CenteredLabel>
              <Form.Control
                type="date"
                value={entry.graduationToDate}
                onChange={(e) => handleEducationChange(index, 'graduationToDate', e.target.value)}
                required
              />
            </Col>
          </Row>
        </div>
      ))}
      <div className="jsc-add-more-wrap">
        <button type="button" className="jsc-add-more" onClick={handleAddEducation}>
          + Add More
        </button>
      </div>

      <h3 className="jsc-section-heading">Current Employment</h3>
      <Row className="jsc-row">
        <Col md={4}>
          <CenteredLabel>Current Company</CenteredLabel>
          <Form.Control name="currentCompany" value={formData.currentCompany} onChange={handleChange} />
        </Col>
        <Col md={4}>
          <CenteredLabel>Current Designation</CenteredLabel>
          <Form.Control name="currentDesignation" value={formData.currentDesignation} onChange={handleChange} />
        </Col>
        <Col md={4}>
          <CenteredLabel required>Notice Period</CenteredLabel>
          <Form.Select name="noticePeriod" value={formData.noticePeriod} onChange={handleChange} required className="jsc-select">
            <option value="">Select Notice Period</option>
            <option value="Immediate">Immediate</option>
            <option value="15 Days">15 Days</option>
            <option value="30 Days">30 Days</option>
            <option value="60 Days">60 Days</option>
            <option value="90 Days">90 Days</option>
            <option value="More than 90 Days">More than 90 Days</option>
          </Form.Select>
        </Col>
      </Row>
      <Row className="jsc-row">
        <Col md={4}>
          <CenteredLabel>Preferred Interview Time</CenteredLabel>
          <Form.Control name="preferredInterviewTime" value={formData.preferredInterviewTime} onChange={handleChange} />
        </Col>
        <Col md={4}>
          <CenteredLabel>Earliest Joining Date</CenteredLabel>
          <Form.Control name="earliestJoiningDate" type="date" value={formData.earliestJoiningDate} onChange={handleChange} />
        </Col>
        <Col md={4}>
          <CenteredLabel>Relieving Date</CenteredLabel>
          <Form.Control name="relievingDate" type="date" value={formData.relievingDate} onChange={handleChange} />
        </Col>
      </Row>
    </>
  );

  const renderStep4 = () => (
    <>
      <Row className="jsc-row">
        <Col md={4}>
          <CenteredLabel>Reference Name</CenteredLabel>
          <Form.Control name="referenceName" value={formData.referenceName} onChange={handleChange} />
        </Col>
        <Col md={4}>
          <CenteredLabel>Reference Phone</CenteredLabel>
          <Form.Control
            name="referencePhone"
            type="tel"
            value={formData.referencePhone}
            onChange={handleChange}
          />
        </Col>
        <Col md={4}>
          <CenteredLabel>Reference Address</CenteredLabel>
          <Form.Control name="referenceAddress" value={formData.referenceAddress} onChange={handleChange} />
        </Col>
      </Row>
      <Row className="jsc-row">
        <Col md={6}>
          <CenteredLabel>Reference Email</CenteredLabel>
          <Form.Control name="referenceEmail" type="email" value={formData.referenceEmail} onChange={handleChange} />
        </Col>
        <Col md={6}>
          <CenteredLabel>Reference Role</CenteredLabel>
          <Form.Control name="referenceRole" value={formData.referenceRole} onChange={handleChange} />
        </Col>
      </Row>
    </>
  );

  const renderStep5 = () => (
    <>
      <Row className="jsc-row">
        <Col xs={12}>
          <CenteredLabel>
            Job Portal Account Name &amp; Credentials (Ex:- LinkedIn, Glassdoor etc... )
          </CenteredLabel>
          <Form.Control
            name="jobPortalAccountNameandCredentials"
            value={formData.jobPortalAccountNameandCredentials}
            onChange={handleChange}
            as="textarea"
            rows={4}
          />
        </Col>
      </Row>
    </>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return null;
    }
  };

  return (
    <div className="jsc-page">
      <CustomNavbar />
      <Container className="jsc-container">
        <button type="button" className="jsc-back" onClick={handleBack}>
          ‹ Back
        </button>

        <h1 className="jsc-title">Job Support Contact Form</h1>

        <div className="jsc-progress-wrap">
          <div className="jsc-progress-fill" style={{ width: `${progressPercent}%` }}>
            <span className="jsc-progress-text">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
          </div>
        </div>

        <h2 className="jsc-step-title">{STEP_TITLES[currentStep - 1]}</h2>
        <hr className="jsc-divider" />

        {submitStatus.message && !showSuccessModal && (
          <Alert variant={submitStatus.success ? 'success' : 'danger'} className="mb-3">
            {submitStatus.message}
          </Alert>
        )}

        {stepError && (
          <Alert variant="danger" className="mb-3">
            {stepError}
          </Alert>
        )}

        <Form ref={formRef} onSubmit={handleSubmit} className="jsc-form">
          {renderStepContent()}

          <div className="jsc-nav">
            {currentStep > 1 ? (
              <Button type="button" variant="outline-dark" className="jsc-btn-prev" onClick={handlePrevious}>
                Previous
              </Button>
            ) : (
              <span />
            )}

            {currentStep < TOTAL_STEPS ? (
              <Button type="button" className="jsc-btn-next" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button
                type="button"
                className="jsc-btn-submit"
                onClick={handlePreviewSubmit}
                disabled={isSubmitting}
              >
                Preview &amp; Submit
              </Button>
            )}
          </div>
        </Form>
      </Container>
      <style>
        {`
          .custom-preview-modal {
            max-width: 90% !important;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
          }
          .custom-preview-modal .modal-content {
            width: 100%;
          }
        `}
      </style>
      <Modal 
        show={showPreviewModal} 
        onHide={() => setShowPreviewModal(false)} 
        centered 
        dialogClassName="custom-preview-modal"
        contentClassName="border-0 shadow"
      >
        <Modal.Header closeButton closeVariant="white" className="bg-primary text-white border-0">
          <Modal.Title className="w-100 text-center">Preview Your Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: '60vh', maxHeight: '85vh', overflowY: 'auto', backgroundColor: '#f8f9fa', padding: '2rem' }}>
          
          <h4 className="mb-3 pb-2 border-bottom text-primary fw-bold">Personal Information</h4>
          <Row>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>First Name:</label>
                <Form.Control readOnly value={formData.firstName || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Middle Name:</label>
                <Form.Control readOnly value={formData.middleName || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Last Name:</label>
                <Form.Control readOnly value={formData.lastName || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Date of Birth:</label>
                <Form.Control readOnly value={formData.dob || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Gender:</label>
                <Form.Control readOnly value={formData.gender || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Ethnicity:</label>
                <Form.Control readOnly value={formData.ethnicity || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
          </Row>

          <h4 className="mt-4 mb-3 pb-2 border-bottom text-primary fw-bold">Contact Information</h4>
          <Row>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Address:</label>
                <Form.Control readOnly value={formData.address || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>County:</label>
                <Form.Control readOnly value={formData.county || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Zip Code:</label>
                <Form.Control readOnly value={formData.zipCode || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Country:</label>
                <Form.Control readOnly value={formData.countryCode || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Mobile:</label>
                <Form.Control readOnly value={formData.mobile || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Email:</label>
                <Form.Control readOnly value={formData.email || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
          </Row>

          <h4 className="mt-4 mb-3 pb-2 border-bottom text-primary fw-bold">Employment Information</h4>
          <Row>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Security Clearance:</label>
                <Form.Control readOnly value={formData.securityClearance === 'yes' ? `Yes (${formData.clearanceLevel})` : formData.securityClearance || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Willing to Relocate:</label>
                <Form.Control readOnly value={formData.willingToRelocate || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Work Preference:</label>
                <Form.Control readOnly value={formData.workPreference || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Years of Experience:</label>
                <Form.Control readOnly value={formData.yearsOfExperience || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Current Salary:</label>
                <Form.Control readOnly value={formData.currentSalary || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Expected Salary:</label>
                <Form.Control readOnly value={formData.expectedSalary || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Visa Status:</label>
                <Form.Control readOnly value={formData.visaStatus === 'other' ? formData.otherVisaStatus : formData.visaStatus || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Current Company:</label>
                <Form.Control readOnly value={formData.currentCompany || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Current Designation:</label>
                <Form.Control readOnly value={formData.currentDesignation || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Notice Period:</label>
                <Form.Control readOnly value={formData.noticePeriod || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Earliest Joining:</label>
                <Form.Control readOnly value={formData.earliestJoiningDate || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Preferred Interview:</label>
                <Form.Control readOnly value={formData.preferredInterviewTime || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Relieving Date:</label>
                <Form.Control readOnly value={formData.relievingDate || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
              </div>
            </Col>
            <Col md={8}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Jobs to Apply:</label>
                <Form.Control readOnly as="textarea" rows={1} value={formData.jobsToApply || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057', resize: 'none' }} />
              </div>
            </Col>
            {formData.restrictedCompanies && (
              <Col md={4}>
                <div className="mb-3">
                  <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Restricted Companies:</label>
                  <Form.Control readOnly as="textarea" rows={1} value={formData.restrictedCompanies || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057', resize: 'none' }} />
                </div>
              </Col>
            )}
          </Row>

          <h4 className="mt-4 mb-3 pb-2 border-bottom text-primary fw-bold">Education Information</h4>
          {educationEntries.map((edu, idx) => (
            <Row key={idx}>
              <Col md={4}>
                <div className="mb-3">
                  <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Institution Name:</label>
                  <Form.Control readOnly value={edu.universityName || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Institution Address:</label>
                  <Form.Control readOnly value={edu.universityAddress || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Course of Study:</label>
                  <Form.Control readOnly value={edu.courseOfStudy || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Graduation From:</label>
                  <Form.Control readOnly value={edu.graduationFromDate || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Graduation To:</label>
                  <Form.Control readOnly value={edu.graduationToDate || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
                </div>
              </Col>
            </Row>
          ))}

          {(formData.referenceName || formData.referencePhone || formData.referenceEmail) && (
            <>
              <h4 className="mt-4 mb-3 pb-2 border-bottom text-primary fw-bold">Reference Information</h4>
              <Row>
                <Col md={4}>
                  <div className="mb-3">
                    <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Name:</label>
                    <Form.Control readOnly value={formData.referenceName || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-3">
                    <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Role:</label>
                    <Form.Control readOnly value={formData.referenceRole || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-3">
                    <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Phone:</label>
                    <Form.Control readOnly value={formData.referencePhone || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-3">
                    <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Email:</label>
                    <Form.Control readOnly value={formData.referenceEmail || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
                  </div>
                </Col>
                <Col md={8}>
                  <div className="mb-3">
                    <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Address:</label>
                    <Form.Control readOnly value={formData.referenceAddress || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
                  </div>
                </Col>
              </Row>
            </>
          )}

          <h4 className="mt-4 mb-3 pb-2 border-bottom text-primary fw-bold">Job Portal Accounts</h4>
          <Row>
            <Col md={12}>
              <div className="mb-3">
                <label className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Job Portal Accounts:</label>
                <Form.Control readOnly as="textarea" rows={2} value={formData.jobPortalAccountNameandCredentials || 'N/A'} style={{ backgroundColor: '#e9ecef', color: '#495057', resize: 'none' }} />
              </div>
            </Col>
          </Row>

        </Modal.Body>
        <Modal.Footer className="bg-light border-0 pt-3 pb-3">
          <Button variant="secondary" className="px-4 text-white" onClick={() => setShowPreviewModal(false)} style={{ backgroundColor: '#6c757d', border: 'none' }}>
            Edit
          </Button>
          <Button variant="primary" className="px-4 text-white" onClick={handleSubmit} disabled={isSubmitting} style={{ backgroundColor: '#0d6efd', border: 'none' }}>
            {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSuccessModal} onHide={() => { setShowSuccessModal(false); navigate('/'); }} centered>
        <Modal.Header closeButton />
        <Modal.Body className="text-center p-4">
          <div className="jsc-success-icon">✓</div>
          <h4>Form Successfully Submitted!</h4>
          <p>Your application has been recorded.</p>
          <Button
            className="jsc-btn-next mt-3"
            onClick={() => navigate('/clientdashboard')}
          >
            View Dashboard
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default JobSupportContactForm;
