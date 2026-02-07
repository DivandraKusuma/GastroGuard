# GastroGuard Project Status - Handoff Notes

**Date:** 2026-02-07
**Objective:** Finalizing for Hackathon Submission & Demo Video

## 🌳 Branching Strategy
- **`main` (Production)**
  - **Login:** REQUIRED (Regular Auth flow).
  - **Security:** RLS (Row Level Security) enabled on Supabase `profiles` & `daily_logs`.
  - **Config:** Includes fallback credentials in `supabase.ts` if `.env` is missing.
  - **Status:** Production-ready.

- **`no-login-version` (Demo/Hackathon) -> CURRENT ACTIVE BRANCH**
  - **Login:** BYPASSED (`DEMO_MODE = true` in `UserContext.tsx`).
  - **Safety:** Database **WRITES DISABLED** (Update/Insert blocked in `UserContext.tsx` to prevent polluting DB).
  - **UI/UX:** 
    - Enhanced Onboarding (Card styles, Toast notifications, Back button).
    - "Update Profile Data" button in Profile page to retake onboarding.
  - **Status:** Ready for video recording.

## 🛠️ Recent Implementations
1.  **Backend Connection:** 
    - API Endpoint: `https://gicax-gastroguard.hf.space`
    - **Crucial Config:** `VITE_API_BASE_URL` is **commented out** in `.env` to enforce usage of Vite Proxy (`/api` -> remote). This fixes CORS issues.
2.  **Onboarding:**
    - Added validation (Name & Stats required).
    - Replaced `alert()` with custom Toast.
    - Added Back functionality.
3.  **Chatbot:**
    - AI now provides natural language breakdown of macronutrients (Protein/Carbs/Fat) in the chat bubble.

## 🚀 Next Steps
- **Immediate:** Record demo video using `no-login-version`.
- **Future:** If developing further, verify `main` branch sync.

## ⚠️ Important Note
If "Unable to connect to server" occurs, it's likely the Hugging Face Space is sleeping (Cold Start). Open the backend URL in a browser to wake it up.
