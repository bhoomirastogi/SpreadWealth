import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import Questionnaire from './pages/Questionnaire.jsx';
import Recommendations from './pages/Recommendations.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MarketOverview from './pages/MarketOverview.jsx';

export default function App() {

  // ✅ Fetch your backend data here
  useEffect(() => {
    fetch("http://127.0.0.1:5000/users")
      .then(res => res.json())
      .then(data => console.log("Fetched data:", data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/market" element={<MarketOverview />} />
      </Routes>
    </div>
  );
}
