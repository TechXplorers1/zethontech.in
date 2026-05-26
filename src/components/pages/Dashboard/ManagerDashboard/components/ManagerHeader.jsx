import React, { useEffect } from 'react';
import logo from '../../../../../assets/zethon_logo.png';

const ManagerHeader = ({
  managerUserName,
  managerInitials,
  onLogoClick,
  isDarkMode,
  toggleTheme,
  toggleSidebar,
  isProfileDropdownOpen,
  setIsProfileDropdownOpen,
  profileDropdownRef,
  setShowProfileModal,
  onNotificationClick,
  onLogoutClick
}) => {

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen, profileDropdownRef, setIsProfileDropdownOpen]);

  return (
    <header className="ad-header">
      <div className="ad-header-left" style={{ display: 'flex', alignItems: 'center' }}>
        <div
          className="ad-logo"
          onClick={onLogoClick}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <img
            src={logo}
            alt="Zethon Tech Logo"
            className="logo-image"
            style={{ height: '30px', marginRight: '5px' }}
          />
          <span style={{ color: 'black', marginLeft: '10px', fontWeight: '', fontSize: '1.5rem' }}>
            Zethon Tech
          </span>
        </div>
      </div>

      <div className="ad-header-right">
        <div className="ad-notification-icon" onClick={onNotificationClick}>
          <svg className="ad-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1.125rem', height: '1.125rem' }}>
            <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.2-43.8 124.9L5.7 377.9c-2.7 4.4-3.4 9.7-1.7 14.6s4.6 8.5 9.8 10.1l39.5 12.8c10.6 3.4 21.8 3.9 32.7 1.4S120.3 400 128 392h192c7.7 8 17.5 13.6 28.3 16.3s22.1 1.9 32.7-1.4l39.5-12.8c5.2-1.7 8.2-6.1 9.8-10.1s1-10.2-1.7-14.6l-20.5-33.7C399.5 322.6 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H184.3c25.8-40 39.7-86.7 39.7-134.6V208c0-61.9 50.1-112 112-112zm0 352a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
          </svg>
          <span className="ad-notification-badge">3</span>
        </div>
        <div className="profile-dropdown-container" ref={profileDropdownRef}>
          <div className="ad-user-info" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
            <div className="ad-user-info-text">
              <p className="ad-user-name">{managerUserName || 'Manager'}</p>
              <span className="ad-admin-tag">
                <svg className="ad-icon-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ fontSize: '0.65rem', width: '0.65rem', height: '0.65rem' }}>
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                </svg>
                Manager
              </span>
            </div>
            <div className="ad-initials-avatar">
              <span className="ad-initials-text">{managerInitials || 'M'}</span>
            </div>
          </div>
          {isProfileDropdownOpen && (
            <ul className="profile-dropdown-menu open">
              <li className="profile-dropdown-item header">My Account</li>
              <li className="profile-dropdown-item" onClick={() => {
                setIsProfileDropdownOpen(false);
                setShowProfileModal(true);
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                </svg>
                Profile
              </li>
            </ul>
          )}
        </div>
      </div>

      <button className="ad-hamburger-menu" onClick={toggleSidebar}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '1.125rem', height: '1.125rem' }}>
          <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
        </svg>
      </button>
    </header>
  );
};

export default ManagerHeader;
