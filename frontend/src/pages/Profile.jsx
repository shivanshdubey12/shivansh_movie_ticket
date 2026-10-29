import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, ShieldCheck, Check } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({ name, phone });
    setSaving(false);
  };

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '40px 20px 80px', maxWidth: '640px' }}>
      <div className="glass-card" style={{ padding: '36px', borderRadius: '20px' }}>
        
        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
            alt={user.name}
            style={{ width: '74px', height: '74px', borderRadius: '50%', background: '#334155', border: '2px solid #e50914' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '1.4rem', color: '#ffffff' }}>{user.name}</h1>
              {user.role === 'admin' && (
                <span className="tag-pill badge-red" style={{ fontSize: '0.7rem' }}>
                  <ShieldCheck size={12} /> ADMIN
                </span>
              )}
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{user.email}</p>
          </div>
        </div>

        {/* Update Profile Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              EMAIL (READ-ONLY)
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                disabled
                value={user.email}
                className="form-input"
                style={{ paddingLeft: '36px', opacity: 0.6, cursor: 'not-allowed' }}
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

          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', marginTop: '10px' }}
          >
            {saving ? 'Saving changes...' : (
              <>
                <Check size={16} /> Save Profile Changes
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Profile;

