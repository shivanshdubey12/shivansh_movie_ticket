import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await register({ name, email, password, phone });
    setSubmitting(false);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '36px',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
        }}
      >
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
            Create an Account
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Join IMovies for seamless ticket bookings and instant rewards
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              FULL NAME
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px' }}
                placeholder="e.g. Alex Johnson"
              />
            </div>
          </div>

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
              PHONE NUMBER
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px' }}
                placeholder="+91 98765 43210"
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px' }}
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', marginTop: '8px' }}
          >
            {submitting ? 'Creating account...' : (
              <>
                Complete Registration <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: '#94a3b8' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#e50914', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

