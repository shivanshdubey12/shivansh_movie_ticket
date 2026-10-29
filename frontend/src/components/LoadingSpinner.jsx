import React from 'react';
import { Film } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', minHeight: '300px' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '3px solid rgba(229, 9, 20, 0.2)',
            borderTopColor: '#e50914',
            animation: 'spin 1s linear infinite'
          }}
        />
        <Film
          size={24}
          color="#e50914"
          style={{ position: 'absolute' }}
        />
      </div>
      <p style={{ marginTop: '16px', color: '#94a3b8', fontSize: '0.95rem', fontWeight: '500' }}>{message}</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;

