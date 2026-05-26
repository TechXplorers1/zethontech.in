import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll window and body
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
    
    // In case #root or another container is handling the scroll due to height: 100%
    const root = document.getElementById('root');
    if (root) {
      root.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
