import React from 'react';

interface NutrientBarProps {
  name: string;
  current: number;
  limit: number;
  unit: string;
}

export function NutrientBar({ name, current, limit, unit }: NutrientBarProps) {
  const percentage = Math.min((current / limit) * 100, 100);
  
  let color = 'bg-green-500';
  if (percentage >= 90) {
    color = 'bg-red-500';
  } else if (percentage >= 70) {
    color = 'bg-yellow-500';
  }

  return (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900">{name}</span>
        <span className="text-sm text-gray-600">
          {current.toFixed(1)}{unit} / {limit}{unit}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
