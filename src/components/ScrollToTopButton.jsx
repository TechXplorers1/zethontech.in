import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = (e) => {
    // Get scroll position from either the target element or window
    const target = e.target;
    const scrollTop = (target === document || target === window) 
      ? (window.pageYOffset || document.documentElement.scrollTop) 
      : target.scrollTop;
      
    if (scrollTop > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    document.body.scrollTo({ top: 0, behavior: "smooth" });
    const root = document.getElementById('root');
    if (root) {
      root.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Use capture phase (true) to catch scroll events from any scrolling container (like #root)
    window.addEventListener("scroll", toggleVisibility, true);
    return () => window.removeEventListener("scroll", toggleVisibility, true);
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '80px', zIndex: 1000 }}>
      {isVisible && 
        <div 
          onClick={scrollToTop} 
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            transition: 'opacity 0.3s',
            fontSize: '20px'
          }}
          title="Scroll to top"
        >
          &#8679;
        </div>
      }
    </div>
  );
};

export default ScrollToTopButton;
