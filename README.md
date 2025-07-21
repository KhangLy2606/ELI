## Getting Started

This guide provides instructions for setting up both the backend server and the frontend application. Both components are required for the application to function correctly.

### Prerequisites

* Node.js (LTS version)
* Git
* A code editor such as Visual Studio Code

## Installation & Setup

Follow the steps below to set up the backend and frontend. It's recommended to use two separate terminal windows.

### 1. Backend Setup (`server/`)

The backend server handles user authentication, database interactions, and communication with the Hume AI API.

1.  **Navigate to the server directory:**
    ```sh
    cd ELI/server
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a new file named `.env` in the `ELI/server/` directory and add the following variables. Replace the placeholder values with your actual credentials.

    ```env
    # Server Configuration
    PORT=3001
    JWT_SECRET=your_super_secret_jwt_key

    # PostgreSQL Database Connection
    DB_USER=postgres
    DB_HOST=localhost
    DB_DATABASE=db
    DB_PASSWORD=your_db_password
    DB_PORT=5432

    # Hume AI API Keys
    HUME_API_KEY=your_hume_api_key
    HUME_SECRET_KEY=your_hume_secret_key
    ```

4.  **Start the Backend Server:**
    ```sh
    node server.js
    ```
    The server should now be running on `http://localhost:3001`.

### 2. Frontend Setup (`Eli-Frontend/`)

The frontend is a React Native application built with Expo.

1.  **Navigate to the frontend project directory (in a new terminal):**
    ```sh
    cd ELI/Eli-Frontend
    ```

2.  **Install the necessary NPM packages:**
    ```sh
    npm install
    ```

3.  **Start the development server:**
    ```sh
    npx expo start
    ```
    This will open the Expo developer tools in your browser. You can run the application on a mobile device using the Expo Go app or in a simulator.

---

With both the backend server and the Expo development server running, you can now use the application. The frontend will make requests to your local backend for authentication and data.
