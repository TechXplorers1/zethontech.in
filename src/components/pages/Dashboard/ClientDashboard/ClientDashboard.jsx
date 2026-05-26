import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getDatabase, ref, query, orderByChild, equalTo, update, remove, set, get, push, onValue } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import { database, storage } from '../../../../firebase';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Carousel } from 'react-bootstrap';
import { utils, writeFile } from 'xlsx';

import { documentTypes, convertDDMMYYYYtoYYYYMMDD, allJobSupportFields, simplifiedServices, formatDate, generateDateRange } from './helpers';
import { chartSectionStyle, paymentOptionButtonStyle, modalClearButtonStyle } from './styles';
import { ClientHeader, DimmingOverlay, ClientProfile } from './components/ClientHeader';
import SubscriptionDetailsModal from './components/Modals/SubscriptionDetailsModal';
import PaymentOptionsModal from './components/Modals/PaymentOptionsModal';
import PaymentPlanModal from './components/Modals/PaymentPlanModal';
import NotificationModal from './components/Modals/NotificationModal';
import AttachmentModal from './components/Modals/AttachmentModal';
import ClientServiceDetailsModal from './components/Modals/ClientServiceDetailsModal';
import DashboardOverview from './components/Tabs/DashboardOverview';

import Applications from './components/Tabs/Applications';
import Documents from './components/Tabs/Documents';
import InterviewsScheduled from './components/Tabs/InterviewsScheduled';
import WorksheetView from './components/Tabs/WorksheetView';

import './styles/modernWorksheet.css';
import './styles/dashboardGlobal.css';
import './styles/carouselPremium.css';

