import React from 'react';

interface CircularProgressProps {
  current: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({
  current,
  total,
  size = 200,
  strokeWidth = 16,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const remaining = Math.max(0, total - current);
  const percentage = Math.max(0, Math.min(100, (remaining / total) * 100));
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#192939"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <div className="text-4xl font-semibold text-gray-900">
          {remaining.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500">kcal left</div>
        <div className="text-xs text-gray-400 mt-1">
          of {total.toLocaleString()} kcal
        </div>
      </div>
    </div>
  );
}
