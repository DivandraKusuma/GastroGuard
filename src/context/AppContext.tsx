import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, DailyLog, FoodItem, MealSlot } from '../types';

interface AppContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  dailyLog: DailyLog;
  addFoodToMeal: (slot: MealSlot, food: FoodItem) => void;
  updateExercise: (calories: number) => void;
  updateSleep: (hours: number) => void;
  getTodayLog: () => DailyLog;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: (profile: UserProfile) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>({});
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedLogs = localStorage.getItem('dailyLogs');
    const savedOnboarding = localStorage.getItem('hasCompletedOnboarding');

    if (savedProfile) {
      setUserProfileState(JSON.parse(savedProfile));
    }
    if (savedLogs) {
      setDailyLogs(JSON.parse(savedLogs));
    }
    if (savedOnboarding === 'true') {
      setHasCompletedOnboarding(true);
    }
  }, []);

  const setUserProfile = (profile: UserProfile) => {
    setUserProfileState(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };

  const completeOnboarding = (profile: UserProfile) => {
    setUserProfile(profile);
    setHasCompletedOnboarding(true);
    localStorage.setItem('hasCompletedOnboarding', 'true');
  };

  const getTodayLog = (): DailyLog => {
    if (!dailyLogs[selectedDate]) {
      const newLog: DailyLog = {
        date: selectedDate,
        meals: {
          breakfast: [],
          lunch: [],
          dinner: [],
          snack: [],
        },
        exercise: 0,
        sleep: 0,
      };
      return newLog;
    }
    return dailyLogs[selectedDate];
  };

  const updateDailyLogs = (updatedLog: DailyLog) => {
    const updated = { ...dailyLogs, [selectedDate]: updatedLog };
    setDailyLogs(updated);
    localStorage.setItem('dailyLogs', JSON.stringify(updated));
  };

  const addFoodToMeal = (slot: MealSlot, food: FoodItem) => {
    const currentLog = getTodayLog();
    const updatedLog = {
      ...currentLog,
      meals: {
        ...currentLog.meals,
        [slot]: [...currentLog.meals[slot], food],
      },
    };
    updateDailyLogs(updatedLog);
  };

  const updateExercise = (calories: number) => {
    const currentLog = getTodayLog();
    const updatedLog = { ...currentLog, exercise: calories };
    updateDailyLogs(updatedLog);
  };

  const updateSleep = (hours: number) => {
    const currentLog = getTodayLog();
    const updatedLog = { ...currentLog, sleep: hours };
    updateDailyLogs(updatedLog);
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserProfile,
        dailyLog: getTodayLog(),
        addFoodToMeal,
        updateExercise,
        updateSleep,
        getTodayLog,
        selectedDate,
        setSelectedDate,
        hasCompletedOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
