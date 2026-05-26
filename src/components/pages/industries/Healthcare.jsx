import React, { useEffect } from 'react';
import IndustryTemplate from '../../IndustryTemplate';
import healthcareImage from '../../../assets/industries/healthcare.jpg';

const Healthcare = () => {
  useEffect(() => {
    if (!window.location.hash.includes('#')) {
      window.location.href = window.location.href + '#';
      window.location.reload();
    }
    }, []);
  const description = `Healthcare is rapidly embracing technology to improve patient care, operational efficiency, and regulatory compliance. From electronic health records (EHR) and telemedicine platforms to AI-assisted diagnostics and mobile health apps, digital transformation is revolutionizing healthcare delivery. We provide HIPAA-compliant solutions that streamline clinical workflows, enhance patient engagement, and enable data-driven decision-making. Our expertise lies in integrating systems for hospitals, clinics, and healthcare providers to ensure seamless, secure, and scalable operations.`;

  return <IndustryTemplate title="Healthcare" description={description} image={healthcareImage} />;
};

export default Healthcare;
