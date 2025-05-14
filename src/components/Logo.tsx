import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'medium' }) => {
  // Size classes based on the size prop
  const sizeClasses = {
    small: 'h-8',
    medium: 'h-10',
    large: 'h-12'
  };

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <svg 
        className={`${sizeClasses[size]} mr-2`}
        viewBox="0 0 512 512" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Book/Journal Base */}
        <rect x="80" y="80" width="352" height="352" rx="20" fill="#4F46E5" />
        
        {/* Pages */}
        <rect x="100" y="100" width="312" height="312" rx="10" fill="#F9FAFB" />
        
        {/* Lines representing text */}
        <rect x="130" y="150" width="252" height="8" rx="4" fill="#D1D5DB" />
        <rect x="130" y="180" width="200" height="8" rx="4" fill="#D1D5DB" />
        <rect x="130" y="210" width="252" height="8" rx="4" fill="#D1D5DB" />
        <rect x="130" y="240" width="180" height="8" rx="4" fill="#D1D5DB" />
        <rect x="130" y="270" width="252" height="8" rx="4" fill="#D1D5DB" />
        <rect x="130" y="300" width="220" height="8" rx="4" fill="#D1D5DB" />
        <rect x="130" y="330" width="252" height="8" rx="4" fill="#D1D5DB" />
        
        {/* Bookmark */}
        <path d="M350 100V160L330 140L310 160V100H350Z" fill="#9F7AEA" />
        
        {/* Globe element representing "Sphere" */}
        <circle cx="380" cy="380" r="60" fill="#4F46E5" stroke="#F9FAFB" strokeWidth="8" />
        <ellipse cx="380" cy="380" rx="40" ry="60" stroke="#F9FAFB" strokeWidth="4" />
        <line x1="320" y1="380" x2="440" y2="380" stroke="#F9FAFB" strokeWidth="4" />
        <line x1="380" y1="320" x2="380" y2="440" stroke="#F9FAFB" strokeWidth="4" />
      </svg>
      <span className="font-bold text-news-blue-dark text-xl">JournalSphere</span>
    </Link>
  );
};

export default Logo;
