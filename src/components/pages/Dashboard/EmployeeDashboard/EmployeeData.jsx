import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Spinner } from 'react-bootstrap'; // Using react-bootstrap Modal
import { ref, query, orderByChild, equalTo, update, remove, set, push, get } from "firebase/database";
import { database } from '../../../../firebase'; // Import your Firebase config
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { utils, writeFile } from 'xlsx';
import './styles/employeeStyles.css';
import NewClientsTab from './components/Tabs/NewClientsTab';
import ActiveClientsTab from './components/Tabs/ActiveClientsTab';
import InactiveClientsTab from './components/Tabs/InactiveClientsTab';
import AddApplicationModal from './components/Modals/AddApplicationModal';
import ViewApplicationModal from './components/Modals/ViewApplicationModal';
import EditApplicationModal from './components/Modals/EditApplicationModal';
import UploadFileModal from './components/Modals/UploadFileModal';
import ViewFileModal from './components/Modals/ViewFileModal';
import EditFileModal from './components/Modals/EditFileModal';
import EmployeeProfileModal from './components/Modals/EmployeeProfileModal';
import NotificationModal from './components/Modals/NotificationModal';
import ClientSelectModal from './components/Modals/ClientSelectModal';
import ImageViewerModal from './components/Modals/ImageViewerModal';
import DeleteFileModal from './components/Modals/DeleteFileModal';



