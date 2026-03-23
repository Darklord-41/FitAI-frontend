# FitAI Frontend

This is the client-side React application for FitAI, built with [Vite](https://vitejs.dev/). It provides an interactive UI for users to track workouts, access their fitness profiles, and communicate with the backend's AI features.

## Tech Stack
- **Framework:** [React 18](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Project Structure
```text
fitai/
├── public/          # Public static assets
├── src/
│   ├── components/  # Reusable React components
│   ├── pages/       # Route-based page views
│   ├── App.css      # Global styles
│   ├── App.jsx      # Root component with routing
│   └── main.jsx     # Frontend entry point
├── .env.local       # Local environment configuration
└── vite.config.js   # Vite configuration settings
```

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

**1. Navigate to the frontend directory:**
```bash
cd fitai-complete/fitai
```

**2. Install dependencies:**
```bash
npm install
# or
pnpm install
```

**3. Configure Environment Variables:**
Check the `.env.local` file (or create one) to define your backend API endpoint. For example:
```env
VITE_API_URL=http://localhost:5000/api
```
*(Ensure this matches the port your `fitai-backend` is using).*

### Running the App

Start the Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
# or
pnpm run dev
```
The application should now be accessible at `http://localhost:5173` in your browser.

## Production Build

To bundle your application for production production deployment, run:
```bash
npm run build
```
This generates optimized static files in the `dist/` directory.

To preview this locally before deploying, you can run:
```bash
npm run preview
```
