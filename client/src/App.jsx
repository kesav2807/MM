import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'react-hot-toast';
import './index.css';

// Lazy loading components for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const Matches = lazy(() => import('./pages/Matches'));
const Inbox = lazy(() => import('./pages/Inbox'));
const ChatList = lazy(() => import('./pages/ChatList'));
const ProfileDetail = lazy(() => import('./pages/ProfileDetail'));
const EngagementList = lazy(() => import('./pages/EngagementList'));
const Plans = lazy(() => import('./pages/Plans'));
const Payment = lazy(() => import('./pages/Payment'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const EditPreferences = lazy(() => import('./pages/EditPreferences'));
const VerifyProfile = lazy(() => import('./pages/VerifyProfile'));
const Settings = lazy(() => import('./pages/Settings'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const HelpPage = lazy(() => import('./pages/Help'));

const LoadingScreen = () => (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#4f46e5', fontWeight: 'bold' }}>
        Loading Madurai Matrimony...
    </div>
);

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Router>
          <div className="App">
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/search" element={<Matches />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/chatlist" element={<ChatList />} />
                <Route path="/views" element={<EngagementList />} />
                <Route path="/shortlists" element={<EngagementList />} />
                <Route path="/profile" element={<Navigate to="/dashboard" />} />
                <Route path="/profile/:id" element={<ProfileDetail />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/edit-preferences" element={<EditPreferences />} />
                <Route path="/verify" element={<VerifyProfile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/premium" element={<Plans />} />
                <Route path="/admin" element={<Navigate to="/admin/login" />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
                <Route path="/help" element={<HelpPage />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
