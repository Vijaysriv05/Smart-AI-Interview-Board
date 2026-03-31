import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Experts from './pages/Experts';
import Recommendations from './pages/Recommendations';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import MockInterview from './pages/MockInterview';
import JobRecommendation from './pages/JobRecommendation';
import SkillGap from './pages/SkillGap';
import ApplicationTracker from './pages/ApplicationTracker';
import AdminComplaints from './pages/AdminComplaints';
import SkillAssessment from './pages/SkillAssessment';
import Sidebar from './components/Sidebar';
import ChatBot from './components/ChatBot';

const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-50 flex">
    <Sidebar />
    <main className="flex-1 overflow-x-hidden overflow-y-auto">
      {children}
    </main>
  </div>
);

const NotFound = () => <div className="p-8 text-center text-slate-500 mt-20">404 - Page Not Found</div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
          <Route path="/candidates" element={<ProtectedRoute><MainLayout><Candidates /></MainLayout></ProtectedRoute>} />
          <Route path="/experts" element={<ProtectedRoute><MainLayout><Experts /></MainLayout></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><MainLayout><Recommendations /></MainLayout></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><MainLayout><UserManagement /></MainLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute><MainLayout><Feedback /></MainLayout></ProtectedRoute>} />
          
          {/* Candidate Ecosystem Routes */}
          <Route path="/resume-analyzer" element={<ProtectedRoute><MainLayout><ResumeAnalyzer /></MainLayout></ProtectedRoute>} />
          <Route path="/mock-interview" element={<ProtectedRoute><MainLayout><MockInterview /></MainLayout></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><MainLayout><JobRecommendation /></MainLayout></ProtectedRoute>} />
          <Route path="/skill-gap" element={<ProtectedRoute><MainLayout><SkillGap /></MainLayout></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><MainLayout><ApplicationTracker /></MainLayout></ProtectedRoute>} />
          <Route path="/complaints" element={<ProtectedRoute><MainLayout><AdminComplaints /></MainLayout></ProtectedRoute>} />
          <Route path="/assessment" element={<ProtectedRoute><SkillAssessment /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatBot />
      </AuthProvider>
    </Router>
  );
}

export default App;