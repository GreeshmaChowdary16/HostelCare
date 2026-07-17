# HostelCare Backend API Documentation

This document outlines the API endpoints, authentication mechanism, request payloads, and response structures for the HostelCare backend application.

## Base URL
All API requests should be sent to:
`http://localhost:5000/api`

---

## Authentication

All protected endpoints require a JWT token passed in the Authorization header.
```http
Authorization: Bearer <your_jwt_token>
```

### 1. Register User
Registers a new user in the system.
* **Endpoint**: `/auth/register`
* **Method**: `POST`
* **Auth Required**: No
* **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.student@hostelcare.com",
  "password": "password123",
  "role": "student"
}
```
* **Response (201 Created)**:
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "60c72b2f9b1d8a2c88888888",
    "name": "John Doe",
    "email": "john.student@hostelcare.com",
    "role": "student",
    "createdAt": "2026-07-16T08:52:00.000Z",
    "updatedAt": "2026-07-16T08:52:00.000Z"
  }
}
```

### 2. Login User
Authenticates a user and returns a JWT token.
* **Endpoint**: `/auth/login`
* **Method**: `POST`
* **Auth Required**: No
* **Request Body**:
```json
{
  "email": "student@hostelcare.com",
  "password": "password2",
  "role": "student"
}
```
* **Response (200 OK)**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "student",
  "name": "Anjali Sharma"
}
```

### 3. Google OAuth Login
Authenticates/Registers a user via Google OAuth2.
* **Endpoint**: `/auth/google-login`
* **Method**: `POST`
* **Auth Required**: No
* **Request Body**:
```json
{
  "idToken": "<google_credential_id_token>",
  "role": "student"
}
```
* **Response (200 OK)**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "student",
  "name": "Greeshma Chowdary"
}
```

### 4. Get Current User Profile
Retrieves detailed profile info of the logged-in user.
* **Endpoint**: `/auth/me`
* **Method**: `GET`
* **Auth Required**: Yes
* **Response (200 OK)**:
```json
{
  "_id": "60c72b2f9b1d8a2c88888889",
  "name": "Anjali Sharma",
  "email": "student@hostelcare.com",
  "role": "student",
  "phone": "+91 70001 23456",
  "parentPhone": "+91 94444 55555",
  "rollNo": "2022CS1045",
  "branch": "Computer Science & Engineering",
  "year": "3rd Year",
  "roomInfo": "Girls Hostel A - Room 302",
  "bio": "CSE undergrad interested in cloud systems."
}
```

### 5. Update Profile
Updates fields in the current user's profile.
* **Endpoint**: `/auth/me`
* **Method**: `PUT`
* **Auth Required**: Yes
* **Request Body**:
```json
{
  "phone": "+91 99999 88888",
  "bio": "Interested in distributed databases.",
  "roomInfo": "Girls Hostel A - Room 303"
}
```
* **Response (200 OK)**:
```json
{
  "_id": "60c72b2f9b1d8a2c88888889",
  "name": "Anjali Sharma",
  "email": "student@hostelcare.com",
  "role": "student",
  "phone": "+91 99999 88888",
  "roomInfo": "Girls Hostel A - Room 303",
  "bio": "Interested in distributed databases."
}
```

---

## Complaints Management

### 1. File a Complaint
Allows students to lodge a new maintenance/service complaint.
* **Endpoint**: `/complaints`
* **Method**: `POST`
* **Auth Required**: Yes (Student only)
* **Request Body**:
```json
{
  "category": "Electrician",
  "subCategory": null,
  "problem": "Fan speed regulator is broken in Room 302.",
  "proof": "fan_photo.jpg"
}
```
* **Response (201 Created)**:
```json
{
  "message": "Complaint submitted successfully",
  "complaint": {
    "_id": "60c72b2f9b1d8a2c88888890",
    "student": "60c72b2f9b1d8a2c88888889",
    "category": "Electrician",
    "subCategory": null,
    "problem": "Fan speed regulator is broken in Room 302.",
    "proof": "fan_photo.jpg",
    "status": "Pending",
    "createdAt": "2026-07-16T08:52:00.000Z"
  }
}
```

### 2. View Complaints
* **Endpoint**: `/complaints`
* **Method**: `GET`
* **Auth Required**: Yes
* **Behavior**:
  * Students see only their own complaints.
  * Rectors/Admins see all complaints in the system.
* **Response (200 OK)**:
```json
[
  {
    "_id": "60c72b2f9b1d8a2c88888890",
    "student": {
      "_id": "60c72b2f9b1d8a2c88888889",
      "name": "Anjali Sharma",
      "email": "student@hostelcare.com",
      "role": "student",
      "phone": "+91 70001 23456",
      "parentPhone": "+91 94444 55555",
      "rollNo": "2022CS1045",
      "branch": "Computer Science & Engineering",
      "year": "3rd Year",
      "roomInfo": "Girls Hostel A - Room 302"
    },
    "category": "Electrician",
    "subCategory": null,
    "problem": "Fan speed regulator is broken in Room 302.",
    "proof": "fan_photo.jpg",
    "status": "Pending",
    "createdAt": "2026-07-16T08:52:00.000Z"
  }
]
```

### 3. Update Complaint Status & Assign Staff
Updates status of a complaint and optionally assigns a maintenance worker.
* **Endpoint**: `/complaints/:id/status`
* **Method**: `PUT`
* **Auth Required**: Yes (Rector or Admin only)
* **Request Body**:
```json
{
  "status": "In Progress",
  "assignedWorker": {
    "name": "Ramesh Lal",
    "phone": "+91 98989 89898",
    "role": "Electrician Staff"
  }
}
```
* **Response (200 OK)**:
```json
{
  "message": "Complaint status updated successfully",
  "complaint": {
    "_id": "60c72b2f9b1d8a2c88888890",
    "student": "60c72b2f9b1d8a2c88888889",
    "category": "Electrician",
    "subCategory": null,
    "problem": "Fan speed regulator is broken in Room 302.",
    "proof": "fan_photo.jpg",
    "status": "In Progress",
    "assignedWorker": {
      "name": "Ramesh Lal",
      "phone": "+91 98989 89898",
      "role": "Electrician Staff"
    }
  }
}
```

---

## Gate Pass Management

### 1. Apply for Gate Pass
Allows students to apply for leaves or daily passes.
* **Endpoint**: `/gatepass`
* **Method**: `POST`
* **Auth Required**: Yes (Student only)
* **Request Body**:
```json
{
  "reason": "Visiting home for weekend",
  "fromDate": "2026-07-18",
  "toDate": "2026-07-20",
  "noOfDays": 3,
  "destination": "Mumbai",
  "contactNo": "+91 70001 23456",
  "parentContactNo": "+91 94444 55555",
  "timeFrom": "09:00 AM",
  "timeTo": "06:00 PM",
  "isExtension": false
}
```
* **Response (201 Created)**:
```json
{
  "message": "Gate pass application submitted successfully",
  "gatePass": {
    "_id": "60c72b2f9b1d8a2c88888895",
    "student": "60c72b2f9b1d8a2c88888889",
    "reason": "Visiting home for weekend",
    "fromDate": "2026-07-18T00:00:00.000Z",
    "toDate": "2026-07-20T00:00:00.000Z",
    "noOfDays": 3,
    "destination": "Mumbai",
    "contactNo": "+91 70001 23456",
    "parentContactNo": "+91 94444 55555",
    "timeFrom": "09:00 AM",
    "timeTo": "06:00 PM",
    "status": "Pending"
  }
}
```

### 2. Get Gate Passes
* **Endpoint**: `/gatepass`
* **Method**: `GET`
* **Auth Required**: Yes
* **Behavior**:
  * Students see only their own gate pass requests.
  * Rectors/Admins see all requests.
* **Response (200 OK)**:
```json
[
  {
    "_id": "60c72b2f9b1d8a2c88888895",
    "student": {
      "_id": "60c72b2f9b1d8a2c88888889",
      "name": "Anjali Sharma",
      "email": "student@hostelcare.com",
      "role": "student",
      "phone": "+91 70001 23456",
      "parentPhone": "+91 94444 55555"
    },
    "reason": "Visiting home for weekend",
    "fromDate": "2026-07-18T00:00:00.000Z",
    "toDate": "2026-07-20T00:00:00.000Z",
    "noOfDays": 3,
    "destination": "Mumbai",
    "status": "Pending"
  }
]
```

### 3. Approve or Reject Gate Pass
Allows rectors or admins to update gate pass status.
* **Endpoint**: `/gatepass/:id/status`
* **Method**: `PUT`
* **Auth Required**: Yes (Rector or Admin only)
* **Request Body**:
```json
{
  "status": "Approved",
  "rejectionReason": null
}
```
* Or for Rejection:
```json
{
  "status": "Rejected",
  "rejectionReason": "Parent has not confirmed permission."
}
```
* **Response (200 OK)**:
```json
{
  "message": "Gate pass request approved successfully",
  "gatePass": {
    "_id": "60c72b2f9b1d8a2c88888895",
    "status": "Approved",
    "rejectionReason": null
  }
}
```

---

## Announcements

### 1. Create Announcement
* **Endpoint**: `/announcements`
* **Method**: `POST`
* **Auth Required**: Yes (Rector or Admin only)
* **Request Body**:
```json
{
  "title": "Water Tank Cleaning Tomorrow",
  "content": "Water supply will be shut down between 10 AM to 1 PM.",
  "category": "Maintenance",
  "color": "#e74a3b"
}
```
* **Response (201 Created)**:
```json
{
  "message": "Announcement posted successfully",
  "announcement": {
    "_id": "60c72b2f9b1d8a2c88888899",
    "title": "Water Tank Cleaning Tomorrow",
    "content": "Water supply will be shut down between 10 AM to 1 PM.",
    "category": "Maintenance",
    "color": "#e74a3b",
    "author": "60c72b2f9b1d8a2c88888887",
    "createdAt": "2026-07-16T08:52:00.000Z"
  }
}
```

### 2. Get Announcements
Fetches all announcements, sorted newest first.
* **Endpoint**: `/announcements`
* **Method**: `GET`
* **Auth Required**: Yes (Any logged-in user)
* **Response (200 OK)**:
```json
[
  {
    "_id": "60c72b2f9b1d8a2c88888899",
    "title": "Water Tank Cleaning Tomorrow",
    "content": "Water supply will be shut down between 10 AM to 1 PM.",
    "category": "Maintenance",
    "color": "#e74a3b",
    "author": {
      "_id": "60c72b2f9b1d8a2c88888887",
      "name": "Mrs. Priya Kumar",
      "role": "rector"
    },
    "createdAt": "2026-07-16T08:52:00.000Z"
  }
]
```

### 3. Delete Announcement
Removes an announcement by ID.
* **Endpoint**: `/announcements/:id`
* **Method**: `DELETE`
* **Auth Required**: Yes (Rector or Admin only)
* **Response (200 OK)**:
```json
{
  "message": "Announcement deleted successfully"
}
```
