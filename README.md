# GastroGuard

## Inspiration
Have you ever tried manually counting calories? It’s exhausting. We realized that the biggest hurdle in maintaining a healthy lifestyle isn't a lack of motivation, but the **friction** in the tracking process itself. Typing in food names, weighing portions, and searching for nutritional info one by one is tedious work that often makes people quit halfway through.

We wanted a different interaction: one that is more human, more empathetic, and most importantly, **instant**. Imagine having a personal nutritionist in your pocket who doesn’t just crunch numbers but actually understands you. That is where **GastroGuard** was born—a "Personal Health Guardian" that turns a boring chore into a natural conversation.

## What it does
GastroGuard is an AI-powered health assistant that monitors and records every calorie intake using a multimodal approach.
Its core workflow is designed for speed and ease:
1.  **User Action:** The user selects a mealtime (e.g., "Lunch").
2.  **AI Activation:** An interactive chatbot opens immediately.
3.  **Multimodal Input:** Users can input what they are eating via **Text**, **Voice**, or simply by snapping a **Photo** of their food.
4.  **Intelligent Analysis:** GastroGuard analyzes this input to break down complex nutritional data and check for food safety (e.g., for users with specific conditions like gastritis).
5.  **Report:** Within seconds, the user receives a comprehensive nutritional report along with personalized health advice.

## How we built it
The heart of GastroGuard is **Gemini 2.5 Flash**, the latest AI model that enables deep multimodal context understanding. We built this application with a user-centric architecture:

*   **Frontend:** React Native/Web with an intuitive chat interface.
*   **Backend:** Python Flask managing business logic and AI orchestration.
*   **Core Engine:** **Gemini 2.5 Flash** integration for vision processing (food images) and natural language understanding (text/voice).

One of our key features is accurate nutrient density calculation. To guarantee this precision, we integrate the **FatSecret API**, ensuring all nutritional data is sourced from a globally recognized and accurate food database. We use the following formula to ensure every recorded calorie matches real-world portions:

**Total Calories = Sum (Weight × (Calorie Density / 100))**

Where **Weight** is the estimated weight of the food component and **Calorie Density** is the energy density per 100 grams from verified databases.

## Challenges we ran into
The biggest challenge we faced was **"The Quota Wall"**.
During early development, we relied heavily on the **Free Gemini AI Quota**. However, due to the complexity of multimodal analysis (especially image processing), we frequently hit API Rate Limits very quickly. The application often became unresponsive in the middle of demos.

## ⚠️ IMPORTANT NOTE: API LIMITS
**Please Note:** This prototype relies on the **Gemini 2.5 Flash Free Tier API**. 
If you encounter errors (like "Server Error" or "Quota Exceeded"), it is likely due to the rate limits of the free API key. Please wait a moment and try again. We appreciate your understanding!

## Built with
- **React** (Frontend Framework)
- **TypeScript** (Programming Language)
- **Vite** (Build Tool)
- **CSS3** (Custom Styling)
- **Axios/Fetch** (API Consumption)

## Getting Started

This repository contains the **Frontend Client** for GastroGuard. It is configured to connect to our live backend server.

### Prerequisites
*   Node.js (v18 or higher)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/DivandraKusuma/GastroGuard.git
    cd GastroGuard
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Application

1.  **Start the Frontend**
    In your terminal:
    ```bash
    npm run dev
    ```
    The application will run on `http://localhost:3000` (or the port shown in your terminal).

2.  **Usage**
    *   Open your browser and navigate to the frontend URL.
    *   The app will automatically connect to our backend server.
    *   Click on "Lunch" or any meal to start the chatbot.
    *   Type a food name or upload an image to analyze nutrition.
