import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '36px',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #e50914 0%, #b80710 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)'
            }}
          >
            <Film size={26} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: '6px' }}>
            Welcome to IMovies
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Sign in to manage bookings and secure your cinema seats
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div style={{ marginBottom: '24px', background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            QUICK ONE-CLICK DEMO ACCOUNTS:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('user@imovies.com', 'user123')}
              className="demo-pill"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <User size={13} color="#38bdf8" /> User (Alex)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@imovies.com', 'admin123')}
              className="demo-pill"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ShieldCheck size={13} color="#f59e0b" /> Admin Console
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px' }}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px' }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', marginTop: '8px' }}
          >
            {submitting ? 'Authenticating...' : (
              <>
                Sign In <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: '#94a3b8' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#e50914', fontWeight: 600, textDecoration: 'none' }}>
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

