
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
