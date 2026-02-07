-- Create Row Level Security (RLS) Policies for profiles and daily_logs tables
-- Run this SQL script in the Supabase SQL Editor.

-- 1. Enable RLS on tables (if not already enabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- 2. Create policies for `profiles` table

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own profile (during sign up)
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);

-- 3. Create policies for `daily_logs` table

-- Allow users to view their own daily logs
CREATE POLICY "Users can view own daily logs"
ON daily_logs FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own daily logs
CREATE POLICY "Users can insert own daily logs"
ON daily_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own daily logs
CREATE POLICY "Users can update own daily logs"
ON daily_logs FOR UPDATE
USING (auth.uid() = user_id);

-- Note: The `USING` clause controls which rows are visible/modifiable.
-- The `WITH CHECK` clause ensures that new/updated rows meet the condition (user can't insert data for someone else).
