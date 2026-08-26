# 🏢 HostelCare — Smart Hostel Management & Complaint Tracking System

<p align="center">
  <strong>A modern full-stack digital platform for smarter, safer, and more efficient hostel management and complaint tracking.</strong>
</p>

<p align="center">
  HostelCare simplifies hostel operations by providing a centralized platform for students, rectors, and administrators to manage complaints, maintenance requests, gate passes, mess services, attendance, fees, and hostel communication.
</p>

<p align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Secure_Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</p>

---

## 📌 Overview

**HostelCare** is a full-stack **Hostel Management and Complaint Tracking System** designed to digitize and streamline day-to-day hostel operations.

The primary goal of HostelCare is to provide a centralized platform where students can easily **raise, track, and monitor hostel complaints**, while rectors and administrators can **review, assign, manage, and resolve complaints efficiently**.

Along with complaint management, HostelCare supports essential hostel operations such as:

- 🛠️ Complaint and maintenance tracking
- 🎫 Digital gate pass / outpass management
- 🍽️ Mess menu and food feedback
- 📅 Attendance management
- 💰 Fee and due tracking
- 📢 Hostel announcements
- 👥 Student and staff management
- ⚡ Real-time status and notification updates

By bringing these processes into one system, HostelCare aims to reduce manual work, improve communication, increase transparency, and provide faster resolution of hostel-related issues.

---

## 🎯 Problem Statement

Traditional hostel management often involves:

- Manual complaint registration
- Delayed complaint resolution
- Difficulty tracking maintenance requests
- Paper-based gate pass processes
- Limited communication between students and hostel authorities
- Manual attendance management
- Difficulty monitoring hostel fees
- Lack of centralized hostel information

These processes can lead to delays, communication gaps, and difficulty maintaining accurate records.

**HostelCare** addresses these challenges by providing a centralized digital platform for hostel management and complaint tracking.

---

## 💡 Our Solution

HostelCare connects students, rectors, administrators, and hostel workers through a single role-based platform.

### Students

Students can:

- Raise hostel complaints
- Upload complaint images
- Track complaint status
- Apply for gate passes
- View mess menus
- Submit food feedback
- Check attendance
- View fee information
- Receive hostel announcements
- Manage their profile

### Rectors / Wardens

Rectors can:

- Monitor hostel activities
- Review student complaints
- Assign complaints to workers
- Track maintenance progress
- Approve or reject gate passes
- Manage students
- Manage attendance
- Manage mess menus
- Monitor food feedback
- Publish announcements

### Administrators

Administrators can:

- Monitor hostel-wide activities
- Manage rectors and staff
- Manage fees
- Monitor hostel operations
- Generate reports
- Manage global notifications and settings

---

# ✨ Key Features

## 🛠️ 1. Complaint & Maintenance Tracking

Complaint management is one of the core features of HostelCare.

### Student

Students can:

- Create a new complaint
- Select complaint category
- Add complaint description
- Upload image proof
- Submit maintenance requests
- Track complaint status

### Rector / Admin

Authorized users can:

- View complaints
- Review complaint details
- Assign complaints to workers
- Update complaint status
- Monitor maintenance progress

### Complaint Categories

The system supports maintenance categories such as:

- ⚡ Electrical
- 🚰 Plumbing
- 🪚 Carpenter
- 🧹 Cleanliness



### Complaint Workflow

