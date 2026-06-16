import React from 'react';
import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';

// Inline SVG leaf icon (modern minimalist leaf)
const LeafIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#22c55e"
    width="16"
    height="16"
    className="leaf-icon"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 2C8 2 5 8 5 12c0 4 3 7 7 7s7-3 7-7c0-4-3-10-7-10z" />
  </svg>
);

export const LeafLink: React.FC<LinkProps> = ({ children, className = '', ...props }) => {
  return (
    <Link {...props} className={`leaf-link ${className}`.trim()}>
      <LeafIcon />
      <span className="leaf-link-text ml-1 align-middle">{children}</span>
    </Link>
  );
};