const simplifiedServices = ['Mobile Development', 'Web Development', 'Digital Marketing', 'IT Talent Supply', 'Cyber Security'];
// --- IndexedDB Helper (Solves the 5MB Quota Limit) ---
const IDB_CONFIG = { name: 'AppCacheDB', version: 1, store: 'firebase_cache' };

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_CONFIG.name, IDB_CONFIG.version);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_CONFIG.store)) {
        db.createObjectStore(IDB_CONFIG.store);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const dbGet = async (key) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(IDB_CONFIG.store, 'readonly');
    const request = transaction.objectStore(IDB_CONFIG.store).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const dbSet = async (key, val) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(IDB_CONFIG.store, 'readwrite');
    const request = transaction.objectStore(IDB_CONFIG.store).put(val, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
// -----------------------------------------------------------

// AdminHeader Component - Provided by the user
const AdminHeader = ({
  adminUserName,
  adminInitials,
  onLogoClick,
  isDarkMode,
  toggleTheme,
  toggleSidebar,
  isProfileDropdownOpen,
  setIsProfileDropdownOpen,
  profileDropdownRef,
  // New props for profile modal
  showProfileModal,
  setShowProfileModal,
  // New prop for notification click
  onNotificationClick,
  onLogoutClick
}) => {

  // Effect to close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if profileDropdownRef.current exists and if the click is outside it
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    // Attach the event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownRef, setIsProfileDropdownOpen]); // Dependencies: profileDropdownRef and setIsProfileDropdownOpen

  return (
    <>
      {/* Inline styles for AdminHeader - extracted from AdminWorksheet.jsx */}
      <header className="ad-header">
        <div className="ad-header-left">
          <div className="ad-logo" onClick={onLogoClick} style={{ cursor: 'pointer' }}>
            <span>Tech</span>
            <span className="ad-logo-x">X</span>
            <span>plorers</span>
          </div>
        </div>

        <div className="ad-header-right">
          <div className="ad-notification-icon">
            {/* Bell Icon */}
            <svg className="ad-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1.125rem', height: '1.125rem' }} onClick={onNotificationClick}>
              <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.2-43.8 124.9L5.7 377.9c-2.7 4.4-3.4 9.7-1.7 14.6s4.6 8.5 9.8 10.1l39.5 12.8c10.6 3.4 21.8 3.9 32.7 1.4S120.3 400 128 392h192c7.7 8 17.5 13.6 28.3 16.3s22.1 1.9 32.7-1.4l39.5-12.8c5.2-1.7 8.2-6.1 9.8-10.1s1-10.2-1.7-14.6l-20.5-33.7C399.5 322.6 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H184.3c25.8-40 39.7-86.7 39.7-134.6V208c0-61.9 50.1-112 112-112zm0 352a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
            </svg>
            <span className="ad-notification-badge">3</span>
          </div>
          <div className="profile-dropdown-container" ref={profileDropdownRef}>
            <div className="ad-user-info" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
              <div className="ad-user-info-text">
                <p className="ad-user-name">{adminUserName}</p>
                <span className="ad-admin-tag">
                  {/* User Icon */}
                  <svg className="ad-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ fontSize: '0.65rem', width: '0.65rem', height: '0.65rem' }}>
                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                  </svg>
                  Employee
                </span>
              </div>
              <div className="ad-initials-avatar">
                <span className="ad-initials-text">{adminInitials}</span>
              </div>
            </div>
            {isProfileDropdownOpen && (
              <ul className="profile-dropdown-menu open">
                <li className="profile-dropdown-item header">My Account</li>
                <li className="profile-dropdown-item" onClick={() => {
                  setIsProfileDropdownOpen(false); // Close dropdown
                  setShowProfileModal(true); // Open profile modal
                }}>
                  {/* User Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                  </svg>
                  Profile
                </li>
                {/* <li className="profile-dropdown-item logout" onClick={() => window.location.href = '/'}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1rem', height: '1rem' }}>
                    <path d="M10 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H10C10.5523 20 11 19.5523 11 19V17H13V19C13 20.6569 11.6569 22 10 22H4C2.34315 22 1 20.6569 1 19V5C1 3.34315 2.34315 2 4 2H10C11.6569 2 13 3.34315 13 5V7H11V5C11 4.44772 10.5523 4 10 4ZM19.2929 10.2929L22.2929 13.2929C22.6834 13.6834 22.6834 14.3166 22.2929 14.7071L19.2929 17.7071C18.9024 18.0976 18.2692 18.0976 17.8787 17.7071C17.4882 17.3166 17.4882 16.6834 17.8787 16.2929L19.5858 14.5858H11C10.4477 14.5858 10 14.1381 10 13.5858C10 13.0335 10.4477 12.5858 11 12.5858H19.5858L17.8787 10.8787C17.4882 10.4882 17.4882 9.85497 17.8787 9.46447C18.2692 9.07395 18.9024 9.07395 19.2929 9.46447Z" />
                  </svg>
                  Log out
                </li> */}
              </ul>
            )}
          </div>
        </div>

        <button
          className="ad-hamburger-menu"
          onClick={toggleSidebar}
        >
          {/* Hamburger Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1.125rem', height: '1.125rem' }}>
            <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
          </svg>
        </button>
      </header>
    </>
  );
};





const EmployeeData = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // State for theme and profile dropdown for AdminHeader
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });
  // --- NEW: Helper function to handle caching with IndexedDB ---
  const getCachedData = async (dbPath, storageKey, durationMinutes = 10) => {
    try {
      const cached = await dbGet(storageKey); // REPLACED sessionStorage

      if (cached) {
        const { data, timestamp } = cached;
        const isFresh = (new Date().getTime() - timestamp) < (durationMinutes * 60 * 1000);
        if (isFresh) {
          console.log(`Using cached data (IDB) for ${storageKey}`);
          return data;
        }
      }

      // If no cache or expired, fetch from Firebase
      const snapshot = await get(ref(database, dbPath));
      const data = snapshot.exists() ? snapshot.val() : null;

      if (data) {
        // Save to IndexedDB (No 5MB limit)
        await dbSet(storageKey, {
          data,
          timestamp: new Date().getTime()
        });
      }
      return data;
    } catch (err) {
      console.error("Cache Error:", err);
      return null;
    }
  };
  // --- NEW: Helper to update cache locally (Async for IDB) ---
  const updateLocalClientCache = async (clientKey, regKey, field, updatedData) => {
    try {
      const cachedWrapper = await dbGet('cache_clients_full'); // Fetch from IDB
      if (cachedWrapper) {
        // Navigate to the specific client and registration
        if (cachedWrapper.data && cachedWrapper.data[clientKey] &&
          cachedWrapper.data[clientKey].serviceRegistrations &&
          cachedWrapper.data[clientKey].serviceRegistrations[regKey]) {

          // Update the specific field
          cachedWrapper.data[clientKey].serviceRegistrations[regKey][field] = updatedData;

          // Save back to IDB
          await dbSet('cache_clients_full', cachedWrapper);
          console.log(`Local IDB cache updated for ${field}`);
        }
      }
    } catch (e) {
      console.error("Error updating local cache:", e);
    }
  };
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const profileDropdownRef = useRef(null);
  const [newApplicationErrors, setNewApplicationErrors] = useState({});
  const [currentModalStep, setCurrentModalStep] = useState(1);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveFormData, setLeaveFormData] = useState({
    applyTo: [], // Array of manager/admin IDs
    fromDate: '',
    toDate: '',
    leaveType: '',
    reason: '',
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [managersAndAdmins, setManagersAndAdmins] = useState([]);
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);
  const [leaveRequestToEdit, setLeaveRequestToEdit] = useState(null);
  const [leaveRequestToDelete, setLeaveRequestToDelete] = useState(null);
  const [showDeleteLeaveModal, setShowDeleteLeaveModal] = useState(false);

  // NEW: State for controlling the visibility of the Employee Profile Modal
  const [showEmployeeProfileModal, setShowEmployeeProfileModal] = useState(false);
  // NEW: State for controlling edit mode of employee profile
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [isSavingChanges, setIsSavingChanges] = useState(false);

  // NEW: State for employee details (now mutable)
  const [employeeDetails, setEmployeeDetails] = useState({
    name: "Employee User",
    employeeId: "EMP001",
    mobile: "+1 (555) 123-4567",
    email: "employee.user@techxplorers.com", // Added email
    lastLogin: new Date().toLocaleString(),
  });

  const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // NEW: useEffect to get logged-in user data from sessionStorage
  // Update useEffect to get the full employee object from sessionStorage
  // In EmployeeData.jsx, replace the useEffect hook that starts with "// NEW: useEffect to get logged-in user data..."

  // ... Find the useEffect that starts around line 330 ...

  useEffect(() => {
    const loggedInUserData = JSON.parse(sessionStorage.getItem('loggedInEmployee'));

    if (!loggedInUserData || !loggedInUserData.firebaseKey) {
      setLeaveRequests([]);
      navigate('/login');
      return;
    }

    const employeeFirebaseKey = loggedInUserData.firebaseKey;

    // 1) Fetch employee profile (Cached for 15 mins)
    (async () => {
      try {
        // optimization: using cached data
        const employeeData = await getCachedData(`users/${employeeFirebaseKey}`, `cache_user_${employeeFirebaseKey}`, 15);
        if (employeeData) {
          setEmployeeDetails(employeeData);
        }
      } catch (err) {
        console.error('Failed to fetch employee profile:', err);
      }
    })();

    // 2) Fetch leave requests (Always fetch fresh or reduce cache time to 1 min)
    (async () => {
      try {
        // Leaves change frequently, so we might pull fresh or use very short cache
        const leaveQuery = query(
          ref(database, 'leave_requests'),
          orderByChild('employeeFirebaseKey'),
          equalTo(employeeFirebaseKey)
        );

        const snapshot = await get(leaveQuery);
        const requestsList = [];

        snapshot.forEach(childSnap => {
          const val = childSnap.val();
          requestsList.push({ id: childSnap.key, ...val });
        });

        requestsList.sort(
          (a, b) => new Date(b.requestedDate || 0) - new Date(a.requestedDate || 0)
        );

        setLeaveRequests(requestsList);
      } catch (err) {
        console.error('Failed to fetch leave requests:', err);

        // Firebase RTDB may require an index for orderByChild queries.
        // If rules are missing, fall back to querying all leave requests and filter locally.
        const errorMessage = err?.message || String(err);
        if (errorMessage.includes('Index not defined') || errorMessage.includes('requires .indexOn')) {
          try {
            const snapshot = await get(ref(database, 'leave_requests'));
            const requestsList = [];

            snapshot.forEach(childSnap => {
              const val = childSnap.val();
              if (val && val.employeeFirebaseKey === employeeFirebaseKey) {
                requestsList.push({ id: childSnap.key, ...val });
              }
            });

            requestsList.sort(
              (a, b) => new Date(b.requestedDate || 0) - new Date(a.requestedDate || 0)
            );

            setLeaveRequests(requestsList);
          } catch (fallbackErr) {
            console.error('Fallback leave request fetch failed:', fallbackErr);
            setLeaveRequests([]);
          }
        } else {
          setLeaveRequests([]);
        }
      }
    })();

    // 3) Fetch Managers/Admins (Cached for 60 mins - this rarely changes)
    (async () => {
      try {
        // optimization: using cached data
        const usersData = await getCachedData('users', 'cache_users_full', 1440);
        const managementList = [];

        if (usersData) {
          Object.keys(usersData).forEach(key => {
            const user = usersData[key];
            if (
              user &&
              user.role &&
              (String(user.role).toLowerCase() === 'manager' ||
                String(user.role).toLowerCase() === 'admin')
            ) {
              managementList.push({
                id: key,
                name:
                  `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                  user.email,
                role: user.role,
              });
            }
          });
        }

        setManagersAndAdmins(managementList);
      } catch (err) {
        console.error('Failed to fetch users once:', err);
      }
    })();

    // 4) Fetch ONLY Assigned Clients (Optimized Reverse Indexing)
    (async () => {
      try {
        if (!employeeFirebaseKey) return;

        // A. Fetch the lightweight list of IDs assigned to this employee
        const assignmentsRef = ref(database, `employee_assignments/${employeeFirebaseKey}`);
        const assignmentsSnapshot = await get(assignmentsRef);

        if (!assignmentsSnapshot.exists()) {
          setNewClients([]);
          setActiveClients([]);
          setInactiveClients([]);
          return;
        }

        const assignments = assignmentsSnapshot.val();
        const promises = [];

        // B. Fetch ONLY the specific client records needed (Parallel Fetch)
        Object.values(assignments).forEach(assignment => {
          const clientBaseRef = ref(database, `clients/${assignment.clientFirebaseKey}`);
          const specificClientRef = ref(database, `clients/${assignment.clientFirebaseKey}/serviceRegistrations/${assignment.registrationKey}`);

          promises.push(Promise.all([get(clientBaseRef), get(specificClientRef)]).then(([clientSnap, regSnap]) => {
            if (regSnap.exists()) {
              const registration = regSnap.val();
              const clientBase = clientSnap.exists() ? clientSnap.val() : {};

              // Flatten jobApplications
              const jobApplicationsArray = registration.jobApplications
                ? Object.values(registration.jobApplications)
                : [];

              // Merge base client data and registration data (registration data takes precedence)
              const mergedData = { ...clientBase, ...registration };
              
              const firstName = mergedData.firstName || '';
              const lastName = mergedData.lastName || '';
              const dateToDisplay = mergedData.registeredDate || mergedData.appliedDate || mergedData.timestamp || 'N/A';

              // Reconstruct the data structure the UI expects
              return {
                ...mergedData,
                jobApplications: jobApplicationsArray,
                clientFirebaseKey: assignment.clientFirebaseKey,
                registrationKey: assignment.registrationKey,
                // Ensure names, initials, and dates are generated correctly
                firstName: firstName,
                lastName: lastName,
                name: `${firstName} ${lastName}`.trim() || 'Unknown Client',
                initials: `${(firstName || 'C').charAt(0)}${(lastName || 'L').charAt(0)}`.toUpperCase(),
                registeredDate: typeof dateToDisplay === 'number' ? new Date(dateToDisplay).toLocaleDateString() : dateToDisplay
              };
            }
            return null;
          }));
        });

        // C. Resolve all promises
        const results = await Promise.all(promises);
        const myRegistrations = results.filter(item => item !== null);

        // D. Sort into buckets
        setNewClients(myRegistrations.filter(c => c.assignmentStatus === 'pending_acceptance'));
        setActiveClients(myRegistrations.filter(c => c.assignmentStatus === 'active'));
        setInactiveClients(myRegistrations.filter(c => c.assignmentStatus === 'inactive'));

      } catch (err) {
        console.error('Failed to fetch assigned clients:', err);
      }
    })();
  }, [navigate]);

  // NEW: Temporary state for editing profile
  const [editedEmployeeDetails, setEditedEmployeeDetails] = useState({});

  // NEW: State for notifications (toast messages)
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  // NEW: State for the notification modal (from screenshot)
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Mock notifications for the modal
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Feature Alert', description: 'Discover our new analytics dashboard!', timeAgo: '2 hours ago' },
    { id: 2, title: 'Payment Due Soon', description: 'Your subscription renews in 3 days.', timeAgo: '1 day ago' },
    { id: 3, title: 'Profile Update', description: 'Your profile information has been updated.', timeAgo: '2 days ago' },
  ]);


  // Function to show a notification (toast)
  const triggerNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage('');
    }, 3000); // Notification disappears after 3 seconds
  };

  // Function to handle notification icon click (now opens the modal)
  const handleNotificationIconClick = () => {
    setShowNotificationModal(true);
  };


  // Function to derive initials from name
  const getInitials = (firstName, lastName) => {
    return `${firstName ? firstName.charAt(0).toUpperCase() : ''}${lastName ? lastName.charAt(0).toUpperCase() : ''}`;
  };

  const employeeName = `${employeeDetails.firstName || ''} ${employeeDetails.lastName || ''}`.trim();
  const employeeInitials = getInitials(employeeDetails.firstName, employeeDetails.lastName);

  // Dynamically calculate adminInitials
  const adminInitials = getInitials(employeeDetails.name);


  useEffect(() => {
    document.documentElement.className = theme + '-mode';
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  // Dummy toggleSidebar function as it's required by AdminHeader but not explicitly defined for EmployeeData's context
  // You might want to implement a proper sidebar functionality if needed.
  const toggleSidebar = () => {
    console.log("Toggle sidebar functionality goes here.");
  };

  // NEW: Handle opening profile modal and initializing edit state
  // FIX: This function now correctly copies the employeeDetails into the editedEmployeeDetails state

  const getLocalDateTimeString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const formatToIST = (utcString) => {
    if (!utcString) return 'N/A';
    try {
      const date = new Date(utcString);
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true, // Use 12-hour clock
        timeZone: 'Asia/Kolkata', // Set to Indian Standard Time
      };
      return new Intl.DateTimeFormat('en-IN', options).format(date);
    } catch (e) {
      console.error('Error formatting date to IST:', e);
      return utcString;
    }
  };


  const handleOpenProfileModal = async () => {
    try {
      const loggedInUserData = JSON.parse(sessionStorage.getItem('loggedInEmployee'));
      if (!loggedInUserData || !loggedInUserData.firebaseKey) {
        console.error("No logged in user found in session.");
        return;
      }
      const employeeRef = ref(database, `users/${loggedInUserData.firebaseKey}`);
      const snap = await get(employeeRef);   // ✅ one-time read
      if (snap.exists()) {
        const employee = snap.val();
        setEmployeeDetails(employee);
        setEditedEmployeeDetails({ ...employee });
      } else {
        console.warn("No employee data found in Firebase for this key.");
      }
      setIsEditingProfile(false);
      setShowEmployeeProfileModal(true);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  // NEW: Handle changes in edit profile form
  const handleProfileFormChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployeeDetails(prev => ({ ...prev, [name]: value }));
  };

  // NEW: Handle saving edited profile
  const handleSaveProfileChanges = async () => {
    if (!employeeDetails.firebaseKey) {
      alert("Error: Cannot update profile. User key is missing.");
      return;
    }
    try {
      const employeeRef = ref(database, `users/${employeeDetails.firebaseKey}`);
      await update(employeeRef, editedEmployeeDetails); // Use update to save changes

      // Also update the local state and session storage
      setEmployeeDetails(editedEmployeeDetails);
      sessionStorage.setItem('loggedInEmployee', JSON.stringify(editedEmployeeDetails));

      setIsEditingProfile(false);
      triggerNotification("Profile updated successfully!");

    } catch (error) {
      console.error("Error updating profile in Firebase:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  // NEW: Handle canceling edit profile
  const handleCancelEditProfile = () => {
    setIsEditingProfile(false); // Exit edit mode
    setEditedEmployeeDetails({ ...employeeDetails }); // Revert changes
  };

  const handleLogout = () => {
    sessionStorage.removeItem('loggedInEmployee');
    navigate('/login');
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(prevState => !prevState);
  };

  const openNotificationsModal = () => {
    setShowNotificationModal(true);
  };

  const closeNotificationsModal = () => {
    setShowNotificationModal(false);
  };


  // Initial active tab is now 'New Clients'
  const [activeTab, setActiveTab] = useState('New Clients');
  // NEW: State for the active sub-tab (for client-specific data)
  const [activeSubTab, setActiveSubTab] = useState('Applications');

  // State for filters (reused across tabs)
  const [filterDateRange, setFilterDateRange] = useState({ startDate: '', endDate: '' });
  const [sortOrder, setSortOrder] = useState('Newest First');
  const [quickFilter, setQuickFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [fileTypeFilter, setFileTypeFilter] = useState('All File Types');
  const [activityTypeFilter, setActivityTypeFilter] = useState('All Activities');

  // States for Modals (Applications Tab)
  const [showAddApplicationModal, setShowAddApplicationModal] = useState(false);
  const [newApplicationFormData, setNewApplicationFormData] = useState({
    jobTitle: '', company: '', jobType: '', jobBoards: '', jobDescriptionUrl: '', location: '', jobDesc: '', jobId: '', role: '' // Added jobId
  });
  const [selectedClientForApplication, setSelectedClientForApplication] = useState(null);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);

  const [showViewApplicationModal, setShowViewApplicationModal] = useState(false);
  const [viewedApplication, setViewedApplication] = useState(null);

  const [showEditApplicationModal, setShowEditApplicationModal] = useState(false);
  // Updated state for edited application to include round and interviewDate
  const [editedApplicationFormData, setEditedApplicationFormData] = useState(null);

  // States for Modals (Files Tab)
  const [showUploadFileModal, setShowUploadFileModal] = useState(false);
  const [newFileFormData, setNewFileFormData] = useState({
    clientId: '', fileType: '', fileName: '', jobDesc: ''
  });
  const [selectedClientForFile, setSelectedClientForFile] = useState(null);

  const [showViewFileModal, setShowViewFileModal] = useState(false);
  const [viewedFile, setViewedFile] = useState(null);

  const [showEditFileModal, setShowEditFileModal] = useState(false);
  const [editedFileFormData, setEditedFileFormData] = useState(null);

  const [showImageViewer, setShowImageViewer] = useState(false);
  const [imageUrlToView, setImageUrlToView] = useState('');

  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const [showDeleteApplicationModal, setShowDeleteApplicationModal] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [isDeletingApplication, setIsDeletingApplication] = useState(false);

  // NEW: State for new clients awaiting acceptance
  const [newClients, setNewClients] = useState([]);

  // Add this useEffect to load the new clients from localStorage
  useEffect(() => {
    const loadNewClients = () => {
      const clientsFromManager = JSON.parse(localStorage.getItem('employee_new_clients')) || [];
      setNewClients(clientsFromManager);
    };

    loadNewClients();

    // Also, listen for real-time changes
    const handleStorageChange = (event) => {
      if (event.key === 'employee_new_clients') {
        setNewClients(JSON.parse(event.newValue || '[]'));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Mock data for employee's assigned clients (now only accepted clients)
  const [activeClients, setActiveClients] = useState([]);

  // NEW: Add this useEffect to save the activeClients list to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('employee_active_clients', JSON.stringify(activeClients));
    } catch (error) {
      console.error("Failed to save active clients to local storage", error);
    }
  }, [activeClients]);


  const handleRequestDeleteApplication = (client, app) => {
    setApplicationToDelete({ client, app });
    setShowDeleteApplicationModal(true);
  };


  const handleConfirmDeleteApplication = async () => {
    if (!applicationToDelete) return;

    setIsDeletingApplication(true);
    const { client, app } = applicationToDelete;

    try {
      const updatedApplications = (client.jobApplications || []).filter(
        (existingApp) => existingApp.id !== app.id
      );

      const registrationRef = ref(
        database,
        `clients/${client.clientFirebaseKey}/serviceRegistrations/${client.registrationKey}/jobApplications`
      );

      await set(registrationRef, updatedApplications);
      updateLocalClientCache(client.clientFirebaseKey, client.registrationKey, 'jobApplications', updatedApplications);
      // Update the local state to trigger a re-render
      const updatedClient = {
        ...client,
        jobApplications: updatedApplications,
      };

      setSelectedClient(updatedClient);
      const updateClientList = (prevClients) => {
        return prevClients.map((c) =>
          c.registrationKey === updatedClient.registrationKey ? updatedClient : c
        );
      };
      setActiveClients(updateClientList);
      setInactiveClients(updateClientList);
      setNewClients(updateClientList);

      triggerNotification("Application deleted successfully!");
    } catch (error) {
      console.error("Failed to delete application:", error);
      alert("Error deleting application. Please try again.");
    } finally {
      setShowDeleteApplicationModal(false);
      setApplicationToDelete(null);
      setIsDeletingApplication(false);
    }
  };


  // NEW: State for inactive clients
  const [inactiveClients, setInactiveClients] = useState([]);

  // NEW: State for the currently selected client from the dropdown
  const [selectedClient, setSelectedClient] = useState(null);

  const [filterWebsites, setFilterWebsites] = useState([]);
  const [filterPositions, setFilterPositions] = useState([]);
  const [filterCompanies, setFilterCompanies] = useState([]);
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  const [isClientSelectModalOpen, setIsClientSelectModalOpen] = useState(false);
  const [clientSearchTermInModal, setClientSearchTermInModal] = useState('');
  const [newResumeFile, setNewResumeFile] = useState(null);
  const [newFilesToUpload, setNewFilesToUpload] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');

  // Handlers for filter changes
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleFromDateChange = (e) => setFilterFromDate(e.target.value);
  const handleToDateChange = (e) => setFilterToDate(e.target.value);


  useEffect(() => {
    let clientsForTab = [];
    if (activeTab === 'New Clients') clientsForTab = newClients;
    else if (activeTab === 'Active Clients') clientsForTab = activeClients;
    else if (activeTab === 'Inactive Clients') clientsForTab = inactiveClients;

    // If the selected client is still in the list, keep it
    if (
      selectedClient &&
      clientsForTab.some(c => c.registrationKey === selectedClient.registrationKey)
    ) {
      return; // Do nothing, keep current selectedClient
    }

    // Otherwise, default to first client or null
    setSelectedClient(clientsForTab[0] || null);
    setNewResumeFile(null);
  }, [activeTab, newClients, activeClients, inactiveClients, selectedClient]);


  // Combined activities for the timeline.
  // Memoize this because it can be expensive for clients with many applications/files/resume updates.
  const allActivities = useMemo(() => {
    if (!selectedClient) return [];

    const clientActivities = [];

    const formatTimestamp = (isoString) => {
      if (!isoString) return { date: 'N/A', time: 'N/A' };
      try {
        const date = new Date(isoString);
        const formattedDate = date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const formattedTime = date.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' });
        return { date: formattedDate, time: formattedTime };
      } catch (e) {
        console.error("Error parsing timestamp:", isoString);
        return { date: isoString, time: 'N/A' };
      }
    };

    // Job application activities
    (selectedClient.jobApplications || []).forEach(app => {
      clientActivities.push({
        clientId: selectedClient.id,
        initials: selectedClient.initials,
        name: selectedClient.name,
        description: `Applied for ${app.jobTitle} position at ${app.company}`,
        type: 'job application',
        timestamp: app.timestamp || new Date(app.appliedDate).toISOString(),
        status: app.status === 'Interview' ? 'Active' : 'Completed',
      });
      if (app.status === 'Interview') {
        clientActivities.push({
          clientId: selectedClient.id,
          initials: selectedClient.initials,
          name: selectedClient.name,
          description: `Interview scheduled with ${app.company} for ${app.jobTitle} position (Round: ${app.round || 'N/A'}, Mail: ${app.recruiterMail || 'N/A'})`,
          type: 'interview scheduled',
          timestamp: app.timestamp || new Date(app.appliedDate).toISOString(),
          status: 'Active',
        });
      }
    });

    // File activities
    (selectedClient.files || []).forEach(file => {
      clientActivities.push({
        clientId: selectedClient.id,
        initials: selectedClient.initials,
        name: selectedClient.name,
        description: `Uploaded ${file.type} for ${selectedClient.name} position`,
        type: 'file upload',
        timestamp: file.timestamp || new Date(file.uploadDate).toISOString(),
        status: 'Active',
      });
    });

    // Resume update activities
    (selectedClient.resumeUpdates || []).forEach(update => {
      clientActivities.push({
        clientId: selectedClient.id,
        initials: selectedClient.initials,
        name: selectedClient.name,
        description: `Resume update: ${update.details}`,
        type: 'resume update',
        timestamp: update.timestamp || new Date(update.date).toISOString(),
        status: update.status,
      });
    });

    return clientActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [selectedClient]);


  // Helper function to get the latest resume update date for a client
  const getLatestResumeUpdateDate = (clientResumeUpdates) => {
    const resumeTypeUpdates = clientResumeUpdates.filter(update => update.type === 'Resume');
    if (resumeTypeUpdates.length === 0) {
      return null;
    }
    const latestDate = new Date(Math.max(...resumeTypeUpdates.map(update => new Date(update.date))));
    return latestDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleResumeFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewResumeFile(e.target.files[0]);
    }
  };

  const handleSaveNewResume = async () => {
    if (!newResumeFile || !selectedClient) {
      alert("Please select a file to upload.");
      return;
    }

    const { clientFirebaseKey, registrationKey } = selectedClient;
    if (!clientFirebaseKey || !registrationKey) {
      alert("Error: Client information is missing. Cannot upload file.");
      return;
    }

    try {
      // 1. Create a unique path in Firebase Storage
      const fileRef = storageRef(getStorage(), `resumes/${clientFirebaseKey}/${registrationKey}/${newResumeFile.name}`);

      // 2. Upload the new file
      await uploadBytes(fileRef, newResumeFile);

      // 3. Get the public download URL
      const downloadURL = await getDownloadURL(fileRef);

      // 4. Update the client's registration in the Realtime Database with the new URL and file name
      const registrationRef = ref(database, `clients/${clientFirebaseKey}/serviceRegistrations/${registrationKey}`);
      await update(registrationRef, {
        resumeUrl: downloadURL,
        resumeFileName: newResumeFile.name
      });

      // 5. Provide feedback and reset state
      triggerNotification("Resume updated successfully!");
      setNewResumeFile(null); // Clear the selected file

    } catch (error) {
      console.error("Error updating resume:", error);
      alert("Failed to update resume. Please try again.");
    }
  };

  const handleRequestDeleteFile = (client, file) => {
    // Store all necessary info for deletion
    setFileToDelete({
      clientFirebaseKey: client.clientFirebaseKey,
      registrationKey: client.registrationKey,
      file: file, // Pass the whole file object
    });
    setShowDeleteFileModal(true);
  };

  // Find and replace the existing handleConfirmDeleteFile function
  const handleConfirmDeleteFile = async () => {
    if (!fileToDelete) return;

    setIsDeleting(true);
    const { clientFirebaseKey, registrationKey, file } = fileToDelete;

    try {
      // 1) Delete from Firebase Storage (if URL exists)
      if (file?.downloadUrl) {
        const storage = getStorage();
        const fileStorageRef = storageRef(storage, file.downloadUrl);

        try {
          await deleteObject(fileStorageRef);
        } catch (err) {
          // Ignore "not found" in storage; still clean DB
          if (err.code !== 'storage/object-not-found') {
            throw err;
          }
        }
      }

      // 2) One-time read of the registration from Realtime DB
      const regRef = ref(
        database,
        `clients/${clientFirebaseKey}/serviceRegistrations/${registrationKey}`
      );
      const regSnap = await get(regRef);
      const registrationData = regSnap.exists() ? regSnap.val() : null;

      const currentFiles = Array.isArray(registrationData?.files)
        ? registrationData.files
        : [];

      // 3) Filter out the deleted file
      const updatedFiles = currentFiles.filter(f => f.id !== file.id);

      // 4) Write updated files list back to DB
      const filesRef = ref(
        database,
        `clients/${clientFirebaseKey}/serviceRegistrations/${registrationKey}/files`
      );
      await set(filesRef, updatedFiles);
      updateLocalClientCache(clientFirebaseKey, registrationKey, 'files', updatedFiles);
      // 5) Update local state (active / inactive / new clients)
      const updateClientList = prevClients =>
        prevClients.map(c => {
          if (c.registrationKey !== registrationKey) return c;
          const updatedClient = { ...c, files: updatedFiles };

          // keep selectedClient in sync
          setSelectedClient(prev =>
            prev && prev.registrationKey === registrationKey
              ? updatedClient
              : prev
          );

          return updatedClient;
        });

      setActiveClients(updateClientList);
      setInactiveClients(updateClientList);
      setNewClients(updateClientList);

      triggerNotification('File deleted successfully from storage and database!');
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file. Please check permissions or try again.');
    } finally {
      // 6) Close modal and reset state
      setShowDeleteFileModal(false);
      setFileToDelete(null);
      setIsDeleting(false);
    }
  };


  const handleDownloadResume = (clientName) => {
    // Placeholder for actual resume download logic
    alert(`Downloading the latest resume for ${clientName}... (Placeholder action)`);
  };

  // --- Filter Functions (reused across tabs) ---
  const handleDateRangeChange = (e) => {
    setFilterDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleQuickFilterChange = (filterType) => {
    const today = new Date();
    let startDate = '';
    let endDate = today.toISOString().split('T')[0]; // Today's date

    if (filterType === 'Last 7 Days') {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      startDate = sevenDaysAgo.toISOString().split('T')[0];
    } else if (filterType === 'Last 30 Days') {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      startDate = thirtyDaysAgo.toISOString().split('T')[0];
    } else if (filterType === 'All Time') {
      startDate = ''; // Clear start date
      endDate = ''; // Clear end date
    }
    setFilterDateRange({ startDate, endDate });
    setQuickFilter(filterType);
  };

  const handleClearFilters = () => {
    setFilterDateRange({ startDate: '', endDate: '' });
    setSortOrder('Newest First');
    setQuickFilter('');
    setSearchTerm('');
    setStatusFilter('All Statuses');
    setFileTypeFilter('All File Types');
    setActivityTypeFilter('All Activities');
  };

  // Function to check if any filters are active
  const areFiltersActive = () => {
    return (
      filterDateRange.startDate !== '' ||
      filterDateRange.endDate !== '' ||
      sortOrder !== 'Newest First' ||
      quickFilter !== '' ||
      searchTerm !== '' ||
      statusFilter !== 'All Statuses' ||
      fileTypeFilter !== 'All File Types' ||
      activityTypeFilter !== 'All Activities'
    );
  };

  // --- Applications Tab Functions ---
  const handleOpenAddApplicationModal = (client) => {
    setSelectedClient(client);
    setShowAddApplicationModal(true);
    // Reset form data and errors on open
    setNewApplicationFormData({
      jobTitle: '', company: '', employment: '', jobType: '', jobBoards: '', jobDescriptionUrl: '', location: '', jobId: '', role: ''
    });
    setNewApplicationErrors({});
    setCurrentModalStep(1);
  };

  const handleNextStep = () => {
    // Job ID is NOT mandatory. Mandatory fields are now just jobTitle, company, and employment.
    const mandatoryFieldsStep1 = ['jobTitle', 'company', 'employment'];
    const errors = {};
    let hasError = false;

    // 1. Validation Check for mandatory Step 1 fields
    mandatoryFieldsStep1.forEach(field => {
      if (!newApplicationFormData[field] || newApplicationFormData[field].trim() === '') {
        errors[field] = 'This field is mandatory.';
        hasError = true;
      }
    });

    const { jobTitle, company, jobId } = newApplicationFormData;

    // 2. Conflict Check against local data (UI feedback)
    if (selectedClient?.jobApplications) {
      const lowerCaseJobTitle = jobTitle ? jobTitle.trim().toLowerCase() : '';
      const lowerCaseCompany = company ? company.trim().toLowerCase() : '';
      const lowerCaseJobId = jobId ? jobId.trim().toLowerCase() : '';

      // Check for Job Title + Company
      if (lowerCaseJobTitle && lowerCaseCompany) {
        const duplicateTitleCompany = selectedClient.jobApplications.find(app =>
          app.jobTitle && app.jobTitle.trim().toLowerCase() === lowerCaseJobTitle &&
          app.company && app.company.trim().toLowerCase() === lowerCaseCompany
        );

        if (duplicateTitleCompany && duplicateTitleCompany.id !== newApplicationFormData.id) {
          errors.jobTitle = 'You have already applied the job.';
          errors.company = 'You have already applied the job.';
          hasError = true;
        }
      }

      // Check for Job Title + Company + Job ID
      if (lowerCaseJobId && lowerCaseCompany && lowerCaseJobTitle) {
        const duplicateAll = selectedClient.jobApplications.find(app =>
          app.jobId && app.jobId.trim().toLowerCase() === lowerCaseJobId &&
          app.company && app.company.trim().toLowerCase() === lowerCaseCompany &&
          app.jobTitle && app.jobTitle.trim().toLowerCase() === lowerCaseJobTitle
        );

        if (duplicateAll && duplicateAll.id !== newApplicationFormData.id) {
          errors.jobId = 'You have already applied the job.';
          hasError = true;
        }
      }
    }

    setNewApplicationErrors(errors);

    if (hasError) {
      triggerNotification("Please fill in all mandatory fields and resolve any application conflicts.");
      return;
    }

    // 3. If validation passes, move to the next step
    setCurrentModalStep(2);
  };

  // Optimized: Fast form change handler (no validation on every keystroke)
  const handleNewApplicationFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewApplicationFormData(prev => ({ ...prev, [name]: value }));
    // Only clear the error for this field
    if (newApplicationErrors[name]) {
      setNewApplicationErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [newApplicationErrors]);

  // Optimized: Run duplicate validation only on blur (not on every keystroke)
  const validateApplicationConflicts = useCallback((fieldName, formData) => {
    if (!['jobTitle', 'company', 'jobId'].includes(fieldName)) return;

    const jobTitleCheck = formData.jobTitle ? formData.jobTitle.trim().toLowerCase() : '';
    const companyCheck = formData.company ? formData.company.trim().toLowerCase() : '';
    const jobIdCheck = formData.jobId ? formData.jobId.trim().toLowerCase() : '';

    let newErrors = { ...newApplicationErrors };

    // Clear errors first to re-eval
    if (fieldName === 'jobTitle') delete newErrors.jobTitle;
    if (fieldName === 'company') delete newErrors.company;
    if (fieldName === 'jobId') delete newErrors.jobId;

    if (selectedClient?.jobApplications) {
      let isDuplicate = false;

      // Check 1: Job Title + Company - exact match with normalized comparison
      if (jobTitleCheck && companyCheck) {
        const existingTitleCompany = selectedClient.jobApplications.find(app =>
          app.jobTitle && app.jobTitle.trim().toLowerCase() === jobTitleCheck &&
          app.company && app.company.trim().toLowerCase() === companyCheck
        );

        if (existingTitleCompany) {
          newErrors.jobTitle = 'You have already applied the job.';
          newErrors.company = 'You have already applied the job.';
          isDuplicate = true;
        }
      }

      // Check 2: Job Title + Company + Job ID - exact match with normalized comparison
      if (jobIdCheck && jobTitleCheck && companyCheck) {
        const existingAll = selectedClient.jobApplications.find(app =>
          app.jobId && app.jobId.trim().toLowerCase() === jobIdCheck &&
          app.company && app.company.trim().toLowerCase() === companyCheck &&
          app.jobTitle && app.jobTitle.trim().toLowerCase() === jobTitleCheck
        );

        if (existingAll) {
          newErrors.jobId = 'You have already applied the job.';
          isDuplicate = true;
        }
      }

      if (!isDuplicate) {
        if (companyCheck && jobTitleCheck) {
          delete newErrors.jobTitle;
          delete newErrors.company;
        }
      }
    }
    setNewApplicationErrors(newErrors);
  }, [newApplicationErrors, selectedClient]);

  const handleSaveNewApplication = async () => {
    if (!selectedClient) return;

    // Validation for Step 2 fields
    const mandatoryFieldsStep2 = ['jobBoards', 'jobDescriptionUrl', 'jobType'];
    const errors = {};
    let hasError = false;

    mandatoryFieldsStep2.forEach(field => {
      if (!newApplicationFormData[field] || newApplicationFormData[field].trim() === '') {
        errors[field] = 'This field is mandatory.';
        hasError = true;
      }
    });

    setNewApplicationErrors(errors);

    // Stop submission if there are errors in Step 2
    if (hasError) {
      triggerNotification("Please fill in all mandatory fields for the final step.");
      return;
    }

    setIsSubmittingApplication(true);
    const newApp = {
      id: Date.now(),
      ...newApplicationFormData,
      status: 'Applied',
      appliedDate: getLocalDateString(),
      timestamp: new Date().toISOString(),
      employeeName: employeeName,
      attachments: []
    };

    const registrationRef = ref(database, `clients/${selectedClient.clientFirebaseKey}/serviceRegistrations/${selectedClient.registrationKey}/jobApplications`);
    try {
      // CRITICAL FIX: Fetch the latest jobApplications from Firebase to catch concurrent duplicates
      const latestSnapshot = await get(registrationRef);
      const latestApplications = latestSnapshot.exists()
        ? (Array.isArray(latestSnapshot.val()) ? latestSnapshot.val() : Object.values(latestSnapshot.val() || {}))
        : [];

      // Perform final duplicate check against FRESH data from Firebase
      const jobTitleNorm = newApp.jobTitle ? newApp.jobTitle.trim().toLowerCase() : '';
      const companyNorm = newApp.company ? newApp.company.trim().toLowerCase() : '';
      const jobIdNorm = newApp.jobId ? newApp.jobId.trim().toLowerCase() : '';

      // Check for duplicates in the fresh data
      const isDuplicate = latestApplications.some(app => {
        const existingJobTitle = app.jobTitle ? app.jobTitle.trim().toLowerCase() : '';
        const existingCompany = app.company ? app.company.trim().toLowerCase() : '';
        const existingJobId = app.jobId ? app.jobId.trim().toLowerCase() : '';

        // Check Job Title + Company match
        if (jobTitleNorm && companyNorm && existingJobTitle === jobTitleNorm && existingCompany === companyNorm) {
          return true;
        }

        // Check Job Title + Company + Job ID match
        if (jobIdNorm && jobTitleNorm && companyNorm &&
          existingJobId === jobIdNorm && existingJobTitle === jobTitleNorm && existingCompany === companyNorm) {
          return true;
        }

        return false;
      });

      if (isDuplicate) {
        triggerNotification("You have already applied for this job. Duplicate application rejected.");
        setIsSubmittingApplication(false);
        return;
      }

      const updatedApplications = [newApp, ...latestApplications];
      await set(registrationRef, updatedApplications);

      const updatedClient = { ...selectedClient, jobApplications: updatedApplications };
      setSelectedClient(updatedClient);
      const updateClientList = (prevClients) => prevClients.map(c => c.registrationKey === updatedClient.registrationKey ? updatedClient : c);
      setActiveClients(updateClientList);
      setInactiveClients(updateClientList);
      setNewClients(updateClientList);
      setShowAddApplicationModal(false);
      setNewApplicationFormData({
        jobTitle: '', company: '', jobType: '', jobBoards: '', jobDescriptionUrl: '', location: '', jobId: '', role: ''
      });
      setCurrentModalStep(1); // Reset step after successful save
      updateLocalClientCache(selectedClient.clientFirebaseKey, selectedClient.registrationKey, 'jobApplications', updatedApplications);
      triggerNotification("Application added successfully!");
    } catch (error) {
      console.error("Failed to save new application:", error);
      alert("Error saving application. Please try again.");
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const handleViewApplication = (application) => {
    setViewedApplication(application);
    setShowViewApplicationModal(true);
  };

  const handleEditApplication = (application) => {
    setEditedApplicationFormData({ ...application, attachments: application.attachments || [] });
    setShowEditApplicationModal(true);
  };

  const handleEditedApplicationFormChange = (e) => {
    const { name, value } = e.target;
    setEditedApplicationFormData(prev => ({ ...prev, [name]: value }));
  };

  // EmployeeData.jsx

  const handleSaveEditedApplication = async () => {
    if (!editedApplicationFormData || !selectedClient) return;
    setIsSavingChanges(true);
    try {
      const applicationDataToSave = { ...editedApplicationFormData };
      const attachmentsToSave = [];
      let hasNewUploads = false;
      let filesToAddToClient = [];

      for (const attachment of applicationDataToSave.attachments || []) {
        if (attachment.file && !attachment.downloadUrl) {
          hasNewUploads = true;
          const { clientFirebaseKey, registrationKey } = selectedClient;
          const appId = applicationDataToSave.id;
          const fileName = `${Date.now()}_${attachment.file.name}`;
          const attachmentRef = storageRef(getStorage(), `application_attachments/${clientFirebaseKey}/${registrationKey}/${appId}/${fileName}`);
          const uploadResult = await uploadBytes(attachmentRef, attachment.file);
          const downloadURL = await getDownloadURL(uploadResult.ref);
          const newFileMetadata = {
            name: attachment.name,
            size: attachment.size,
            type: attachment.type,
            uploadDate: getLocalDateString(), // FIX: Use local date string
            timestamp: new Date().toISOString(),
            downloadUrl: downloadURL,
            id: Date.now() + Math.random(),
          };
          attachmentsToSave.push(newFileMetadata);
          filesToAddToClient.push({ ...newFileMetadata, jobDesc: `Screenshot for application: ${applicationDataToSave.jobTitle} at ${applicationDataToSave.company}` });
        } else {
          attachmentsToSave.push(attachment);
        }
      }
      if (hasNewUploads) {
        triggerNotification("Uploading attachments...");
      }
      applicationDataToSave.attachments = attachmentsToSave;
      const updatedApplications = (selectedClient.jobApplications || []).map(app => app.id === applicationDataToSave.id ? applicationDataToSave : app);
      const registrationRef = ref(database, `clients/${selectedClient.clientFirebaseKey}/serviceRegistrations/${selectedClient.registrationKey}`);
      const currentFiles = selectedClient.files || [];
      const updatedFiles = [...filesToAddToClient, ...currentFiles];

      await update(registrationRef, { jobApplications: updatedApplications, files: updatedFiles, });
      updateLocalClientCache(selectedClient.clientFirebaseKey, selectedClient.registrationKey, 'jobApplications', updatedApplications);
      updateLocalClientCache(selectedClient.clientFirebaseKey, selectedClient.registrationKey, 'files', updatedFiles); const updatedClient = { ...selectedClient, jobApplications: updatedApplications, files: updatedFiles, };
      setSelectedClient(updatedClient);
      const updateClientLists = (prevClients) => { return prevClients.map(c => c.registrationKey === updatedClient.registrationKey ? updatedClient : c); };
      setActiveClients(updateClientLists);
      setInactiveClients(updateClientLists);
      setNewClients(updateClientLists);
      setShowEditApplicationModal(false);
      triggerNotification("Application updated successfully!");
    } catch (error) {
      console.error("Failed to save edited application or upload file:", error);
      alert("Error saving application. Please try again.");
    } finally {
      setIsSavingChanges(false);
    }
  };



  // In EmployeeData.jsx, find the handlePasteAttachment function and replace it with this:
  const handlePasteAttachment = useCallback((event) => {
    // Check if either the edit or upload modal is the active context
    if (!showEditApplicationModal && !showUploadFileModal) return;

    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    let pastedFiles = [];

    for (const item of items) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        const newFileObject = {
          name: `Pasted Screenshot ${Date.now()}.${file.type.split('/')[1] || 'png'}`,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: 'interview screenshot',
          uploadDate: new Date().toISOString().split('T')[0],
          file: file,
          id: Date.now() + Math.random(), // Add a unique ID for the new file
        };
        pastedFiles.push(newFileObject);
      }
    }

    if (pastedFiles.length > 0) {
      if (showEditApplicationModal) {
        setEditedApplicationFormData(prev => ({
          ...prev,
          attachments: [...(prev.attachments || []), ...pastedFiles],
        }));
      } else if (showUploadFileModal) {
        // FIX: Add pasted files to the newFilesToUpload state
        setNewFilesToUpload(prev => [...prev, ...pastedFiles]);
      }
      triggerNotification(`${pastedFiles.length} file(s) pasted successfully!`);
    }
  }, [showEditApplicationModal, showUploadFileModal]); // Add showUploadFileModal as a dependency

  // This useEffect adds and removes the paste event listener
  useEffect(() => {
    window.addEventListener('paste', handlePasteAttachment);

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      window.removeEventListener('paste', handlePasteAttachment);
    };
  }, [handlePasteAttachment]);

  // Use this to open the confirmation modal for a specific application
  const handleDeleteApplication = (app) => {
    // We need the parent client as well – that's the currently selected client
    if (!selectedClient) return;

    // This will set applicationToDelete and open the confirmation modal
    handleRequestDeleteApplication(selectedClient, app);
  };


  // Function to filter and sort job applications
  const getFilteredAndSortedApplications = (applications) => {
    const todayFormatted = getLocalDateString();
    let filtered = applications || [];

    // Client filter (NEW) - This filter is now handled by passing the specific client's applications
    // if (selectedClient) {
    //   filtered = filtered.filter(app => app.clientId === selectedClient.id);
    // }

    filtered = filtered.filter(app => {
      // Search term filter
      const matchesSearch = searchTerm
        ? Object.values(app).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
        : true;

      // Status filter
      const matchesStatus = statusFilter === 'All Statuses' || app.status === statusFilter;

      let matchesDateRange = false;
      const start = filterDateRange.startDate;
      const end = filterDateRange.endDate;

      if (searchTerm) {
        // CASE 1: Search term is active — search across ALL dates
        matchesDateRange = true;
      } else if (start || end) {
        // CASE 2: Date range filter is active (show applications within the custom range)
        const appDate = new Date(app.appliedDate);
        const startDate = start ? new Date(start) : null;
        const endDate = end ? new Date(end) : null;

        if (startDate) startDate.setHours(0, 0, 0, 0);
        if (endDate) endDate.setHours(23, 59, 59, 999);

        matchesDateRange =
          (!startDate || appDate >= startDate) &&
          (!endDate || appDate <= endDate);

      } else {
        // CASE 3: No search and no date range — default to showing ONLY TODAY's applications
        matchesDateRange = app.appliedDate === todayFormatted;
      }

      return matchesSearch && matchesStatus && matchesDateRange;
    });

    // Sort order (remains the same)
    filtered.sort((a, b) => {
      const dateA = new Date(a.appliedDate);
      const dateB = new Date(b.appliedDate);

      switch (sortOrder) {
        case 'Newest First':
          return dateB - dateA;
        case 'Oldest First':
          return dateA - dateB;
        case 'Job Title A-Z':
          return a.jobTitle.localeCompare(b.jobTitle);
        case 'Company A-Z':
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // --- Files Tab Functions ---
  const handleOpenUploadFileModal = (client) => {
    setSelectedClientForFile(client);
    setNewFileFormData({
      clientId: '', fileType: '', fileName: '', jobDesc: ''
    });
    setShowUploadFileModal(true);
  };

  const handleNewFileFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'fileName' && files && files[0]) {
      // Store the actual file object for uploading
      setFileToUpload(files[0]);
      // Update the form data with the file's name for display
      setNewFileFormData(prev => ({ ...prev, fileName: files[0].name }));
    } else {
      setNewFileFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleOpenClientSelectModal = () => setIsClientSelectModalOpen(true);
  const handleCloseClientSelectModal = () => setIsClientSelectModalOpen(false);
  const handleSelectClientFromModal = (client) => {
    setSelectedClient(client);
    handleCloseClientSelectModal();
  };

  // In EmployeeData.jsx, replace the existing handleSaveNewFile function

  // In EmployeeData.jsx, find and replace the existing handleSaveNewFile function
  const handleSaveNewFile = async () => {
    if (!selectedClientForFile || !newFileFormData.fileType || newFilesToUpload.length === 0) {
      alert('Please select a client, file type, and at least one file to upload.');
      return;
    }

    setIsUploading(true);
    const { clientFirebaseKey, registrationKey } = selectedClientForFile;
    const uploadedFilesMetadata = [];

    try {
      triggerNotification("Uploading file(s), please wait...");

      // FIX: Loop through the newFilesToUpload array instead of a single file
      for (const file of newFilesToUpload) {
        const storagePath = `client_files/${clientFirebaseKey}/${registrationKey}/${Date.now()}_${file.name}`;
        const fileRef = storageRef(getStorage(), storagePath);
        await uploadBytes(fileRef, file.file); // Use the File object inside the metadata object
        const downloadURL = await getDownloadURL(fileRef);

        const newFileMetadata = {
          id: Date.now() + Math.random(),
          downloadUrl: downloadURL,
          name: file.name,
          size: file.size,
          type: newFileFormData.fileType,
          uploadDate: getLocalDateTimeString(),
          timestamp: new Date().toISOString(),
          notes: newFileFormData.notes || '',
        };
        uploadedFilesMetadata.push(newFileMetadata);
      }

      const filesRef = ref(database, `clients/${clientFirebaseKey}/serviceRegistrations/${registrationKey}/files`);
      const existingFiles = selectedClientForFile.files || [];
      const updatedFiles = [...uploadedFilesMetadata, ...existingFiles];

      await set(filesRef, updatedFiles);

      const updatedClient = {
        ...selectedClientForFile,
        files: updatedFiles,
      };

      setSelectedClient(updatedClient);
      const updateClientList = (prevClients) => {
        return prevClients.map(c =>
          c.registrationKey === updatedClient.registrationKey ? updatedClient : c
        );
      };
      setActiveClients(updateClientList);
      setInactiveClients(updateClientList);
      setNewClients(updateClientList);

      setShowUploadFileModal(false);
      setNewFilesToUpload([]); // FIX: Reset the files array
      setNewFileFormData({ fileType: '', fileName: '', notes: '' }); // Reset form data
      updateLocalClientCache(selectedClientForFile.clientFirebaseKey, selectedClientForFile.registrationKey, 'files', updatedFiles);
      triggerNotification("File(s) uploaded successfully!");

    } catch (error) {
      console.error("Error uploading file(s):", error);
      alert("File upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewFile = (file) => {
    if (file.downloadUrl) {
      // Open the file's download URL in a new tab
      window.open(file.downloadUrl, "_blank", "noopener,noreferrer");
    } else {
      // Handle files that don't have a download URL yet (e.g., local files)
      alert("File URL is not available. Please upload it first.");
    }
  };

  const handleEditFile = (file) => {
    // Find the client associated with this file
    const client = [...activeClients, ...inactiveClients].find(c => c.files.some(fileItem => fileItem.id === file.id));
    setSelectedClientForFile(client); // Set this for context in save
    setEditedFileFormData({ ...file });
    setShowEditFileModal(true);
  };

  const handleEditedFileFormChange = (e) => {
    const { name, value } = e.target;
    setEditedFileFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEditedFile = () => {
    if (!editedFileFormData || !selectedClientForFile) return;

    const updateClientList = (prevClients) => {
      return prevClients.map(client =>
        client.id === selectedClientForFile.id
          ? {
            ...client,
            files: client.files.map(file =>
              file.id === editedFileFormData.id ? editedFileFormData : file
            ),
          }
          : client
      );
    };

    if (selectedClientForFile.status === 'active') {
      setActiveClients(updateClientList);
    } else if (selectedClientForFile.status === 'inactive') {
      setInactiveClients(updateClientList);
    }

    // Update selectedClient to reference the newly updated client object
    setSelectedClient(prevSelected => {
      const updatedClient = updateClientList([prevSelected]).find(c => c.id === prevSelected.id);
      return updatedClient || prevSelected;
    });

    setShowEditFileModal(false);
    setEditedFileFormData(null);
    setSelectedClientForFile(null);
    triggerNotification("File updated successfully!"); // Trigger notification
  };


  const openDeleteConfirmModal = (client, file) => {
    setFileToDelete({ client, file });
    setShowDeleteConfirmModal(true);
  };

  // 2. New function to handle the actual deletion after confirmation
  const confirmDeleteFile = () => {
    if (!fileToDelete) return;

    const { client, file } = fileToDelete;

    const updateClientList = (prevClients) => {
      return prevClients.map(c =>
        c.id === client.id
          ? {
            ...c,
            files: c.files.filter(f => f.id !== file.id),
          }
          : c
      );
    };

    if (client.status === 'active') {
      setActiveClients(updateClientList);
    } else if (client.status === 'inactive') {
      setInactiveClients(updateClientList);
    }

    setSelectedClient(prevSelected => {
      if (prevSelected && prevSelected.id === client.id) {
        return updateClientList([prevSelected])[0] || null;
      }
      return prevSelected;
    });

    triggerNotification("File deleted successfully!");
    closeDeleteConfirmModal(); // Close modal after deleting
  };

  // 3. New helper function to close the modal and reset state
  const closeDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(false);
    setFileToDelete(null);
  };

  const getFilteredAndSortedFiles = (files) => {
    let filtered = files || [];

    // Client filter (NEW) - This filter is now handled by passing the specific client's files
    // if (selectedClient) {
    //   filtered = filtered.filter(file => file.clientId === selectedClient.id);
    // }

    filtered = filtered.filter(file => {
      const matchesSearch = searchTerm
        ? Object.values(file).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
        : true;

      const matchesFileType = fileTypeFilter === 'All File Types' || file.type === fileTypeFilter;

      const fileDate = new Date(file.uploadDate);
      const start = filterDateRange.startDate ? new Date(filterDateRange.startDate) : null;
      const end = filterDateRange.endDate ? new Date(filterDateRange.endDate) : null;

      const matchesDateRange = (!start || fileDate >= start) && (!end || fileDate <= end);

      return matchesSearch && matchesFileType && matchesDateRange;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(a.uploadDate);
      const dateB = new Date(b.uploadDate);

      switch (sortOrder) {
        case 'Newest First':
          return dateB - dateA;
        case 'Oldest First':
          return dateA - dateB;
        case 'File Name A-Z':
          return a.name.localeCompare(b.name);
        case 'File Size (Asc)':
          return parseFloat(a.size) - parseFloat(b.size); // Assuming size is "X KB" or "Y MB"
        case 'File Size (Desc)':
          return parseFloat(b.size) - parseFloat(a.size);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // --- Activity Tab Functions ---
  const getFilteredAndSortedActivities = (activities) => {
    let filtered = activities;

    // Client filter (NEW) - This filter is now handled by passing the specific client's activities
    // if (selectedClient) {
    //   filtered = filtered.filter(activity => activity.clientId === selectedClient.id);
    // }

    filtered = filtered.filter(activity => {
      const matchesSearch = searchTerm
        ? Object.values(activity).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
        : true;

      const matchesActivityType = activityTypeFilter === 'All Activities' || activity.type === activityTypeFilter;

      const activityDate = new Date(activity.date);
      const start = filterDateRange.startDate ? new Date(filterDateRange.startDate) : null;
      const end = filterDateRange.endDate ? new Date(filterDateRange.endDate) : null;

      const matchesDateRange = (!start || activityDate >= start) && (!end || activityDate <= end);

      return matchesSearch && matchesActivityType && matchesDateRange;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);

      switch (sortOrder) {
        case 'Newest First':
          return dateB - dateA;
        case 'Oldest First':
          return dateA - dateB;
        case 'Activity Type A-Z':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredActivities = useMemo(() => {
    return getFilteredAndSortedActivities(allActivities);
  }, [allActivities, searchTerm, activityTypeFilter, filterDateRange, sortOrder]);

  // In EmployeeData.jsx (around line 980)

  const handleAcceptClient = async (clientToAccept) => {
    // Ensure the client has the necessary keys
    const { clientFirebaseKey, registrationKey } = clientToAccept;

    if (!clientFirebaseKey || !registrationKey) {
      alert("Error: Missing client keys for acceptance.");
      return;
    }

    const registrationRef = ref(database, `clients/${clientFirebaseKey}/serviceRegistrations/${registrationKey}`);

    // Create the updated client object for local state (must be done before Firebase update)
    const updatedClient = {
      ...clientToAccept,
      assignmentStatus: 'active', // The new status
    };

    try {
      // 1. Update status in Firebase Realtime Database
      await update(registrationRef, { assignmentStatus: 'active' });

      // 2. Update the local IndexedDB cache immediately (crucial for cost/performance)
      await updateLocalClientCache(
        clientFirebaseKey,
        registrationKey,
        'assignmentStatus',
        'active'
      );

      // 3. Update local state arrays for immediate UI refresh
      setNewClients(prev =>
        prev.filter(c => c.registrationKey !== registrationKey) // Remove from New Clients
      );

      setActiveClients(prev =>
        // Add the new client to Active Clients (ensuring no duplicates, though unlikely here)
        [...prev.filter(c => c.registrationKey !== registrationKey), updatedClient]
      );

      // No need to update inactiveClients as they were not inactive before

      // 4. Set the newly accepted client as the selected one (optional, for convenience)
      setSelectedClient(updatedClient);

      // 5. Provide feedback
      triggerNotification(`Client ${clientToAccept.name} has been moved to Active Clients!`);

      // OPTIONAL: Switch tab to Active Clients immediately
      setActiveTab('Active Clients');

    } catch (error) {
      console.error("Failed to accept client:", error);
      alert("Error accepting client. Please check your network connection or Firebase rules.");
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return { date: 'N/A', time: 'N/A' };
    try {
      const date = new Date(timestamp);
      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

      const formattedDate = date.toLocaleDateString('en-US', dateOptions);
      const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

      return { date: formattedDate, time: formattedTime };
    } catch (e) {
      console.error("Error formatting timestamp:", e);
      return { date: 'Invalid Date', time: 'N/A' };
    }
  };

  // ... inside the EmployeeData component, before the return statement ...

  // Apply all filters to the relevant base set of applications
  const filteredApplicationsForDisplay = useMemo(() => {
    // --- FIX: Add a safety check ---
    // If no client is selected, return an empty array immediately.
    if (!selectedClient) {
      return [];
    }

    // The rest of the logic runs only if a client is selected.
    let baseApps = selectedClient.jobApplications || [];

    return baseApps.filter(app => {
      const matchesWebsite = filterWebsites.length === 0 || filterWebsites.includes(app.website);
      const matchesPosition = filterPositions.length === 0 || filterPositions.includes(app.position);
      const matchesCompany = filterCompanies.length === 0 || filterCompanies.includes(app.company);

      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearchTerm =
        searchTerm === '' ||
        (app.website && app.website.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (app.position && app.position.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (app.company && app.company.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (app.jobDescription && app.jobDescription.toLowerCase().includes(lowerCaseSearchTerm));

      let matchesDateRange = true;
      if (startDateFilter || endDateFilter) {
        const appDate = new Date(convertDDMMYYYYtoYYYYMMDD(app.dateAdded));
        appDate.setHours(0, 0, 0, 0);

        const start = startDateFilter ? new Date(convertDDMMYYYYtoYYYYMMDD(startDateFilter)) : null;
        const end = endDateFilter ? new Date(convertDDMMYYYYtoYYYYMMDD(endDateFilter)) : null;

        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        matchesDateRange =
          (!start || appDate >= start) &&
          (!end || appDate <= end);
      }

      return matchesWebsite && matchesPosition && matchesCompany && matchesSearchTerm && matchesDateRange;
    });
  }, [selectedClient, filterWebsites, filterPositions, filterCompanies, searchTerm, startDateFilter, endDateFilter]);

  useEffect(() => {
    const clientsForTab = activeTab === 'Active Clients' ? activeClients : inactiveClients;
    // Check if a client is already selected and if that client is still in the list
    const currentClientInList = clientsForTab.find(
      c => c.registrationKey === (selectedClient ? selectedClient.registrationKey : null)
    );

    // If the currently selected client is no longer in the list for the current tab,
    // or if no client is selected, select the first one.
    if (!currentClientInList) {
      if (activeTab === 'New Clients' && newClients.length > 0) {
        setSelectedClient(newClients[0]);
      } else if (activeTab === 'Active Clients' && activeClients.length > 0) {
        setSelectedClient(activeClients[0]);
      } else if (activeTab === 'Inactive Clients' && inactiveClients.length > 0) {
        setSelectedClient(inactiveClients[0]);
      } else {
        setSelectedClient(null);
      }
    }
  }, [activeTab, newClients, activeClients, inactiveClients]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveSubTab('Applications');
    setSelectedClient(null); // Explicitly clear the selected client
  };

  const normalizeDate = (dateString) => {
    return dateString;
  };

  const downloadApplicationsData = () => {
    // *** Use the filters from the filterDateRange object ***
    const startFilter = filterDateRange.startDate;
    const endFilter = filterDateRange.endDate;
    // *******************************************************

    if (!selectedClient || !selectedClient.jobApplications || selectedClient.jobApplications.length === 0) {
      alert("No applications available to download for the selected client.");
      return;
    }

    // 1. Filter applications by date range (using appliedDate)
    const filteredApps = selectedClient.jobApplications.filter(app => {
      const appDate = normalizeDate(app.appliedDate);

      // If an app has no date but filters are active, skip it. If filters are empty, we keep it.
      if (!appDate && (startFilter || endFilter)) return false;

      let isWithinDateRange = true;

      // If both filters are empty, isWithinDateRange remains true, including all apps.
      if (startFilter && appDate < normalizeDate(startFilter)) {
        isWithinDateRange = false;
      }

      if (endFilter && appDate > normalizeDate(endFilter)) {
        isWithinDateRange = false;
      }

      return isWithinDateRange;
    });

    if (filteredApps.length === 0) {
      alert("No applications found in the selected date range.");
      return;
    }

    // 2. Prepare data for export with Serial Numbers (S.No.)
    const dataForExport = filteredApps.map((app, index) => ({
      'S.No.': index + 1, // Add Serial Number
      'Client Name': `${selectedClient.firstName || ''} ${selectedClient.lastName || ''}`.trim(),
      'Client Email': selectedClient.email || '-',
      'Job Title': app.jobTitle || '-',
      'Company': app.company || '-',
      'Employment Type': app.employment || '-',
      'Job Boards': app.jobBoards || '-',
      'Applied Date': app.appliedDate || '-',
      'Status': app.status || '-',
      'Job ID': app.jobId || '-',
      'Job Description URL': app.jobDescriptionUrl || '-',
      'Attachments Count': app.attachments?.length || 0,
    }));

    // 3. Export using XLSX (Requires utils and writeFile from 'xlsx' import)
    const ws = utils.json_to_sheet(dataForExport);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Applications");

    const clientName = `${selectedClient.firstName || ''}_${selectedClient.lastName || ''}`.trim().replace(/\s/g, '_');
    const fileName = `Applications_${clientName}_${startFilter || 'All'}_to_${endFilter || 'All'}.xlsx`;

    writeFile(wb, fileName);
  };


  // Inside EmployeeData component

  const getManagerNames = useCallback((ids = []) => {
    return ids.map(id => {
      const manager = managersAndAdmins.find(m => m.id === id);
      return manager ? `${manager.name} (${manager.role})` : 'Unknown User';
    }).join(', ');
  }, [managersAndAdmins]);

  const handleLeaveFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'applyTo') {
      const targetId = value;
      setLeaveFormData(prev => ({
        ...prev,
        applyTo: checked
          ? [...prev.applyTo, targetId]
          : prev.applyTo.filter(id => id !== targetId),
      }));
    } else {
      setLeaveFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleOpenLeaveModal = (request = null) => {
    if (request) {
      // Edit mode
      setLeaveRequestToEdit(request);
      setLeaveFormData({
        applyTo: request.applyTo || [],
        fromDate: request.fromDate || '',
        toDate: request.toDate || '',
        leaveType: request.leaveType || '',
        reason: request.reason || '',
      });
    } else {
      // New mode
      setLeaveRequestToEdit(null);
      setLeaveFormData({
        applyTo: [],
        fromDate: '',
        toDate: '',
        leaveType: '',
        reason: '',
      });
    }
    setShowLeaveModal(true);
  };

  const handleCloseLeaveModal = () => {
    setShowLeaveModal(false);
    setLeaveRequestToEdit(null);
    // Reset form data on close
    setLeaveFormData({
      applyTo: [],
      fromDate: '',
      toDate: '',
      reason: '',
    });
  };

  const handleRequestDeleteLeave = (request) => {
    setLeaveRequestToDelete(request);
    setShowDeleteLeaveModal(true);
  };

  // Inside EmployeeData.jsx, replace your existing handleConfirmDeleteLeave function with this:
  const handleConfirmDeleteLeave = async () => {
    if (!leaveRequestToDelete) return;

    setIsDeleting(true);
    const leaveId = leaveRequestToDelete.id;

    try {
      // Corrected path: Include 'users/' prefix
      const leaveRef = ref(database, `leave_requests/${leaveId}`);
      await remove(leaveRef);


      triggerNotification("Leave request deleted successfully!");
    } catch (error) {
      console.error("Failed to delete leave request:", error);
      alert("Error deleting leave request. Please try again.");
    } finally {
      setShowDeleteLeaveModal(false);
      setLeaveRequestToDelete(null);
      setIsDeleting(false);
    }
  };


  // Inside EmployeeData.jsx, replace your existing handleSubmiOrEditLeave function with this:
  const handleSubmiOrEditLeave = async (e) => {
    e.preventDefault();
    setIsSubmittingLeave(true);

    const loggedInUserData = JSON.parse(sessionStorage.getItem('loggedInEmployee'));
    if (!loggedInUserData || !loggedInUserData.firebaseKey) {
      triggerNotification("Session expired. Please log in again.");
      setIsSubmittingLeave(false);
      return;
    }

    const employeeFirebaseKey = loggedInUserData.firebaseKey;
    const { fromDate, toDate, jobType } = leaveFormData;

    // Calculate leave days
    const leaveDays = calculateLeaveDays(fromDate, toDate);
    if (leaveDays <= 0) {
      triggerNotification("Please select a valid date range for your leave.");
      setIsSubmittingLeave(false);
      return;
    }

    // 🔒 Prevent duplicate casual leaves in same month
    if (jobType === 'Casual leave') {
      const isDuplicate = hasExistingCasualLeaveInMonth(fromDate, toDate, leaveRequestToEdit?.id);
      if (isDuplicate) {
        triggerNotification("You can only take one Casual Leave per month.");
        setIsSubmittingLeave(false);
        return;
      }
    }

    const employeeName = `${loggedInUserData.firstName || ''} ${loggedInUserData.lastName || ''}`.trim() || loggedInUserData.name;

    const leaveRequestData = {
      applyTo: leaveFormData.applyTo,
      subject: leaveFormData.subject,
      fromDate,
      toDate,
      jobType,
      description: leaveFormData.description,
      status: 'Pending',
      requestedDate: new Date().toISOString(),
      employeeFirebaseKey,
      employeeName,
      leaveDays,
      clientIds: loggedInUserData.assignedClients || [] // Important: which clients this employee serves
    };

    try {
      let newRequestId = null;

      if (leaveRequestToEdit) {
        // Update existing
        const refPath = ref(database, `leave_requests/${leaveRequestToEdit.id}`);
        await update(refPath, leaveRequestData);
        newRequestId = leaveRequestToEdit.id;
        triggerNotification("Leave request updated successfully!");
      } else {
        // Create new
        const refPath = ref(database, 'leave_requests');
        const newRef = push(refPath);
        await set(newRef, { id: newRef.key, ...leaveRequestData });
        newRequestId = newRef.key;
        triggerNotification("Leave request submitted successfully!");
      }

      // Manually update local state immediately
      setLeaveRequests(prev => {
        const filtered = prev.filter(r => r.id !== newRequestId);
        return [{ id: newRequestId, ...leaveRequestData }, ...filtered];
      });

      handleCloseLeaveModal();

    } catch (error) {
      console.error("Error saving leave request:", error);
      triggerNotification("Failed to submit leave request. Please try again.");
    } finally {
      setIsSubmittingLeave(false);
    }
  };

  // Helper function to calculate the number of days between two dates (inclusive)
  const calculateLeaveDays = (fromDate, toDate) => {
    if (!fromDate || !toDate) return 0;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    // Calculate the time difference in milliseconds
    const timeDiff = end.getTime() - start.getTime();
    // Convert to days (including the start day)
    // Adding 1 ensures both start and end dates are counted
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    return Math.max(0, daysDiff); // Ensure it's not negative
  };

  const hasExistingCasualLeaveInMonth = (fromDate, toDate, currentRequestId = null) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);

    // Get year and month of the leave period
    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();

    // If range spans multiple months, we need to check both
    const monthsToCheck = new Set();
    monthsToCheck.add(`${startYear}-${startMonth}`);
    if (startYear !== endYear || startMonth !== endMonth) {
      monthsToCheck.add(`${endYear}-${endMonth}`);
    }

    return leaveRequests.some(req => {
      // Skip self when editing
      if (req.id === currentRequestId) return false;

      // Only check casual leaves
      if (req.leaveType !== 'Casual leave') return false;

      const reqStart = new Date(req.fromDate);
      const reqYear = reqStart.getFullYear();
      const reqMonth = reqStart.getMonth();

      const reqMonthKey = `${reqYear}-${reqMonth}`;
      return monthsToCheck.has(reqMonthKey);
    });
  };


  const filteredLeaveRequests = useMemo(() => {
    // Use leaveRequests or an empty array if not defined
    const requestsToFilter = leaveRequests || [];

    return requestsToFilter.filter(request => {
      // 1. Filter by Search Query (Reason, Leave Type)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchLower === '' ||
        request.reason.toLowerCase().includes(searchLower) ||
        request.leaveType.toLowerCase().includes(searchLower);

      // 2. Filter by Date Range
      const requestStartDate = new Date(request.fromDate);
      const requestEndDate = new Date(request.toDate);

      const filterStart = filterFromDate ? new Date(filterFromDate) : null;
      const filterEnd = filterToDate ? new Date(filterToDate) : null;

      let matchesDateRange = true;

      // Check if the request's start date is on or after the filter's start date
      if (filterStart) {
        // Set time to midnight for accurate date comparison
        filterStart.setHours(0, 0, 0, 0);
        requestStartDate.setHours(0, 0, 0, 0);
        matchesDateRange = matchesDateRange && (requestStartDate >= filterStart);
      }

      // Check if the request's end date is on or before the filter's end date
      if (filterEnd) {
        filterEnd.setHours(0, 0, 0, 0);
        requestEndDate.setHours(0, 0, 0, 0);
        matchesDateRange = matchesDateRange && (requestEndDate <= filterEnd);
      }

      return matchesSearch && matchesDateRange;
    }).sort((a, b) => new Date(b.requestedDate) - new Date(a.requestedDate)); // Keep sorting by newest first
  }, [leaveRequests, searchQuery, filterFromDate, filterToDate]);

  // --- Applications pagination (page size = 5) ---
  const APPLICATIONS_PAGE_SIZE = 5;
  const [applicationsPage, setApplicationsPage] = useState(0);

  // All filtered + sorted apps for the selected client
  const allFilteredApplications = useMemo(() => {
    if (!selectedClient) return [];
    // reuse the existing filter/sort function so behaviour stays same
    return getFilteredAndSortedApplications(selectedClient.jobApplications || []);
  }, [selectedClient, searchTerm, statusFilter, filterDateRange, sortOrder]);

  const applicationsByDate = useMemo(() => {
    const grouped = {};
    allFilteredApplications.forEach(app => {
      const dateKey = app.appliedDate || 'Unknown Date';
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(app);
    });
    return Object.keys(grouped)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(dateKey => ({ dateKey, applications: grouped[dateKey] }));
  }, [allFilteredApplications]);

  const totalApplicationPages = Math.max(
    1,
    Math.ceil(allFilteredApplications.length / APPLICATIONS_PAGE_SIZE)
  );

  // Apps for the current page only
  const paginatedApplications = useMemo(() => {
    const start = applicationsPage * APPLICATIONS_PAGE_SIZE;
    const end = start + APPLICATIONS_PAGE_SIZE;
    return allFilteredApplications.slice(start, end);
  }, [allFilteredApplications, applicationsPage]);

  // Reset to first page whenever client or filters/search change
  useEffect(() => {
    setApplicationsPage(0);
  }, [
    selectedClient,
    searchTerm,
    statusFilter,
    filterDateRange.startDate,
    filterDateRange.endDate,
    sortOrder,
  ]);

  const handleNextApplicationsPage = () => {
    setApplicationsPage(prev =>
      prev + 1 < totalApplicationPages ? prev + 1 : prev
    );
  };

  const handlePrevApplicationsPage = () => {
    setApplicationsPage(prev => (prev > 0 ? prev - 1 : 0));
  };



  
  const allProps = { handleOpenAddApplicationModal, handleRequestDeleteApplication, handleConfirmDeleteApplication, handleRequestDeleteFile, handleConfirmDeleteFile, handleNotificationIconClick, handleOpenProfileModal, handleProfileFormChange, handleSaveProfileChanges, handleCancelEditProfile, handleLogout, handleSearchChange, handleFromDateChange, handleToDateChange, handleResumeFileChange, handleSaveNewResume, handleNextStep, handleEditedApplicationFormChange, handleSaveEditedApplication, handlePasteAttachment, handleOpenUploadFileModal, handleNewFileFormChange, handleSaveNewFile, handleViewFile, handleEditFile, handleEditedFileFormChange, handleSaveEditedFile, formatDateTime, setImageUrlToView, imageUrlToView, editedApplicationFormData, editedFileFormData, newFileFormData, modalHeaderStyle, modalTitleStyle, modalBodyStyle, modalFormGridStyle, modalFormFieldGroupStyle, modalLabelStyle, modalInputStyle, modalSelectStyle, modalTextareaStyle, modalFooterStyle, modalCancelButtonStyle, modalAddButtonPrimaryStyle, modalViewDetailsGridStyle, modalViewDetailItemStyle, errorTextStyle, applicationStatusBadgeStyle, getApplicationStatusStyle, clientSearchTermInModal, setClientSearchTermInModal, handleSelectClientFromModal, activeTab, searchTerm, sortOrder, statusFilter, activityTypeFilter, filterDateRange, applicationsPage, quickFilter, handleQuickFilterChange, handleClearFilters, areFiltersActive, handleDateRangeChange, setSortOrder, setSearchTerm, setStatusFilter, paginatedApplications, getFilteredAndSortedFiles, newClients, activeClients, inactiveClients, selectedClient, allActivities, filteredActivities, allFilteredApplications, applicationsByDate, totalApplicationPages, showAddApplicationModal, showViewApplicationModal, showEditApplicationModal, showUploadFileModal, showViewFileModal, showEditFileModal, showEmployeeProfileModal, showNotificationModal, isClientSelectModalOpen, showImageViewer, showDeleteFileModal, newApplicationFormData, newApplicationErrors, currentModalStep, isSubmittingApplication, viewedApplication, selectedClientForFile, viewedFile, fileToDelete, notifications, APPLICATIONS_PAGE_SIZE, employeeName, triggerNotification, handleAcceptClient, handleDownloadResume, handleViewApplication, handleEditApplication, handleDeleteApplication, handlePrevApplicationsPage, handleNextApplicationsPage, handleNewApplicationFormChange, validateApplicationConflicts, handleSaveNewApplication, handleCloseClientSelectModal, setShowAddApplicationModal, setShowViewApplicationModal, setShowEditApplicationModal, setShowUploadFileModal, setShowViewFileModal, setShowEditFileModal, setShowEmployeeProfileModal, setShowNotificationModal, setIsClientSelectModalOpen, setShowImageViewer, setShowDeleteFileModal, setCurrentModalStep, setSelectedClient, setViewedApplication, setViewedFile, setFileToDelete, activeSubTab, setActiveSubTab, handleOpenClientSelectModal, applicationsSectionStyle, sectionTitleStyle, subLabelStyle, clientSelectContainerStyle, filterLabelStyle, selectClientButtonStyle, tabsContainerStyle, tabButtonStyle, tabButtonActiveStyle, overviewCardsContainerStyle, cardStyle, cardIconContainerStyle, cardLabelStyle, cardValueStyle, cardSubLabelStyle, clientsGridStyle, clientCardStyle, clientCardHeaderStyle, clientNameStyle, clientCodeStyle, statusBadgeStyle, priorityBadgeStyle, clientDetailStyle, clientCardFooterStyle, footerItemStyle, footerItemLabelStyle, footerItemValueStyle, footerItemIconStyle, viewButtonStyle, activityButtonStyle, clientDataGridStyle, clientDataSectionStyle, clientDataSectionTitleStyle, clientDataDetailStyle, initialsCircleStyle, clientDetailIconStyle, clientApplicationsContainerStyle, clientApplicationsHeaderStyle, clientAppStatsStyle, addApplicationButtonStyle, applicationTableControlsStyle, searchInputStyle, statusFilterSelectStyle, downloadButtonStyle, applicationTableWrapperStyle, applicationTableStyle, applicationTableHeaderCellStyle, applicationTableDataCellStyle, actionButtonAppStyle, actionButtonSecondaryStyle, deleteButtonStyle, filesGridStyle, fileCardStyle, fileCardHeaderStyle, fileIconStyle, fileNameStyle, fileSizeStyle, fileStatusStyle, fileUploadDateStyle, fileNotesStyle, fileActionsStyle, activityTimelineContainerStyle, activityItemStyle, activityIconContainerStyle, initialsCircleSmallStyle, activityContentStyle, activityDescriptionStyle, activityDateStyle, activityBadgeStyle, getActivityBadgeStyle, getActivityStatusStyle, activityStatusBadgeStyle };

return (
    <div style={containerStyle}>
      <AdminHeader
        adminUserName={`${employeeDetails.firstName || ''} ${employeeDetails.lastName || ''}`.trim() || employeeDetails.name}
        adminInitials={adminInitials}
        isDarkMode={theme === 'dark'}
        toggleTheme={toggleTheme}
        toggleSidebar={toggleSidebar}
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
        profileDropdownRef={profileDropdownRef}
        showProfileModal={showEmployeeProfileModal}
        setShowProfileModal={setShowEmployeeProfileModal}
        onNotificationClick={handleNotificationIconClick}
        onLogoClick={() => navigate('/')}
        onLogoutClick={handleLogout}
      />
      {/* Centralized CSS styles for hover effects and animations */}

      {/* Notification Toast */}
      {showNotification && (
        <div className="notification-toast show">
          {notificationMessage}
        </div>
      )}

      {/* Header */}
      <header style={headerContentStyle}> {/* Adjusted style here */}
        <div style={headerTitleStyle}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
            Employee WorkSheet
          </h1>
          <p style={{ fontSize: '1rem', color: '#64748b', margin: '4px 0 0 0' }}>
            Manage job applications and client assignments
          </p>
        </div>
        <div style={tabsContainerStyle}>
          {/* Only top-level tabs here */}
          {['New Clients', 'Active Clients', 'Inactive Clients'].map(tab => (
            <button
              key={tab}
              style={{
                ...tabButtonStyle,
                ...(activeTab === tab ? tabButtonActiveStyle : {})
              }}
              className={activeTab === tab ? 'tab-button active' : 'tab-button'}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* NEW: New Clients Tab Content */}
        {activeTab === 'New Clients' && (
          <NewClientsTab {...allProps} />
        )}

      {/* Active Clients Tab Content */}
        {activeTab === 'Active Clients' && (
          <ActiveClientsTab {...allProps} />
        )}

      {/* NEW: Inactive Clients Tab Content */}
        {activeTab === 'Inactive Clients' && (
          <InactiveClientsTab {...allProps} />
        )}

      {/* Add New Application Modal */}
      {/* Add New Application Modal */}
      {selectedClient && (
        <AddApplicationModal {...allProps} />
      )}

      {/* View Application Details Modal */}
      {viewedApplication && (
        <ViewApplicationModal {...allProps} />
      )}

      {/* Edit Application Details Modal */}
      {editedApplicationFormData && (
        <EditApplicationModal {...allProps} />
      )}

      {/* Upload File Modal */}
      {selectedClientForFile && (
        <UploadFileModal {...allProps} />
      )}

      {viewedFile && (
        <ViewFileModal {...allProps} />
      )}

      {/* Edit File Details Modal */}
      {editedFileFormData && (
        <EditFileModal {...allProps} />
      )}

      {/* Employee Profile Details Modal */}
      {/* Employee Profile Details Modal */}
        <EmployeeProfileModal {...allProps} />

      {/* Notification Modal (New from screenshot) */}
        <NotificationModal {...allProps} />

      {isClientSelectModalOpen && (
        <ClientSelectModal {...allProps} />
      )}

        <ImageViewerModal {...allProps} />

      {/* Delete File Confirmation Modal */}
        <DeleteFileModal {...allProps} />

      {/* NEW MODAL: Delete Confirmation Modal for Applications */}
      <Modal
        show={showDeleteApplicationModal}
        onHide={() => setShowDeleteApplicationModal(false)}
        centered
        size="md"
      >
        <Modal.Header closeButton style={modalHeaderStyle}>
          <Modal.Title style={modalTitleStyle}>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalBodyStyle}>
          <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#475569' }}>
            Are you sure you want to permanently delete this application?
          </p>
          {applicationToDelete && (
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 15px',
                textAlign: 'center',
                color: '#1e293b',
                wordBreak: 'break-all',
              }}
            >
              <strong>{applicationToDelete.app.jobTitle} at {applicationToDelete.app.company}</strong>
            </div>
          )}
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.9rem',
              color: '#ef4444',
              marginTop: '15px',
            }}
          >
            This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer style={modalFooterStyle}>
          <button
            onClick={() => setShowDeleteApplicationModal(false)}
            style={modalCancelButtonStyle}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDeleteApplication}
            style={{ ...modalAddButtonPrimaryStyle, backgroundColor: '#ef4444' }}
            disabled={isDeletingApplication}
          >
            {isDeletingApplication ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span style={{ marginLeft: '5px' }}>Deleting...</span>
              </>
            ) : (
              'Confirm Delete'
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// --- STYLES ---
const containerStyle = {
  fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
  background: '#f8fafc',
  color: '#1e293b',
  minHeight: '100vh',
  padding: '0', // Removed padding-top here
};

const headerContentStyle = { // New style for the content under AdminHeader
  marginBottom: '32px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '20px',
  width: '100%',
  paddingTop: '32px', // Added padding-top here to move content down
};
const errorTextStyle = {
  fontSize: '0.8rem',
  color: 'red',
  marginTop: '4px',
  marginBottom: '0',
};

const headerTitleStyle = {
  width: '100%',
  textAlign: 'center',
  marginBottom: '10px',
};

const tabsContainerStyle = {
  display: 'flex',
  gap: '8px',
  background: '#ffffff',
  borderRadius: '9999px',
  padding: '6px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  border: '1px solid #e5e7eb',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-start',
};

const tabButtonStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  padding: '10px 22px',
  borderRadius: '9999px',
  fontSize: '0.95rem',
  fontWeight: '700',
  color: '#475569',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease, color 0.2s ease, transform 0.2s ease',
  whiteSpace: 'nowrap',
};

const tabButtonActiveStyle = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
  boxShadow: '0 8px 16px rgba(37, 99, 235, 0.18)',
};


const overviewCardsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '24px',
  marginBottom: '40px',
};

const cardStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8px',
  position: 'relative',
  overflow: 'hidden',
};

const cardIconContainerStyle = {
  backgroundColor: '#eff6ff',
  borderRadius: '50%',
  padding: '12px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '8px',
};

const cardLabelStyle = {
  fontSize: '0.9rem',
  color: '#64748b',
  margin: 0,
};

const cardValueStyle = {
  fontSize: '2rem',
  fontWeight: '700',
  color: '#1e293b',
  margin: '4px 0',
};

const cardSubLabelStyle = {
  fontSize: '0.8rem',
  color: '#94a3b8',
  margin: 0,
};

const sectionTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#1e293b',
  marginBottom: '24px',
  // textAlign: 'center', // Added for centering the title
};

const clientsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '24px',
};

const clientCardStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out', // Added transition for client cards
};

const clientCardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
  paddingBottom: '12px',
  borderBottom: '1px solid #f1f5f9',
};

const initialsCircleStyle = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: '#e0effe',
  color: '#3b82f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  fontWeight: '600',
};

const clientNameStyle = {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#1e293b',
  margin: 0,
};

