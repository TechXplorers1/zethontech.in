// ClientDashboard Helper Functions and Constants
export const documentTypes = {
  Resumes: 'resume',
  CoverLetters: 'cover letter',
  Interviews: 'interview screenshot',
  Offers: 'offers', // Assuming 'Offers' corresponds to 'portfolio' type
  Portfolio: 'portfolio',
  Others: 'other'
};

export const convertDDMMYYYYtoYYYYMMDD = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return null;
  const parts = dateString.split('-'); // [DD, MM, YYYY]
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
  }
  return null; // Invalid format
};

export const allJobSupportFields = {
  // Personal Information
  firstName: 'N/A',
  middleName: 'N/A',
  lastName: 'N/A',
  dob: 'N/A',
  gender: 'N/A',
  ethnicity: 'N/A',
  // Contact Information
  address: 'N/A',
  county: 'N/A',
  zipCode: 'N/A',
  countryCode: 'N/A',
  mobile: 'N/A',
  email: 'N/A',
  // Employment Information
  securityClearance: 'N/A',
  clearanceLevel: 'N/A',
  willingToRelocate: 'N/A',
  workPreference: 'N/A',
  restrictedCompanies: 'N/A',
  yearsOfExperience: 'N/A',
  // Job Preferences
  jobsToApply: 'N/A',
  currentSalary: 'N/A',
  expectedSalary: 'N/A',
  visaStatus: 'N/A',
  otherVisaStatus: 'N/A',
  // Education
  universityName: 'N/A',
  universityAddress: 'N/A',
  courseOfStudy: 'N/A',
  graduationFromDate: 'N/A',
  graduationToDate: 'N/A',
  noticePeriod: 'N/A',
  // Current Employment
  currentCompany: 'N/A',
  currentDesignation: 'N/A',
  preferredInterviewTime: 'N/A',
  earliestJoiningDate: 'N/A',
  relievingDate: 'N/A',
  // References
  referenceName: 'N/A',
  referencePhone: 'N/A',
  referenceAddress: 'N/A',
  referenceEmail: 'N/A',
  referenceRole: 'N/A',
  // Job Portal Information
  jobPortalAccountNameandCredentials: 'N/A',
  // Resume & Cover Letter
  resumeFileName: 'N/A',
  coverLetterFileName: 'N/A',
};

export const simplifiedServices = [
  'Mobile Development',
  'Web Development',
  'Digital Marketing',
  'IT Talent Supply',
  'Cyber Security'
];

export const formatDate = (date) => {
  if (!date) return ''; // Handle empty date
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const generateDateRange = (centerDate) => {
  const dates = [];
  const options = { weekday: 'short' };

  for (let i = -3; i <= 3; i++) {
    const date = new Date(centerDate);
    date.setDate(centerDate.getDate() + i);
    dates.push({
      date: formatDate(date),
      dayOfWeek: date.toLocaleDateString('en-US', options)
    });
  }
  return dates;
};


