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
        {/* Heart shape */}
        <path
          d="M256 448l-30.164-27.211C118.718 322.442 48 258.61 48 179.095 48 114.221 97.918 64 162.4 64c36.399 0 70.717 16.742 93.6 43.947C278.882 80.742 313.199 64 349.6 64 414.082 64 464 114.221 464 179.095c0 79.516-70.719 143.348-177.836 241.694L256 448z"
          fill="#E53E3E"
        />

        {/* Inner heart highlight */}
        <path
          d="M256 400l-25-22.5C147.5 297.5 89 244.5 89 179.1 89 124.5 130.5 84 186 84c24.5 0 49.9 12.5 70 36.5C277 96.5 302.5 84 327 84c55.5 0 97 40.5 97 95.1 0 65.4-58.5 118.4-142 198.4L256 400z"
          fill="#FC8181"
        />

        {/* Globe element representing "Sphere" */}
        <circle cx="350" cy="350" r="60" fill="#4F46E5" stroke="#F9FAFB" strokeWidth="8" />
        <ellipse cx="350" cy="350" rx="40" ry="60" stroke="#F9FAFB" strokeWidth="4" />
        <line x1="290" y1="350" x2="410" y2="350" stroke="#F9FAFB" strokeWidth="4" />
        <line x1="350" y1="290" x2="350" y2="410" stroke="#F9FAFB" strokeWidth="4" />
      </svg>
      <span className="font-bold text-news-blue-dark text-xl">JournalSphere</span>
    </Link>
  );
};

export default Logo;
