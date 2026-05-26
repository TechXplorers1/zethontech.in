import React from 'react';
import { Link } from 'react-router-dom';
import mobileIcon from '../assets/mobile_app_dev.png';
import webIcon from '../assets/web_app_dev.png';
import marketingIcon from '../assets/digi_mark.png';
import talentIcon from '../assets/it_talent_supply.png';
import consultingIcon from '../assets/job_support.png';
import cyberSecurity from '../assets/cyber_security.png';
import '../styles/Services.css';

const services = [
  {
    title: 'Mobile Application Development',
    icon: mobileIcon,
    path: '/services/mobile-app-development',
  },
  {
    title: 'Web Application Development',
    icon: webIcon,
    path: '/services/web-app-development',
  },
  {
    title: 'Digital Marketing',
    icon: marketingIcon,
    path: '/services/digital-marketing',
  },
  {
    title: 'IT Talent Supply',
    icon: talentIcon,
    path: '/services/it-talent-supply',
  },
  {
    title: 'Job Support & IT Consulting',
    icon: consultingIcon,
    path: '/services/job-support',
  },
  {
    title: 'Cyber Security',
    icon: cyberSecurity,
    path: '/services/cyber_security',
  },
];

const ServicesDropdown = () => {
  return (
    <div className="navbar-services-grid">
      {services.map((service) => (
        <Link
          to={service.path}
          key={service.path}
          className="navbar-services-card-link"
        >
          <div className="navbar-services-card">
            <img src={service.icon} alt="" aria-hidden="true" />
            <span className="navbar-services-card-title">{service.title}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ServicesDropdown;