const clientCodeStyle = {
  fontSize: '0.875rem',
  color: '#64748b',
  margin: 0,
};

const statusBadgeStyle = {
  padding: '4px 10px',
  borderRadius: '16px',
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'uppercase',
};

const priorityBadgeStyle = {
  padding: '4px 10px',
  borderRadius: '16px',
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  marginLeft: 'auto', // Push to the right
};

const clientDetailStyle = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.9rem',
  color: '#475569',
  margin: 0,
};

const clientDetailIconStyle = {
  color: '#94a3b8',
  marginRight: '8px',
};

const clientCardFooterStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '16px',
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: '1px solid #f1f5f9',
};

const downloadButtonStyle = {
  background: 'linear-gradient(135deg, #10b981 0%, #0f766e 100%)',
  color: '#ffffff',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
  marginLeft: '10px', // Spacing from the select filter
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  boxShadow: '0 10px 16px rgba(16, 185, 129, 0.18)',
};

const footerItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
};

const footerItemLabelStyle = {
  fontSize: '0.8rem',
  color: '#64748b',
  marginBottom: '4px',
};

const footerItemValueStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: '#1e293b',
  marginBottom: '8px',
};

const footerItemIconStyle = {
  marginBottom: '8px',
};

const viewButtonStyle = {
  background: '#e0effe',
  color: '#3b82f6',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
  width: '80%',
};

