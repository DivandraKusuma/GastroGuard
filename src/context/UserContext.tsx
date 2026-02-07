import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

// Types
export type UserGoal = 'loss' | 'maintain' | 'gain';
export type ActivityLevel = 'low' | 'moderate' | 'high';
export type Gender = 'male' | 'female';

export interface UserProfile {
    name: string;
    goal: UserGoal;
    healthPurpose: string;
    medicalConditions: string[];
    height: number;
    weight: number;
    targetWeight: number;
    birthDate: string;
    gender: Gender;
    activityLevel: ActivityLevel;
    isOnboarded: boolean;
}

export interface DailyLog {
    date: string;
    breakfast: number; // calories
    lunch: number;
    dinner: number;
    snack: number; // calories
    exercise: number; // burnt
    sleep: number; // hours

    // Macros
    protein: number; // g
    carbs: number; // g
    fat: number; // g

    // Micros
    fiber: number; // g
    sugar: number; // g
    sodium: number; // mg
    cholesterol: number; // mg
    saturated_fat: number; // g
    polyunsaturated_fat: number; // g
    monounsaturated_fat: number; // g
    potassium: number; // mg
}

interface UserContextType {
    user: UserProfile;
    dailyStats: DailyLog;
    updateUser: (data: Partial<UserProfile>) => void;
    updateLog: (data: Partial<DailyLog>) => void;
    dailyCalorieTarget: number;
    session: Session | null;
    logout: () => void;
    authLoading: boolean;
}

const defaultUser: UserProfile = {
    name: '',
    goal: 'maintain',
    healthPurpose: '',
    medicalConditions: [],
    height: 0,
    weight: 0,
    targetWeight: 0,
    birthDate: '',
    gender: 'male',
    activityLevel: 'moderate',
    isOnboarded: false,
};

