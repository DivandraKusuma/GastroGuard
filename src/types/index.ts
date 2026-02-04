export type Goal = 'lose' | 'maintain' | 'gain' | 'undecided';
export type ActivityLevel = 'low' | 'medium' | 'high';
export type Gender = 'male' | 'female';

export interface UserProfile {
  // Personal Stats
  height: number; // cm
  weight: number; // kg
  targetWeight?: number; // kg
  dateOfBirth: string;
  gender: Gender;
  activityLevel: ActivityLevel;
  
  // Goals
  goal: Goal;
  healthPurposes: string[];
  medicalHistory: string[];
  otherGoal?: string;
  
  // Calculated
  akg: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    saturatedFat: number;
    polyunsaturatedFat: number;
    monounsaturatedFat: number;
    cholesterol: number;
    sodium: number;
    potassium: number;
  };
  
  // Metadata
  memberSince: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  saturatedFat: number;
  polyunsaturatedFat: number;
  monounsaturatedFat: number;
  cholesterol: number;
  sodium: number;
  potassium: number;
  thumbnail?: string;
  isAI?: boolean;
}

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface DailyLog {
  date: string;
  meals: {
    breakfast: FoodItem[];
    lunch: FoodItem[];
    dinner: FoodItem[];
    snack: FoodItem[];
  };
  exercise: number; // calories burned
  sleep: number; // hours
}
