import React, { useState } from 'react';
import { Flame, Moon } from 'lucide-react';

interface ActivityCardProps {
  type: 'exercise' | 'sleep';
  value: number;
  onUpdate: (value: number) => void;
}

export function ActivityCard({ type, value, onUpdate }: ActivityCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  const handleSave = () => {
    const numValue = parseFloat(inputValue) || 0;
    onUpdate(numValue);
    setIsEditing(false);
  };

  const config = {
    exercise: {
      icon: Flame,
      title: 'Exercise',
      unit: 'kcal burned',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
    sleep: {
      icon: Moon,
      title: 'Sleep',
      unit: 'hours',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
    },
  };

  const { icon: Icon, title, unit, bgColor, iconColor } = config[type];

  return (
    <div className={`${bgColor} rounded-2xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder={unit}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-3 py-1.5 bg-[#192939] text-white text-sm rounded-lg hover:bg-[#2a3f54] transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setInputValue(value.toString());
                setIsEditing(false);
              }}
              className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full text-left"
        >
          <div className="text-2xl font-semibold text-gray-900">
            {value || '-'}
          </div>
          <div className="text-xs text-gray-500">{unit}</div>
        </button>
      )}
    </div>
  );
}
