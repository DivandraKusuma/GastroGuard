import React from 'react';
import { useApp } from '../context/AppContext';
import { NutrientBar } from '../components/NutrientBar';

export function Reports() {
  const { userProfile, getTodayLog } = useApp();

  if (!userProfile) return null;

  const log = getTodayLog();
  
  // Calculate current intake from all meals
  const totals = Object.values(log.meals)
    .flat()
    .reduce(
      (sum, food) => ({
        protein: sum.protein + food.protein,
        carbs: sum.carbs + food.carbs,
        fat: sum.fat + food.fat,
        fiber: sum.fiber + food.fiber,
        sugar: sum.sugar + food.sugar,
        saturatedFat: sum.saturatedFat + food.saturatedFat,
        polyunsaturatedFat: sum.polyunsaturatedFat + food.polyunsaturatedFat,
        monounsaturatedFat: sum.monounsaturatedFat + food.monounsaturatedFat,
        cholesterol: sum.cholesterol + food.cholesterol,
        sodium: sum.sodium + food.sodium,
        potassium: sum.potassium + food.potassium,
      }),
      {
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        saturatedFat: 0,
        polyunsaturatedFat: 0,
        monounsaturatedFat: 0,
        cholesterol: 0,
        sodium: 0,
        potassium: 0,
      }
    );

  const macroPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="pb-24 px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Nutrition Report
        </h1>
        <p className="text-gray-600">
          Detailed breakdown of your intake
        </p>
      </div>

      {/* Macronutrients */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">Macronutrients</h2>
        
        <div className="space-y-4">
          {/* Protein */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Protein</span>
              <span className="text-sm text-gray-600">
                {totals.protein.toFixed(1)}g / {userProfile.akg.protein}g
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${macroPercentage(totals.protein, userProfile.akg.protein)}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Carbohydrates</span>
              <span className="text-sm text-gray-600">
                {totals.carbs.toFixed(1)}g / {userProfile.akg.carbs}g
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 transition-all duration-300"
                style={{ width: `${macroPercentage(totals.carbs, userProfile.akg.carbs)}%` }}
              />
            </div>
          </div>

          {/* Fat */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Fat</span>
              <span className="text-sm text-gray-600">
                {totals.fat.toFixed(1)}g / {userProfile.akg.fat}g
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${macroPercentage(totals.fat, userProfile.akg.fat)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Micronutrients */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">Micronutrients & Limits</h2>
        
        <div>
          <NutrientBar
            name="Fiber"
            current={totals.fiber}
            limit={userProfile.akg.fiber}
            unit="g"
          />
          <NutrientBar
            name="Sugar"
            current={totals.sugar}
            limit={userProfile.akg.sugar}
            unit="g"
          />
          <NutrientBar
            name="Saturated Fat"
            current={totals.saturatedFat}
            limit={userProfile.akg.saturatedFat}
            unit="g"
          />
          <NutrientBar
            name="Polyunsaturated Fat"
            current={totals.polyunsaturatedFat}
            limit={userProfile.akg.polyunsaturatedFat}
            unit="g"
          />
          <NutrientBar
            name="Monounsaturated Fat"
            current={totals.monounsaturatedFat}
            limit={userProfile.akg.monounsaturatedFat}
            unit="g"
          />
          <NutrientBar
            name="Cholesterol"
            current={totals.cholesterol}
            limit={userProfile.akg.cholesterol}
            unit="mg"
          />
          <NutrientBar
            name="Sodium"
            current={totals.sodium}
            limit={userProfile.akg.sodium}
            unit="mg"
          />
          <NutrientBar
            name="Potassium"
            current={totals.potassium}
            limit={userProfile.akg.potassium}
            unit="mg"
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Daily Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Total Calories</div>
            <div className="font-semibold text-gray-900">
              {Object.values(log.meals)
                .flat()
                .reduce((sum, food) => sum + food.calories, 0)
                .toFixed(0)} kcal
            </div>
          </div>
          <div>
            <div className="text-gray-600">Exercise</div>
            <div className="font-semibold text-gray-900">
              {log.exercise} kcal
            </div>
          </div>
          <div>
            <div className="text-gray-600">Sleep</div>
            <div className="font-semibold text-gray-900">
              {log.sleep} hours
            </div>
          </div>
          <div>
            <div className="text-gray-600">Net Calories</div>
            <div className="font-semibold text-gray-900">
              {(Object.values(log.meals)
                .flat()
                .reduce((sum, food) => sum + food.calories, 0) - log.exercise).toFixed(0)} kcal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
