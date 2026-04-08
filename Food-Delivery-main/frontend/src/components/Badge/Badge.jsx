import React from 'react';
import './Badge.css';

const Badge = ({ text, type = 'orange', className = '' }) => {
  return (
    <div className={`rs-badge ${type} ${className}`}>
      {text}
    </div>
  );
};

export default Badge;
