#  Vibe Commerce — E-Commerce Platform
**By:** Rajat Kumar Singh  

##  Project Overview
A modern full-stack e-commerce application built using **React (Frontend)** and **Node.js + Express + SQLite (Backend)**.

### Features
- Product listing (with dynamic fetch from backend)
- Add to Cart / Remove / Quantity update
- Animated UI (AOS integration)
- Toast notification for cart actions
- Checkout modal + Receipt summary
- Default image fallback for missing product images

### Tech Stack
- **Frontend:** React, AOS, CSS Animations
- **Backend:** Node.js, Express, SQLite3
- **Database:** Local SQLite (`db.sqlite` auto-seeds products)
- **API Communication:** Fetch over REST endpoints

### Setup Instructions
#### Backend
```bash
cd backend
npm install
node server.js
