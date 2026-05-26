import React, { useState, useEffect, useRef } from 'react';
import logo from '../../../../../assets/zethon_logo.png';

const ClientHeader = ({
  clientUserName,
  clientInitials,
  onLogoClick,
  toggleSidebar, // This prop is no longer used for the hamburger menu, but kept for consistency
  isProfileDropdownOpen,
  setIsProfileDropdownOpen,
  profileDropdownRef,
  onClientProfileClick,
  onSubscriptionClick,
  unreadNotificationsCount,
  onNotificationClick,
  onLogoutClick,
  activeServices,
  inactiveServices,
  onActiveServiceClick,
  onInactiveServiceClick
}) => {

  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const servicesMenuRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutsideServices = (event) => {
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target)) {
        setIsServicesDropdownOpen(false);
      }
    };
    if (isServicesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutsideServices);
    }
    return () => document.removeEventListener('mousedown', handleClickOutsideServices);
  }, [isServicesDropdownOpen]);

  return (
    <div>
      {/* Inline styles for ClientHeader */}
      <style>
        {`
        /* Import Inter font from Google Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        /* CSS Variables for theming (Header specific) */
        :root {
          --bg-header: #ffffff;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --border-color: #e5e7eb;
          --shadow-color-1: rgba(0, 0, 0, 0.05);
          --icon-color: #6b7280;
          --client-avatar-bg: #1f2937;
          --client-avatar-text: #ffffff;
          --logo-x-color: #2563eb;
          --client-tag-bg: #e0f2f7;
          --client-tag-text: #0891b2;
          --bg-nav-link-hover: #f9fafb; /* For dropdown items */
            --color-blue-light: #e0f2fe;
  --color-green-light: #dcfce7;
  --color-red-light: #fee2e2;
  --color-orange-light: #ffedd5;
  --color-purple-light: #f3e8ff;
  --color-cyan-light: #e0f2fe;
        }

                .html-dark { 
          --bg-header: #2d3748;
          --text-primary: #e2e8f0;
          --text-secondary: #a0aec0;
          --border-color: #4a5568;
          --shadow-color-1: rgba(0, 0, 0, 0.2);
          --icon-color: #cbd5e0;
          --client-avatar-bg: #4299e1;
          --client-avatar-text: #ffffff;
          --logo-x-color: #4299e1;
          --client-tag-bg: #fbd38d;
          --client-tag-text: #6b4617;
          --bg-nav-link-hover: #4a5568; /* For dropdown items */
        }

        html.dark-mode { /* Re-added dark mode styles */
          --bg-header: #2d3748;
          --text-primary: #e2e8f0;
          --text-secondary: #a0aec0;
          --border-color: #4a5568;
          --shadow-color-1: rgba(0, 0, 0, 0.2);
          --icon-color: #cbd5e0;
          --client-avatar-bg: #4299e1;
          --client-avatar-text: #ffffff;
          --logo-x-color: #4299e1;
          --client-tag-bg: #fbd38d;
          --client-tag-text: #6b4617;
          --bg-nav-link-hover: #4a5568; /* For dropdown items */
        }

        /* Profile Dropdown Styles */
        .profile-dropdown-container {
          position: relative;
          cursor: pointer;
          z-index: 60; /* Higher than header for dropdown to appear on top */
        }

        .profile-dropdown-menu {
          position: absolute;
          top: calc(100% + 0.5rem); /* Position below the avatar */
          right: 0;
          background-color: var(--bg-header); /* Use header background for consistency */
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid var(--border-color);
          min-width: 12rem;
          padding: 0.5rem 0;
          list-style: none;
          margin: 0;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: opacity 0.2s ease-out, transform 0.2s ease-out, visibility 0.2s ease-out;
        }

        .profile-dropdown-menu.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .profile-dropdown-item {
          padding: 0.75rem 1rem;
          color: var(--text-primary);
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: background-color 0.15s ease;
        }
          
          .header-button-item {
            position: relative; /* Needed for the dropdown positioning */
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 6px;
            background-color: transparent;
            border: 1px solid transparent;
            color: var(--text-secondary);
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s, color 0.2s;
          }

          .header-button-item:hover {
            background-color: var(--bg-nav-link-hover);
            color: var(--text-primary);
          }

           .services-dropdown-menu {
            position: absolute;
            top: calc(100% + 0.5rem); /* Position below the button */
            right: 0;
            background-color: var(--bg-header);
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid var(--border-color);
            min-width: 16rem; /* Wider for service names */
            padding: 0.5rem 0;
            list-style: none;
            margin: 0;
            z-index: 70; /* Above other content but below profile dropdown if needed */
          }

          .services-dropdown-header {
            font-weight: 600;
            color: var(--text-secondary);
            font-size: 0.8rem;
            padding: 0.5rem 1rem;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 0.5rem;
          }

          .services-dropdown-item {
            padding: 0.75rem 1rem;
            color: var(--text-primary);
            font-size: 0.9rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            transition: background-color 0.15s ease;
            cursor: pointer;
          }

          .services-dropdown-item:hover {
            background-color: var(--bg-nav-link-hover);
          }

        .profile-dropdown-item:hover {
          background-color: var(--bg-nav-link-hover);
        }

        .profile-dropdown-item.header {
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.8rem;
          padding: 0.5rem 1rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 0.5rem;
        }

        .profile-dropdown-item.logout {
          color: #ef4444; /* Red for logout */
        }

        .profile-dropdown-item.logout:hover {
          background-color: #fee2e2; /* Light red background on hover */
        }

        /* Top Navigation Bar */
        .ad-header {
          background-color: var(--bg-header);
          box-shadow: 0 1px 2px 0 var(--shadow-color-1);
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .ad-header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .ad-logo {
          display: flex;
          align-items: center;
          color: var(--text-primary);
          font-size: 1.5rem;
          font-weight: 700;
        }
        .ad-logo-x {
          color: var(--logo-x-color);
        }

        .ad-header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .ad-icon-btn {
          color: var(--icon-color);
          font-size: 1.125rem;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ad-icon-btn:hover {
          color: #2563eb;
        }

        .ad-notification-icon {
          position: relative;
          cursor: pointer; /* Make it clear it's clickable */
        }

        .ad-notification-badge {
          position: absolute;
          top: -0.25rem;
          right: -0.25rem;
          background-color: #ef4444;
          color: #ffffff;
          font-size: 0.75rem;
          border-radius: 9999px;
          height: 1rem;
          width: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          ${unreadNotificationsCount === 0 ? 'display: none;' : ''} /* Hide badge if no notifications */
        }

        .ad-user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ad-user-info-text {
          display: none;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.125rem;
        }

        @media (min-width: 768px) {
          .ad-user-info-text {
            display: flex;
          }
        }

        .ad-user-name {
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0;
          padding: 0;
          line-height: 1.2;
        }

        .ad-user-email {
          color: var(--text-secondary);
          font-size: 0.75rem;
          margin: 0;
          padding: 0;
          line-height: 1.2;
        }

        /* Initials Avatar Styles */
        .ad-initials-avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 9999px;
          background-color: var(--client-avatar-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ad-initials-text {
          color: var(--client-avatar-text);
          font-size: 0.875rem;
          font-weight: 600;
        }

        /* Client Tag in Header */
        .ad-client-tag {
            background-color: var(--client-tag-bg);
            color: var(--client-tag-text);
            padding: 0.125rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-left: 0.5rem;
            white-space: nowrap;
            display: inline-flex; /* Ensure it behaves like a tag */
            align-items: center;
            gap: 0.25rem;
        }
            .brand-full {
  font-size: 1.7rem; /* Adjust size as needed */
  font-weight: 700;
  background: linear-gradient(90deg, #4F46E5 0%, #8B5CF6 100%); /* Purple to Violet gradient */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  letter-spacing: -0.5px; /* Optional: adjust spacing */
}

        /* Hamburger menu is removed, so no styles are needed for it */
        `}
      </style>
      <header className={`ad-header`}>
        <div className="ad-header-left">
          <div className="ad-logo" onClick={onLogoClick} style={{ cursor: 'pointer' }}>
            <img src={logo} alt="Zethon Tech Logo" height="50" />
            <span style={{ color: 'black', marginLeft: '10px', fontWeight: '', fontSize: '1.5rem' }}>
              Zethon Tech
            </span>
          </div>
        </div>

        <div className="ad-header-right">
          <li className="profile-dropdown-item" onClick={onSubscriptionClick}>
            {/* Credit Card Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1rem', height: '1rem', color: 'var(--text-primary)' }}>
              <path d="M22 9H2C1.44772 9 1 9.44772 1 10V19C1 19.5523 1.44772 20 2 20H22C22.5523 20 23 19.5523 23 19V10C23 9.44772 22.5523 9 22 9ZM3 11V18H21V11H3ZM22 4H2C1.44772 4 1 4.44772 1 5V7C1 7.55228 1.44772 8 2 8H22C22.5523 8 23 7.55228 23 7V5C23 4.44772 22.5523 4 22 4Z" />
            </svg>
            Subscription
          </li>

          {/* <div className="header-button-item" onMouseEnter={() => setIsServicesDropdownOpen(true)} onMouseLeave={() => setIsServicesDropdownOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1rem', height: '1rem', color: 'var(--text-primary)' }}>
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
            Services
            {isServicesDropdownOpen && (
              <ul className="services-dropdown-menu" ref={servicesMenuRef}>
                <li className="services-dropdown-header">Active Services</li>
                {activeServices.length > 0 ? (
                  activeServices.map(service => (
                    <li key={service.title} className="services-dropdown-item" onClick={() => onActiveServiceClick(service)}>
                      {service.title}
                    </li>
                  ))
                ) : (
                  <li className="services-dropdown-item" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>No active services</li>
                )}

                <li className="services-dropdown-header" style={{ marginTop: '0.5rem' }}>Inactive Services</li>
                {inactiveServices.map(service => (
                  <li key={service.title} className="services-dropdown-item" onClick={() => onInactiveServiceClick(service.path)}>
                    {service.title}
                  </li>
                ))}
              </ul>
            )}
          </div> */}

          <div className="ad-notification-icon" onClick={onNotificationClick}>
            {/* Bell Icon */}
            <svg className="ad-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1.125rem', height: '1.125rem', color: 'var(--text-primary)' }}>
              <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.2-43.8 124.9L5.7 377.9c-2.7 4.4-3.4 9.7-1.7 14.6s4.6 8.5 9.8 10.1l39.5 12.8c10.6 3.4 21.8 3.9 32.7 1.4S120.3 400 128 392h192c7.7 8 17.5 13.6 28.3 16.3s22.1 1.9 32.7-1.4l39.5-12.8c5.2-1.7 8.2-6.1 9.8-10.1s1-10.2-1.7-14.6l-20.5-33.7C399.5 322.6 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H184.3c25.8-40 39.7-86.7 39.7-134.6V208c0-61.9 50.1-112 112-112zm0 352a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
            </svg>
            {unreadNotificationsCount > 0 && (
              <span className="ad-notification-badge">{unreadNotificationsCount}</span>
            )}
          </div>
          <div className="profile-dropdown-container" ref={profileDropdownRef}>
            <div className="ad-user-info" onClick={() => setIsProfileDropdownOpen(prev => !prev)}>
              <div className="ad-user-info-text">
                <p className="ad-user-name">{clientUserName}</p>
                <span className="ad-client-tag">
                  {/* User Icon */}
                  <svg className="ad-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ fontSize: '0.65rem', width: '0.65rem', height: '0.65rem', color: 'var(--text-primary)' }}>
                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                  </svg>
                  Client
                </span>
              </div>
              <div className="ad-initials-avatar">
                <span className="ad-initials-text">{clientInitials}</span>
              </div>
            </div>
            {isProfileDropdownOpen && (
              <ul className="profile-dropdown-menu open">
                <li className="profile-dropdown-item header">My Account</li>
                <li className="profile-dropdown-item" onClick={onClientProfileClick}>
                  {/* User Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1rem', height: '1rem', color: 'var(--text-primary)' }}>
                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                  </svg>
                  Your Profile
                </li>
                <li className="profile-dropdown-item" onClick={onLogoClick}>
                  {/* User Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" style={{ width: '1rem', height: '1rem', color: 'var(--text-primary)' }}>
                    <path d="M541 229.16 310.6 25.5c-7.7-6.9-19.5-6.9-27.2 0L35 229.16c-10.2 9.2-11 25-1.8 35.2s25 11 35.2 1.8L96 247.1V464c0 26.5 
    21.5 48 48 48h112V336h64v176h112c26.5 0 48-21.5 48-48V247.1l27.6 19.1c4.5 3.1 9.6 4.6 14.6 4.6 
    7.1 0 14.2-3.1 19-9 9.2-10.2 8.4-26-1.8-35.2z"/>
                  </svg>
                  Home Page
                </li>

                {/* <li className="profile-dropdown-item logout" onClick={onLogoutClick}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '1rem', height: '1rem' }}>
                    <path d="M10 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H10C10.5523 20 11 19.5523 11 19V17H13V19C13 20.6569 11.6569 22 10 22H4C2.34315 22 1 20.6569 1 19V5C1 3.34315 2.34315 2 4 2H10C11.6569 2 13 3.34315 13 5V7H11V5C11 4.44772 10.5523 4 10 4ZM19.2929 10.2929L22.2929 13.2929C22.6834 13.6834 22.6834 14.3166 22.2929 14.7071L19.2929 17.7071C18.9024 18.0976 18.2692 18.0976 17.8787 17.7071C17.4882 17.3166 17.4882 16.6834 17.8787 16.2929L19.5858 14.5858H11C10.4477 14.5858 10 14.1381 10 13.5858C10 13.0335 10.4477 12.5858 11 12.5858H19.5858L17.8787 10.8787C17.4882 10.4882 17.4882 9.85497 17.8787 9.46447C18.2692 9.07395 18.9024 9.07395 19.2929 9.46447Z" />
                  </svg>
                  Log out
                </li> */}
              </ul>
            )}
          </div>
        </div>

        {/* Removed the hamburger menu button */}
      </header>
    </div>
  );
};

const DimmingOverlay = ({ isVisible, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: isVisible ? 90 : -1, // Z-index needs to be below modals (100) but above content and header dropdown (60)
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.3s ease, visibility 0.3s ease',
      }}
    />
  );
};

const ClientProfile = ({
  profilePlaceholder, // Not used in this version but kept for consistency with original prop signature
  clientUserName, // Not used in this version but kept for consistency with original prop signature
  onClose
}) => {
  return (
    <div className="modal-overlay">
    </div>
  );
};

export { ClientHeader, DimmingOverlay, ClientProfile };
