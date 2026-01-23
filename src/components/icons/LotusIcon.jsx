import React from "react";

const LotusIcon = ({ className = "", size = 100, withGlow = false }) => {
  const height = size * 0.75;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {withGlow && (
        <div className="absolute inset-0 bg-yellow-200 blur-3xl opacity-40 rounded-full scale-125 z-0" />
      )}
      <svg
        width={size}
        height={height}
        viewBox="0 0 200 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Center Petal */}
        <path
          d="M100 140 C100 140 70 80 100 20 C130 80 100 140 100 140Z"
          fill="#EC4899"
          fillOpacity="0.4"
        />
        {/* Inner Left */}
        <path
          d="M100 140 C100 140 50 90 70 40 C90 90 100 140 100 140Z"
          fill="#EC4899"
          fillOpacity="0.4"
        />
        {/* Inner Right */}
        <path
          d="M100 140 C100 140 150 90 130 40 C110 90 100 140 100 140Z"
          fill="#EC4899"
          fillOpacity="0.4"
        />
        {/* Middle Left */}
        <path
          d="M100 140 C100 140 20 100 40 60 C70 110 100 140 100 140Z"
          fill="#EC4899"
          fillOpacity="0.35"
        />
        {/* Middle Right */}
        <path
          d="M100 140 C100 140 180 100 160 60 C130 110 100 140 100 140Z"
          fill="#EC4899"
          fillOpacity="0.35"
        />
        {/* Outer Left */}
        <path
          d="M100 140 C100 140 0 110 10 80 C50 120 100 140 100 140Z"
          fill="#EC4899"
          fillOpacity="0.3"
        />
        {/* Outer Right */}
        <path
          d="M100 140 C100 140 200 110 190 80 C150 120 100 140 100 140Z"
          fill="#EC4899"
          fillOpacity="0.3"
        />
      </svg>
    </div>
  );
};

export default LotusIcon;