const activityButtonStyle = {
  background: '#f1f5f9',
  color: '#475569',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
  width: '80%',
};

// --- NEW STYLES FOR APPLICATIONS TAB ---
const applicationsSectionStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  marginBottom: '32px',
};

const subLabelStyle = {
  fontSize: '1rem',
  color: '#64748b',
  margin: '4px 0 24px 0',
};

const filterContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'minmax(280px, 1.4fr) minmax(220px, 280px) minmax(260px, 1.2fr)',
  gap: '24px',
  marginBottom: '32px',
  paddingBottom: '24px',
  borderBottom: '1px solid #e5e7eb',
  alignItems: 'center',
  justifyItems: 'center',
  gridAutoRows: 'minmax(100px, auto)',
  width: '100%',
};

const filterGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  width: '100%',
  minWidth: 0,
};

const filterLabelStyle = {
  fontSize: '0.9rem',
  fontWeight: '700',
  color: '#102a43',
};

const dateRangeInputGroupStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  gap: '14px',
  alignItems: 'center',
  width: '100%',
  minWidth: 0,
};

const dateInputStyle = {
  padding: '14px 16px',
  border: '1px solid #cbd5e1',
  borderRadius: '14px',
  fontSize: '0.95rem',
  color: '#0f172a',
  backgroundColor: '#ffffff',
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22%3E%3Cpath fill=%22%2364748b%22 d=%22M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM19 20H5V9h14v11zm0-13H5V6h14v1z%22/%3E%3C/svg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  backgroundSize: '18px',
  paddingRight: '44px',
  width: '100%',
  minWidth: 0,
};

