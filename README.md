# 🚀 PublicPlus – Civic Intelligence & Reporting System

PublicPlus is a modern civic issue management platform built to improve communication between citizens and local authorities. The system helps people report city-related problems, while government departments and operators can manage, track, and resolve issues efficiently.

The platform combines real-time tracking, AI-based image verification, automated task assignment, and SLA monitoring to create a transparent and reliable civic management experience.

---

# 🛠 Tech Stack

## Frontend

* **Framework:** React.js 19 (Vite)
* **Styling:** Tailwind CSS
* **State Management:** React Context API
* **Real-Time Updates:** Socket.io-client
* **Maps & Geolocation:** Leaflet and Google Maps API
* **Charts & Analytics:** Recharts
* **Animations & Icons:** Framer Motion and Lucide React

## Backend

* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JWT and Bcryptjs
* **Real-Time Communication:** Socket.io
* **Automation & Scheduling:** Node-cron

## AI Service

* **Language:** Python
* **Framework:** PyTorch
* **Model Used:** EfficientNet-V2
* **Purpose:** Detect fake or AI-generated complaint images
* **Integration:** Flask API

## Storage & Services

* **Cloud Database:** MongoDB Atlas
* **Image Storage:** Cloudinary
* **Email Service:** Brevo SMTP
* **Push Notifications:** Firebase Cloud Messaging (FCM)

---

# 👥 User Roles & Features

## 1. 🏙 Citizen (Reporter)

Citizens can report civic issues directly from the platform.

### Features

* Register and login securely using OTP verification
* Report issues with:

  * Images
  * Description
  * Auto-detected GPS location
* Track complaint status in real time:

  * Reported
  * In Progress
  * Resolved
* Upvote or downvote nearby complaints based on urgency
* Receive instant notifications and email confirmations

---

## 2. 👷 Operator (Field Worker)

Operators handle tasks assigned by departments.

### Features

* View assigned complaints and priorities
* Update task status during field work
* Upload image proof after completing work
* Track personal performance statistics
* View pending and completed tasks
* Get protected from overload using max-capacity limits
* Monitor SLA timers before deadlines are breached

---

## 3. 🏢 Department Admin

Department Admins manage complaints related to their department.

### Features

* Monitor all complaints assigned to the department
* Reassign tasks when necessary
* Approve or reject operator resolution proofs
* Receive escalation alerts for delayed complaints
* Use intelligent task assignment based on operator workload

---

## 4. 🛡 Super Admin

The Super Admin manages the complete system.

### Features

* Create and manage departments and operators
* Configure issue categories and SLA timings
* Monitor city-wide complaint analytics
* View heatmaps and performance statistics
* Access logs for escalations and status updates

---

# ⚡ Intelligent System Features

## 1. Automated Task Assignment

The system automatically assigns complaints using a Least-Load Algorithm.

### Workflow

1. Search operators in the complaint zone
2. If unavailable, search in fallback zones
3. Select the operator with:

   * Lowest active workload
   * Available capacity

This ensures balanced task distribution.

---

## 2. Duplicate Complaint Detection

The platform avoids duplicate complaint submissions using:

### Spatial Matching

* Detects complaints within a 50-meter radius

### Semantic Matching

* Compares complaint descriptions using similarity matching logic

This improves data quality and reduces repeated reports.

---

## 3. SLA Escalation Engine

A background automation service continuously checks complaint deadlines.

### Features

* Automatically increases escalation levels
* Recalculates deadlines after breaches
* Sends alerts through:

  * Push notifications
  * Emails
  * Dashboard notifications

---

# 🌐 Deployment

## Frontend

* Hosted on Vercel

## Backend

* Deployed on Render or Railway

## Database

* MongoDB Atlas Cloud Cluster

## AI Service

* Containerized Python deployment for isolated AI processing

---

# 🧪 Testing & Performance

### Unit Testing

* Priority calculation logic
* Similarity detection logic

### Integration Testing

* User → API → AI Service → Database workflow

### Performance Optimization

* Optimized Socket.io communication
* Efficient Cloudinary image uploads
* Supports large-scale concurrent users

---

# ✨ Key Highlights

* Real-time civic issue tracking
* AI-powered fake image detection
* Smart task assignment system
* SLA monitoring and escalation handling
* Interactive maps and analytics dashboard
* Secure authentication and role-based access

---

# 📌 Conclusion

PublicPlus is designed to make civic issue management faster, smarter, and more transparent. By combining AI, automation, real-time communication, and geospatial intelligence, the platform helps authorities respond to public complaints more effectively while giving citizens a better reporting experience.

---

Developed by the PublicPlus Engineering Team.
