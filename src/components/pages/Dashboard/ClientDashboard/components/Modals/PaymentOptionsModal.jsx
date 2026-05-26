import React, { useState } from 'react';

const PaymentOptionsModal = ({ onClose, selectedPlanName, selectedPlanPrice }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card'); // Default to card

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePayClick = () => {
    // In a real application, this would trigger a payment gateway integration
    // For now, just close the modal after a short delay
    setTimeout(() => {
      onClose();
      // Optionally show a success message or navigate
    }, 1000);
  };

  return (
    <div className="modal-overlay">
      <div className="payment-modal-content-wrapper">
        <button onClick={onClose} className="modal-close-button" style={{ top: '20px', right: '20px' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="payment-modal-grid">
          {/* Payment Information Section */}
          <div className="payment-info-section">
            <div className="payment-section-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Payment Information
              <span className="ssl-badge">256-bit SSL</span>
            </div>

            <h4 className="payment-sub-heading">Choose Payment Method</h4>
            <div className="payment-method-options">
              <div
                className={`payment-method-card ${selectedPaymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => handlePaymentMethodSelect('card')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                <span>Visa + Mastercard - Amex</span>
              </div>
              <div
                className={`payment-method-card ${selectedPaymentMethod === 'paypal' ? 'selected' : ''}`}
                onClick={() => handlePaymentMethodSelect('paypal')}
              >
                <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-mark-color.svg" alt="PayPal" style={{ height: '24px' }} />
                <span>Pay with PayPal</span>
              </div>
              <div
                className={`payment-method-card ${selectedPaymentMethod === 'direct_transfer' ? 'selected' : ''}`}
                onClick={() => handlePaymentMethodSelect('direct_transfer')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>Direct transfer</span>
              </div>
            </div>

            <p className="all-methods-secured">All methods secured</p>

            {/* Card Payment Form (visible if 'card' is selected) */}
            {selectedPaymentMethod === 'card' && (
              <div className="card-form">
                <label htmlFor="emailAddress">Email Address</label>
                <input type="email" id="emailAddress" placeholder="john@example.com" />

                <label htmlFor="cardNumber">Card Number</label>
                <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" />

                <div className="form-row">
                  <div>
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input type="text" id="expiryDate" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label htmlFor="cvv">CVV</label>
                    <input type="text" id="cvv" placeholder="123" />
                  </div>
                </div>

                <label htmlFor="cardholderName">Cardholder Name</label>
                <input type="text" id="cardholderName" placeholder="John Doe" />

                <div className="checkbox-group">
                  <input type="checkbox" id="saveCard" />
                  <label htmlFor="saveCard">Save this card for future payments</label>
                </div>
                <div className="checkbox-group">
                  <input type="checkbox" id="rememberMe" defaultChecked />
                  <label htmlFor="rememberMe">Remember me for faster checkout</label>
                </div>
              </div>
            )}

            {/* PayPal Details (visible if 'paypal' is selected) */}
            {selectedPaymentMethod === 'paypal' && (
              <div style={{
                padding: '20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                color: '#1e293b', // Dark text for light mode
                background: '#f8fafc',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#e0f2fe', // Light blue background for icon
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0' }}>Continue with PayPal</h3>
                <p style={{ fontSize: '1rem', color: '#475569', margin: '0' }}>
                  You'll be securely redirected to PayPal to complete your payment of
                  <span style={{ fontWeight: '600', color: '#1e293b', marginLeft: '5px' }}>{selectedPlanPrice}</span>
                </p>
                <button
                  onClick={() => {
                    // In a real app, this would initiate PayPal redirect
                    window.open('https://www.paypal.com', '_blank'); // Placeholder for actual PayPal redirection
                    onClose(); // Close modal after initiating redirect
                  }}
                  style={{
                    background: '#0070BA', // PayPal blue
                    color: 'white',
                    border: 'none',
                    padding: '12px 25px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'background-color 0.2s, transform 0.2s',
                    width: 'fit-content', // Adjust width to content
                    margin: '0 auto' // Center the button
                  }}
                >
                  <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-mark-color.svg" alt="PayPal Icon" style={{ height: '20px', filter: 'brightness(0) invert(1)' }} />
                  Continue to PayPal
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(0deg)' }}>
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            )}

            {/* Direct Transfer/Bank Transfer Details (visible if 'direct_transfer' is selected) */}
            {selectedPaymentMethod === 'direct_transfer' && (
              <div style={{
                padding: '20px',
                textAlign: 'center',
                color: '#1e293b', // Dark text for light mode
                background: '#f8fafc',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#e0f2fe', // Light blue background for icon
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0' }}>Bank Transfer Details</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0' }}>Secure wire transfer information</p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '15px',
                  width: '100%',
                  maxWidth: '500px',
                  margin: '20px 0'
                }}>
                  <div style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#64748b' }}>Bank Name:</p>
                    <strong style={{ fontSize: '1rem', color: '#1e293b' }}>TechXplorers Business Bank</strong>
                  </div>
                  <div style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#64748b' }}>Account Number:</p>
                    <strong style={{ fontSize: '1rem', color: '#1e293b' }}>1234567890</strong>
                  </div>
                  <div style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#64748b' }}>Routing Number:</p>
                    <strong style={{ fontSize: '1rem', color: '#1e293b' }}>021000021</strong>
                  </div>
                  <div style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#64748b' }}>Reference:</p>
                    <strong style={{ fontSize: '1rem', color: '#047857' }}>INV-ADMIN-1752558009349</strong>
                  </div>
                </div>

                <div style={{
                  background: '#fffbe0', // Light yellow background
                  border: '1px solid #ffe0b2', // Orange border
                  borderRadius: '8px',
                  padding: '15px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  width: '100%',
                  maxWidth: '500px',
                  textAlign: 'left'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <p style={{ margin: '0', fontSize: '0.9rem', color: '#78350f' }}>
                    <strong style={{ color: '#f59e0b' }}>Important Instructions:</strong> Please include the reference number <strong style={{ color: '#f59e0b' }}>INV-ADMIN-1752558009349</strong> in your transfer description to ensure proper processing.
                  </p>
                </div>
              </div>
            )}

            <div className="payment-buttons">
              <button className="cancel-button" onClick={onClose}>Cancel</button>
              {/* The "Pay" button only makes sense for card or PayPal direct action.
                  For bank transfer, the user has to manually transfer. */}
              {selectedPaymentMethod === 'card' && (
                <button className="pay-button" onClick={handlePayClick}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <path d="M12 1v22"></path>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  Pay {selectedPlanPrice}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="order-summary-section">
            <div className="payment-section-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              Order Summary
            </div>

            <div className="summary-card">
              <div className="summary-item-logo">
                <img src="https://placehold.co/40x40/475569/ffffff?text=TX" alt="TechXplorers Logo" style={{ borderRadius: '8px' }} />
                <div>
                  <p className="summary-main-text">TechXplorers</p>
                  <p className="summary-sub-text">Verified Merchant</p>
                </div>
              </div>
              <div className="summary-rating">
                <span className="star-icon">⭐</span>4.9/5 <span className="reviews-count">(2,847 reviews)</span>
              </div>

              <div className="summary-divider"></div>

              <h5 className="summary-sub-heading">Bill To:</h5>
              <div className="bill-to-details">
                <p><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> John Smith</p>
                <p><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> john@example.com</p>
                <p><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2.003 16.92 16.92 0 0 1-13.82-13.82A2.003 2.003 0 0 1 3.08 2H6.1a2 2 0 0 1 1.95 1.54L9 8.23a2 2 0 0 1-1.1 2.13 11.05 11.05 0 0 0 5.85 5.85 2 2 0 0 1 2.13-1.1l4.69-1.95a2 2 0 0 1 1.54 1.95z"></path></svg> +91 1234567890</p>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-line-item">
                <span>Invoice:</span>
                <span>#INV-001</span>
              </div>
              <div className="summary-line-item">
                <span>Service:</span>
                <span>Executive and senior management team</span>
              </div>
              <div className="summary-line-item">
                <span>Subtotal:</span>
                <span>USD {selectedPlanPrice.replace('$', '')}</span>
              </div>
              <div className="summary-line-item">
                <span>Processing Fee:</span>
                <span className="included-text">Included</span>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <span>USD {selectedPlanPrice.replace('$', '')}</span>
              </div>
            </div>

            <div className="security-trust-info">
              <h5 className="summary-sub-heading">Security & Trust</h5>
              <p><span className="green-dot"></span> 256-bit SSL</p>
              <p><span className="green-dot"></span> PCI Compliant</p>
              <p><span className="green-dot"></span> Fraud Protection</p>
              <p><span className="green-dot"></span> Encrypted</p>
            </div>

            <button className="back-to-dashboard-button" onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <path d="M10 12L6 8L10 4"></path>
              </svg>
              Back to Module
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- PaymentPlanModal Component ---

export default PaymentOptionsModal;
