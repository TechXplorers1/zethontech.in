import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import CustomNavbar from './components/Navbar';
import mobileImg from './assets/mobile_app_dev.png';
import webImg from './assets/web_app_dev.png';
import digiImg from './assets/digi_mark.png';
import ittalentImg from './assets/it_talent_supply.png';
import jobsupportImg from './assets/job_support.png';
import cybersecurityImg from './assets/cyber_security.png';
import Footer from './components/Footer';
import About from './components/About';

function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const contentRef = useRef(null);
  const aboutRef = useRef(null);
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const navigate = useNavigate();

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 50);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="hero-section">
      <div className="hero-overlay"></div>

      <CustomNavbar scrolled={navbarScrolled} aboutRef={aboutRef} />

      <div className="main-content">
        <div className="content-container">
          <div className="welcome-section">
            <h1 className="cinematic-text">
              Welcome <span>to</span> Zethon Tech private limited
            </h1>
          </div>

          <div className="engineering-section">
            <h2 className="future-heading">EXPLORING THE FUTURE</h2>
            <h3 className="tech-innovation">OF TECH & INNOVATION</h3>
            <div className="action-buttons">
              <button className="cta-button talk-button" onClick={() => navigate('/contact')}>
                LET'S TALK
              </button>
              <button className="cta-button services-button" onClick={scrollToContent}>
                EXPLORE SERVICES
              </button>
            </div>
          </div>
        </div>

        <div ref={aboutRef}>
          <About />
        </div>

        <div className="content-section" ref={contentRef}>
          <h2 className="section-title">What we Offer</h2>
          <div className="card-container">
            <div className="info-card" onClick={() => navigate('/services/mobile-app-development')}>
              <img src={mobileImg} alt="Mobile App" className="card-icon" />
              <h3>Mobile Application Development</h3>
            </div>
            <div className="info-card" onClick={() => navigate('/services/web-app-development')}>
              <img src={webImg} alt="Web App" className="card-icon" />
              <h3>Web Application Development</h3>
            </div>
            <div className="info-card" onClick={() => navigate('/services/digital-marketing')}>
              <img src={digiImg} alt="Digital Marketing" className="card-icon" />
              <h3>Digital Marketing</h3>
            </div>
            <div className="info-card" onClick={() => navigate('/services/it-talent-supply')}>
              <img src={ittalentImg} alt="IT Talent" className="card-icon" />
              <h3>IT Talent Supply</h3>
            </div>
            <div className="info-card" onClick={() => navigate('/services/job-support')}>
              <img src={jobsupportImg} alt="Consulting" className="card-icon" />
              <h3>Job Support & IT Consulting</h3>
            </div>
            <div className="info-card" onClick={() => navigate('/services/cyber_security')}>
              <img src={cybersecurityImg} alt="Cyber Security" className="card-icon" style={{ width: '70px', height: '70px',marginBottom:'10px' }} />
              <h3>Cyber Security</h3>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;