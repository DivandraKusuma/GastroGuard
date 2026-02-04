import React from 'react';
import { Plus } from 'lucide-react';
import { FoodItem, MealSlot } from '../types';

interface MealCardProps {
  title: string;
  slot: MealSlot;
  foods: FoodItem[];
  onAddFood: () => void;
}

export function MealCard({ title, slot, foods, onAddFood }: MealCardProps) {
  const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <button
          onClick={onAddFood}
          className="w-8 h-8 rounded-full bg-[#192939] flex items-center justify-center hover:bg-[#2a3f54] transition-colors"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>

      {foods.length === 0 ? (
        <div className="text-sm text-gray-400">No food added yet</div>
      ) : (
        <div className="space-y-2">
          {foods.map((food) => (
            <div
              key={food.id}
              className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
            >
              {food.thumbnail && (
                <img
                  src={food.thumbnail}
                  alt={food.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {food.name}
                  {food.isAI && (
                    <span className="ml-2 text-xs text-blue-600 font-normal">
                      AI Scanned
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {food.calories} kcal
                </div>
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-gray-200">
            <div className="text-sm font-semibold text-gray-900">
              {title}: {totalCalories} kcal
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