const selectFilterStyle = {
  padding: '14px 16px',
  border: '1px solid #cbd5e1',
  borderRadius: '14px',
  fontSize: '0.95rem',
  color: '#0f172a',
  backgroundColor: '#ffffff',
  appearance: 'none', // Remove default arrow
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 320 512%22%3E%3Cpath fill=%22%23475569%22 d=%22M143 352.3L7.7 199.7c-4.7-4.7-12.3-4.7-17 0l-19.4 19.4c-4.7 4.7-4.7 12.3 0 17L159 448.3c9.4 9.4 24.6 9.4 33.9 0l151.3-151.3c4.7-4.7 4.7-12.3 0-17l-19.4-19.4c-4.7-4.7-12.3-4.7-17 0L160 352.3c-9.4 9.4-24.6 9.4-33.9 0z%22/%3E%3C/svg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 16px center',
  backgroundSize: '12px',
  width: '100%',
  maxWidth: '260px',
  minWidth: 0,
};

const selectClientDropdownStyle = { // New style for the specific client dropdown
  padding: '8px 25px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#1e293b',
  backgroundColor: '#ffffff',
  appearance: 'none', // Remove default arrow
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20512%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M143%20352.3L7.7%20199.7c-4.7-4.7-12.3-4.7-17%200l-19.4%2019.4c-4.7%204.7-4.7%2012.3%200%2017L159%20448.3c9.4%209.4%2024.6%209.4%2033.9%200l151.3-151.3c4.7-4.7%204.7-12.3%200-17l-19.4-19.4c-4.7-4.7-12.3-4.7-17%200L160%20352.3c-9.4%209.4-24.6%209.4-33.9%200z%22%2F%3E%3C%2Fsvg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '10px',
  width: '250px', // Increased width for this specific dropdown
};

