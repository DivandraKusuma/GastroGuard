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
The heart of GastroGuard is **Gemini 3 Pro**, the latest AI model that enables deep multimodal context understanding. We built this application with a user-centric architecture:

*   **Frontend:** React Native/Web with an intuitive chat interface.
*   **Backend:** Python Flask managing business logic and AI orchestration.
*   **Core Engine:** **Gemini 3 Pro** integration for vision processing (food images) and natural language understanding (text/voice).

One of our key features is accurate nutrient density calculation. To guarantee this precision, we integrate the **FatSecret API**, ensuring all nutritional data is sourced from a globally recognized and accurate food database. We use the following formula to ensure every recorded calorie matches real-world portions:

**Total Calories = Sum (Weight × (Calorie Density / 100))**

Where **Weight** is the estimated weight of the food component and **Calorie Density** is the energy density per 100 grams sourced directly from **FatSecret**.

## Challenges we ran into
The biggest challenge we faced was **"The Quota Wall"**.
During early development, we relied heavily on the **Free Gemini AI Quota**. However, due to the complexity of multimodal analysis (especially image processing), we frequently hit API Rate Limits very quickly. The application often became unresponsive in the middle of demos.

We had to execute a **Technical Pivot** to solve this without sacrificing intelligence:
1.  **Smart Caching:** We implemented a *response caching* system for common food queries (e.g., "Fried Rice" doesn't need to be re-analyzed every time).
2.  **Efficient Prompt Engineering:** We streamlined our *system prompts* to reduce the number of tokens processed per request while maintaining JSON output accuracy.
3.  **Fallback Mechanism:** If the main AI quota is exhausted or latency is too high, the system automatically switches to a local database-based estimation mode to ensure users can still log their meals.

## Accomplishments that we're proud of
*   **Seamless Multimodal Experience:** Successfully integrated image and voice inputs so users can log meals in under 5 seconds.
*   **Context-Aware Analysis:** Our AI doesn't just count calories; it provides safety warnings (like "Warning: Spicy!") for users with sensitive stomachs.
*   **Premium UI/UX:** Created a clean, responsive interface that feels "premium," encouraging users to keep interacting with the app.

## What we learned
This project taught us that **sometimes, "less is more"**.
When dealing with *resource-constrained APIs* like the Gemini Free Tier, we learned to be efficient. Not every query requires the full power of the largest model. We learned to balance the accuracy of heavy AI models with the response speed users demand. Furthermore, we learned that building a chatbot isn't about how smartly the bot answers, but how comfortable the user feels talking to it.

## What's next for GastroGuard
Our journey has just begun. Here is our roadmap:
*   **IoT Integration:** Connecting GastroGuard with smart scales or wearables for real-time health data.
*   **Community:** Adding social features where users can share healthy recipes and achievements.
*   **Premium Tier:** Access the Gemini Ultra model without quota limits for deeper micronutrient analysis.

GastroGuard is not just about counting calories; it's about guarding your health's future, one bite at a time.

## Built with
- **React** (Frontend Framework)
- **TypeScript** (Programming Language)
- **Vite** (Build Tool)
- **Python** (Backend Language)
- **Flask** (Micro web framework)
- **Google Gemini API** (For Gemini 3 Pro & 2.5 Flash Models)
- **FatSecret API** (Verified Nutritional Database)
- **CSS3** (Custom Styling)
- **Axios/Fetch** (API Consumption)