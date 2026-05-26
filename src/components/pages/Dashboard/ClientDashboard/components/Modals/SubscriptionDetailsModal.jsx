import React from 'react';

const SubscriptionDetailsModal = ({
  togglePaymentModal,
  currentPlanPrice,
  daysLeftInPlan,
  onClose
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content-style" style={{
        maxWidth: '500px',
        padding: '40px',
        // Use CSS variables for background and text
        background: 'var(--bg-card)',
        color: 'var(--text-primary)'
      }}>
        <button onClick={onClose} className="modal-close-button" style={{ color: 'var(--text-secondary)' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h3 style={{
          marginBottom: '30px',
          textAlign: 'center',
          color: 'var(--text-primary)',
          fontSize: '1.8rem',
          fontWeight: '700'
        }}>
          Your Subscription Details
        </h3>
        <div className="subscription-details-card"
        // The CSS for this card is now managed through the global styles for consistency
        >
          {/* FIX: Removed hardcoded inline styles for color to rely on CSS variables */}
          <div className="subscription-detail-item" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <p className="subscription-detail-label" style={{ color: 'var(--text-secondary)' }}>Current Plan</p>
            <strong className="subscription-detail-value" style={{ color: 'var(--text-primary)' }}>1 Month Plan</strong>
          </div>
          {/* FIX: Removed hardcoded inline styles for color to rely on CSS variables */}
          <div className="subscription-detail-item" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <p className="subscription-detail-label" style={{ color: 'var(--text-secondary)' }}>Price</p>
            <strong className="subscription-detail-value" style={{ color: 'var(--text-primary)' }}>{currentPlanPrice}</strong>
          </div>
          {/* FIX: Removed hardcoded inline styles for color to rely on CSS variables */}
          <div className="subscription-detail-item" style={{ borderBottom: 'none' }}>
            <p className="subscription-detail-label" style={{ color: 'var(--text-secondary)' }}>Days Left</p>
            <strong className="subscription-detail-value" style={{ color: 'var(--text-primary)' }}>{daysLeftInPlan}</strong>
          </div>
        </div>
        <button
          onClick={() => { onClose(); togglePaymentModal(); }}
          className="renew-button-style"
          style={{ marginTop: '30px' }}
        >
          Renew Plan
        </button>
      </div>
    </div>
  );
};

export default SubscriptionDetailsModal;
