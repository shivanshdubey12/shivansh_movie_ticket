# 🎬 IMovies - Movie Ticket Booking Made Simple

A full-stack cinema ticketing and theater management platform built on the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with real-time seat tracking powered by **Socket.io**.

![IMovies Banner](https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

### 🍿 Customer Experience
- **Interactive Seating Map**: Visual auditorium layout categorized by **Silver**, **Gold**, and **VIP Recliner** seating tiers.
- **Live Seat Availability with Socket.io**: Real-time locking and booking updates broadcast to all users looking at the same show to prevent double bookings.
- **Movie Catalog & Filtering**: Search and filter by genre (Action, Sci-Fi, Drama, etc.), language, cinema location, and release status (Now Showing / Upcoming).
- **Showtimes & Schedules**: Real-time calendar dates with multi-theatre showtimes (2D, 3D, IMAX 3D, 4DX).
- **Simulated Payment Gateway**: Card (Debit/Credit) with card format validation and UPI (Google Pay, PhonePe, Paytm).
- **Digital QR E-Tickets**: Instant boarding pass ticket generator with scannable QR Code and **Print / PDF export**.
- **Booking Management**: View past and upcoming reservations with instant cancellation, seat release, and refund calculation.
- **Live Notifications**: Dropdown notification center for booking alerts and cancellation refunds.

### 🛡️ Admin Management Console
- **Executive Analytics Dashboard**: Real-time tracking of total revenue, tickets booked, active movies, and top-grossing blockbusters.
- **Movie Management**: Full CRUD operations for movies with poster URLs, synopsis, duration, cast, director, and YouTube trailer links.
- **Theatre & Auditorium Management**: Manage cinema branches across cities (Mumbai, Delhi, Bengaluru, Hyderabad) with screen and sound format setups.
- **Show Scheduler**: Link movies and theatres with dates, timings, format, and multi-tier pricing (automatically initializes 60 individual seat records per show).
- **All Bookings Audit**: Audit and search all platform transactions by customer or reference code.

---

## 🏗️ Technical Architecture

```
IMovies System Architecture
│
├── Frontend (React 18 + Vite)
│   ├── State & Auth Context (JWT token management)
│   ├── Socket.io Client (Real-time seat locking & broadcast sync)
│   ├── Modern Cinema UI (Glassmorphism, custom CSS, Lucide icons)
│   └── QRCode.react + Canvas Confetti
│
├── Backend (Node.js + Express.js)
│   ├── RESTful APIs (/api/auth, /api/movies, /api/theatres, /api/shows, /api/bookings, /api/admin)
│   ├── Socket.io Server (Auditorium room management: show_${showId})
│   ├── Role-Based Access Control (User & Admin middlewares)
│   ├── Express Rate Limiting & Multer File Upload
│   └── QRCode Base64 generation
│
└── Database (MongoDB Mongoose)
    ├── Users
    ├── Movies
    ├── Theatres
    ├── Shows
    ├── Seats
    ├── Bookings
    ├── Payments
    └── Notifications
```

---

## ⚡ Quick Start & Run Guide

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (Local instance or MongoDB Atlas. *Note: If a local MongoDB instance is not detected, the backend will automatically spin up an embedded in-memory MongoDB instance with pre-seeded data for zero-friction testing!*)

### 1. Start Backend Server
```bash
cd backend
npm install
node server.js
```
The backend server runs on `http://localhost:5000`. On first start, it automatically seeds 6 popular movies, 6 theatres across 4 cities, 180 scheduled shows, and sample bookings!

### 2. Start Frontend Client
```bash
cd frontend
npm install
npm run dev
```
The frontend dev server runs on `http://localhost:5173`.

---

## 🔑 Pre-Configured Demo Credentials

For quick testing, the login screen includes **one-click demo autofill buttons**:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@imovies.com` | `admin123` | Full access to Admin Console, movie/theatre/show management, and booking audits |
| **Customer** | `user@imovies.com` | `user123` | Book tickets, view and cancel reservations, view QR passes |

---

## 📊 Database Collections (8 Schemas)

1. **`Users`**: User details, bcrypt password hashing, avatar URL, and role (`user`, `admin`).
2. **`Movies`**: Title, synopsis, duration, genres, release date, rating, poster/banner URL, trailer link, status (`now_showing`, `upcoming`).
3. **`Theatres`**: Cinema name, city, location, full address, facilities, and screens list.
4. **`Shows`**: Movie ref, Theatre ref, date (YYYY-MM-DD), time (e.g. 06:30 PM), format, screen name, tiered ticket pricing (`silver`, `gold`, `vip`).
5. **`Seats`**: Show ref, seat number (`A1`, `B4`, `F10`), row, number, tier, status (`available`, `locked`, `booked`), lockedBy user ref, lockedAt timestamp.
6. **`Bookings`**: Booking reference code (`IM-XXXXXX-XXX`), user ref, show ref, seat details, subtotal, convenience fee, GST, total amount, status (`confirmed`, `cancelled`), base64 QR code.
7. **`Payments`**: Booking ref, user ref, amount, transaction ID, payment method (`Card`, `UPI`), status (`success`, `refunded`).
8. **`Notifications`**: User ref, title, message, type (`booking`, `cancellation`, `system`), read status.

---

## 📡 Real-Time Socket.io Events

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `joinShow` | Client ➔ Server | `{ showId }` | Joins the auditorium room `show_${showId}` |
| `leaveShow` | Client ➔ Server | `{ showId }` | Leaves the auditorium room |
| `lockSeat` | Client ➔ Server | `{ showId, seatNumber, userId }` | Temporarily locks a seat for other clients |
| `seatLocked` | Server ➔ Broadcast | `{ showId, seatNumber, userId }` | Notifies other viewers that a seat is being held |
| `unlockSeat` | Client ➔ Server | `{ showId, seatNumber, userId }` | Releases a locked seat |
| `seatUnlocked` | Server ➔ Broadcast | `{ showId, seatNumber }` | Notifies viewers that a seat is free again |
| `seatsUpdated`| Server ➔ Broadcast | `{ showId, bookedSeatNumbers, status }` | Broadcasts confirmed bookings or cancellations |

---

## 🔌 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user & return JWT token
- `GET /api/auth/me` - Get current user profile (Protected)
- `PUT /api/auth/profile` - Update name & phone (Protected)

### Movies (`/api/movies`)
- `GET /api/movies` - List movies with search, filter (genre, language, status), and pagination
- `GET /api/movies/featured` - Get top featured movies for spotlight carousel
- `GET /api/movies/:id` - Movie details & available showtimes
- `POST /api/movies` - Add new movie (Admin Only)
- `PUT /api/movies/:id` - Update movie (Admin Only)
- `DELETE /api/movies/:id` - Delete movie (Admin Only)

### Theatres (`/api/theatres`)
- `GET /api/theatres` - List theatres (filter by city)
- `GET /api/theatres/cities` - Get list of unique cities
- `GET /api/theatres/:id` - Theatre details with scheduled shows
- `POST /api/theatres` - Add new theatre (Admin Only)
- `PUT /api/theatres/:id` - Update theatre (Admin Only)
- `DELETE /api/theatres/:id` - Delete theatre (Admin Only)

### Shows (`/api/shows`)
- `GET /api/shows` - Get shows filtered by movie, date, theatre, city
- `GET /api/shows/:id` - Get show details, seating layout, and availability matrix
- `POST /api/shows` - Schedule show & generate 60 tiered seats (Admin Only)
- `PUT /api/shows/:id` - Update show (Admin Only)
- `DELETE /api/shows/:id` - Delete show (Admin Only)

### Bookings (`/api/bookings`)
- `POST /api/bookings` - Reserve seats, process payment, generate QR code (Protected)
- `GET /api/bookings/my-bookings` - Get user's booking history (Protected)
- `GET /api/bookings/:id` - Get single booking details (Protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking, refund amount, release seats (Protected)
- `GET /api/bookings` - View all system bookings with search & filter (Admin Only)

### Admin Analytics (`/api/admin`)
- `GET /api/admin/stats` - Total revenue, bookings count, top grossing movies, recent transactions (Admin Only)

### Notifications (`/api/notifications`)
- `GET /api/notifications` - Get user notifications & unread count (Protected)
- `PUT /api/notifications/:id/read` - Mark single notification as read (Protected)
- `PUT /api/notifications/read-all` - Mark all notifications as read (Protected)


# shivansh_movie_ticket

