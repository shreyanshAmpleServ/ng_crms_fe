import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './logo.css';

const CRMSLogo = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Start animation on component mount
    setAnimate(true);

    // Loop animation every 3 seconds
    const interval = setInterval(() => {
      setAnimate(false);
      setTimeout(() => setAnimate(true), 100);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container-fluid">
      <div className="row justify-content-start align-items-center" style={{ minHeight: '100%' }}>
        <div className="col-auto">
          <div className={`crms-logo-container ${animate ? 'animated' : ''}`}>
            <h1 className="crms-text d-flex mb-0">
              <span className="letter letter-c">C</span>
              <span className="letter letter-r">R</span>
              <span className="letter letter-m">M</span>
              <span className="letter letter-s">S</span>
            </h1>
            {/* <div className="logo-subtitle text-center mt-2">
              <small className="text-muted">Customer Relationship Management</small>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMSLogo;