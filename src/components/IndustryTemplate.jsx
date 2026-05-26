import React from 'react';
import '../styles/IndustryStyles.css';
import CustomNavbar from './Navbar';
const IndustryTemplate = ({ title, description, image }) => {
  return (
    <div className="industry-layout">
      <CustomNavbar />
      <h2 className="industry-title">{title}</h2>
      <img src={image} alt={`${title} Banner`} className="industry-image" />
      <div className="industry-description">
        <p>{description}</p>
      </div>
    </div>
  );
};

export default IndustryTemplate;
