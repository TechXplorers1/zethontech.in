import React, { useEffect } from 'react';
import IndustryTemplate from '../../IndustryTemplate';
import telecomImage from '../../../assets/industries/telecom.jpg';

const Telecommunication  = () => {
  useEffect(() => {
    if (!window.location.hash.includes('#')) {
      window.location.href = window.location.href + '#';
      window.location.reload();
    }
    }, []);
  const description = `The telecom industry is at the forefront of digital transformation, driven by 5G, cloud computing, and IoT. To keep pace with increasing demand and complex networks, telecom providers are investing in intelligent automation, network virtualization, and customer-centric platforms. We support telecom operators with solutions for OSS/BSS, customer self-service portals, predictive maintenance, and real-time analytics. Our aim is to help telecom companies enhance service quality, reduce churn, and innovate faster in a highly competitive market.`;

  return <IndustryTemplate title="Telecommunication" description={description} image={telecomImage} />;
};

export default Telecommunication ;
