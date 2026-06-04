import React, { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

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

      // Note: In a fully secure setup, this token should be sent to your backend
      // to be verified with the secret key: 6LdSWessAAAAAPoxWF3ecY6KslAySy5KI0Bda6ee
    }
  };

  const handleExpired = () => {
    setIsVerified(false);
    sessionStorage.removeItem('site_captcha_verified');
  };

  // Manage body scroll when CAPTCHA is active
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

  // Load site key from environment variables or use the default public site key
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LdSWessAAAAAJESxNDO_8iq_vZ6GjimfXlan8nG';

  return (
    <>
      {/* Always render the children so the Landing Page background is visible */}
      {children}

      {/* Conditionally render the CAPTCHA overlay if not verified */}
      {!isVerified && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999, // Ensure it's above the navbar and footer
          fontFamily: "'Inter', sans-serif"
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '2.5rem 2rem',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '420px',
            width: '90%'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#1f2937', fontSize: '1.75rem', fontWeight: '800' }}>Security Check</h2>
            <p style={{ marginBottom: '2rem', color: '#4b5563', lineHeight: '1.6', fontSize: '1.05rem' }}>
              Please verify that you are human to access Zethontech.in
            </p>
            <ReCAPTCHA
              sitekey={siteKey}
              onChange={handleVerify}
              onExpired={handleExpired}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CaptchaGate;