```text
Student
   │
   ▼
Create Complaint
   │
   ▼
Rector / Admin Review
   │
   ▼
Assign Worker
   │
   ▼
Maintenance Work
   │
   ▼
Update Complaint Status
   │
   ▼
Student Receives Update
🎫 2. Digital Gate Pass / Outpass

Students can digitally apply for hostel leave or outpasses.

Features include:


Day leave
Night leave
Destination details
Date range
Emergency contact information
Application tracking
Approval / rejection
Rejection reason
Real-time status updates


Gate Pass Workflow:

Student
   │
   ▼
Submit Gate Pass
   │
   ▼
Rector / Admin Review
   │
   ├───────────────┐
   ▼               ▼
Approve          Reject
   │               │
   └───────┬───────┘
           ▼
     Student Update

🍽️ 3. Mess Menu & Food Feedback

HostelCare provides digital mess management.

Students can:

View mess schedules
Check daily/weekly menus
Rate food
Submit food reviews

Rectors can:

Manage mess menus
Monitor student feedback
Analyze food reviews

📅 4. Attendance Management

HostelCare provides digital attendance management.

Features include:

Daily attendance
Monthly attendance
Attendance history
Aggregate attendance information

Rectors can mark and manage attendance, while students can view their attendance records.

💰 5. Fee Management

Students can view:

Hostel fee information
Fee invoices
Payment status
Pending dues

Administrators can:

Manage fee structures
Track collections
Monitor pending dues

📢 6. Announcements & Notifications

Hostel authorities can publish important announcements to students.

Features include:

Hostel notices
Priority-based announcements
Global notifications
Real-time notification updates


👤 7. Profile Management

Students can manage and view their:

Personal information
Room information
Academic details
Contact information


👥 Role-Based Access

HostelCare follows a role-based architecture.

Role	Main Responsibilities
👨‍🎓 Student	Complaints, Gate Pass, Mess, Attendance, Fees, Notices, Profile
🛡️ Rector / Warden	Complaints, Workers, Gate Pass Approval, Students, Attendance, Mess, Announcements
👑 Admin	System Management, Staff, Fees, Reports, Notifications, Settings
🏗️ System Architecture
                    ┌──────────────────────────────┐
                    │       React 18 + Vite        │
                    │                              │
                    │   Student │ Rector │ Admin  │
                    └──────────────┬───────────────┘
                                   │
                         HTTP / REST API
                                   │
                              Socket.IO
                                   │
                    ┌──────────────▼───────────────┐
                    │       Express.js Server      │
                    │                              │
                    │ Authentication               │
                    │ Middleware                   │
                    │ Routes                       │
                    │ Controllers                  │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
             ┌──────▼────────┐          ┌────────▼───────┐
             │    MongoDB     │          │ File Storage   │
             │   Mongoose     │          │   /uploads     │
             └────────────────┘          └────────────────┘


🛠️ Technology Stack
Frontend:
Technology	Purpose -
React 18	Component-based UI
Vite	Frontend build and development tooling
React Router DOM v6	Client-side routing
Socket.IO Client	Real-time communication
CSS3	Responsive and customized styling

Backend:
Technology	Purpose -
Node.js	Server-side JavaScript runtime
Express.js 5	REST API framework

MongoDB	Database -
Mongoose	Database modeling
Socket.IO	Real-time communication
JWT	Authentication
Bcrypt.js	Password hashing
Google Auth Library	Google OAuth authentication
Multer	File uploads
Nodemailer	Email communication
Helmet	HTTP security
Compression	Response compression


📁 Project Structure
HostelCare/
│
├── Backend/
│   ├── config/
│   │   └── Database, Socket.IO and authentication configuration
│   │
│   ├── controllers/
│   │   └── Request and business logic
│   │
│   ├── middleware/
│   │   └── Authentication, authorization and error handling
│   │
│   ├── models/
│   │   └── Mongoose database schemas
│   │
│   ├── routes/
│   │   └── Express API routes
│   │
│   ├── uploads/
│   │   └── Uploaded complaint proof files
│   │
│   ├── utils/
│   │   └── Helper utilities and mail services
│   │
│   ├── seed.js
│   ├── server.js
│   └── package.json
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │
│   │   ├── modules/
│   │   │   ├── admin/
│   │   │   ├── login/
│   │   │   ├── rector/
│   │   │   └── student/
│   │   │
│   │   ├── socket.js
│   │   ├── style.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── API_DOCUMENTATION.md
├── HostelCare.postman_collection.json
├── LICENSE
└── README.md


🚀 Getting Started
Prerequisites

Before running the project, make sure you have:

Node.js v18 or higher
npm
MongoDB Local Server or MongoDB Atlas
Git
1️⃣ Clone the Repository
git clone https://github.com/GreeshmaChowdary16/HostelCare.git

cd HostelCare
2️⃣ Backend Setup

Navigate to the backend directory:

cd Backend

Install dependencies:

npm install

Create a .env file inside the Backend directory.

Backend Environment Variables
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/hostelcare

JWT_SECRET=your_super_secret_jwt_key

FRONTEND_URL=http://localhost:5173
Optional Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
Email Configuration
EMAIL_FROM=no-reply@hostelcare.local

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password

Start the backend:

npm run dev

Backend server:

http://localhost:5000
3️⃣ Frontend Setup

Open a new terminal.

Navigate to the frontend:

cd Frontend

Install dependencies:

npm install

Create a .env file inside the Frontend directory.

VITE_API_BASE_URL=http://localhost:5000/api

Start the frontend:

npm run dev

Frontend application:

http://localhost:5173

🌱 Database Seeding

HostelCare includes a database seed script for development and testing.

Navigate to the backend:

cd Backend

Run:

node seed.js

The seed script can populate sample data including:

Students
Rectors
Workers
Complaints
Mess menus
Gate pass requests

🔑 Demo Credentials

These credentials are intended for local development/testing only.

Role	Email	Password
Admin	admin@hostelcare.com	admin123
Rector	rector@hostelcare.com	rector123
Student	student@hostelcare.com	student123

Do not use these credentials in production.

📡 API Documentation

HostelCare provides REST APIs for the major hostel management workflows.

Detailed API documentation is available in:

API_DOCUMENTATION.md

A Postman collection is also included:

HostelCare.postman_collection.json

🔐 Authentication APIs
Method	Endpoint	Description	Access
POST	/api/auth/register	Register a new user	Public
POST	/api/auth/login	Authenticate user	Public
POST	/api/auth/google-login	Google authentication	Public
GET	/api/auth/me	Get active user profile	Private
PUT	/api/auth/me	Update active user profile	Private

🛠️ Complaint APIs
Method	Endpoint	Description	Access
POST	/api/complaints	Create a complaint	Student
GET	/api/complaints	Get complaints	Authenticated
PUT	/api/complaints/:id/status	Update complaint status / assign worker	Rector / Admin

🎫 Gate Pass APIs
Method	Endpoint	Description	Access
POST	/api/gatepass	Apply for gate pass	Student
GET	/api/gatepass	Get gate pass requests	Authenticated
PUT	/api/gatepass/:id/status	Approve / reject gate pass	Rector / Admin

📢 Announcement APIs
Method	Endpoint	Description	Access
GET	/api/announcements	Get active announcements	Authenticated
POST	/api/announcements	Publish announcement	Rector / Admin

🍽️ Mess APIs
Method	Endpoint	Description	Access
GET	/api/mess-menu	Get mess menu	Authenticated
POST	/api/mess-reviews	Submit food review	Student

📅 Attendance API
Method	Endpoint	Description	Access
GET	/api/attendance	Get attendance records	Authenticated

💰 Fees API
Method	Endpoint	Description	Access
GET	/api/fees	Get hostel fee information	Authenticated

⚡ Real-Time Communication

HostelCare uses Socket.IO to provide real-time updates.

Supported Events
Event	Direction	Purpose
new_notification	Server → Client	Send notifications
complaint_updated	Server → Client	Notify complaint status changes
gatepass_decision	Server → Client	Notify gate pass decisions

This allows students and hostel authorities to receive important updates without repeatedly refreshing the application.

🔒 Security

HostelCare includes several security mechanisms:

🔐 JWT-based authentication
👥 Role-Based Access Control
🔑 Bcrypt password hashing
🛡️ Protected API routes
✅ Input validation
🗄️ Mongoose schema validation
🪖 Helmet security headers
🌐 CORS configuration
⚡ Response compression
Role-Based Access
                    HostelCare
                        │
          ┌─────────────┼─────────────┐
          │             │             │
       Student        Rector         Admin
          │             │             │
          ▼             ▼             ▼
      Student       Hostel         System
      Services      Operations     Management
🔄 Core Workflows
Complaint Workflow
Student
   ↓
Raise Complaint
   ↓
Add Details / Image
   ↓
Complaint Submitted
   ↓
Rector / Admin Reviews
   ↓
Worker Assigned
   ↓
Maintenance Work
   ↓
Status Updated
   ↓
Student Notified
Gate Pass Workflow
Student
   ↓
Apply for Gate Pass
   ↓
Rector / Admin Reviews
   ↓
Approve / Reject
   ↓
Decision Recorded
   ↓
Student Notified
Mess Feedback Workflow
Student
   ↓
View Mess Menu
   ↓
Have Meal
   ↓
Rate Food
   ↓
Submit Review
   ↓
Rector Monitors Feedback

📊 Project Benefits

HostelCare helps hostel management by providing:

For Students
Faster complaint registration
Easy complaint tracking
Digital gate pass applications
Transparent fee information
Easy access to mess schedules
Quick access to hostel announcements
For Rectors
Centralized complaint management
Faster worker assignment
Digital gate pass approval
Student management
Attendance management
Mess monitoring
For Administrators
System-wide visibility
Staff management
Fee management
Reports and monitoring
Centralized application control

🎯 Project Objectives

The major objectives of HostelCare are:

Digitize hostel management processes.
Provide an efficient complaint tracking system.
Reduce manual complaint handling.
Improve communication between students and hostel authorities.
Provide transparent complaint status tracking.
Simplify gate pass management.
Centralize hostel information.
Improve maintenance workflow.
Provide role-based access to hostel services.
Enable real-time notifications and updates.

🔮 Future Enhancements

Possible future improvements include:

📱 Dedicated mobile application
📊 Advanced analytics dashboards
📈 Detailed complaint analytics
🔔 Enhanced notification system
📋 Automated report generation
🏢 Advanced hostel occupancy analytics
☁️ Cloud-based file storage
🧪 Automated testing
🔄 CI/CD pipeline integration
📝 Advanced audit logging
🧪 Testing

The project includes a Postman collection for API testing.

HostelCare.postman_collection.json

The collection can be imported into Postman to test backend APIs independently.

Testing should cover:

Authentication
Role-based access
Complaint creation
Complaint updates
Worker assignment
Gate pass workflow
Mess functionality
Attendance
Fees
Announcements
File uploads
Real-time notifications

🤝 Contributing

Contributions and improvements are welcome.

Create a feature branch
git checkout -b feature/your-feature
Stage changes
git add .
Commit changes
git commit -m "Add: your feature description"
Push the branch
git push origin feature/your-feature

Then create a Pull Request on GitHub.

Contribution Guidelines
Keep commits meaningful.
Follow the existing project structure.
Avoid unnecessary changes.
Test your changes before pushing.
Do not commit .env files.
Do not commit passwords, API keys, or database credentials.

🔐 Environment & Secrets

Never commit sensitive information such as:

MongoDB credentials
JWT secrets
Google OAuth credentials
SMTP passwords
API keys

Make sure .env files are included in .gitignore.

Example:

.env
.env.local
.env.*.local

📚 Documentation

Additional documentation included in the repository:

File	Description
README.md	Project overview and setup
API_DOCUMENTATION.md	Detailed REST API documentation
HostelCare.postman_collection.json	Postman API collection
LICENSE	Project license

👥 Project Team

HostelCare is developed as a collaborative full-stack software project.

The system follows a modular architecture that separates:

Frontend modules
Backend APIs
Database models
Authentication
Role-based workflows
Real-time communication

This structure makes the project easier to maintain, test, and extend.


<p align="center"> <strong>🏢 HostelCare</strong> </p> <p align="center"> Smarter Hostel Management • Better Complaint Tracking • Faster Resolution </p> <p align="center"> Built with ❤️ for better hostel management. </p> ```
