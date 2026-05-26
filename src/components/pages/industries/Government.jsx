import React, { useEffect } from 'react';
import IndustryTemplate from '../../IndustryTemplate';
import governmentImage from '../../../assets/industries/government.jpg';

const Government = () => {
  useEffect(() => {
    if (!window.location.hash.includes('#')) {
      window.location.href = window.location.href + '#';
      window.location.reload();
    }
    }, []);
  const description = `Government agencies around the world are focusing on digital transformation to improve citizen services, increase transparency, and optimize operations. Our solutions help public sector organizations embrace e-governance, digitize public records, automate workflows, and ensure compliance. We specialize in secure data management, citizen portals, and public resource planning. By modernizing legacy systems and enabling real-time communication, we help governments be more responsive, efficient, and citizen-centric.`;

  return <IndustryTemplate title="Government" description={description} image={governmentImage} />;
};

export default Government;
