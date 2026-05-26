import React, { useEffect } from 'react';
import IndustryTemplate from '../../IndustryTemplate';
import retailImage from '../../../assets/industries/retail.jpg';

const Retail = () => {
  useEffect(() => {
    if (!window.location.hash.includes('#')) {
      window.location.href = window.location.href + '#';
      window.location.reload();
    }
    }, []);
  const description = `The retail industry is driven by evolving consumer behavior, omnichannel experiences, and data-driven personalization. We provide digital solutions that help retailers streamline operations, optimize inventory, and deliver seamless customer journeys both online and in-store. Our offerings include e-commerce platforms, POS integration, CRM systems, and AI-powered recommendation engines. By leveraging technology, retailers can improve loyalty, reduce cart abandonment, and make more informed decisions that boost profitability.`;

  return <IndustryTemplate title="Retail" description={description} image={retailImage} />;
};

export default Retail;
