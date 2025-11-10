import React, { useEffect, useState } from 'react';

const SuccessAnimation: React.FC = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation setelah component mount
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`success-animation ${animate ? 'animate' : ''}`}>
      <div className="checkmark-circle">
        <div className="checkmark-background"></div>
        <svg
          className="checkmark-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle 
            className="checkmark-circle-svg" 
            cx="26" 
            cy="26" 
            r="25" 
            fill="none" 
          />
          <path
            className="checkmark-check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
      </div>
    </div>
  );
};

export default SuccessAnimation;