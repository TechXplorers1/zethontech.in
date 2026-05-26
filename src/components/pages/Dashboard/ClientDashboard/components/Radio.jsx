import React from 'react';
import { StyledWrapper } from '../styles';

const Radio = ({ selectedRadioPlan, handleRadioPlanChange }) => {
  return (
    <StyledWrapper>
      <div className="glass-radio-group">
        <input
          type="radio"
          name="plan"
          id="glass-silver"
          checked={selectedRadioPlan === 'glass-silver'}
          onChange={() => handleRadioPlanChange('glass-silver')}
        />
        <label htmlFor="glass-silver">Silver</label>
        <input
          type="radio"
          name="plan"
          id="glass-gold"
          checked={selectedRadioPlan === 'glass-gold'}
          onChange={() => handleRadioPlanChange('glass-gold')}
        />
        <label htmlFor="glass-gold">Gold</label>
        <input
          type="radio"
          name="plan"
          id="glass-platinum"
          checked={selectedRadioPlan === 'glass-platinum'}
          onChange={() => handleRadioPlanChange('glass-platinum')}
        />
        <label htmlFor="glass-platinum">Platinum</label>
        <div className="glass-glider" /> {/* This will be dynamically styled by the parent */}
      </div>
    </StyledWrapper>
  );
};

export default Radio;
