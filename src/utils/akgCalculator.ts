import { UserProfile, Goal, ActivityLevel, Gender } from '../types';

export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export function calculateBMR(weight: number, height: number, age: number, gender: Gender): number {
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export function getActivityMultiplier(activityLevel: ActivityLevel): number {
  switch (activityLevel) {
    case 'low':
      return 1.2; // Sedentary
    case 'medium':
      return 1.55; // Moderately active
    case 'high':
      return 1.725; // Very active
    default:
      return 1.2;
  }
}

export function getGoalAdjustment(goal: Goal): number {
  switch (goal) {
    case 'lose':
      return -500; // 500 calorie deficit
    case 'gain':
      return 500; // 500 calorie surplus
    case 'maintain':
    case 'undecided':
      return 0;
    default:
      return 0;
  }
}

export function calculateAKG(
  weight: number,
  height: number,
  dateOfBirth: string,
  gender: Gender,
  activityLevel: ActivityLevel,
  goal: Goal
) {
  const age = calculateAge(dateOfBirth);
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = bmr * getActivityMultiplier(activityLevel);
  const calories = Math.round(tdee + getGoalAdjustment(goal));
  
  // Macronutrient distribution (standard ratios)
  const protein = Math.round((calories * 0.3) / 4); // 30% of calories, 4 cal/g
  const carbs = Math.round((calories * 0.4) / 4); // 40% of calories, 4 cal/g
  const fat = Math.round((calories * 0.3) / 9); // 30% of calories, 9 cal/g
  
  // Micronutrient limits (based on standard dietary guidelines)
  const fiber = 25; // grams
  const sugar = Math.round(calories * 0.1 / 4); // Max 10% of calories
  const saturatedFat = Math.round((calories * 0.1) / 9); // Max 10% of calories
  const polyunsaturatedFat = Math.round(fat * 0.3); // ~30% of total fat
  const monounsaturatedFat = Math.round(fat * 0.4); // ~40% of total fat
  const cholesterol = 300; // mg
  const sodium = 2300; // mg
  const potassium = 3500; // mg
  
  return {
    calories,
    protein,
    carbs,
    fat,
    fiber,
    sugar,
    saturatedFat,
    polyunsaturatedFat,
    monounsaturatedFat,
    cholesterol,
    sodium,
    potassium,
  };
}

export function calculateBMI(weight: number, height: number): number {
  // BMI = weight(kg) / (height(m))^2
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}
