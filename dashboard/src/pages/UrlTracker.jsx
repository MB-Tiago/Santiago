import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const UrlTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const handleUrlChange = () => {
      const currentUrl = window.location.href; // Capture the full URL including the origin
      let urlHistory = JSON.parse(localStorage.getItem('urlHistory')) || [];
      if (urlHistory[urlHistory.length - 1] !== currentUrl) {
        urlHistory.push(currentUrl);
        localStorage.setItem('urlHistory', JSON.stringify(urlHistory));
      }
    };

    handleUrlChange();

    window.addEventListener('popstate', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [location]);
};

export default UrlTracker;
