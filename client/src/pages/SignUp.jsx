import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{};:'",.<>/?\\|`~_\-+=]).{8,}$/;

  // ✅ Combined validation + API submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};

    // Validation checks
    if (!name.trim()) next.name = 'Please enter your full name';
    if (!emailRegex.test(email)) next.email = 'Enter a valid email address';
    if (!passwordRegex.test(password))
      next.password = 'Min 8 chars with 1 uppercase, 1 number, 1 special';
    if (!Number(age) || Number(age) < 18)
      next.age = 'You must be at least 18 years old';

    setErrors(next);
    if (Object.keys(next).length) return; // stop if validation fails

    const data = {
      name,
      email,
      password,
      age: parseInt(age),
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        alert(result.message || 'User created successfully!');
        navigate('/questionnaire'); // redirect after signup
      } else {
        alert(result.message || 'Signup failed. Try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Error connecting to the server.');
    }
  };

  // --- Styling (unchanged)
  const page = {
    minHeight: '100vh',
    background: '#f6f7fb',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial',
    color: '#0f172a',
    position: 'relative',
  };
  const title = {
    margin: '0 0 6px 0',
    fontSize: 28,
    fontWeight: 800,
    color: '#1f2a44',
    textAlign: 'center',
  };
  const subline = { color: '#667085', fontSize: 14, textAlign: 'center' };
  const link = { color: '#274aa3', textDecoration: 'none', fontWeight: 600 };
  const card = {
    width: '100%',
    maxWidth: 580,
    background: '#fff',
    borderRadius: 14,
    padding: '22px 24px',
    border: '1px solid #e6e8ef',
    boxShadow: '0 16px 40px rgba(0,0,0,.08)',
  };
  const label = { display: 'grid', gap: 6 };
  const labelText = { fontSize: 14, color: '#344256', fontWeight: 600 };
  const input = {
    border: '1px solid #e5e7eb',
    outline: 'none',
    background: '#fff',
    padding: '10px 12px',
    fontSize: 14,
    color: '#0f172a',
    borderRadius: 10,
  };
  const errText = { color: '#ef4444', fontSize: 12, marginTop: 2 };
  const btnBase = {
    display: 'inline-block',
    textAlign: 'center',
    padding: '12px 14px',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    border: '1px solid transparent',
    cursor: 'pointer',
    textDecoration: 'none',
  };
  const btnPrimary = {
    ...btnBase,
    background: '#274aa3',
    color: '#fff',
    borderColor: '#274aa3',
    width: '100%',
  };
  const dashboardBtn = {
    ...btnBase,
    background: '#274aa3',
    color: '#fff',
    border: '1px solid #274aa3',
    position: 'absolute',
    top: 20,
    right: 20,
  };

  const iconWrap = {
    width: 50,
    height: 50,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fff',
    border: '1px solid #e6e8ef',
    boxShadow: '0 4px 10px rgba(0,0,0,.05)',
    marginBottom: 14,
  };
  const icon = { width: 28, height: 28, color: '#274aa3' };

  // --- JSX ---
  return (
    <div style={page}>
      <button style={dashboardBtn} onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>

      <div style={iconWrap}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={icon}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 3a9 9 0 018.94 7.88A9 9 0 0111 21V3z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 3v9H2.06A9.001 9.001 0 0111 3z"
          />
        </svg>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <h1 style={title}>Create your Spread Wealth account</h1>
        <div style={subline}>
          Already have an account?{' '}
          <Link to="/signin" style={link}>
            Sign in
          </Link>
        </div>
      </div>

      <div style={card}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <label style={label}>
            <span style={labelText}>Full Name</span>
            <input
              style={{
                ...input,
                borderColor: errors.name ? '#ef4444' : '#e5e7eb',
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
            {errors.name && <div style={errText}>{errors.name}</div>}
          </label>

          <label style={label}>
            <span style={labelText}>Email</span>
            <input
              style={{
                ...input,
                borderColor: errors.email ? '#ef4444' : '#e5e7eb',
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
            {errors.email && <div style={errText}>{errors.email}</div>}
          </label>

          <label style={label}>
            <span style={labelText}>Password</span>
            <input
              type="password"
              style={{
                ...input,
                borderColor: errors.password ? '#ef4444' : '#e5e7eb',
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
            <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
              At least 8 characters
            </div>
            {errors.password && <div style={errText}>{errors.password}</div>}
          </label>

          <label style={label}>
            <span style={labelText}>Age</span>
            <input
              type="number"
              style={{
                ...input,
                borderColor: errors.age ? '#ef4444' : '#e5e7eb',
              }}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Your age"
              min="0"
            />
            <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
              You must be at least 18 years old
            </div>
            {errors.age && <div style={errText}>{errors.age}</div>}
          </label>

          <button type="submit" style={btnPrimary}>
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
