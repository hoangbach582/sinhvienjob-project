import React from 'react';
// import các component từ thư viện react-router-dom dùng để tạo Routing (Định tuyến)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Thư viện hiển thị thông báo (toast popup) góc màn hình

// =====================================
// IMPORT CÁC TRANG (PAGES) CỦA SINH VIÊN
// =====================================
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
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';

// =====================================
// IMPORT CÁC TRANG CỦA NHÀ TUYỂN DỤNG
// =====================================
import EmployerRegister from './pages/EmployerRegister'; 
import EmployerLogin from './pages/EmployerLogin'; 
import EmployerApplicants from './pages/EmployerApplicants'; 
import EmployerProfile from './pages/EmployerProfile'; 
import EmployerSettings from './pages/EmployerSettings'; 
import EmployerNotifications from './pages/EmployerNotifications';
import EmployerLayout from './layouts/EmployerLayout'; // Layout riêng cho Nhà tuyển dụng
import EmployerDashboard from './pages/EmployerDashboard'; 
import PostJob from './pages/PostJob'; 
import PostedJobs from './pages/PostedJobs'; 
import EditJob from './pages/EditJob'; 

// =====================================
// IMPORT CÁC TRANG CỦA ADMIN
// =====================================
import AdminLayout from './layouts/AdminLayout'; // Layout riêng cho Admin
import AdminDashboard from './pages/AdminDashboard'; 
import AdminAccounts from './pages/AdminAccounts'; 
import AdminJobs from './pages/AdminJobs'; 
import AdminIndustries from './pages/AdminIndustries'; 
import AdminFeedbacks from './pages/AdminFeedbacks';
import AdminActivityLog from './pages/AdminActivityLog';
import AdminLogin from './pages/AdminLogin'; 

// =====================================
// IMPORT CÁC CONTEXT PROVIDER
// =====================================
// Đây là nơi quản lý state toàn cục (Global State) thay vì dùng Redux
import { AuthProvider } from './context/AuthContext'; 
import { SavedJobsProvider } from './context/SavedJobsContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    // Bọc toàn bộ App bằng các Provider để các trang bên trong đều có thể xài được state của chúng
    <AuthProvider>  {/* Quản lý đăng nhập/đăng xuất */}
      <NotificationProvider> {/* Quản lý thông báo real-time */}
        <SavedJobsProvider> {/* Quản lý danh sách việc làm đã lưu */}
          <BrowserRouter> {/* Bọc hệ thống Router */}
          {/* Component cấu hình cho các thông báo Toast */}
          <Toaster position="top-center" reverseOrder={false} /> 
          
          {/* Chứa danh sách các Route (đường dẫn) */}
          <Routes>
            {/* ============================================================== */}
            {/* PHÂN HỆ SINH VIÊN (Dùng chung Layout mặc định của từng trang)  */}
            {/* ============================================================== */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email-notice" element={<EmailVerificationNotice />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} /> {/* Route nhận callback từ Google */}
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/job/:id" element={<JobDetail />} /> {/* :id là tham số động */}
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

            {/* ============================================================== */}
            {/* PHÂN HỆ NHÀ TUYỂN DỤNG (Có Layout bọc ngoài)                   */}
            {/* ============================================================== */}
            {/* 2 trang này không cần thanh điều hướng của Employer nên để ở ngoài */}
            <Route path="/employer/register" element={<EmployerRegister />} />
            <Route path="/employer/login" element={<EmployerLogin />} />
            
            {/* Các trang bắt đầu bằng /employer sẽ dùng EmployerLayout (chứa Sidebar + Topbar riêng) */}
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

            {/* ============================================================== */}
            {/* PHÂN HỆ QUẢN TRỊ VIÊN - ADMIN (Có Layout bọc ngoài)            */}
            {/* ============================================================== */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              {/* index route: Tự động chuyển hướng từ /admin sang /admin/dashboard */}
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