const quickFilterButtonsStyle = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
};

const quickFilterButtonStyle = {
  background: '#f1f5f9',
  color: '#334155',
  border: '1px solid #e2e8f0',
  padding: '10px 18px',
  borderRadius: '9999px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s, color 0.2s, transform 0.2s',
  whiteSpace: 'nowrap',
  minWidth: '108px',
  textAlign: 'center',
};

const quickFilterButtonActiveStyle = {
  background: '#e0e7ff',
  color: '#1d4ed8',
  borderColor: '#c7d2fe',
  transform: 'translateY(-1px)',
};

const clearFiltersButtonContainerStyle = { // New style for positioning
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginLeft: 'auto', // Push to the right
  gridColumn: 'span 1', // Ensure it takes its own grid column
  justifySelf: 'end', // Align to the end of its grid area
};

const clearFiltersButtonStyle = {
  background: '#fef2f2',
  color: '#ef4444',
  border: '1px solid #fecaca',
  padding: '8px 16px',
  borderRadius: '6px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  whiteSpace: 'nowrap', // Prevent text wrapping
  justifyContent: 'center',
  minWidth: '150px',
};

const clientApplicationsContainerStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  marginBottom: '24px',
};

const clientApplicationsHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '20px',
  paddingBottom: '16px',
  borderBottom: '1px solid #f1f5f9',
  flexWrap: 'wrap', // Allow wrapping on smaller screens
};

