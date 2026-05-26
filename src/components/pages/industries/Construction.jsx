import React, { useEffect } from 'react';
import IndustryTemplate from '../../IndustryTemplate';
import constructionImage from '../../../assets/industries/construction.jpg';

const Construction = () => {
  useEffect(() => {
    if (!window.location.hash.includes('#')) {
      window.location.href = window.location.href + '#';
      window.location.reload();
    }
    }, []);
  const description = `The construction industry is embracing digital transformation to improve project delivery, safety, and cost-efficiency. Technology solutions like Building Information Modeling (BIM), IoT-enabled equipment tracking, and predictive analytics are reshaping how construction projects are planned and executed. Our services for the construction industry cover areas such as project lifecycle management, workforce scheduling, site safety monitoring, and real-time reporting dashboards. We help construction companies modernize legacy systems, enhance collaboration, and make data-driven decisions that reduce delays and overruns.`;

  return <IndustryTemplate title="Construction" description={description} image={constructionImage} />;
};

export default Construction;
