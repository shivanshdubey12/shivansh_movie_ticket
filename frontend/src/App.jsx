import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import SeatBooking from './pages/SeatBooking';
import Checkout from './pages/Checkout';
import BookingSuccess from './pages/BookingSuccess';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';

import './App.css';

function App() {
  const [selectedCity, setSelectedCity] = useState('All Cities');

  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="app-wrapper">
            <Navbar selectedCity={selectedCity} setSelectedCity={setSelectedCity} />

            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home selectedCity={selectedCity} />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/movie/:id" element={<MovieDetails selectedCity={selectedCity} />} />
                <Route path="/seat-booking/:showId" element={<SeatBooking />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Customer Routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/booking-success/:id"
                  element={
                    <ProtectedRoute>
                      <BookingSuccess />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute>
                      <MyBookings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />

                {/* 404 Catch All */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />

            <ToastContainer
              position="bottom-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;

