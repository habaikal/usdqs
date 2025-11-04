# USDQS Platform

An upgraded React-based platform for the USDQS stablecoin, featuring user authentication, virtual wallets, coin transfers, and a dynamic, multilingual interface.

[**Live Demo**](https://habaikal.github.io/usdqs)

 <!-- It's recommended to replace this with an actual screenshot of your application -->

## ✨ Key Features

-   **User Authentication:** Secure signup and login functionality.
-   **Virtual Wallet:** Users get a personal wallet to manage their USDQS balance.
-   **Buy & Sell USDQS:** A simple interface to purchase and sell USDQS with a simulated 1:1 USD peg.
-   **P2P Transfers:** Seamlessly transfer USDQS to other registered users on the same device.
-   **Transaction History:** View a detailed log of all wallet activities (purchases, sales, transfers).
-   **Bilingual Interface:** Supports both English (en) and Korean (ko).
-   **Responsive Design:** A clean, modern UI that works great on desktop and mobile devices.
-   **Informational Pages:** Includes detailed Whitepaper and DAO Governance pages to provide project context.

## 🚀 Technology Stack

-   **Frontend:** [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Charting:** [Recharts](https://recharts.org/)
-   **State Management:** React Context API

## 📂 Project Structure

The project follows a standard React application structure, organizing files by feature and type.

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components (UI elements, sections, modals)
│   ├── contexts/        # React Context providers for global state management
│   ├── constants/       # Application-wide constants (e.g., translations)
│   ├── types.ts         # TypeScript type definitions
│   ├── App.tsx          # Main application component with routing logic
│   └── index.tsx        # Application entry point
├── .gitignore           # Git ignore file
├── index.html           # Main HTML file
├── package.json         # Project dependencies and scripts
├── README.md            # This file
└── vite.config.ts       # Vite configuration
```

## 🛠️ Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm (comes with Node.js) or yarn

### Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/habaikal/usdqs.git
    cd usdqs
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

    The application will be running at `http://localhost:5173` (or the next available port).

## 📦 Build and Deployment

### Building for Production

To create an optimized production build of the application, run:

```bash
npm run build
```

This command generates a `dist` folder with the static files ready for deployment.

### Deploying to GitHub Pages

This project is pre-configured for easy deployment to GitHub Pages.

1.  **Update `homepage` URL:**
    In `package.json`, ensure the `homepage` value points to your GitHub Pages URL.
    ```json
    "homepage": "https://<your-github-username>.github.io/<your-repo-name>",
    ```

2.  **Run the deploy script:**
    ```bash
    npm run deploy
    ```
    This script will first build the project and then deploy the contents of the `dist` directory to the `gh-pages` branch on your repository.

## ⚠️ Important Note: Data Persistence

This application is a **client-side demo**. All user and account data (including registered users, balances, and transactions) is stored exclusively in the browser's **`localStorage`**.

-   **No Backend Server:** The application does not have a backend server or a central database.
-   **Data is Device-Specific:** Data is not synchronized across different browsers or devices. A user registered on one device will not be recognized on another. Consequently, transfers only work between users who have registered on the **same device and browser**.

This design was chosen for simplicity, allowing the application to run without any server-side setup. For a real-world application, this `localStorage`-based system should be replaced with a secure backend API and a persistent database.
