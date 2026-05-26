import React from 'react';
import Radio from '../Radio';
import {
  selectedPlanDetailsStyle,
  paymentPlanTitleStyle,
  paymentPlanPriceStyle,
  paymentPlanPeriodStyle,
  paymentPlanFeaturesListStyle,
  paymentPlanSelectButtonStyle
} from '../../styles';

const PaymentPlanModal = ({ selectedRadioPlan, handleRadioPlanChange, handleProceedToPayment, onClose }) => {
  const planOptions = {
    'glass-silver': { name: 'Silver', price: '$199', period: '/month', features: ['Full dashboard access', 'Monthly chart updates', 'Basic support'] },
    'glass-gold': { name: 'Gold', price: '$499', period: '/3 months', features: ['All Silver features', 'Priority support', 'Quarterly review calls'] },
    'glass-platinum': { name: 'Platinum', price: '$999', period: '/year', features: ['All Gold features', 'Dedicated account manager', 'Annual strategic planning session'] },
  };
  const currentSelectedPlanDetails = planOptions[selectedRadioPlan];

  return (
    <div className="modal-overlay">
      <div className="modal-content-style" style={{ maxWidth: '600px', padding: '40px', background: '#334155', color: '#f1f5f9' }}>
        <button onClick={onClose} className="modal-close-button">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h3 style={{
          marginBottom: '30px',
          textAlign: 'center',
          color: '#f1f5f9',
          fontSize: '1.8rem',
          fontWeight: '700'
        }}>
          Choose Your Plan
        </h3>

        {/* Integrated Radio Component */}
        <div style={{ margin: '20px auto 30px auto', width: 'fit-content' }}>
          <Radio
            selectedRadioPlan={selectedRadioPlan}
            handleRadioPlanChange={handleRadioPlanChange}
          />
        </div>


        {/* Display details of the currently selected plan */}
        {currentSelectedPlanDetails && (
          <div style={selectedPlanDetailsStyle}>
            <h4 style={paymentPlanTitleStyle}>{currentSelectedPlanDetails.name} Plan</h4>
            <p style={paymentPlanPriceStyle}>
              {currentSelectedPlanDetails.price}
              <span style={paymentPlanPeriodStyle}>{currentSelectedPlanDetails.period}</span>
            </p>
            <ul style={paymentPlanFeaturesListStyle}>
              {currentSelectedPlanDetails.features.map((feature, index) => (
                <li key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#4ade80' }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleProceedToPayment(currentSelectedPlanDetails.name, currentSelectedPlanDetails.price)}
              style={paymentPlanSelectButtonStyle}
            >
              Proceed to Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPlanModal;