const defaultLog: DailyLog = {
    date: new Date().toISOString().split('T')[0],
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snack: 0,
    exercise: 0,
    sleep: 8,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    cholesterol: 0,
    saturated_fat: 0,
    polyunsaturated_fat: 0,
    monounsaturated_fat: 0,
    potassium: 0
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile>(defaultUser);
    const [dailyStats, setDailyStats] = useState<DailyLog>(defaultLog);
    const [session, setSession] = useState<Session | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    // 1. Handle Supabase Auth Session
    useEffect(() => {
        let mounted = true;

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (mounted) {
                setSession(session);
                setUserId(session?.user?.id || null);
                // IF NO SESSION -> Loading finish immediately
                if (!session) setAuthLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                setSession(session);
                setUserId(session?.user?.id || null);

                if (!session) {
                    setUser(defaultUser);
                    setDailyStats(defaultLog);
                    setAuthLoading(false);
                }
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // 2. Fetch User Profile and Daily Log from Supabase when userId is ready
    useEffect(() => {
        if (!userId) return;

        setAuthLoading(true); // Start loading while we fetch profile

        const fetchData = async () => {
            try {
                // Fetch Profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', userId)
                    .single();

                if (profileData) {
                    setUser({
                        name: profileData.name || '',
                        goal: profileData.goal || 'maintain',
                        healthPurpose: profileData.health_purpose || '',
                        medicalConditions: [],
                        height: profileData.height || 0,
                        weight: profileData.weight || 0,
                        targetWeight: profileData.target_weight || 0,
                        birthDate: profileData.birth_date || '',
                        gender: profileData.gender || 'male',
                        activityLevel: profileData.activity_level || 'moderate',
                        isOnboarded: profileData.is_onboarded || false,
                    });
                }

                // Fetch Today's Log
                const today = new Date().toISOString().split('T')[0];
                const { data: logData } = await supabase
                    .from('daily_logs')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('date', today)
                    .single();

                if (logData) {
                    setDailyStats({
                        date: logData.date,
                        breakfast: logData.breakfast || 0,
                        lunch: logData.lunch || 0,
                        dinner: logData.dinner || 0,
                        snack: logData.snack || 0,
                        exercise: logData.exercise || 0,
                        sleep: logData.sleep || 0,
                        protein: logData.protein || 0,
                        carbs: logData.carbs || 0,
                        fat: logData.fat || 0,
                        fiber: logData.fiber || 0,
                        sugar: logData.sugar || 0,
                        sodium: logData.sodium || 0,
                        cholesterol: logData.cholesterol || 0,
                        saturated_fat: logData.saturated_fat || 0,
                        polyunsaturated_fat: logData.polyunsaturated_fat || 0,
                        monounsaturated_fat: logData.monounsaturated_fat || 0,
                        potassium: logData.potassium || 0,
                    });
                } else {
                    setDailyStats({ ...defaultLog, date: today });
                }
            } catch (err) {
                console.error(err);
            } finally {
                // IMPORTANT: Only stop loading AFTER we have checked the profile
                setAuthLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    // 3. Update Functions
    const updateUser = async (data: Partial<UserProfile>) => {
        if (!userId) return;

        setUser(prev => ({ ...prev, ...data }));

        const dbData = {
            user_id: userId,
            updated_at: new Date(),
            name: data.name !== undefined ? data.name : user.name,
            goal: data.goal !== undefined ? data.goal : user.goal,
            health_purpose: data.healthPurpose !== undefined ? data.healthPurpose : user.healthPurpose,
            height: data.height !== undefined ? data.height : user.height,
            weight: data.weight !== undefined ? data.weight : user.weight,
            target_weight: data.targetWeight !== undefined ? data.targetWeight : user.targetWeight,
            birth_date: data.birthDate !== undefined ? data.birthDate : user.birthDate,
            gender: data.gender !== undefined ? data.gender : user.gender,
            activity_level: data.activityLevel !== undefined ? data.activityLevel : user.activityLevel,
            is_onboarded: data.isOnboarded !== undefined ? data.isOnboarded : user.isOnboarded,
        };

        const { error } = await supabase.from('profiles').upsert(dbData);
        if (error) console.error("Error updating profile:", error);
    };

    const updateLog = async (data: Partial<DailyLog>) => {
        if (!userId) return;

        setDailyStats(prev => ({ ...prev, ...data }));

        const today = new Date().toISOString().split('T')[0];
        const currentLog = { ...dailyStats, ...data };

        const dbLogData = {
            user_id: userId,
            date: today,
            breakfast: currentLog.breakfast,
            lunch: currentLog.lunch,
            dinner: currentLog.dinner,
            snack: currentLog.snack,
            exercise: currentLog.exercise,
            sleep: currentLog.sleep,
            protein: currentLog.protein,
            carbs: currentLog.carbs,
            fat: currentLog.fat,
            fiber: currentLog.fiber,
            sugar: currentLog.sugar,
            sodium: currentLog.sodium,
            cholesterol: currentLog.cholesterol,
            saturated_fat: currentLog.saturated_fat,
            polyunsaturated_fat: currentLog.polyunsaturated_fat,
            monounsaturated_fat: currentLog.monounsaturated_fat,
            potassium: currentLog.potassium,
        };

        const { error } = await supabase.from('daily_logs').upsert(dbLogData, { onConflict: 'user_id,date' });
        if (error) console.error("Error updating log:", error);
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    const calculateCalories = () => {
        if (!user.weight || !user.height || !user.birthDate) return 2000;

        const birthYear = new Date(user.birthDate).getFullYear();
        const age = new Date().getFullYear() - birthYear;

        let bmr = 10 * user.weight + 6.25 * user.height - 5 * age;
        if (user.gender === 'male') {
            bmr += 5;
        } else {
            bmr -= 161;
        }

        let multiplier = 1.2;
        if (user.activityLevel === 'moderate') multiplier = 1.55;
        if (user.activityLevel === 'high') multiplier = 1.725;

        let tdee = bmr * multiplier;

        if (user.goal === 'loss') return Math.round(tdee - 500);
        if (user.goal === 'gain') return Math.round(tdee + 500);

        return Math.round(tdee);
    };

    return (
        <UserContext.Provider value={{
            user,
            dailyStats,
            updateUser,
            updateLog,
            dailyCalorieTarget: calculateCalories(),
            session,
            logout,
            authLoading
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
