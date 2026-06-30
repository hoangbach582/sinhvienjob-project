import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Import Toaster
import Home from './pages/Home';
import Login from './pages/Login'; 
import Register from './pages/Register'; 
import ForgotPassword from './pages/ForgotPassword'; 
import ResetPassword from './pages/ResetPassword'; 
import EmailVerificationNotice from './pages/EmailVerificationNotice';
import VerifyEmail from './pages/VerifyEmail';
import Jobs from './pages/Jobs'; 
import JobDetail from './pages/JobDetail'; 
import StudentProfile from './pages/StudentProfile'; 
import ApplyJob from './pages/ApplyJob'; 
import AppliedJobs from './pages/AppliedJobs'; 
import SavedJobs from './pages/SavedJobs'; 
import BuildCV from './pages/BuildCV';  
import StudentSettings from './pages/StudentSettings'; 
import GoogleCallback from './pages/GoogleCallback'; 
import Notifications from './pages/Notifications';
import StudentDashboard from './pages/StudentDashboard';


import EmployerRegister from './pages/EmployerRegister'; 
import EmployerLogin from './pages/EmployerLogin'; 
import EmployerApplicants from './pages/EmployerApplicants'; 
import EmployerProfile from './pages/EmployerProfile'; 
import EmployerSettings from './pages/EmployerSettings'; 
import EmployerNotifications from './pages/EmployerNotifications';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';

import EmployerLayout from './layouts/EmployerLayout';
import EmployerDashboard from './pages/EmployerDashboard'; 
import PostJob from './pages/PostJob'; 
import PostedJobs from './pages/PostedJobs'; 
import EditJob from './pages/EditJob'; 
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard'; 
import AdminAccounts from './pages/AdminAccounts'; 
import AdminJobs from './pages/AdminJobs'; 
import AdminIndustries from './pages/AdminIndustries'; 
import AdminFeedbacks from './pages/AdminFeedbacks';
import AdminActivityLog from './pages/AdminActivityLog';
import AdminLogin from './pages/AdminLogin'; 

import { AuthProvider } from './context/AuthContext'; 
import { SavedJobsProvider } from './context/SavedJobsContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <AuthProvider>  
      <NotificationProvider>
        <SavedJobsProvider>
          <BrowserRouter>
          <Toaster position="top-center" reverseOrder={false} /> {/* Thêm Toaster ở đây */}
          <Routes>
            {/* Phân hệ Ứng viên */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email-notice" element={<EmailVerificationNotice />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/job/:id" element={<JobDetail />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/job/:id/apply" element={<ApplyJob />} />
            <Route path="/applied-jobs" element={<AppliedJobs />} />
            <Route path="/saved-jobs" element={<SavedJobs />} /> 
            <Route path="/build-cv" element={<BuildCV />} />
            <Route path="/settings" element={<StudentSettings />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:id" element={<CompanyDetail />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/dashboard" element={<StudentDashboard />} />

            {/* Phân hệ Nhà tuyển dụng */}
            <Route path="/employer/register" element={<EmployerRegister />} />
            <Route path="/employer/login" element={<EmployerLogin />} />
            <Route path="/employer" element={<EmployerLayout />}>
              <Route path="dashboard" element={<EmployerDashboard />} /> 
              <Route path="post-job" element={<PostJob />} />
              <Route path="edit-job/:id" element={<EditJob />} />
              <Route path="posted-jobs" element={<PostedJobs />} />
              <Route path="applicants" element={<EmployerApplicants />} />
              <Route path="profile" element={<EmployerProfile />} />
              <Route path="notifications" element={<EmployerNotifications />} />
              <Route path="settings" element={<EmployerSettings />} />
            </Route>

            {/* Phân hệ Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} /> 
              <Route path="accounts" element={<AdminAccounts />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="industries" element={<AdminIndustries />} />
              <Route path="feedbacks" element={<AdminFeedbacks />} />
              <Route path="activity-logs" element={<AdminActivityLog />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SavedJobsProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;