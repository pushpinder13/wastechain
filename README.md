# Team Details

## Project Title
WasteChain - Smart Recycling Traceability Platform

## Team Members
- Pushpinder Singh – 2210990693
- Narinder Singh – 2210990598

## Project Type
Copyright.

## Team Details
Department: CSE  
University: Chitkara University

## Current Status
Completed



# WasteChain - Smart Recycling Traceability Platform

WasteChain is a full-stack traceability platform for recyclable waste management. It connects citizens, collectors, recyclers, and admins with photo-backed submissions, AI-assisted classification, QR tracking, realtime updates, and blockchain-style audit logs.

## ?? Core Features

- Role-based access control for `citizen`, `collector`, `recycler`, and `admin`
- Citizen waste submission with image upload, category, weight, description, and pickup address
- Automatic QR code generation for every waste submission
- AI image analysis using Google Gemini for waste type prediction and disposal guidance
- Points, levels, and badges to gamify recycling behavior
- Collector dashboard for nearby pickups, collections, and earnings statistics
- Recycler workflow for incoming waste, delivery handling, and recycling stats
- Admin analytics, user management, recycler approval, traceability logs, and CSV export
- Blockchain-style traceability logs with SHA-256 hash chaining
- Real-time status notifications with Socket.IO
- Dark mode UI support via frontend theme toggle
- Responsive design with Tailwind CSS

## ??? Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS
- React Router DOM
- Axios
- Socket.IO client
- Recharts
- react-hot-toast
- Lucide React icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Multer file uploads
- Google Gemini AI integration via `@google/generative-ai`
- Socket.IO realtime communication
- Express rate limiting on auth endpoints

## ?? Prerequisites

- Node.js v16 or higher
- MongoDB (local or Atlas)
- npm

## ?? Setup

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Configure backend environment

Create or update `backend/.env` with the following values:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
GEMINI_API_KEY=your_google_gemini_api_key  # optional, only if using AI waste analysis
```

### 4. Configure frontend API URL (optional)

If your backend runs somewhere other than `http://localhost:5000`, create `frontend/.env` with:

```env
VITE_API_URL=http://your-backend-host:5000
```

The frontend defaults to `http://localhost:5000` when `VITE_API_URL` is not set.

## ?? Running the Application

### Start backend

```bash
cd backend
npm run dev
```

### Start frontend

```bash
cd frontend
npm run dev
```

Open the frontend at: `http://localhost:3000`

## ?? API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `PUT /api/auth/change-password`
- `POST /api/waste`
- `GET /api/waste`
- `GET /api/waste/nearby`
- `GET /api/waste/:id`
- `PUT /api/waste/:id/status`
- `DELETE /api/waste/:id`
- `GET /api/waste/:id/trace`
- `POST /api/ai/analyze-image`
- `GET /api/admin/analytics`
- `GET /api/admin/users`
- `DELETE /api/admin/users/:id`
- `PUT /api/admin/users/:id/approve`
- `GET /api/admin/logs`
- `GET /api/admin/export-csv`
- `GET /api/health`

## ?? Roles and Workflows

### Citizen
- Create an account with the `Citizen` role
- Submit waste with photo, weight, category, and pickup address
- Optionally use AI image analysis to suggest category and disposal instructions
- Earn points, rank up levels, and collect badges
- Track waste progress and view traceability logs

### Collector
- Register as a `Collector`
- View nearby submissions waiting for pickup
- Update waste status throughout the collection workflow
- See collector-specific stats and earnings

### Recycler
- Register as a `Recycler`
- Recycler accounts are created with `isApproved=false` by default
- Admin approval is required before a recycler can fully access the app
- View incoming waste and recycling statistics

### Admin
- Admin users are not created through the public registration page
- Create or upgrade an admin user manually in MongoDB
- Access analytics, user management, recycler approval, logs, and CSV export

## ?? Notes

- Uploaded files and generated QR codes are served from `backend/uploads`
- The frontend proxies `/api` and `/uploads` to the backend in `frontend/vite.config.js`
- Auth routes are rate limited: 100 requests in development, 20 in production
- Waste IDs are generated as `WC-<timestamp>-<random>` and recorded on submissions
- Traceability logs use SHA-256 hashing for blockchain-style audit chaining
- AI image inference is optional and depends on a valid `GEMINI_API_KEY`

## ?? Project Structure

```
wastechain/
+-- backend/
¦   +-- controllers/
¦   ¦   +-- adminController.js
¦   ¦   +-- aiController.js
¦   ¦   +-- authController.js
¦   ¦   +-- wasteController.js
¦   +-- middleware/
¦   ¦   +-- auth.js
¦   ¦   +-- upload.js
¦   +-- models/
¦   ¦   +-- TraceabilityLog.js
¦   ¦   +-- User.js
¦   ¦   +-- WasteSubmission.js
¦   +-- routes/
¦   ¦   +-- admin.js
¦   ¦   +-- ai.js
¦   ¦   +-- auth.js
¦   ¦   +-- waste.js
¦   +-- uploads/
¦   +-- .env
¦   +-- package.json
¦   +-- server.js
¦
+-- frontend/
¦   +-- src/
¦   ¦   +-- components/
¦   ¦   ¦   +-- Button.jsx
¦   ¦   ¦   +-- Card.jsx
¦   ¦   ¦   +-- ConfirmationModal.jsx
¦   ¦   ¦   +-- Navbar.jsx
¦   ¦   ¦   +-- Sidebar.jsx
¦   ¦   +-- context/
¦   ¦   ¦   +-- AuthContext.jsx
¦   ¦   +-- pages/
¦   ¦   ¦   +-- AdminAnalytics.jsx
¦   ¦   ¦   +-- AdminDashboard.jsx
¦   ¦   ¦   +-- AdminLogsPage.jsx
¦   ¦   ¦   +-- AdminUsersPage.jsx
¦   ¦   ¦   +-- CollectorDashboard.jsx
¦   ¦   ¦   +-- CitizenDashboard.jsx
¦   ¦   ¦   +-- IncomingWastePage.jsx
¦   ¦   ¦   +-- LoginPage.jsx
¦   ¦   ¦   +-- MyCollectionsPage.jsx
¦   ¦   ¦   +-- MySubmissionsPage.jsx
¦   ¦   ¦   +-- ProfilePage.jsx
¦   ¦   ¦   +-- RegisterPage.jsx
¦   ¦   ¦   +-- RewardsPage.jsx
¦   ¦   ¦   +-- SubmitWastePage.jsx
¦   ¦   ¦   +-- TrackWastePage.jsx
¦   ¦   ¦   +-- TermsPage.jsx
¦   ¦   ¦   +-- more pages...
¦   ¦   +-- services/
¦   ¦   ¦   +-- api.js
¦   ¦   +-- App.jsx
¦   ¦   +-- main.jsx
¦   +-- package.json
¦   +-- postcss.config.js
¦   +-- tailwind.config.js
¦   +-- vite.config.js
```
