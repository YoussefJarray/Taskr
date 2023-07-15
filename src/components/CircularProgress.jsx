import React from 'react';

export function CircularProgress({ progress }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = ((100 - progress) / 100) * circumference;

  return (
    <div className="container flex items-center justify-center">
      {/* Circle */}
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-32 h-32">
          <circle className="text-slate-600" strokeWidth="" stroke="currentColor" fill="transparent" r={radius} cx="50%" cy="50%" />
          <circle
            className="text-purple-700"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
            transform="rotate(-90 50% 50%)"
          />
        </svg>
        <span className="absolute text-xl font-semibold text-purple-700">{`${progress}%`}</span>
      </div>
    </div>
  );
}