const ClientDashboard = () => {
  const navigate = useNavigate();

  const [applicationsData, setApplicationsData] = useState({});
  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  const [clientData, setClientData] = useState(null);
  const [allFiles, setAllFiles] = useState([]);

  // NEW: Split states for raw profile and raw applications (Refactoring Job Applications)
  const [rawProfile, setRawProfile] = useState(null);
  const [rawApps, setRawApps] = useState(null);

  // --- UPDATED ADS & BANNERS LOGIC ---
  const [activeBannerAds, setActiveBannerAds] = useState([]);

  // CHANGE 1: State is now an array, not a single object
  const [activePopupAds, setActivePopupAds] = useState([]);
  const [showPopupModal, setShowPopupModal] = useState(false);

  // ---- Welcome card state ----
  const [welcomeCardData, setWelcomeCardData] = useState(null);
  const [showWelcomeCardModal, setShowWelcomeCardModal] = useState(false);

  const WELCOME_CARD_CLOSED_PREFIX = 'closed_welcome_card_';

  const wasCardClosedToday = (cardKey) => {
    if (!cardKey) return false;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return localStorage.getItem(`${WELCOME_CARD_CLOSED_PREFIX}${cardKey}_${today}`) === 'true';
  };

  const markWelcomeCardClosedToday = (cardKey) => {
    if (!cardKey) return;
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`${WELCOME_CARD_CLOSED_PREFIX}${cardKey}_${today}`, 'true');
  };

  const handleCloseWelcomeCard = () => {
    if (welcomeCardData?.key) {
      markWelcomeCardClosedToday(welcomeCardData.key);
    }
    setShowWelcomeCardModal(false);
  };



  // Helper to check if a specific ad ID was closed
  const isAdClosed = (adId) => localStorage.getItem(`closed_ad_${adId}`) === 'true';

  // Helper to close a specific ad ID
  const markAdAsClosed = (adId) => {
    if (adId) {
      localStorage.setItem(`closed_ad_${adId}`, 'true');
    }
  };

  // --- FIX: FETCH ADS (ONCE ONLY - LOW COST) ---
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsRef = ref(database, 'welcomeCards');
        const snapshot = await get(adsRef); // <--- Changed to 'get' for one-time fetch

        if (snapshot.exists()) {
          const data = snapshot.val();
          const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

          const banners = [];
          const popups = [];

          Object.keys(data).forEach(key => {
            const ad = { id: key, ...data[key] };

            if (ad.type === 'banner') {
              banners.push(ad);
            } else if (ad.type === 'popup') {
              // Check if target date matches TODAY
              if (ad.targetDate === today) {
                const isClosed = localStorage.getItem(`closed_ad_${ad.id}`) === 'true';
                if (!isClosed) {
                  popups.push(ad);
                }
              }
            }
          });

          // Sort banners: Newest first
          banners.sort((a, b) => new Date(b.createdAt || b.targetDate) - new Date(a.createdAt || a.targetDate));

          setActiveBannerAds(banners);
          setActivePopupAds(popups);

          if (popups.length > 0) {
            setShowPopupModal(true);
          }
        } else {
          setActiveBannerAds([]);
          setActivePopupAds([]);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();
  }, []);


  // CHANGE 3: Update close handler to mark ALL displayed popups as closed
  const handleClosePopup = () => {
    // Loop through all currently active popups and mark them as seen locally
    // so they don't appear again on refresh
    activePopupAds.forEach(ad => {
      markAdAsClosed(ad.id);
    });
    setShowPopupModal(false);
  };
  // --- END NEW ADS LOGIC ---
  // --- START: ADD NEW STATE FOR LEAVES ---
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  // --- END: ADD NEW STATE FOR LEAVES ---


  // Initialize activeTab from localStorage, default to "Dashboard" if not found
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('activeClientDashboardTab');
    return savedTab || "Dashboard";
  });

  const [showUnderDevelopment, setShowUnderDevelopment] = useState(false);
  const [developmentService, setDevelopmentService] = useState('');
  const [showNotifyMessage, setShowNotifyMessage] = useState(false);

  // ADD this new handler for the "Notify me" button
  const handleNotifyMeClick = () => {
    setShowNotifyMessage(true);
  };

  // ADD this new handler for the "Go Back" button
  const handleGoBack = () => {
    setShowUnderDevelopment(false);
    setShowNotifyMessage(false);
  };

  // allJobSupportFields is now imported from helpers

  // Effect to save activeTab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeClientDashboardTab', activeTab);
  }, [activeTab]);

  // New state to manage the visibility of the "Worksheet" specific view
  const [isInWorksheetView, setIsInWorksheetView] = useState(() => {
    // Check if the saved tab is 'Applications' or 'Documents' to determine initial isInWorksheetView
    const savedTab = localStorage.getItem('activeClientDashboardTab');
    return savedTab === "Applications" || savedTab === "Documents";
  });

  // State for tabs within the WorksheetView (Applications or Documents)
  const [activeWorksheetTab, setActiveWorksheetTab] = useState(() => {
    // If we're starting in WorksheetView, determine which sub-tab was active
    const savedTab = localStorage.getItem('activeClientDashboardTab');
    if (savedTab === "Applications" || savedTab === "Documents") {
      return savedTab;
    }
    return "Applications"; // Default to Applications if starting in worksheet view
  });


  // States from clientdashboard.txt
  const [menuOpen, setMenuOpen] = useState(false); // No longer used for hamburger menu
  const [showInterviewsModal, setShowInterviewsModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSubscriptionDetailsModal, setShowSubscriptionDetailsModal] = useState(false);
  const [selectedRadioPlan, setSelectedRadioPlan] = useState('glass-silver');

  const [isServiceDetailsModalOpen, setIsServiceDetailsModalOpen] = useState(false);
  const [selectedServiceForDetails, setSelectedServiceForDetails] = useState(null);

  // simplifiedServices is now imported from helpers

  const [showImageViewer, setShowImageViewer] = useState(false);
  const [imageUrlToView, setImageUrlToView] = useState('');

  // New state for the PaymentOptionsModal
  const [showPaymentOptionsModal, setShowPaymentOptionsModal] = useState(false);
  const [planToPayFor, setPlanToPayFor] = useState({ name: '', price: '' });


  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const [activeServices, setActiveServices] = useState([]);
  const [inactiveServices, setInactiveServices] = useState([]);

  const allServices = [
    { title: "Mobile Development", path: "/services/mobile-app-development" },
    { title: "Web Development", path: "/services/web-app-development" },
    { title: "Digital Marketing", path: "/services/digital-marketing" },
    { title: "IT Talent Supply", path: "/services/it-talent-supply" },
    { title: "Job Supporting", path: "/services/job-contact-form" },
    { title: "Cyber Security", path: "/services/cyber-security" },
  ];

  const clientUserName = useMemo(() => {
    if (clientData) {
      return `${clientData.firstName || ''} ${clientData.lastName || ''}`.trim() || 'Client';
    }
    return 'Client';
  }, [clientData]);

  const clientInitials = useMemo(() => {
    if (clientData) {
      const first = clientData.firstName ? clientData.firstName.charAt(0) : '';
      const last = clientData.lastName ? clientData.lastName.charAt(0) : '';
      return `${first}${last}` || 'C';
    }
    return 'C';
  }, [clientData]);

  // Keep these as they are not part of the client's dynamic data
  const currentPlanPrice = "$199";
  const daysLeftInPlan = "28";


  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(3);
  const [notifications, setNotifications] = useState([
    { title: 'New Feature Alert', message: 'Discover our new analytics dashboard!', time: '2 hours ago' },
    { title: 'Payment Due Soon', message: 'Your subscription renews in 3 days.', time: '1 day ago' },
    { title: 'Profile Update', message: 'Your profile information has been updated.', time: '2 days ago' },
  ]);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [currentAttachments, setCurrentAttachments] = useState([]);

  // States for Applications tab (from clientworksheet.txt)
  const [selectedDate, setSelectedDate] = useState(null); // For the daily date navigation ribbon
  const [dateRange, setDateRange] = useState([]);
  const [currentStartDate, setCurrentStartDate] = useState(new Date());

  const [filterWebsites, setFilterWebsites] = useState([]);
  const [filterPositions, setFilterPositions] = useState([]);
  const [filterCompanies, setFilterCompanies] = useState([]);
  const [filtereJobType, setFilterJobType] = useState([]);


  const [uniqueWebsites, setUniqueWebsites] = useState([]);
  const [uniquePositions, setUniquePositions] = useState([]);
  const [uniqueCompanies, setUniqueCompanies] = useState([]);
  const [uniqueJobType, setUniqueJobType] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);

  const [showJobDescriptionModal, setShowJobDescriptionModal] = useState(false);
  const [currentJobDescription, setCurrentJobDescription] = useState(''); // Initialize with empty string

  const [showFilterModal, setShowFilterModal] = useState(false); // Categorical filter modal
  const [tempSelectedWebsites, setTempSelectedWebsites] = useState([]);
  const [tempSelectedPositions, setTempSelectedPositions] = useState([]);
  const [tempSelectedCompanies, setTempSelectedCompanies] = useState([]);

  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page number
  const applicationsPerPage = 5;

  // States for Documents tab
  const [activeSubTab, setActiveSubTab] = useState("Resumes");


  // --- Handlers for ClientDashboard (main component) ---
  // const toggleTheme = () => {
  //   setIsDarkMode(prevMode => !prevMode);
  //   document.documentElement.classList.toggle('dark-mode');
  // };

  const toggleMenu = () => setMenuOpen(!menuOpen); // This function is now effectively unused for the UI
  const toggleInterviewsModal = () => setShowInterviewsModal(!showInterviewsModal);
  const toggleResumeModal = () => setShowResumeModal(!showResumeModal);
  const togglePaymentModal = () => setShowPaymentModal(!showPaymentModal);
  const toggleSubscriptionDetailsModal = () => setShowSubscriptionDetailsModal(!showSubscriptionDetailsModal);

  // Handlers for profile dropdown items
  // UPDATE: The handleClientProfileClick function needs to reference the new allJobSupportFields object.
  const handleClientProfileClick = useCallback(() => {
    setIsProfileDropdownOpen(false);
    if (clientData && clientData.serviceRegistrations) {
      const registrationKeys = Object.keys(clientData.serviceRegistrations);
      if (registrationKeys.length > 0) {
        const mostRecentRegistration = registrationKeys.reduce((latest, key) => {
          const current = { ...clientData.serviceRegistrations[key], key: key };
          if (!latest || new Date(current.registeredDate) > new Date(latest.registeredDate)) {
            return current;
          }
          return latest;
        }, null);

        if (mostRecentRegistration) {
          const fullDetails = {
            ...allJobSupportFields, // Use all form fields as a base
            ...mostRecentRegistration, // Overwrite with data from Firebase
            // Combine parent client data for consistency
            email: clientData.email || mostRecentRegistration.email,
            mobile: clientData.mobile || mostRecentRegistration.mobile,
            firstName: clientData.firstName || mostRecentRegistration.firstName,
            lastName: clientData.lastName || mostRecentRegistration.lastName,
            resumes: mostRecentRegistration.resumes || mostRecentRegistration.resume || clientData.resumes || clientData.resume || [],
            // Ensure file names and URLs are present for the modal
            resumeFileName: mostRecentRegistration.resumeFileName || (Array.isArray(mostRecentRegistration.resumes) && mostRecentRegistration.resumes[0]?.name),
            resumeUrl: mostRecentRegistration.resumeUrl || (Array.isArray(mostRecentRegistration.resumes) && mostRecentRegistration.resumes[0]?.url),
            coverLetterFileName: mostRecentRegistration.coverLetterFileName,
            coverLetterUrl: mostRecentRegistration.coverLetterUrl,
          };
          setSelectedServiceForDetails(fullDetails);
          setIsServiceDetailsModalOpen(true);
        }
      } else {
        alert("You have no registered services to display.");
      }
    } else {
      alert("Profile data is not available yet. Please try again in a moment.");
    }
  }, [clientData]);

  const handleSubscriptionClick = useCallback(() => {
    setIsProfileDropdownOpen(false); // Close dropdown
    setShowSubscriptionDetailsModal(true); // Open new subscription details modal
  }, []);

  const handleNotificationClick = useCallback(() => {
    setShowNotificationsModal(true);
    setUnreadNotificationsCount(0); // Mark all as read when modal is opened
  }, []);

  const closeNotificationsModal = useCallback(() => {
    setShowNotificationsModal(false);
  }, []);

  const handleAttachmentClick = useCallback((attachments) => {
    setCurrentAttachments(attachments);
    setShowAttachmentModal(true);
  }, []);

  const closeAttachmentModal = useCallback(() => {
    setShowAttachmentModal(false);
    setCurrentAttachments([]); // Clear attachments when closing
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('activeClientDashboardTab'); // Clear persisted tab on logout
    navigate('/'); // Redirect to home/login page
    setIsProfileDropdownOpen(false); // Close dropdown
  }, [navigate]);

  // Example of how to add a new notification (you'd replace this with actual logic)
  const addNewNotification = () => {
    const newNotification = {
      title: 'New Update Available',
      message: 'A new version of the dashboard has been released!',
      time: new Date().toLocaleTimeString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadNotificationsCount(prev => prev + 1);
  };

  // Optional: Simulate updates
  useEffect(() => {
    const interval = setInterval(() => {
      // You would replace this with actual checks for updates (e.g., fetching from an API)
      // For demonstration, let's add a new notification every 30 seconds
      // addNewNotification();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // ... other states ...

  // ClientDashboard.jsx


  // --- REFACTORED: SPLIT FETCHING AND PROCESSING ---

  // 1. Data Fetching Effect (Listeners)
  useEffect(() => {
    let loggedInUserData = null;
    try {
      loggedInUserData = JSON.parse(sessionStorage.getItem('loggedInClient'));
    } catch (e) {
      console.warn("Error parsing session data", e);
    }

    // GUEST MODE / BYPASS LOGIC
    if (!loggedInUserData || !loggedInUserData.firebaseKey) {
      console.warn("ClientDashboard: No loggedInClient found. Using GUEST attributes.");

      // Mock Client Data used for Guest Mode
      const mockClientData = {
        firstName: "Guest",
        lastName: "Client",
        email: "guest@example.com",
        files: [],
        serviceRegistrations: {
          "mock-service-id": {
            serviceName: "Web Development",
            status: "Active",
            files: [],
            // Mock apps are already embedded, so rawApps can be empty or null
            jobApplications: [
              {
                id: "job-1",
                jobId: "JOB-101",
                jobTitle: "Frontend Developer",
                company: "Tech Corp",
                appliedDate: new Date().toISOString(),
                jobBoards: "LinkedIn",
                link: "https://linkedin.com",
                status: "Applied"
              }
            ]
          }
        }
      };

      setRawProfile(mockClientData);
      setRawApps(null); // No separate apps for guest
      return;
    }

    const clientKey = loggedInUserData.firebaseKey;

    // Listen to Profile
    const profileRef = ref(database, `clients/${clientKey}`);
    const unsubscribeProfile = onValue(profileRef, (snapshot) => {
      setRawProfile(snapshot.exists() ? snapshot.val() : null);
    });

    // Listen to Applications (New Node)
    const appsRef = ref(database, `clients-jobapplication/${clientKey}`);
    const unsubscribeApps = onValue(appsRef, (snapshot) => {
      setRawApps(snapshot.exists() ? snapshot.val() : null);
    });

    return () => {
      unsubscribeProfile();
      unsubscribeApps();
    };
  }, []); // Run once on mount

  // 2. Data Processing Effect (Merge & Process)
  useEffect(() => {
    // If no profile data, clear everything
    if (!rawProfile) {
      setClientData(null);
      setAllFiles([]);
      setApplicationsData({});
      setScheduledInterviews([]);
      setActiveServices([]);
      setInactiveServices([]);
      return;
    }

    // MERGE LOGIC: Inject applications into service registrations
    const combinedData = { ...rawProfile };

    // Normalize root resume fields for backward compatibility
    if (combinedData.resume && !combinedData.resumes) {
      combinedData.resumes = Array.isArray(combinedData.resume) ? combinedData.resume : [combinedData.resume];
    }

    // Only attempt merge if we have a serviceRegistrations object
    if (combinedData.serviceRegistrations) {
      // Create a shallow copy of serviceRegistration keys to avoid mutation
      const newRegistrations = {};

      Object.keys(combinedData.serviceRegistrations).forEach(regKey => {
        const originalReg = combinedData.serviceRegistrations[regKey];
        const normalizedReg = { ...originalReg };
        if (normalizedReg.resume && !normalizedReg.resumes) {
          normalizedReg.resumes = Array.isArray(normalizedReg.resume) ? normalizedReg.resume : [normalizedReg.resume];
        }
        newRegistrations[regKey] = normalizedReg;

        // If we have separate apps for this key, inject them
        // Note: rawApps is { regKey: [apps...] }
        if (rawApps && rawApps[regKey]) {
          newRegistrations[regKey].jobApplications = rawApps[regKey];
        } else if (!newRegistrations[regKey].jobApplications) {
          // If no apps from separate node AND none in original (legacy), ensure array exists
          // But for Guest, they exist in original.
          // So only if missing, default to empty? 
          // Actually, if we migrated, original won't have them. 
          // If rawApps is null (loading or empty), we might show nothing.
        }
      });

      combinedData.serviceRegistrations = newRegistrations;
    }

    // Set the combined data as the main source of truth
    setClientData(combinedData);

    // --- COPIED PROCESSING LOGIC ---
    // Extract and process registrations from the COMBINED data
    const registrations = combinedData.serviceRegistrations ? Object.values(combinedData.serviceRegistrations) : [];

    // B. Extract and group applications (Optimization: use a single loop)
    let allApplications = [];
    let interviews = [];
    const groupedApplications = {};
    let generalFiles = [];
    let applicationAttachments = [];

    registrations.forEach(reg => {
      // Collect files attached to the service registration itself
      generalFiles = generalFiles.concat(reg.files || []);

      (reg.jobApplications || []).forEach(app => {
        // Collect all applications for flattening
        allApplications.push(app);

        // Collect attachments from applications
        applicationAttachments = applicationAttachments.concat(app.attachments || []);

        // Group applications by date for the ribbon
        const dateKey = formatDate(app.appliedDate);
        const entry = {
          id: app.id,
          dateAdded: formatDate(app.appliedDate), // ADDED: Map appliedDate to dateAdded for display
          jobId: app.jobId,
          website: app.jobBoards,
          position: app.jobTitle,
          company: app.company,
          // FIX: Ensure you are using the correct field name for the link
          link: app.jobDescriptionUrl || app.link || '', // Use 'link' for display, fallback to 'jobDescriptionUrl' if name is inconsistent
        };

        if (!groupedApplications[dateKey]) {
          groupedApplications[dateKey] = [];
        }
        groupedApplications[dateKey].push(entry);

        // Filter interviews directly
        if (app.status === 'Interview') {
          interviews.push(app);
        }
      });
    });

    setScheduledInterviews(interviews);
    setApplicationsData(groupedApplications); // Use the efficiently created map

    // C. Combine and set all files
    const allFilesMap = new Map();
    [...generalFiles, ...applicationAttachments].forEach(file => {
      if (file && file.downloadUrl) {
        allFilesMap.set(file.downloadUrl, file);
      }
    });
    setAllFiles(Array.from(allFilesMap.values()));

    // D. Update Active/Inactive Services
    const allServices = [
      { title: "Mobile Development", path: "/services/mobile-app-development" },
      { title: "Web Development", path: "/services/web-app-development" },
      { title: "Digital Marketing", path: "/services/digital-marketing" },
      { title: "IT Talent Supply", path: "/services/it-talent-supply" },
      { title: "Job Supporting", path: "/services/job-contact-form" },
      { title: "Cyber Security", path: "/services/cyber-security" },
    ];
    const registeredServiceNames = registrations.map(
      reg => reg.service || ''
    );
    setActiveServices(allServices.filter(s => registeredServiceNames.includes(s.title)));
    setInactiveServices(allServices.filter(s => !registeredServiceNames.includes(s.title)));

  }, [rawProfile, rawApps]);

  const handleActiveServiceClick = (service) => {
    if (clientData && clientData.serviceRegistrations) {
      // Find the registration that matches the clicked service title
      const registration = Object.values(clientData.serviceRegistrations).find(reg => reg.service === service.title);
      if (registration) {
        const fullDetails = {
          ...registration,
          email: clientData.email || registration.email,
          mobile: clientData.mobile || registration.mobile,
        };
        setSelectedServiceForDetails(fullDetails);
        setIsServiceDetailsModalOpen(true);
        setIsProfileDropdownOpen(false); // Close the services dropdown
      } else {
        alert(`Could not find details for the service: ${service.title}`);
      }
    }
  };

  // Handler for when a client clicks on an INACTIVE service
  const handleInactiveServiceClick = (path) => {
    navigate(path); // Navigate to the corresponding service page to sign up
    setIsProfileDropdownOpen(false); // Close the dropdown
  };

  const profilePlaceholder = "https://imageio.forbes.com/specials-images/imageserve/5c7d7829a7ea434b351ba0b6/0x0.jpg?format=jpg&crop=1837,1839,x206,y250,safe&height=416&width=416&fit=bounds";

  // Chart data for Dashboard content
  const generateChartLabelsForPastDays = (numDays) => {
    const labels = [];
    const today = new Date();
    const options = { day: '2-digit', month: 'short' }; // Format as "DD Mon"

    for (let i = numDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', options));
    }
    return labels;
  };

  const chartLabels = generateChartLabelsForPastDays(7); // Last 7 days

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'LinkedIn',
        data: [25, 20, 22, 28, 26, 24, 27], // 7 data points for 7 days
        borderColor: '#0A66C2',
        backgroundColor: '#0A66C2',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2
      },
      {
        label: 'Indeed',
        data: [5, 10, 15, 20, 25, 22, 15], // 7 data points for 7 days
        borderColor: '#2164F4',
        backgroundColor: '#2164F4',
        tension: 0.4,
        pointRadius: 5,
        borderWidth: 2
      },
      {
        label: 'Company Site',
        data: [10, 12, 20, 6, 29, 23, 28], // 7 data points for 7 days
        borderColor: '#6A0DAD',
        backgroundColor: '#6A0DAD',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2
      },
      {
        label: 'Glassdoor',
        data: [20, 15, 8, 16, 15, 10, 30], // 7 data points for 7 days
        borderColor: '#0CAA41',
        backgroundColor: '#0CAA41',
        tension: 0.4,
        pointRadius: 5,
        borderWidth: 2
      },
      {
        label: 'Other',
        data: [15, 25, 18, 26, 22, 28, 18], // 7 data points for 7 days
        borderColor: '#FF6B00',
        backgroundColor: '#FF6B00',
        tension: 0.4,
        pointRadius: 5,
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: "'Segoe UI', sans-serif"
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        mode: 'nearest',
        intersect: false,
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 35,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      },
      x: {
        grid: {
          display: true, // Display vertical grid lines
          color: 'rgba(0,0,0,0.1)',
          drawOnChartArea: true,
          drawTicks: false,
          lineWidth: 1,
          borderDash: [5, 5],
        }
      }
    },
    elements: {
      line: {
        fill: false
      }
    }
  };

  // Mock data for Resume & Job Portal Updates
  const resumeUpdates = [
    { id: 1, date: '2025-06-08', type: 'Resume', status: 'Updated', details: 'Added new project experience' },
    { id: 2, date: '2025-06-05', type: 'LinkedIn Profile', status: 'Reviewed', details: 'Optimized keywords' },
    { id: 3, date: '2025-06-01', type: 'Job Portal Profile', status: 'Completed', details: 'Indeed profile sync' },
    { id: 4, date: '2025-05-28', type: 'Cover Letter Template', status: 'Revised', details: 'Tailored for specific roles' },
    { id: 5, date: '2025-05-25', type: 'Resume', status: 'Draft 1 Sent', details: 'Initial review with consultant' },
    { id: 6, date: '2025-05-20', type: 'Glassdoor Profile', status: 'Created', details: 'New profile setup' },
    { id: 7, date: '2025-05-18', type: 'Portfolio Link', status: 'Added', details: 'Updated portfolio on resume' },
    { id: 8, date: '2025-05-15', type: 'Skills Section', status: 'Enhanced', details: 'Added new technical skills' },
  ];

  // Filtered resume updates to show only type 'Resume'
  const filteredResumeUpdates = resumeUpdates.filter(update => update.type === 'Resume');

  // Find the latest resume update date
  const latestResumeUpdate = filteredResumeUpdates.length > 0
    ? new Date(Math.max(...filteredResumeUpdates.map(update => new Date(update.date))))
    : null;

  const formattedLatestResumeDate = latestResumeUpdate
    ? latestResumeUpdate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';


  // Map plans to prices and features for display
  const planOptions = {
    'glass-silver': { name: 'Silver', price: '$199', features: ['Full dashboard access', 'Monthly chart updates', 'Basic support'] },
    'glass-gold': { name: 'Gold', price: '$499', features: ['All Silver features', 'Priority support', 'Quarterly review calls'] },
    'glass-platinum': { name: 'Platinum', price: '$999', features: ['All Gold features', 'Dedicated account manager', 'Annual strategic planning session'] },
  };

  // Handler for proceeding to payment options from PaymentPlanModal
  const handleProceedToPayment = (planName, planPrice) => {
    setPlanToPayFor({ name: planName, price: planPrice });
    setShowPaymentModal(false); // Close the plan selection modal
    setShowPaymentOptionsModal(true); // Open the new payment options modal
  };

  // Function to handle radio button change
  const handleRadioPlanChange = (planId) => {
    setSelectedRadioPlan(planId);
  };

  // Function to get glider style based on selected plan (not directly used in render, but kept for logic)
  const getGliderDynamicStyle = () => {
    let transformValue = 'translateX(0%)';
    let backgroundValue = 'linear-gradient(135deg, #c0c0c055, #e0e0e0)';
    let boxShadowValue = '0 0 18px rgba(192, 192, 192, 0.5), 0 0 10px rgba(255, 255, 255, 0.4) inset';

    if (selectedRadioPlan === 'glass-gold') {
      transformValue = 'translateX(100%)';
      backgroundValue = 'linear-gradient(135deg, #ffd70055, #ffcc00)';
      boxShadowValue = '0 0 18px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 235, 150, 0.4) inset';
    } else if (selectedRadioPlan === 'glass-platinum') {
      transformValue = 'translateX(200%)';
      backgroundValue = 'linear-gradient(135deg, #d0e7ff55, #a0d8ff)';
      boxShadowValue = '0 0 18px rgba(160, 216, 255, 0.5), 0 0 10px rgba(200, 240, 255, 0.4) inset';
    }

    return {
      transform: transformValue,
      background: backgroundValue,
      boxShadow: boxShadowValue,
    };
  };

  // Get current selected plan details for display below radio buttons
  const currentSelectedPlanDetails = planOptions[selectedRadioPlan];

  // Handler for downloading resume
  const handleDownloadResume = () => {
    if (rawProfile && rawProfile.resume && rawProfile.resume.length > 0) {
      const firstResume = rawProfile.resume[0];
      const resumeUrl = typeof firstResume === 'string' ? firstResume : firstResume?.url;
      if (resumeUrl) {
        window.open(resumeUrl, '_blank');
        return;
      }
    }
    alert('No resume available.');
  };

  // --- Handlers for Applications tab ---

  // Effect to generate initial date range and select today's date for Applications tab
  useEffect(() => {
    const today = new Date();
    setSelectedDate(formatDate(today)); // Highlight today's date in the ribbon
    setCurrentStartDate(today); // Set today as the center date for the range
    setDateRange(generateDateRange(today)); // Generate the initial 7-day range
  }, []);

  // Effect to populate unique filter options from all application data for Applications tab
  useEffect(() => {
    const allWebsites = new Set();
    const allPositions = new Set();
    const allCompanies = new Set();
    const allJobType = new Set();

    Object.values(applicationsData).forEach(dateApps => {
      dateApps.forEach(app => {
        allWebsites.add(app.website);
        allPositions.add(app.position);
        allCompanies.add(app.company);
        allJobType.add(app.jobType);
      });
    });

    setUniqueWebsites(Array.from(allWebsites).sort());
    setUniquePositions(Array.from(allPositions).sort());
    setUniqueCompanies(Array.from(allCompanies).sort());
    setUniqueJobType(Array.from(allJobType).sort());
  }, []);

  // Flatten all applications once and add their original date for Applications tab
  const allApplicationsFlattened = useMemo(() => {
    const flattened = [];
    for (const dateKey in applicationsData) {
      if (Object.prototype.hasOwnProperty.call(applicationsData, dateKey)) {
        applicationsData[dateKey].forEach(app => {
          flattened.push({ ...app, dateAdded: dateKey }); // Add the original date string to each app (DD-MM-YYYY)
        });
      }
    }
    return flattened;
  }, [applicationsData]);


  // Helper to determine if any global filter (search, date range, or categorical) is active
  const isGlobalFilterActive = useMemo(() => {
    return searchTerm !== '' ||
      startDateFilter !== '' ||
      endDateFilter !== '' ||
      filterWebsites.length > 0 ||
      filterPositions.length > 0 ||
      filterCompanies.length > 0;
  }, [searchTerm, startDateFilter, endDateFilter, filterWebsites, filterPositions, filterCompanies]);

  // Function to clear ALL applied filters and reset temp states (for main page button)
  const clearAllFilters = () => {
    setSearchTerm('');
    setStartDateFilter('');
    setEndDateFilter('');
    setFilterWebsites([]); // Clear categorical filters too on global clear
    setFilterPositions([]);
    setFilterCompanies([]);
    setTempStartDate(null); // Clear temp states for date range modal
    setTempEndDate(null);   // Clear temp states for date range modal
    setTempSelectedWebsites([]); // Clear temp states for categorical modal
    setTempSelectedPositions([]);
    setTempSelectedCompanies([]);
  };

  // Checkbox change handlers for temporary selections within the categorical modal
  const handleWebsiteCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setTempSelectedWebsites(prev =>
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };

  const handlePositionCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setTempSelectedPositions(prev =>
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };

  const handleCompanyCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setTempSelectedCompanies(prev =>
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };


  // --- Handlers for the NEW Date Range Picker Modal ---
  const handleOpenDateRangeModal = () => {
    // Convert DD-MM-YYYY strings back to Date objects for the calendar component
    setTempStartDate(startDateFilter ? new Date(convertDDMMYYYYtoYYYYMMDD(startDateFilter)) : null);
    setTempEndDate(endDateFilter ? new Date(convertDDMMYYYYtoYYYYMMDD(endDateFilter)) : null);
    setShowDateRangeModal(true);
  };

  const handleCloseDateRangeModal = () => {
    setShowDateRangeModal(false);
  };

  // Callback from DateRangeCalendar when a range is selected
  const handleDateRangeChangeFromCalendar = useCallback((start, end) => {
    setTempStartDate(start);
    setTempEndDate(end);
  }, []);


  const handleApplyDateRange = () => {
    // Validate dates before applying (optional, but good practice)
    if (tempStartDate && tempEndDate && tempStartDate > tempEndDate) {
      // You might want to show a user-friendly error message here
      return;
    }
    // Set the main filter states (converted back to DD-MM-YYYY strings for consistency)
    const newStartFilter = tempStartDate ? formatDate(tempStartDate) : '';
    const newEndFilter = tempEndDate ? formatDate(tempEndDate) : '';


    setStartDateFilter(newStartFilter);
    setEndDateFilter(newEndFilter);
    setShowDateRangeModal(false);

    // NOTE: The asynchronous nature of set state means the console may show old state values 
    // outside of the rendering cycle. The next render cycle will use the new values set above.
  };


  const handleClearDateRangeInModal = () => {
    // 1. Clear the temporary date selections within the modal
    setTempStartDate(null);
    setTempEndDate(null);

    // FIX: Clear the actual date filters being applied to the dashboard
    setStartDateFilter('');
    setEndDateFilter('');

    // 3. Close the modal for a better user experience
    setShowDateRangeModal(false);
  };

  // --- Handlers for Job Description Modal ---
  const handleOpenJobDescriptionModal = (description) => {
    setCurrentJobDescription(description);
    setShowJobDescriptionModal(true);
  };

  const handleCloseJobDescriptionModal = () => {
    setShowJobDescriptionModal(false);
    setCurrentJobDescription('');
  };

  const downloadApplicationsData = () => {
    if (!filteredApplicationsForDisplay.length) return;

    const dataToExport = filteredApplicationsForDisplay.map((app, index) => ({
      'S.No': index + 1,
      'Applied Date': app.dateAdded,
      'Job Boards': app.jobBoards,
      'Job Title': app.position,
      'Job ID': app.jobId,
      'Company': app.company,
      'Job Type': app.jobType || 'N/A',
      'Link': app.link,
      // 'Job Description': app.jobDescription
    }));

    const ws = utils.json_to_sheet(dataToExport); // Use utils from named import
    const wb = utils.book_new(); // Use utils from named import
    const sheetName = isGlobalFilterActive ? 'Filtered Applications' : `Applications ${selectedDate}`;
    utils.book_append_sheet(wb, ws, sheetName); // Use utils from named import
    writeFile(wb, `JobApplications_${sheetName.replace(/\s/g, '_')}.xlsx`); // Use writeFile from named import
  };

  const showPreviousWeek = () => {
    const newCenterDate = new Date(currentStartDate);
    newCenterDate.setDate(newCenterDate.getDate() - 1); // Move back by 1 day
    setCurrentStartDate(newCenterDate);
    setDateRange(generateDateRange(newCenterDate));
  };

  const showNextWeek = () => {
    const newCenterDate = new Date(currentStartDate);
    newCenterDate.setDate(newCenterDate.getDate() + 1); // Move forward by 1 day
    setCurrentStartDate(newCenterDate);
    setDateRange(generateDateRange(newCenterDate));
  };


  // Update the title dynamically based on active filters
  const getApplicationsSectionTitle = (count) => {
    const hasDateRangeFilter = startDateFilter && endDateFilter;
    const hasSearchTerm = searchTerm !== '';
    const hasCategoricalFilters = filterWebsites.length > 0 || filterPositions.length > 0 || filterCompanies.length > 0;

    if (hasDateRangeFilter) {
      // This line is updated to include the count as you requested
      return `Filtered Applications (From ${startDateFilter} - To ${endDateFilter}) Total Count: ${count}`;
    } else if (hasSearchTerm || hasCategoricalFilters) {
      // Added count for other filter scenarios for consistency
      return `Filtered Applications (${count} found)`;
    } else if (selectedDate) {
      // Added count for the daily view as well
      return `Applications for ${selectedDate} (Count : ${count} )`;
    }
    return 'Job Applications'; // Default title
  };

  // In ClientDashboard.jsx, add this new handler function.

  // In ClientDashboard.jsx, add this array before the return statement.

  // servicesData is now defined directly in DashboardOverview tab subcomponent

  const handleViewDashboardClick = (serviceName) => {
    const service = allServices.find(s => s.title === serviceName);
    if (!service) {
      if (serviceName === 'Job Application') {
        setIsInWorksheetView(true);
        setActiveWorksheetTab("Applications");
      }
      return;
    }

    const isActive = activeServices.some(active => active.title === service.title);

    if (isActive) {
      if (service.title === 'Job Supporting') {
        setIsInWorksheetView(true);
        setActiveWorksheetTab("Applications");  // ⬅️ opens Job Support dashboard
      } else {
        setDevelopmentService(service.title);
        setShowUnderDevelopment(true);
      }
    } else {
      setDevelopmentService(service.title);
      setShowUnderDevelopment(true);
    }
  };



  // Apply all filters to the relevant base set of applications
  const filteredApplicationsForDisplay = useMemo(() => {


    let baseApps = [];

    const isDateRangeFilterSet = startDateFilter !== '' || endDateFilter !== ''; // Check if ANY date filter is set
    const isSearchActiveOnly = searchTerm !== '';
    const isCategoricalFilterActiveOnly = filterWebsites.length > 0 || filterPositions.length > 0 || filterCompanies.length > 0;

    // --- Core Fix: Determine which pool of data to filter from ---
    if (isDateRangeFilterSet || isSearchActiveOnly || isCategoricalFilterActiveOnly) {
      // If any filter *besides* the simple date ribbon selection is active, use the FULL flattened data pool.
      baseApps = allApplicationsFlattened;
    } else if (selectedDate) {
      // If only a ribbon date is selected (and no other global filters active), use that date's data.
      baseApps = applicationsData[selectedDate] || [];
    } else {
      // Default case, if no filters active and no ribbon date selected, show data for today.
      baseApps = applicationsData[formatDate(new Date())] || [];
    }
    // --- End Core Fix ---


    const result = baseApps.filter(app => {
      const matchesWebsite = filterWebsites.length === 0 || filterWebsites.includes(app.website);
      const matchesPosition = filterPositions.length === 0 || filterPositions.includes(app.position);
      const matchesCompany = filterCompanies.length === 0 || filterCompanies.includes(app.company);

      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearchTerm =
        searchTerm === '' ||
        app.website.toLowerCase().includes(lowerCaseSearchTerm) ||
        app.position.toLowerCase().includes(lowerCaseSearchTerm) ||
        app.company.toLowerCase().includes(lowerCaseSearchTerm) ||
        (app.jobDescription && app.jobDescription.toLowerCase().includes(lowerCaseSearchTerm)); // Search in job description


      // Date Range Filter logic (applies only if startDateFilter or endDateFilter are explicitly set)
      let matchesDateRange = true;
      if (startDateFilter || endDateFilter) {
        // Convert DD-MM-YYYY (app.dateAdded) to YYYY-MM-DD for Date constructor comparability
        // And normalize to start/end of day for accurate range comparison
        const appDate = new Date(convertDDMMYYYYtoYYYYMMDD(app.dateAdded));
        appDate.setHours(0, 0, 0, 0); // Normalize to start of day

        const start = startDateFilter ? new Date(convertDDMMYYYYtoYYYYMMDD(startDateFilter)) : null;
        const end = endDateFilter ? new Date(convertDDMMYYYYtoYYYYMMDD(endDateFilter)) : null;

        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        matchesDateRange =
          (!start || appDate >= start) &&
          (!end || appDate <= end);
      }

      // Combine all conditions
      return matchesWebsite && matchesPosition && matchesCompany && matchesSearchTerm && matchesDateRange;
    });

    return result;
  }, [selectedDate, applicationsData, filterWebsites, filterPositions, filterCompanies, searchTerm, startDateFilter, endDateFilter, allApplicationsFlattened, isGlobalFilterActive]);


  // ---------- PAGINATION FOR APPLICATIONS TABLE ----------
  const totalPages = useMemo(() => {
    if (!filteredApplicationsForDisplay || filteredApplicationsForDisplay.length === 0) return 1;
    return Math.ceil(filteredApplicationsForDisplay.length / applicationsPerPage);
  }, [filteredApplicationsForDisplay, applicationsPerPage]);

  const paginatedApplications = useMemo(() => {
    if (!filteredApplicationsForDisplay) return [];
    const start = (currentPage - 1) * applicationsPerPage;
    const end = start + applicationsPerPage;
    return filteredApplicationsForDisplay.slice(start, end);
  }, [filteredApplicationsForDisplay, currentPage, applicationsPerPage]);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset to first page whenever filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    startDateFilter,
    endDateFilter,
    filterWebsites,
    filterPositions,
    filterCompanies,
    filtereJobType,
    selectedDate,
  ]);


  // Determine if the overlay should be visible (for all modals and sidebar)
  const isOverlayVisible = useMemo(() => {
    return menuOpen || showResumeModal || showPaymentModal || showSubscriptionDetailsModal ||
      showNotificationsModal || showAttachmentModal || showDateRangeModal || showJobDescriptionModal || showFilterModal || showPaymentOptionsModal;
  }, [menuOpen, showResumeModal, showPaymentModal,
    , showSubscriptionDetailsModal,
    showNotificationsModal, showAttachmentModal, showDateRangeModal, showJobDescriptionModal, showFilterModal, showPaymentOptionsModal]);


  // ClientDashboard.jsx

  // ... after other component definitions like Radio, ClientHeader etc.

  // ClientServiceDetailsModal component is now imported externally

  const handleImageView = (url) => {
    setImageUrlToView(url);
    setShowImageViewer(true);
  };

  // Add this useMemo hook to combine data efficiently
  const updatedClientData = useMemo(() => {
    if (!clientData) return null;
    return {
      ...clientData,
      files: allFiles // Replace the original 'files' array with the combined 'allFiles'
    };
  }, [clientData, allFiles]);


  const [hoveredServiceKey, setHoveredServiceKey] = useState(null);

  // Function to calculate metrics for Job Supporting service
  const getServiceMetrics = (serviceKey) => {
    // For "Job Application", use the real-time Firebase data
    if (serviceKey === 'Job Application') {
      if (!applicationsData || !scheduledInterviews) return { appliedToday: 0, totalApplications: 0, interviewsScheduled: 0, responseRate: '0%' };

      const today = formatDate(new Date()); // Format today's date as DD-MM-YYYY

      // Calculate Applied Today
      const appliedToday = applicationsData[today] ? applicationsData[today].length : 0;

      // Calculate Total Applications
      let totalApplications = 0;
      Object.values(applicationsData).forEach(dateApps => {
        totalApplications += dateApps.length;
      });

      // Calculate Interviews Scheduled
      const interviewsScheduled = scheduledInterviews.length;

      // Calculate Response Rate (Simplified: Interviews Scheduled / Total Applications)
      const responseRate = totalApplications > 0 ? ((interviewsScheduled / totalApplications) * 100).toFixed(0) + '%' : '0%';

      return { appliedToday, totalApplications, interviewsScheduled, responseRate };
    }

    // For all other services, return the static dummy data
    const metrics = {
      'Mobile Development': {
        activeProjects: 15,
        appsDeployed: 47,
        clientsSatisfied: 163,
        avgRating: '4.9',
        colors: ['#D946EF', '#EC4899', '#10B981', '#F59E0B']
      },
      'Web Development': {
        sitesBuilt: 94,
        domainsManaged: 71,
        uptime: '99.9%',
        performanceScore: 97,
        colors: ['#3B82F6', '#38BDF8', '#10B981', '#60A5FA']
      },
      'Digital Marketing': {
        activeCampaigns: 28,
        leadsGenerated: 1389,
        conversionRate: '13.8%',
        roi: '365%',
        colors: ['#F59E0B', '#EC4899', '#10B981', '#D946EF']
      },
      'IT Talent Supply': {
        candidatesPlaced: 82,
        interviewsToday: 18,
        activePositions: 45,
        placementRate: '96%',
        colors: ['#10B981', '#38BDF8', '#3B82F6', '#10B981']
      },
      'Cyber Security': {
        threatsBlocked: 2789,
        securityScans: 178,
        vulnerabilitiesFixed: 94,
        systemsProtected: 267,
        colors: ['#6B7280', '#9CA3AF', '#EF4444', '#10B981']
      }
    };
    return metrics[serviceKey] || null;
  };


  // ... inside the ClientDashboard main component

  // In ClientDashboard.jsx, add this constant before the return statement.

  // Worksheet and tab styles are now loaded from modernWorksheet.css

  return (
    <div className={`client-dashboard-container`}>
      {/* Dynamic Styles injected here */}
      {/* Worksheet and global dashboard styles are now loaded from external stylesheets */}

      {/* Client Header */}
      <ClientHeader
        clientUserName={clientUserName}
        clientInitials={clientInitials}
        toggleSidebar={toggleMenu} // Still passed, but the hamburger button is removed
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
        profileDropdownRef={profileDropdownRef}
        onClientProfileClick={handleClientProfileClick}
        onSubscriptionClick={handleSubscriptionClick}
        unreadNotificationsCount={unreadNotificationsCount}
        onNotificationClick={handleNotificationClick}
        // onLogoutClick={handleLogout}
        onLogoClick={() => navigate('/')}
        activeServices={activeServices}
        inactiveServices={inactiveServices}
        onActiveServiceClick={handleActiveServiceClick}
        onInactiveServiceClick={handleInactiveServiceClick}
      />

      {/* Dimming Overlay */}
      <DimmingOverlay
        isVisible={isOverlayVisible}
        onClick={() => {
          if (menuOpen) setMenuOpen(false); // This will no longer be triggered by hamburger menu
          if (showInterviewsModal) setShowInterviewsModal(false);
          if (showResumeModal) setShowResumeModal(false);
          if (showPaymentModal) setShowPaymentModal(false);
          if (showSubscriptionDetailsModal) setShowSubscriptionDetailsModal(false);
          if (showNotificationsModal) setShowNotificationsModal(false);
          if (showAttachmentModal) setShowAttachmentModal(false);
          if (showDateRangeModal) setShowDateRangeModal(false);
          if (showJobDescriptionModal) setShowJobDescriptionModal(false);
          if (showFilterModal) setShowFilterModal(false);
          if (showPaymentOptionsModal) setShowPaymentOptionsModal(false); // Close payment options modal
        }}
      />

      {/* Modals */}
      {showInterviewsModal && (
        <div className="modal-overlay">
          <div className="modal-content-style">
            <button onClick={toggleInterviewsModal} className="modal-close-button">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <h3 style={{
              marginBottom: '25px',
              textAlign: 'center',
              color: '#1e293b',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Scheduled Interviews
            </h3>
            <div className="modal-table-container">
              <table className="modal-table">
                <thead>
                  <tr>
                    <th className="modal-table-header">Date</th>
                    <th className="modal-table-header">Time</th>
                    {/* <th className="modal-table-header">Job ID</th> */}
                    <th className="modal-table-header">Company</th>
                    <th className="modal-table-header">Job Type</th>
                    <th className="modal-table-header">Recruiter Mail ID</th>
                    <th className="modal-table-header">Round</th>
                    <th className="modal-table-header">Attachment</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledInterviews.map((interview) => (
                    <tr key={interview.id} className="modal-table-row">
                      <td className="modal-table-cell">
                        <div style={{ fontWeight: '500' }}>{interview.appliedDate}</div>
                      </td>
                      <td className="modal-table-cell">{interview.interviewTime}</td>
                      {/* <td className="modal-table-cell">{interview.jobId}</td> */}
                      <td style={{ fontWeight: '600' }} className="modal-table-cell">{interview.company}</td>
                      <td style={{ fontWeight: '600' }} className="modal-table-cell">{interview.jobType}</td>
                      <td className="modal-table-cell">{interview.recruiterMail}</td>
                      <td className="modal-table-cell">
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 12px',
                          borderRadius: '16px',
                          backgroundColor:
                            interview.round === 'Round 1' ? '#EFF6FF' :
                              interview.round === 'Round 2' ? '#ECFDF5' :
                                interview.round === 'Round 3' ? '#FEF3C7' : '#F3E8FF',
                          color:
                            interview.round === 'Round 1' ? '#1D4ED8' :
                              interview.round === 'Round 2' ? '#047857' :
                                interview.round === 'Round 3' ? '#92400E' : '#6B21A8',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {interview.round}
                        </div>
                      </td>
                      <td className="modal-table-cell">
                        {interview.attachments && interview.attachments.length > 0 ? (
                          <button
                            onClick={() => handleAttachmentClick(interview.attachments)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '5px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              color: '#3b82f6',
                              fontWeight: '600',
                              fontSize: '0.85rem',
                              borderRadius: '4px',
                              transition: 'background-color 0.2s',
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                              <polyline points="13 2 13 9 20 9"></polyline>
                              <path d="M16 21v-6a2 2 0 0 1 2-2h2l-5 5-5-5h2a2 2 0 0 1 2 2v6z"></path>
                            </svg>
                            ({interview.attachments.length})
                          </button>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showResumeModal && (
        <div className="modal-overlay">
          <div className="modal-content-style">
            <button onClick={toggleResumeModal} className="modal-close-button">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13M1 1L13 13" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <h3 style={{
              marginBottom: '25px',
              textAlign: 'center',
              color: '#1e293b',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Resume Updates
            </h3>
            <div className="modal-table-container">
              <table className="modal-table">
                <thead>
                  <tr>
                    <th className="modal-table-header">Date</th>
                    <th className="modal-table-header">Update Type</th>
                    <th className="modal-table-header">Status</th>
                    <th className="modal-table-header">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResumeUpdates.map((update) => (
                    <tr key={update.id} className="modal-table-row">
                      <td className="modal-table-cell">
                        <div style={{ fontWeight: '500' }}>{update.date}</div>
                      </td>
                      <td style={{ fontWeight: '600' }} className="modal-table-cell">{update.type}</td>
                      <td className="modal-table-cell">
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 12px',
                          borderRadius: '16px',
                          backgroundColor:
                            update.status === 'Updated' ? '#EFF6FF' :
                              update.status === 'Reviewed' ? '#FEF3C7' :
                                update.status === 'Completed' ? '#ECFDF5' : '#F3E8FF',
                          color:
                            update.status === 'Updated' ? '#1D4ED8' :
                              update.status === 'Reviewed' ? '#92400E' :
                                update.status === 'Completed' ? '#047857' : '#6B21A8',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {update.status}
                        </div>
                      </td>
                      <td className="modal-table-cell">{update.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Download Button with Animation (using a CSS class now) */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                onClick={handleDownloadResume}
                className="download-button" // Applying the CSS class
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Latest Resume
              </button>
              {latestResumeUpdate && (
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '10px' }}>
                  Last updated: {formattedLatestResumeDate}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <PaymentPlanModal
          selectedRadioPlan={selectedRadioPlan}
          handleRadioPlanChange={handleRadioPlanChange}
          handleProceedToPayment={handleProceedToPayment} // This now triggers the new modal
          onClose={togglePaymentModal}
        />
      )}

      {showPaymentOptionsModal && (
        <PaymentOptionsModal
          onClose={() => setShowPaymentOptionsModal(false)}
          selectedPlanName={planToPayFor.name}
          selectedPlanPrice={planToPayFor.price}
        />
      )}

      {/* --- UPDATED ADS POPUP MODAL (AUTO-SLIDE ENABLED) --- */}
      {activePopupAds.length > 0 && (
        <Modal
          show={showPopupModal}
          onHide={handleClosePopup}
          centered
          backdrop="static"
          keyboard={false}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ color: '#007bff', fontWeight: '700' }}>
              Welcome / Announcements
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-0">
            <Carousel
              interval={3000} // <--- CHANGED: Set to 3000ms (3 seconds) for auto-slide
              pause="hover"   // Pauses sliding when the user hovers over the ad
              indicators={activePopupAds.length > 1}
              controls={activePopupAds.length > 1}
              variant="dark"
            >
              {activePopupAds.map((ad) => (
                <Carousel.Item key={ad.id}>
                  <div style={{ padding: '20px', textAlign: 'center', minHeight: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                    {/* Title */}
                    <h4 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '15px' }}>
                      {ad.title}
                    </h4>

                    {/* Image */}
                    {ad.imageUrl && (
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '250px',
                          borderRadius: '8px',
                          objectFit: 'contain',
                          marginBottom: '15px'
                        }}
                      />
                    )}

                    {/* Message */}
                    <p style={{ fontSize: '1.1rem', whiteSpace: 'pre-wrap', color: '#334155', marginBottom: '20px' }}>
                      {ad.message}
                    </p>

                    {/* Button */}
                    {ad.linkUrl && (
                      <Button
                        variant="success"
                        onClick={() => window.open(ad.linkUrl, '_blank')}
                        style={{ fontWeight: '600' }}
                      >
                        {ad.buttonText || 'Open Link'}
                      </Button>
                    )}
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosePopup}>
              Close All
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <ClientServiceDetailsModal
        show={isServiceDetailsModalOpen}
        onHide={() => setIsServiceDetailsModalOpen(false)}
        serviceDetails={selectedServiceForDetails}
      />

      {showSubscriptionDetailsModal && (
        <SubscriptionDetailsModal
          togglePaymentModal={togglePaymentModal}
          currentPlanPrice={currentPlanPrice}
          daysLeftInPlan={daysLeftInPlan}
          onClose={toggleSubscriptionDetailsModal}
        />
      )}

      {showNotificationsModal && (
        <NotificationModal
          notifications={notifications}
          onClose={closeNotificationsModal}
        />
      )}

      {showAttachmentModal && (
        <AttachmentModal
          attachments={currentAttachments}
          onClose={closeAttachmentModal}
        />
      )}

      {/* Sidebar Menu (This is now permanently hidden as per request 1) */}
      <div className="sidebar-menu" style={{
        position: 'fixed',
        top: 0,
        right: '-280px', // Always off-screen
        height: '100%',
        width: '280px',
        background: '#ffffff',
        color: '#1e293b',
        padding: '24px',
        boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
        zIndex: 100,
        transition: 'right 0.3s ease-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Profile Section */}
        <div style={{
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          backgroundColor: '#f1f5f9',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          border: '3px solid #e2e8f0'
        }}>
          <img
            src={profilePlaceholder}
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        <h4 style={{
          marginBottom: '16px',
          fontWeight: '700',
          fontSize: '1.25rem',
          color: '#1e293b'
        }}>
          {clientUserName}
        </h4>

        {/* Plan Details */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: 'var(--bg-body)',
          borderRadius: '12px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>1 Month Plan</p>
            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>$199</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Days Left</p>
            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>28</p>
          </div>
        </div>

        {/* Renew Plan Button in Sidebar */}
        <button
          onClick={togglePaymentModal}
          className="renew-plan-button"
        >
          Renew Plan
        </button>

        {/* Spacer */}
        <div style={{ flexGrow: 1 }}></div>

        {/* Bottom Links */}
        <button
          onClick={() => navigate('/contactus')}
          className="help-support-button"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '8px' }}>
            <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6C6 6 6.5 5 8 5C9.5 5 10 6 10 6C10 6 9.5 7 8 7C6.5 7 6 6 6 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 8H6.01M10 8H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Help & Support
        </button>

        {/* <button
          onClick={handleLogout}
          className="logout-button"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '8px' }}>
            <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6M10.6667 11.3333L14 8M14 8L10.6667 4.66667M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Log Out
        </button> */}
      </div>

      {/* Main Content Area */}
      <div className="main-content-area">
        {/* Conditional rendering for Client Module vs. Worksheet View */}
        {showUnderDevelopment ? (
          // If true, render the "under development" container
          <div className="under-development-container">
            <button className="back-btn" onClick={handleGoBack}>← Go Back to Dashboard</button>
            <div className="development-message">
              <h2>{developmentService} Dashboard</h2>
              <p>This dashboard is currently under development. We will update you as soon as it's ready!</p>
              {!showNotifyMessage ? (
                <button className="notify-btn" onClick={handleNotifyMeClick}>Notify me</button>
              ) : (
                <p className="notify-success-message">Once it's ready, we will send you an email notification. Thank you!</p>
              )}
            </div>
          </div>
        ) : (
          !isInWorksheetView ? (
            <div>
              <h2 className="dashboard-title">
                {/* Client Module */}
              </h2>

              {/* Tabs for Dashboard, Applications, Documents */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "20px",
                  flexWrap: 'wrap', // Allow tabs to wrap on smaller screens
                }}
              >
              </div>



              {/* Content for main dashboard tabs */}
              {activeTab === "Dashboard" && (
                <DashboardOverview
                  clientUserName={clientUserName}
                  activeBannerAds={activeBannerAds}
                  activeServices={activeServices}
                  getServiceMetrics={getServiceMetrics}
                  handleViewDashboardClick={handleViewDashboardClick}
                />
              )}

              {/* If activeTab is 'Applications' or 'Documents' directly from the main tabs, render WorksheetView */}
              {activeTab === "Applications" && !isInWorksheetView && (
                <WorksheetView
                  setActiveTab={setActiveTab}
                  activeWorksheetTab={"Applications"} // Force Applications tab
                  setActiveWorksheetTab={setActiveWorksheetTab}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  dateRange={dateRange}
                  currentStartDate={currentStartDate}
                  setCurrentStartDate={setCurrentStartDate}
                  showPreviousWeek={showPreviousWeek}
                  showNextWeek={showNextWeek}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  startDateFilter={startDateFilter}
                  setStartDateFilter={setStartDateFilter}
                  endDateFilter={endDateFilter}
                  setEndDateFilter={setEndDateFilter}
                  showDateRangeModal={showDateRangeModal}
                  setShowDateRangeModal={setShowDateRangeModal}
                  tempStartDate={tempStartDate}
                  setTempStartDate={setTempStartDate}
                  tempEndDate={tempEndDate}
                  setTempEndDate={tempEndDate}
                  handleDateRangeChangeFromCalendar={handleDateRangeChangeFromCalendar}
                  handleApplyDateRange={handleApplyDateRange}
                  handleClearDateRangeInModal={handleClearDateRangeInModal}
                  showJobDescriptionModal={showJobDescriptionModal}
                  setShowJobDescriptionModal={setShowJobDescriptionModal}
                  currentJobDescription={currentJobDescription}
                  setCurrentJobDescription={setCurrentJobDescription}
                  handleOpenJobDescriptionModal={handleOpenJobDescriptionModal}
                  handleCloseJobDescriptionModal={handleCloseJobDescriptionModal}
                  filterWebsites={filterWebsites}
                  setFilterWebsites={setFilterWebsites}
                  filterPositions={filterPositions}
                  setFilterPositions={setFilterPositions}
                  filterCompanies={filterCompanies}
                  setFilterCompanies={setFilterCompanies}
                  uniqueWebsites={uniqueWebsites}
                  uniquePositions={uniquePositions}
                  uniqueCompanies={uniqueCompanies}
                  showFilterModal={showFilterModal}
                  setShowFilterModal={setShowFilterModal}
                  tempSelectedWebsites={tempSelectedWebsites}
                  setTempSelectedWebsites={setTempSelectedWebsites}
                  tempSelectedPositions={tempSelectedPositions}
                  setTempSelectedPositions={setTempSelectedPositions}
                  tempSelectedCompanies={tempSelectedCompanies}
                  setTempSelectedCompanies={setTempSelectedCompanies}
                  handleOpenFilterModal={() => setShowFilterModal(true)}
                  handleCloseFilterModal={() => setShowFilterModal(false)}
                  handleApplyCategoricalFilters={() => {
                    setFilterWebsites(tempSelectedWebsites);
                    setFilterPositions(tempSelectedPositions);
                    setFilterCompanies(tempSelectedCompanies);
                    setShowFilterModal(false);
                  }}
                  handleClearTempFiltersInModal={() => {
                    setTempSelectedWebsites([]);
                    setTempSelectedPositions([]);
                    setTempSelectedCompanies([]);
                  }}
                  handleWebsiteCheckboxChange={handleWebsiteCheckboxChange}
                  handlePositionCheckboxChange={handlePositionCheckboxChange}
                  handleCompanyCheckboxChange={handleCompanyCheckboxChange}
                  isGlobalFilterActive={isGlobalFilterActive}
                  clearAllFilters={clearAllFilters}
                  getApplicationsSectionTitle={getApplicationsSectionTitle}
                  downloadApplicationsData={downloadApplicationsData}
                  applicationsData={applicationsData}
                  allApplicationsFlattened={allApplicationsFlattened}
                  setActiveSubTab={setActiveSubTab}
                  clientData={clientData}
                  setIsInWorksheetView={setIsInWorksheetView}
                  onImageView={handleImageView}
                  scheduledInterviews={scheduledInterviews}
                  handleAttachmentClick={handleAttachmentClick}
                  closeAttachmentModal={closeAttachmentModal}
                  currentAttachments={currentAttachments}
                  showAttachmentModal={showAttachmentModal}
                  employeeLeaves={employeeLeaves}
                  filteredApplicationsForDisplay={paginatedApplications} // Use paginated data
                  totalPages={totalPages}
                  currentPage={currentPage}
                  handleNextPage={handleNextPage}
                  handlePreviousPage={handlePreviousPage}
                  onPageChange={handlePageChange}

                />
              )}

              {activeTab === "Documents" && !isInWorksheetView && (
                <WorksheetView
                  setActiveTab={setActiveTab}
                  activeWorksheetTab={"Documents"} // Force Documents tab
                  setActiveWorksheetTab={setActiveWorksheetTab}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  dateRange={dateRange}
                  currentStartDate={currentStartDate}
                  setCurrentStartDate={setCurrentStartDate}
                  showPreviousWeek={showPreviousWeek}
                  showNextWeek={showNextWeek}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  startDateFilter={startDateFilter}
                  setStartDateFilter={setStartDateFilter}
                  endDateFilter={endDateFilter}
                  setEndDateFilter={setEndDateFilter}
                  showDateRangeModal={showDateRangeModal}
                  setShowDateRangeModal={setShowDateRangeModal}
                  tempStartDate={tempStartDate}
                  setTempStartDate={setTempStartDate}
                  tempEndDate={tempEndDate}
                  setTempEndDate={tempEndDate}
                  handleDateRangeChangeFromCalendar={handleDateRangeChangeFromCalendar}
                  handleApplyDateRange={handleApplyDateRange}
                  handleClearDateRangeInModal={handleClearDateRangeInModal}
                  showJobDescriptionModal={showJobDescriptionModal}
                  setShowJobDescriptionModal={setShowJobDescriptionModal}
                  currentJobDescription={currentJobDescription}
                  setCurrentJobDescription={setCurrentJobDescription}
                  handleOpenJobDescriptionModal={handleOpenJobDescriptionModal}
                  handleCloseJobDescriptionModal={handleCloseJobDescriptionModal}
                  filterWebsites={filterWebsites}
                  setFilterWebsites={setFilterWebsites}
                  filterPositions={filterPositions}
                  setFilterPositions={setFilterPositions}
                  filterCompanies={filterCompanies}
                  setFilterCompanies={setFilterCompanies}
                  uniqueWebsites={uniqueWebsites}
                  uniquePositions={uniquePositions}
                  uniqueCompanies={uniqueCompanies}
                  showFilterModal={showFilterModal}
                  setShowFilterModal={setShowFilterModal}
                  tempSelectedWebsites={tempSelectedWebsites}
                  setTempSelectedWebsites={setTempSelectedWebsites}
                  tempSelectedPositions={tempSelectedPositions}
                  setTempSelectedPositions={setTempSelectedPositions}
                  tempSelectedCompanies={tempSelectedCompanies}
                  setTempSelectedCompanies={setTempSelectedCompanies}
                  handleOpenFilterModal={() => setShowFilterModal(true)}
                  handleCloseFilterModal={() => setShowFilterModal(false)}
                  handleApplyCategoricalFilters={() => {
                    setFilterWebsites(tempSelectedWebsites);
                    setFilterPositions(tempSelectedPositions);
                    setFilterCompanies(tempSelectedCompanies);
                    setShowFilterModal(false);
                  }}
                  handleClearTempFiltersInModal={() => {
                    setTempSelectedWebsites([]);
                    setTempSelectedPositions([]);
                    setTempSelectedCompanies([]);
                  }}
                  handleWebsiteCheckboxChange={handleWebsiteCheckboxChange}
                  handlePositionCheckboxChange={handlePositionCheckboxChange}
                  handleCompanyCheckboxChange={handleCompanyCheckboxChange}
                  isGlobalFilterActive={isGlobalFilterActive}
                  clearAllFilters={clearAllFilters}
                  getApplicationsSectionTitle={getApplicationsSectionTitle}
                  downloadApplicationsData={downloadApplicationsData}
                  applicationsData={applicationsData}
                  allApplicationsFlattened={allApplicationsFlattened}
                  activeSubTab={activeSubTab} // Pass sub-tab state for Documents
                  setActiveSubTab={setActiveSubTab} // Pass sub-tab state for Documents
                  setIsInWorksheetView={setIsInWorksheetView} // Pass down
                  clientData={updatedClientData}
                  onImageView={handleImageView}
                  scheduledInterviews={scheduledInterviews}
                  handleAttachmentClick={handleAttachmentClick}
                  closeAttachmentModal={closeAttachmentModal}
                  currentAttachments={currentAttachments}
                  showAttachmentModal={showAttachmentModal}
                  employeeLeaves={employeeLeaves}
                  filteredApplicationsForDisplay={paginatedApplications} // Use paginated data
                  totalPages={totalPages}
                  currentPage={currentPage}
                  handleNextPage={handleNextPage}
                  handlePreviousPage={handlePreviousPage}
                />
              )}
              <Modal show={showImageViewer} onHide={() => setShowImageViewer(false)} size="lg" centered>
                <Modal.Header closeButton>
                  <Modal.Title>Image Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: 'center', padding: '10px' }}>
                  <img src={imageUrlToView} alt="Document Preview" style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: '8px' }} />
                </Modal.Body>
              </Modal>
            </div>
          ) : (
            // Render the WorksheetView when isInWorksheetView is true
            <WorksheetView
              setActiveTab={setActiveTab} // To go back to main Dashboard
              activeWorksheetTab={activeWorksheetTab}
              setActiveWorksheetTab={setActiveWorksheetTab}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              dateRange={dateRange}
              currentStartDate={currentStartDate}
              setCurrentStartDate={setCurrentStartDate}
              showPreviousWeek={showPreviousWeek}
              showNextWeek={showNextWeek}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              startDateFilter={startDateFilter}
              setStartDateFilter={setStartDateFilter}
              endDateFilter={endDateFilter}
              setEndDateFilter={setEndDateFilter}
              showDateRangeModal={showDateRangeModal}
              setShowDateRangeModal={setShowDateRangeModal}
              tempStartDate={tempStartDate}
              setTempStartDate={setTempStartDate}
              tempEndDate={tempEndDate}
              setTempEndDate={tempEndDate}
              handleDateRangeChangeFromCalendar={handleDateRangeChangeFromCalendar}
              handleApplyDateRange={handleApplyDateRange}
              handleClearDateRangeInModal={handleClearDateRangeInModal}
              showJobDescriptionModal={showJobDescriptionModal}
              setShowJobDescriptionModal={setShowJobDescriptionModal}
              currentJobDescription={currentJobDescription}
              setCurrentJobDescription={setCurrentJobDescription}
              handleOpenJobDescriptionModal={handleOpenJobDescriptionModal}
              handleCloseJobDescriptionModal={handleCloseJobDescriptionModal}
              filterWebsites={filterWebsites}
              setFilterWebsites={setFilterWebsites}
              filterPositions={filterPositions}
              setFilterPositions={setFilterPositions}
              filterCompanies={filterCompanies}
              setFilterCompanies={setFilterCompanies}
              uniqueWebsites={uniqueWebsites}
              uniquePositions={uniquePositions}
              uniqueCompanies={uniqueCompanies}
              showFilterModal={showFilterModal}
              setShowFilterModal={setShowFilterModal}
              tempSelectedWebsites={tempSelectedWebsites}
              setTempSelectedWebsites={setTempSelectedWebsites}
              tempSelectedPositions={tempSelectedPositions}
              setTempSelectedPositions={setTempSelectedPositions}
              tempSelectedCompanies={tempSelectedCompanies}
              setTempSelectedCompanies={setTempSelectedCompanies}
              handleOpenFilterModal={() => setShowFilterModal(true)}
              handleCloseFilterModal={() => setShowFilterModal(false)}
              handleApplyCategoricalFilters={() => {
                setFilterWebsites(tempSelectedWebsites);
                setFilterPositions(tempSelectedPositions);
                setFilterCompanies(tempSelectedCompanies);
                setShowFilterModal(false);
              }}
              handleClearTempFiltersInModal={() => {
                setTempSelectedWebsites([]);
                setTempSelectedPositions([]);
                setTempSelectedCompanies([]);
              }}
              handleWebsiteCheckboxChange={handleWebsiteCheckboxChange}
              handlePositionCheckboxChange={handlePositionCheckboxChange}
              handleCompanyCheckboxChange={handleCompanyCheckboxChange}
              isGlobalFilterActive={isGlobalFilterActive}
              clearAllFilters={clearAllFilters}
              getApplicationsSectionTitle={getApplicationsSectionTitle}
              downloadApplicationsData={downloadApplicationsData}
              applicationsData={applicationsData}
              allApplicationsFlattened={allApplicationsFlattened}
              activeSubTab={activeSubTab} // Pass sub-tab state for Documents
              setActiveSubTab={setActiveSubTab} // Pass sub-tab state for Documents
              setIsInWorksheetView={setIsInWorksheetView} // Pass down
              clientData={updatedClientData}
              onImageView={handleImageView}
              scheduledInterviews={scheduledInterviews}
              handleAttachmentClick={handleAttachmentClick}
              closeAttachmentModal={closeAttachmentModal}
              currentAttachments={currentAttachments}
              showAttachmentModal={showAttachmentModal}
              employeeLeaves={employeeLeaves}
              filteredApplicationsForDisplay={paginatedApplications} // Use paginated data
              totalPages={totalPages}
              currentPage={currentPage}
              handleNextPage={handleNextPage}
              handlePreviousPage={handlePreviousPage}
            />
          )
        )}

      </div>
    </div>
  );
};

// --- STYLES (Combined from both files) ---

export default ClientDashboard;
