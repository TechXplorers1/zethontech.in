import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import '../styles/ServiceLayout.css';

const ServiceLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="service-layout">
      
      
      <main className="service-main">
        <div className="service-content-wrapper">
          {/* <button 
            onClick={() => navigate(-1)}
            className="service-back-button"
          >
            ← Back
          </button> */}
          <div className="service-content">
            <Outlet />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServiceLayout;