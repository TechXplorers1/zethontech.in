// src/components/IndustriesDropdown.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import bfsiIcon from '../assets/bfsi.png';
import constructionIcon from '../assets/construction.png';
import educationIcon from '../assets/education.png';
import governmentIcon from '../assets/government.png';
import healthcareIcon from '../assets/health.png';
import manufacturingIcon from '../assets/manufacturing.png';
import oilgasIcon from '../assets/oil_gas.png';
import retailIcon from '../assets/retail.png';
import telecomIcon from '../assets/tele_communication.png';
import '../styles/Industries.css';

const industries = [
  { title: "BFSI", icon: bfsiIcon, route: "bfsi" },
  { title: "Construction", icon: constructionIcon, route: "construction" },
  { title: "Education", icon: educationIcon, route: "education" },
  { title: "Government", icon: governmentIcon, route: "government" },
  { title: "Healthcare", icon: healthcareIcon, route: "healthcare" },
  { title: "Manufacturing", icon: manufacturingIcon, route: "manufacturing" },
  { title: "Oil & Gas", icon: oilgasIcon, route: "oil-gas" },
  { title: "Retail", icon: retailIcon, route: "retail" },
  { title: "Tele\ncommunication", icon: telecomIcon, route: "telecommunication" },
];

const IndustriesDropdown = () => {
  return (
    <div className="industries-dropdown-container">
      <div className="industries-dropdown">
        {industries.map((industry, index) => (
          <Link
            to={`/industries/${industry.route}`}
            key={index}
            className="industry-card"
          >
            <img src={industry.icon} alt={industry.title} />
            <span>{industry.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default IndustriesDropdown;
