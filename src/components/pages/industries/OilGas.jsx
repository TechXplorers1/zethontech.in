import React, { useEffect } from 'react';
import IndustryTemplate from '../../IndustryTemplate';
import oilgasImage from '../../../assets/industries/oilgas.jpg';

const OilGas = () => {
  useEffect(() => {
    if (!window.location.hash.includes('#')) {
      window.location.href = window.location.href + '#';
      window.location.reload();
    }
    }, []);
  const description = `The oil & gas industry faces increasing pressure to improve operational efficiency, reduce environmental impact, and ensure worker safety. Digital solutions are essential to achieving these goals. We deliver specialized technology services for exploration, drilling, refining, and distribution. From real-time asset monitoring and remote field operations to advanced analytics and environmental compliance systems, our solutions are designed to maximize productivity while minimizing risk. We help oil & gas companies future-proof their operations through smart technology integration.`;

  return <IndustryTemplate title="Oil & Gas" description={description} image={oilgasImage} />;
};

export default OilGas;
