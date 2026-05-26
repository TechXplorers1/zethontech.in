import React, { useEffect } from 'react';
import IndustryTemplate from '../../IndustryTemplate';
import educationImage from '../../../assets/industries/education.jpg';

const Education = () => {
  useEffect(() => {
    if (!window.location.hash.includes('#')) {
      window.location.href = window.location.href + '#';
      window.location.reload();
    }
    }, []);
  const description = `Education is evolving rapidly with the integration of digital technologies, creating more personalized and accessible learning experiences. From virtual classrooms and e-learning platforms to AI-powered assessment tools and student analytics, the education sector is undergoing a digital renaissance. We offer robust solutions for institutions, including Learning Management Systems (LMS), ERP for academic operations, and remote learning infrastructure. Our goal is to empower educators and learners with interactive, secure, and scalable technologies.`;

  return <IndustryTemplate title="Education" description={description} image={educationImage} />;
};

export default Education;
