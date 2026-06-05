import React, { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

// The sitekey can be loaded from the environment (VITE_RECAPTCHA_SITE_KEY) or falls back to a default key
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LfNjQwtAAAAAGyirqn5sIXKSqCN7w86cIy4hnfD";

const CaptchaGate = ({ children }) => {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Check if the user has already verified in this session
    const sessionVerified = sessionStorage.getItem('site_captcha_verified');
    if (sessionVerified === 'true') {
      setIsVerified(true);
    }
  }, []);

  const handleVerify = (token) => {
    if (token) {
      // User successfully solved the CAPTCHA
      setIsVerified(true);
      sessionStorage.setItem('site_captcha_verified', 'true');
    }
  };

  const handleExpired = () => {
    setIsVerified(false);
    sessionStorage.removeItem('site_captcha_verified');
  };

  // Manage body scroll and custom cursor visibility when CAPTCHA is active
  useEffect(() => {
    if (!isVerified) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVerified]);

  return (
    <>
      {/* Always render children in background for smooth transition */}
      {children}

      {/* Conditionally render the futuristic CAPTCHA overlay if not verified */}
      {!isVerified && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999, // Ensure it floats above the navigation bar/footer
          fontFamily: "'Orbitron', 'Segoe UI', sans-serif",
          color: '#ffffff'
        }}>
          <div style={{
            backgroundColor: 'rgba(10, 10, 10, 0.9)',
            border: '2px solid rgba(0, 240, 255, 0.6)',
            boxShadow: '0 0 25px rgba(0, 240, 255, 0.4)',
            padding: '2.5rem 2rem',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '420px',
            width: '90%'
          }}>
            <h2 style={{
              marginBottom: '1rem',
              color: '#ffffff',
              fontSize: '1.75rem',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              textShadow: '0 0 10px rgba(0, 240, 255, 0.7)'
            }}>
              Security Check
            </h2>

            <p style={{
              marginBottom: '2rem',
              color: '#a3a3a3',
              lineHeight: '1.6',
              fontSize: '0.95rem',
              fontFamily: "'Segoe UI', sans-serif"
            }}>
              Please verify that you are human to access Zethon Tech.
            </p>

            <div style={{
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(0, 240, 255, 0.2)'
            }}>
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                theme="dark"
                onChange={handleVerify}
                onExpired={handleExpired}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CaptchaGate;
