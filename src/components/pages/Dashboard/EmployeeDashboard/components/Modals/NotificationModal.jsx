import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const NotificationModal = (props) => {
  const {
    showNotificationModal,
    notifications,
    setShowNotificationModal
  } = props;

  return (
    <>
      <Modal show={showNotificationModal} onHide={() => setShowNotificationModal(false)} centered className="notification-modal">
        <Modal.Header>
          <Modal.Title>Notifications</Modal.Title>
          <button
            type="button"
            className="btn-close-custom"
            aria-label="Close"
            onClick={() => setShowNotificationModal(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </Modal.Header>
        <Modal.Body>
          {notifications.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
              No new notifications.
            </div>
          ) : (
            <div>
              {notifications.map(notification => (
                <div key={notification.id} className="notification-item">
                  <p className="notification-item-title">{notification.title}</p>
                  <p className="notification-item-description">{notification.description}</p>
                  <p className="notification-item-time">{notification.timeAgo}</p>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NotificationModal;
