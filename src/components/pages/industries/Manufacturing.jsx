import React, { useEffect } from 'react';
import IndustryTemplate from '../../IndustryTemplate';
import manufacturingImage from '../../../assets/industries/manufacturing.jpg';

const Manufacturing = () => {
  useEffect(() => {
    if (!window.location.hash.includes('#')) {
      window.location.href = window.location.href + '#';
      window.location.reload();
    }
    }, []);
  const description = `The manufacturing sector is undergoing a digital revolution through Industry 4.0, with technologies like IoT, AI, robotics, and big data transforming production and supply chain operations. We provide end-to-end digital solutions for manufacturers, including smart factory automation, predictive maintenance, quality control systems, and real-time analytics. Our focus is on increasing productivity, reducing waste, and improving time-to-market through customized tech solutions that integrate seamlessly with existing infrastructure.`;

  return <IndustryTemplate title="Manufacturing" description={description} image={manufacturingImage} />;
};

export default Manufacturing;
