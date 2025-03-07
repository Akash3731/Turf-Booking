<h1 align="center">
 <img src="https://readme-typing-svg.herokuapp.com/?lines=Turf+Booking+Platform;Connect+Players+and+Turf+Owners;Seamless+Payment+Solutions&center=true&size=30">
</h1>

<h3 align="center">
 🏟️ Full-Stack Turf Booking System | 💳 Integrated Payments | 📱 Responsive Design
</h3>

---

### 🌟 Project Overview

A comprehensive MERN stack application that connects sports enthusiasts with turf owners, featuring dual payment processing options through Razorpay integration.

### ✨ Key Features

- **👥 User & Admin Authentication**
- Secure JWT-based authentication
- Role-based access control

- **🏟️ Turf Management**
- Interactive turf listings with details and images
- Advanced filtering by location, sport type, and availability

- **📅 Booking System**
- Real-time availability calendar
- Time slot selection with duration calculation

- **💸 Dual Payment Processing**
- Direct payments to turf owners' Razorpay accounts
- Platform-mediated escrow payments
- Cash on arrival option

- **📊 User Dashboard**
- Booking history and management
- Easy cancellation and rescheduling

### 🛠️ Tech Stack

<p align="center">
 <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
 <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
 <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
 <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
 <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite"/>
 <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"/>
 <img src="https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF" alt="Razorpay"/>
 <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT"/>
 <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios"/>
</p>

### 📋 Installation & Setup

```bash
# Clone repository
git clone https://github.com/yourusername/turf-booking-platform.git
cd turf-booking-platform

# Server setup
npm install

# Client setup
cd client
npm install
cd ..

# Create environment variables
# Server (.env)
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Client (.env)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_API_URL=http://localhost:5000

# Run development server
npm run dev
```
