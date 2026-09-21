# Student Collaborator

A full-stack collaboration platform that helps students discover projects, build teams, manage tasks, and communicate in real time.

## 🚀 Features

### 🔐 Authentication & Security
- User registration and login
- JWT-based authentication
- Protected routes
- Secure password hashing using bcrypt
- Change password
- Logout

### 👤 User Profile
- Profile management
- College information
- Bio
- Skills
- Interests
- GitHub profile
- LinkedIn profile
- Achievements
- Experience points

### 📊 Dashboard
- Personal project statistics
- Joined project statistics
- Assigned task statistics
- Experience points
- User-specific project information

### 📁 Project Management
- Create projects
- View project details
- Update and manage projects
- Project status management
- My Projects
- Joined Projects

### 🔎 Project Discovery
- Discover available projects
- Search projects
- Filter projects
- View project requirements
- Send join requests

### 👥 Team Management
- Send project join requests
- View incoming join requests
- Accept or reject requests
- Manage project members
- Remove team members
- Project-based team management

### ✅ Task Management
- Create project tasks
- Assign tasks to team members
- Update tasks
- Delete tasks
- Track task status
- Todo / In Progress / Completed workflow

### 💬 Real-Time Project Chat
- Project-specific chat
- Real-time messaging using Socket.IO
- Persistent project messages
- Team communication inside projects

### 🔔 Notifications
- Join request notifications
- Join request acceptance/rejection notifications
- Task-related notifications
- Read/unread notification system
- Mark individual notifications as read
- Mark all notifications as read

### ⚙️ Settings
- Account information
- Authentication status
- Change password
- Logout

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Socket.IO

### Deployment
- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       Client        │
                    │   React + Vite      │
                    └──────────┬──────────┘
                               │
                         REST API / Socket.IO
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Backend        │
                    │ Node.js + Express   │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
        Authentication     Business Logic    Socket.IO
          + JWT              + APIs          Real-time Chat
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │   MongoDB Atlas     │
                    └─────────────────────┘

📂 Project Structure
Student-Collaborator/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── socket/
│   │
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   │
│   └── package.json
│
└── README.md
🔄 Core Application Flow
User
 │
 ▼
Register / Login
 │
 ▼
JWT Authentication
 │
 ▼
Dashboard
 │
 ├──────────────► Discover Projects
 │                      │
 │                      ▼
 │                View Project
 │                      │
 │                      ▼
 │                Join Request
 │                      │
 │                      ▼
 │              Team Formation
 │
 ▼
My Projects
 │
 ▼
Project Collaboration
 │
 ├── Team
 ├── Tasks
 ├── Chat
 ├── Notifications
 └── Project Progress
🔑 Authentication Flow
User Login
     │
     ▼
Backend validates credentials
     │
     ▼
Password verified using bcrypt
     │
     ▼
JWT token generated
     │
     ▼
Token stored on client
     │
     ▼
Axios interceptor attaches token
     │
     ▼
Protected API request
     │
     ▼
JWT middleware verifies token
     │
     ▼
Authorized request
💾 Main Data Models
User
 │
 ├── Projects
 ├── Tasks
 ├── Notifications
 └── Team Memberships

Project
 │
 ├── Owner
 ├── Members
 ├── Join Requests
 ├── Tasks
 └── Messages

Task
 │
 ├── Project
 └── Assigned User

Message
 │
 └── Project

Notification
 │
 ├── Recipient
 ├── Project
 └── Task
⚡ Real-Time Communication

Project chat is implemented using Socket.IO.

Client
   │
   │ Socket Connection
   ▼
Socket.IO Server
   │
   │ Project Room
   ▼
Project Members

Messages are also persisted so that users can access previous project conversations.

🔒 Security

The application implements:

JWT-based authentication
Password hashing using bcrypt
Protected backend routes
Authentication middleware
User-specific resource access
Project/team-based authorization
Server-side validation
Environment variables for sensitive configuration
Passwords excluded from user responses
⚙️ Environment Variables
Backend

Create a .env file inside the backend directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Frontend

Create a .env file inside the frontend directory:

VITE_API_URL=http://localhost:5000/api

Do not commit .env files to GitHub.

▶️ Getting Started
1. Clone the Repository
git clone https://github.com/Anuragp-0407/collaborative-student-platform.git
cd collaborative-student-platform
2. Setup Backend
cd backend
npm install

Create a .env file and add the required environment variables.

Start the development server:

npm run dev

The backend will run on:

http://localhost:5000
3. Setup Frontend

Open another terminal:

cd frontend
npm install

Create the frontend .env file:

VITE_API_URL=http://localhost:5000/api

Start the frontend:

npm run dev
🧪 API Health Check

The backend provides a health-check endpoint:

GET /api/health

Successful response:

{
  "success": true,
  "message": "Student Collaborator API is running"
}
📌 Phase 1 Scope

Phase 1 focuses on building the core student collaboration platform.

Included
Authentication
User profiles
Dashboard
Project management
Project discovery
Search and filtering
Join requests
Team management
Task management
Real-time project chat
Notifications
Project status
Account settings
Future Phases

The following features are planned for future development:

Hackathons
Hackathon submissions
AI-based project evaluation
AI-powered project recommendations
AI-powered teammate recommendations
Advanced gamification
Additional collaboration tools
🎯 Project Goal

The goal of Student Collaborator is to make student project collaboration easier by bringing together:

Project Discovery
       +
Team Formation
       +
Task Management
       +
Communication
       +
Progress Tracking

into a single platform.

📈 Future Vision

Future versions of the platform may introduce a dedicated hackathon system:

Join Hackathon
      ↓
Build Team
      ↓
Develop Project
      ↓
Submit Project
      ↓
AI-Assisted Evaluation
      ↓
Leaderboard

These features are planned for future development and are not part of Phase 1.

👨‍💻 Author

Anurag Pandey

Computer Science & Engineering Student

GitHub: https://github.com/Anuragp-0407

⭐ Project Status

Phase 1 — Core Platform

🟢 Core features implemented
🟢 Backend APIs implemented
🟢 Frontend connected with backend
🟢 Authentication implemented
🟢 Real-time communication implemented
🟢 Team and task management implemented
🟢 Notification system implemented

The project is currently being finalized with integration, security review, testing, and deployment improvements.
