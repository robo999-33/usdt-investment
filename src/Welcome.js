// src/Welcome.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to USDT Investment Platform</h1>
      <div style={{ marginTop: '40px' }}>
        <button 
          onClick={() => navigate('/signup')} 
          style={{ padding: '10px 30px', marginRight: '20px', fontSize: '16px' }}
        >
          Sign Up
        </button>
        <button 
          onClick={() => navigate('/login')} 
          style={{ padding: '10px 30px', fontSize: '16px' }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Welcome;