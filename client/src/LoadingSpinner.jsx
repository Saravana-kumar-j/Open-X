// LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css'; // Make sure to include this CSS file

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner">
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>
  </div>
);

export default LoadingSpinner;
