# 🎓 Campus Connect - Student Community & Club Management System

A full-stack web application that streamlines campus activities by bringing students, clubs, and administrators onto a single platform.

The platform enables club management, event organization, student communication, complaint handling, marketplace features, and real-time messaging to improve campus engagement and simplify student life.

---

# 🚀 Features

## 👤 User Authentication
- Secure Login System
- Session-based Authentication
- Passport.js Integration
- Role-based Access Control

---

## 🏛️ Club Management
- View all campus clubs
- Club profiles
- Club announcements
- Club-specific messaging
- Event requests by clubs

---

## 📅 Event Management
- Campus event calendar
- Event creation
- Event approval workflow
- Event scheduling

---

## 💬 Real-Time Messaging
- Student inbox
- Club messaging
- Direct messaging
- Socket.IO powered real-time communication

---

## 📢 Community Posts
- Create posts
- View community feed
- Share announcements
- Campus updates

---

## 📝 Complaint Management
- Submit complaints
- Complaint tracking
- Admin complaint handling

---

## 🛒 Student Marketplace
### Lost & Found
- Report lost items
- Report found items

### Resell Marketplace
- Buy and sell student items

### Cab Splits
- Find students for shared rides

### Food Splits
- Share food orders and split costs

---

## 👨‍💼 Admin Dashboard
- Manage students
- Manage clubs
- Manage events
- Approve requests
- Handle complaints

---

# 🛠️ Tech Stack

### Backend
- Node.js
- Express.js

### Frontend
- EJS
- HTML5
- CSS3
- JavaScript

### Database
- MongoDB
- Mongoose

### Authentication
- Passport.js
- Express Sessions

### Real-Time Communication
- Socket.IO

### File Uploads
- Multer

### Environment Management
- Dotenv

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/yourusername/hackathon-app.git
```

## 2. Navigate to project folder

```bash
cd hackathon-app
```

## 3. Install dependencies

```bash
npm install
```

## 4. Create a `.env` file

```env
ATLAS_URL=mongodb://bhuwalkadevansh_db_user:VgHs1FfXqOhAbJNM@ac-vxpezpu-shard-00-00.lwv82g8.mongodb.net:27017,ac-vxpezpu-shard-00-01.lwv82g8.mongodb.net:27017,ac-vxpezpu-shard-00-02.lwv82g8.mongodb.net:27017/hackathon-app?ssl=true&replicaSet=atlas-a1sw02-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0


```

---

## 5. Seed the database (Optional)

```bash
node seedAll.js
```

or individually

```bash
node seedStudents.js
node seedAdmins.js
node seedRoles.js
node seedClubs.js
```

---

## 6. Run the application

```bash
node app.js
```

The server will start on

```
http://localhost:3000
```

---

# 📦 Dependencies

- Express
- Mongoose
- Passport
- Passport Local
- Express Session
- Connect Mongo
- Socket.IO
- Multer
- Dotenv
- Method Override
- EJS
- EJS Mate

---

# 🎯 Project Objectives

This project aims to solve common challenges faced in educational institutions by providing:

- Centralized student communication
- Efficient club management
- Event coordination
- Complaint resolution
- Community engagement
- Student marketplace
- Real-time interaction

---

# 🔒 Authentication & Security

- Session Authentication
- Role-Based Authorization
- Protected Routes
- Secure Password Authentication

---

# 🎥 Demo Video

Watch the complete project demonstration here:

🔗 **Google Drive Link:**  
(https://drive.google.com/file/d/1IBLBAHkKlvAtTwIl9LY1Vpx2KXiJ2TPw/view?usp=drive_link)

> The video demonstrates the complete workflow of the application, including user authentication, club management, event management, marketplace, real-time messaging, and admin functionalities.

# 🌟 Future Improvements

- Email Notifications
- Push Notifications
- Mobile Application
- Attendance Tracking
- QR-based Event Check-in
- Analytics Dashboard
- Cloud Image Storage

---

# 👥 Contributors

- Keshav Agrawal
- Devansh Bhowalka
- Shubhanjali Singh

---

# 📄 License

This project is developed for educational and hackathon purposes.
