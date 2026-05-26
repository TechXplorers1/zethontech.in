import React, { useEffect } from 'react';
import IndustryTemplate from '../../IndustryTemplate';
import bfsImage from '../../../assets/industries/bfsi.jpg'; // Add relevant image

const BFSI = () => {
  useEffect(() => {
    if (!window.location.hash.includes('#')) {
      window.location.href = window.location.href + '#';
      window.location.reload();
    }
    }, []);
  const description = `The Banking, Financial Services, and Insurance (BFSI) industry is undergoing rapid transformation driven by digital innovation, customer expectations, and regulatory changes. At the heart of this evolution is the need for secure, scalable, and compliant solutions that enhance customer experience and operational efficiency. From mobile banking and digital wallets to AI-driven risk analysis and fraud detection systems, BFSI institutions are investing in technology to stay competitive and resilient. We provide end-to-end IT services for the BFSI sector, including core banking transformation, financial analytics, digital onboarding, and blockchain-based solutions. Our focus is on delivering reliable, real-time solutions while ensuring data privacy and regulatory adherence.`;

  return <IndustryTemplate title="BFSI" description={description} image={bfsImage} />;
};

export default BFSI;
