import React from 'react';

const NotificationModal = ({ notifications, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content-style" style={{ maxWidth: '500px', padding: '40px', background: '#ffffff', color: '#1e293b' }}>
        <button onClick={onClose} className="modal-close-button" style={{ color: '#64748B' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h3 style={{ marginBottom: '30px', textAlign: 'center', color: '#1e293b', fontSize: '1.8rem', fontWeight: '700' }}>
          Notifications
        </h3>
        {notifications.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No new notifications.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {notifications.map((notification, index) => (
              <li key={index} style={{ padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                <p style={{ fontWeight: '600', marginBottom: '5px' }}>{notification.title}</p>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{notification.message}</p>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{notification.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// --- AttachmentModal Component ---
// In ClientDashboard.jsx, replace the existing AttachmentModal with this version.

// --- AttachmentModal Component ---

export default NotificationModal;
