# WasteChain - Smart Recycling Traceability Platform

A complete full-stack SaaS application for tracking recyclable waste from citizens to recycling centers with QR codes, AI detection, blockchain-style traceability, and gamification.

## 🚀 Features

- **User Authentication** - JWT-based auth with role-based access (Citizen, Collector, Recycler, Admin)
- **Waste Submission** - Upload waste with photos and auto-generate QR codes
- **AI Waste Detection** - Mock AI model to classify waste types
- **QR Code Tracking** - Track waste lifecycle with unique QR codes
- **Blockchain Traceability** - Immutable logs with hash chains
- **Gamification** - Points, levels, and badges for recycling
- **Analytics Dashboard** - Admin panel with charts and statistics
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS
- Lucide React Icons
- Recharts for analytics
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- QRCode generation

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Installation & Setup

### 1. Install MongoDB (if not installed)

Download and install MongoDB from: https://www.mongodb.com/try/download/community

Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Configure Environment Variables

The `.env` file is already created in the backend folder. Make sure MongoDB is running on the default port (27017).

If using MongoDB Atlas, update the `MONGODB_URI` in `backend/.env`:

```
MONGODB_URI=your_mongodb_atlas_connection_string
```

## 🚀 Running the Application

### Start MongoDB (if using local installation)

Open a new terminal and run:
```bash
mongod
```

### Start Backend Server

Open a terminal in the backend folder:
```bash
cd backend
npm run dev
```

Backend will run on: http://localhost:5000

### Start Frontend Development Server

Open another terminal in the frontend folder:
```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:3000

## 🌐 Access the Application

Open your browser and go to: **http://localhost:3000**

## 👥 Test Accounts

You can register new accounts with different roles:

### Create Admin Account (Manual)
After registering a user, you can manually update their role to 'admin' in MongoDB:

1. Open MongoDB Compass or mongo shell
2. Find the user in the `users` collection
3. Update the `role` field to `"admin"`

### Test Flow

1. **Register as Citizen**
   - Go to Register page
   - Select "Citizen" role
   - Fill in details and register

2. **Submit Waste**
   - Login as citizen
   - Go to "Submit Waste"
   - Upload waste photo
   - Use AI detection (optional)
   - Submit waste
   - Get QR code

3. **Register as Collector**
   - Register another account with "Collector" role
   - View nearby waste pickups
   - Accept and collect waste

4. **Track Waste**
   - Use the QR code or waste ID to track
   - View blockchain-style traceability logs

5. **View Analytics (Admin)**
   - Login as admin
   - View analytics dashboard with charts

## 📁 Project Structure

```
wastechain/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── wasteController.js
│   │   ├── aiController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── WasteSubmission.js
│   │   └── TraceabilityLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── waste.js
│   │   ├── ai.js
│   │   └── admin.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── CitizenDashboard.jsx
│   │   │   ├── CollectorDashboard.jsx
│   │   │   ├── SubmitWastePage.jsx
│   │   │   ├── MySubmissionsPage.jsx
│   │   │   ├── TrackWastePage.jsx
│   │   │   ├── RewardsPage.jsx
│   │   │   └── AdminAnalytics.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## 🎯 Key Features Explained

### 1. QR Code Generation
Each waste submission automatically generates a unique QR code that can be scanned to track the waste lifecycle.

### 2. AI Waste Detection
Mock AI model that predicts waste type from uploaded images with confidence scores. In production, this would connect to a real ML model.

### 3. Blockchain-Style Traceability
Each action creates a log entry with:
- Timestamp
- User who performed action
- Previous hash (linking to previous log)
- Current hash (SHA-256)

### 4. Gamification System
- Points awarded based on waste category and weight
- Levels: Eco Starter → Eco Warrior → Green Champion → Recycling Hero
- Badges earned at milestones

### 5. Role-Based Dashboards
- **Citizen**: Submit waste, track submissions, view rewards
- **Collector**: View nearby pickups, accept jobs, mark collected
- **Recycler**: View incoming waste, process materials
- **Admin**: Analytics, user management, system overview

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Role-based authorization
- File upload validation

## 📊 Analytics Features

- Total waste collected
- Waste distribution by category (Pie chart)
- Waste status breakdown (Bar chart)
- Monthly recycling trends (Line chart)
- Top recyclers leaderboard

## 🎨 UI Features

- Modern SaaS design
- Dark mode support
- Responsive layout
- Smooth animations
- Gradient backgrounds
- Status badges
- Progress bars

## 🐛 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check the connection string in `.env`
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Backend: Change PORT in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

### Module Not Found
- Run `npm install` in both backend and frontend folders
- Delete `node_modules` and `package-lock.json`, then reinstall

### Image Upload Not Working
- Make sure `backend/uploads` folder exists
- Check file size limits in `backend/middleware/upload.js`

## 📝 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Waste Management
- POST `/api/waste` - Create waste submission
- GET `/api/waste` - Get all waste (with filters)
- GET `/api/waste/:id` - Get waste by ID
- PUT `/api/waste/:id/status` - Update waste status
- GET `/api/waste/:id/trace` - Get traceability logs
- GET `/api/waste/nearby` - Get nearby waste (collectors)

### AI Detection
- POST `/api/ai/detect-waste` - Detect waste type
- POST `/api/ai/analyze-image` - Analyze waste image

### Admin
- GET `/api/admin/analytics` - Get analytics data
- GET `/api/admin/users` - Get all users
- PUT `/api/admin/users/:id/approve` - Approve recycler
- GET `/api/admin/logs` - Get all traceability logs

## 🌟 Future Enhancements

- Real AI/ML model integration
- Google Maps integration for pickup locations
- Real-time notifications
- Mobile app (React Native)
- Payment integration for rewards
- Social sharing features
- Multi-language support

## 📄 License

MIT License - Free for educational and personal use

## 👨‍💻 Author

Created for student copyright project - Simple, clean, and well-documented code

## 🙏 Acknowledgments

- Unsplash for recycling images
- Lucide for beautiful icons
- Tailwind CSS for styling
- MongoDB for database
- React and Node.js communities

---

**Happy Recycling! 🌱♻️**
