import React from 'react';
import '../styles/about.css';
import aboutImage from '../assets/about.png';

const About = ({ aboutRef }) => {
  return (
    <div className="about-container" ref={aboutRef} id="about">
      <h2 className="main-about-heading">About Us</h2>

      <div className="about-wrapper">
        <div className="about-image-container">
          <img src={aboutImage} alt="About Zethon Tech" />
        </div>
        <div className="about-text-container">
          <h2 className="about-heading">About Zethon</h2>
          <p>
            Zethon Tech Is A Technology-Driven And Innovation-Focused Consulting Firm Committed To Delivering Top-Tier Solutions In IT Services, Staffing, Software Engineering, And Enterprise Application Development. Our Mission Is To Explore, Innovate, And Implement Cutting-Edge Technologies That Empower Our Clients To Streamline Operations, Accelerate Growth, And Stay Ahead In An Ever-Evolving Digital Landscape.
          </p>
          <p>
            At Zethon Tech, We Bring Together A Passionate Team Of Experts, Modern Methodologies, And Industry Best Practices To Address The Unique Challenges Of Every Project. By Aligning The Right Talent With The Right Technology, We Ensure Flawless Execution And Impactful Outcomes. Our Client-First Approach And Dedication To Excellence Help Businesses Achieve Their Goals With Clarity, Confidence, And A Future-Ready Mindset.
          </p>
          <p>
            With a strong foundation in innovation and a relentless pursuit of excellence, Zethon Tech is not just a service provider — we are a strategic partner in your digital transformation journey. Whether it's crafting scalable enterprise solutions or delivering agile staffing models, our focus remains on driving measurable results and building long-term value for our clients.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