const clientAppStatsStyle = {
  display: 'flex',
  gap: '16px',
  fontSize: '0.9rem',
  color: '#475569',
  marginLeft: 'auto', // Push stats to the right
  marginRight: '20px', // Space before add button
  flexWrap: 'wrap',
  justifyContent: 'flex-end', // Align stats to the right if wrapped
};

const addApplicationButtonStyle = {
  background: '#3b82f6',
  color: '#ffffff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: '150px',
  justifyContent: 'center',
};

const applicationTableControlsStyle = {
  display: 'flex',
  gap: '16px',
  marginBottom: '20px',
  flexWrap: 'wrap',
  alignItems: 'center',
};

const searchInputStyle = {
  flexGrow: 1,
  padding: '10px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#1e293b',
  maxWidth: '300px', // Limit search input width
};

const statusFilterSelectStyle = {
  padding: '10px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#1e293b',
  backgroundColor: '#ffffff',
  appearance: 'none',
  // Updated SVG for down arrow
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20512%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M143%20352.3L7.7%20199.7c-4.7-4.7-12.3-4.7-17%200l-19.4%2019.4c-4.7%204.7-4.7%2012.3%200%2017L159%20448.3c9.4%209.4%2024.6%209.4%2033.9%200l151.3-151.3c4.7-4.7%204.7-12.3%200-17l-19.4-19.4c-4.7-4.7-12.3-4.7-17%200L160%20352.3c-9.4%209.4-24.6%209.4-33.9%200z%22%2F%3E%3C%2Fsvg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '10px',
  minWidth: '150px',
};

const applicationTableWrapperStyle = {
  overflowX: 'auto', // Enable horizontal scrolling for the table on small screens
  width: '100%',
};

const applicationTableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '16px',
};

const applicationTableHeaderCellStyle = {
  padding: '12px 16px',
  textAlign: 'center',
  backgroundColor: '#f1f5f9',
  color: '#475569',
  fontSize: '0.85rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  borderBottom: '1px solid #e2e8f0',
};

const applicationTableDataCellStyle = {
  padding: '12px 16px',
  borderBottom: '1px solid #f1f5f9',
  fontSize: '0.9rem',
  color: '#1e293b',
  verticalAlign: 'middle',
};

const applicationStatusBadgeStyle = {
  padding: '4px 10px',
  borderRadius: '16px',
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'capitalize',
  display: 'inline-block',
};

const getApplicationStatusStyle = (status) => {
  switch (status) {
    case 'Applied':
      return { backgroundColor: '#e0effe', color: '#3b82f6' };
    case 'Interview':
      return { backgroundColor: '#fffbeb', color: '#f59e0b' };
    case 'Rejected':
      return { backgroundColor: '#fee2e2', color: '#ef4444' };
    case 'Offered':
      return { backgroundColor: '#dcfce7', color: '#10b981' };
    default:
      return { backgroundColor: '#e2e8f0', color: '#475569' };
  }
};

const actionButtonAppStyle = {
  background: 'none',
  border: 'none',
  padding: '6px',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#1e293b',
  marginRight: '4px',
  transition: 'color 0.2s, background-color 0.2s',
};

const saveButtonAppStyle = {
  background: '#22c55e',
  color: '#ffffff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
};

const deleteButtonAppStyle = {
  background: 'none',
  border: 'none',
  padding: '6px',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#ef4444',
  transition: 'color 0.2s, background-color 0.2s',
};

const editableInputStyle = {
  width: '100%',
  padding: '6px 8px',
  border: '1px solid #cbd5e1',
  borderRadius: '4px',
  fontSize: '0.9rem',
};

const editableSelectStyle = {
  width: '100%',
  padding: '6px 8px',
  border: '1px solid #cbd5e1',
  borderRadius: '4px',
  fontSize: '0.9rem',
  backgroundColor: '#ffffff',
  appearance: 'none',
  // Updated SVG for down arrow
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20512%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M143%20352.3L7.7%20199.7c-4.7-4.7-12.3-4.7-17%200l-19.4%2019.4c-4.7%204.7-4.7%2012.3%200%2017L159%20448.3c9.4%209.4%2024.6%209.4%2033.9%200l151.3-151.3c4.7-4.7%204.7-12.3%200-17l-19.4-19.4c-4.7-4.7-12.3-4.7-17%200L160%20352.3c-9.4%209.4-24.6%209.4-33.9%200z%22%2F%3E%3C%2Fsvg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 8px center',
  backgroundSize: '8px',
};

// --- NEW STYLES FOR FILES TAB ---
const filesGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '20px',
  marginTop: '20px',
};

const fileCardStyle = {
  background: '#f8fafc', // Lighter background for file cards
  borderRadius: '10px',
  padding: '16px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
  border: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
};

const fileCardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '8px',
};

const fileIconStyle = {
  color: '#64748b',
};

const fileNameStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: '#1e293b',
  margin: 0,
  wordBreak: 'break-word', // Ensure long file names wrap
};

const fileSizeStyle = {
  fontSize: '0.85rem',
  color: '#94a3b8',
  margin: 0,
};

const fileTypeBadgeStyle = {
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '0.7rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  marginLeft: 'auto',
  whiteSpace: 'nowrap',
};

const getFileTypeBadgeStyle = (type) => {
  switch (type) {
    case 'resume':
      return { backgroundColor: '#e0effe', color: '#3b82f6' };
    case 'cover letter':
      return { backgroundColor: '#dcfce7', color: '#10b981' };
    case 'interview screenshot':
      return { backgroundColor: '#fffbeb', color: '#f59e0b' };
    case 'portfolio':
      return { backgroundColor: '#f3e8ff', color: '#8b5cf6' };
    case 'Offers':
      return { backgroundColor: '#ffe4e6', color: '#ef4444' };
    case 'application attachment':
      return { backgroundColor: '#dbeafe', color: '#1d4ed8' };
    default:
      return { backgroundColor: '#e2e8f0', color: '#475569' };
  }
};


const fileStatusStyle = {
  fontSize: '0.85rem',
  color: '#64748b',
  margin: 0,
};

const fileUploadDateStyle = {
  fontSize: '0.85rem',
  color: '#64748b',
  margin: 0,
};

const fileNotesStyle = {
  fontSize: '0.85rem',
  color: '#475569',
  margin: '8px 0',
  fontStyle: 'italic',
  borderLeft: '2px solid #cbd5e1',
  paddingLeft: '8px',
};

const fileActionsStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  marginTop: 'auto', // Push actions to the bottom
  paddingTop: '12px',
  borderTop: '1px solid #f1f5f9',
};

const editableSelectSmallStyle = {
  padding: '4px 6px',
  border: '1px solid #cbd5e1',
  borderRadius: '4px',
  fontSize: '0.75rem',
  backgroundColor: '#ffffff',
  appearance: 'none',
  // Updated SVG for down arrow
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20512%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M143%20352.3L7.7%20199.7c-4.7-4.7-12.3-4.7-17%200l-19.4%2019.4c-4.7%204.7-4.7%2012.3%200%2017L159%20448.3c9.4%209.4%2024.6%209.4%2033.9%200l151.3-151.3c4.7-4.7%204.7-12.3%200-17l-19.4-19.4c-4.7-4.7-12.3-4.7-17%200L160%20352.3c-9.4%209.4-24.6%209.4-33.9%200z%22%2F%3E%3C%2Fsvg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 4px center',
  backgroundSize: '6px',
};

// --- NEW STYLES FOR ACTIVITY TAB ---
const activityTimelineContainerStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  marginBottom: '32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const activityItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  padding: '16px',
  borderRadius: '10px',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
};

const activityIconContainerStyle = {
  flexShrink: 0,
};

const initialsCircleSmallStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: '#e0effe',
  color: '#3b82f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.9rem',
  fontWeight: '600',
};

const activityContentStyle = {
  flexGrow: 1,
};

const activityDescriptionStyle = {
  fontSize: '0.95rem',
  color: '#1e293b',
  margin: '0 0 4px 0',
  lineHeight: '1.4',
};

const activityDateStyle = {
  fontSize: '0.8rem',
  color: '#64748b',
  margin: 0,
};

const activityBadgeStyle = {
  padding: '4px 10px',
  borderRadius: '16px',
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'capitalize',
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

const getActivityBadgeStyle = (type) => {
  switch (type) {
    case 'job application':
      return { backgroundColor: '#e0effe', color: '#3b82f6' };
    case 'file upload':
      return { backgroundColor: '#dcfce7', color: '#10b981' };
    case 'interview scheduled':
      return { backgroundColor: '#fffbeb', color: '#f59e0b' };
    case 'status update':
      return { backgroundColor: '#f3e8ff', color: '#8b5cf6' };
    case 'resume update':
      return { backgroundColor: '#ffe4e6', color: '#ef4444' };
    default:
      return { backgroundColor: '#e2e8f0', color: '#475569' };
  }
};

const activityStatusBadgeStyle = {
  padding: '4px 10px',
  borderRadius: '16px',
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'capitalize',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  marginLeft: '8px', // Space between activity type and status
};

const getActivityStatusStyle = (status) => {
  switch (status) {
    case 'Active':
      return { backgroundColor: '#dcfce7', color: '#10b981' };
    case 'Completed':
      return { backgroundColor: '#e2e8f0', color: '#475569' };
    default:
      return { backgroundColor: '#e2e8f0', color: '#475569' };
  }
};

// --- NEW STYLES FOR MODALS (Add/View/Edit Application) ---
const modalHeaderStyle = {
  borderBottom: 'none',
  paddingBottom: '15px',
  textAlign: 'center',
};

const modalTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#1e293b',
};

const modalBodyStyle = {
  padding: '20px 30px',
  lineHeight: '1.8',
  color: '#444',
};

const modalFormGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
};

const modalFormFieldGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const modalLabelStyle = {
  fontSize: '0.9rem',
  fontWeight: '500',
  color: '#475569',
};

const modalInputStyle = {
  padding: '10px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#1e293b',
  width: '100%',
};

const modalSelectStyle = {
  ...modalInputStyle,
  appearance: 'none',
  // Updated SVG for down arrow
  backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20512%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M143%20352.3L7.7%20199.7c-4.7-4.7-12.3-4.7-17%200l-19.4%2019.4c-4.7%204.7-4.7%2012.3%200%2017L159%20448.3c9.4%209.4%2024.6%209.4%2033.9%200l151.3-151.3c4.7-4.7%204.7-12.3%200-17l-19.4-19.4c-4.7-4.7-12.3-4.7-17%200L160%20352.3c-9.4%209.4-24.6%209.4-33.9%200z%22%2F%3E%3C%2Fsvg%3E')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '10px',
};

const modalTextareaStyle = {
  ...modalInputStyle,
  minHeight: '80px',
  resize: 'vertical',
};

const modalFooterStyle = {
  borderTop: 'none',
  paddingTop: '15px',
  display: 'flex',
  justifyContent: 'flex-end', // Align buttons to the right
  gap: '15px',
};

const modalCancelButtonStyle = {
  background: '#cbd5e1',
  color: '#475569',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
};

const modalAddButtonPrimaryStyle = {
  background: '#3b82f6',
  color: '#ffffff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
};

const modalViewDetailsGridStyle = {
  // Removed grid properties to make items stack one by one
  // display: 'grid',
  // gridTemplateColumns: '1fr 1fr',
  gap: '10px 20px',
  fontSize: '0.95rem',
  color: '#333',
};

const modalViewDetailItemStyle = {
  margin: 0,
  padding: '5px 0',
};

// --- NEW CLIENTS TAB STYLES ---
const newClientsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '24px',
  marginTop: '20px',
};

const newClientCardStyle = {
  background: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const newClientCardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
  paddingBottom: '12px',
  borderBottom: '1px solid #f1f5f9',
};

const newClientNameStyle = {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#1e293b',
  margin: 0,
};

const newClientDetailStyle = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.9rem',
  color: '#475569',
  margin: 0,
};

const newClientCardActionsStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '16px',
  justifyContent: 'flex-end',
};

const acceptButtonStyle = {
  background: '#22c55e',
  color: '#ffffff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
};

const declineButtonStyle = {
  background: '#ef4444',
  color: '#ffffff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-out',
};

const clientSelectContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '20px',
  flexWrap: 'wrap',
  marginLeft: '20px', // Move client select slightly to the right
};

// --- NEW STYLES FOR CLIENT DATA TAB ---
const clientDataGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '24px',
  marginTop: '20px',
};

const clientDataSectionStyle = {
  background: '#f8fafc',
  borderRadius: '10px',
  padding: '20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
  border: '1px solid #e2e8f0',
};

const clientDataSectionTitleStyle = {
  fontSize: '1.2rem',
  fontWeight: '600',
  color: '#3b82f6',
  marginBottom: '15px',
  borderBottom: '1px solid #c4e0ff',
  paddingBottom: '10px',
};

const clientDataDetailStyle = {
  fontSize: '0.95rem',
  color: '#1e293b',
  margin: '8px 0',
  lineHeight: '1.4',
};

const selectClientButtonStyle = {
  padding: '8px 16px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '0.9rem',
  color: '#1e293b',
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minWidth: '250px',
};

const actionButtonSecondaryStyle = {
  background: 'none',
  border: 'none',
  color: '#2563eb',
  cursor: 'pointer',
  padding: '4px',
  marginRight: '4px',
  display: 'flex',
  alignItems: 'center'
};
const deleteButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#ef4444', // red color for delete action
  cursor: 'pointer',
  padding: '4px',
  marginLeft: '4px',
  display: 'flex',
  alignItems: 'center'
};
export default EmployeeData;