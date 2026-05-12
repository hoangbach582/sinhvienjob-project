import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login'; // Import trang đăng nhập
import Register from './pages/Register'; // Import trang đăng ký
import ForgotPassword from './pages/ForgotPassword'; // Import trang quên mật khẩu
import ResetPassword from './pages/ResetPassword'; // Import trang đặt lại mật khẩu
import EmailVerificationNotice from './pages/EmailVerificationNotice';
import VerifyEmail from './pages/VerifyEmail';
import Jobs from './pages/Jobs'; // Import trang danh sách việc làm
import JobDetail from './pages/JobDetail'; // Import trang chi tiết công việc
import StudentProfile from './pages/StudentProfile'; // Import trang hồ sơ sinh viên
import ApplyJob from './pages/ApplyJob'; // Import Form ứng tuyển 
import AppliedJobs from './pages/AppliedJobs'; // Import trang việc làm đã ứng tuyển của sinh viên
import BuildCV from './pages/BuildCV';  
import StudentSettings from './pages/StudentSettings'; // Import trang cài đặt tài khoản
import GoogleCallback from './pages/GoogleCallback'; // Import trang xử lý đăng nhập Google


import EmployerRegister from './pages/EmployerRegister'; // Import trang đăng ký cho NTD
import EmployerLogin from './pages/EmployerLogin'; // Import trang đăng nhập cho NTD
import EmployerApplicants from './pages/EmployerApplicants'; // Import trang quản lý hồ sơ ứng viên của NTD
import EmployerProfile from './pages/EmployerProfile'; // Import trang thông tin công ty(NTD)
import EmployerSettings from './pages/EmployerSettings'; // Import trang cài đặt tài khoản NTD
import Companies from './pages/Companies'; //Import trang danh sách công ty
// Import Layout và Page
import EmployerLayout from './layouts/EmployerLayout';
import EmployerDashboard from './pages/EmployerDashboard'; // Import trang dashboard nhà tuyển dụng
import PostJob from './pages/PostJob'; // Import trang Đăng tin
import PostedJobs from './pages/PostedJobs'; // Import trang Tin đã đăng
import EditJob from './pages/EditJob'; // Import trang Sửa tin
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard'; // Import trang Dashboard admin
import AdminAccounts from './pages/AdminAccounts'; // Import trang quản lý tài khoản admin
import AdminJobs from './pages/AdminJobs'; // Import trang quản lý tin tuyển dụng admin
import AdminIndustries from './pages/AdminIndustries'; // Import trang quản lý ngành nghề admin
import AdminLogin from './pages/AdminLogin'; // Import trang đăng nhập admin

import { AuthProvider } from './context/AuthContext'; // Import trạm phát sóng Context để quản lý đăng nhập
function App() {
  return (
    <AuthProvider>  
      <BrowserRouter>
        <Routes>
          {/* Phân hệ Ứng viên */}
          <Route path="/" element={<Home />} />{/* Đường dẫn '/' (Trang chủ) sẽ gọi giao diện Home */}
          {/* Trang đăng nhập */}
          <Route path="/login" element={<Login />} />
          {/* Trang đăng ký */}
          <Route path="/register" element={<Register />} />
          {/* Trang quên mật khẩu */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Trang đặt lại mật khẩu */}
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* Xác minh email */}
          <Route path="/verify-email-notice" element={<EmailVerificationNotice />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          {/* Callback của Google */}
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          {/* Trang danh sách việc làm */}
          <Route path="/jobs" element={<Jobs />} />
          {/* Trang chi tiết công việc */}
          <Route path="/job/:id" element={<JobDetail />} />
          {/* Trang hồ sơ sinh viên */}
          <Route path="/profile" element={<StudentProfile />} />
          {/* Form ứng tuyển */}
          <Route path="/job/:id/apply" element={<ApplyJob />} />
          {/* Trang việc làm đã ứng tuyển */}
          <Route path="/applied-jobs" element={<AppliedJobs />} />
          {/* Trang tạo CV */}
          <Route path="/build-cv" element={<BuildCV />} />
          {/* Trang cài đặt tài khoản */}
          <Route path="/settings" element={<StudentSettings />} />

          <Route path="/companies" element={<Companies />} />

          {/* Phân hệ Nhà tuyển dụng */}
          {/* Trang đăng ký cho NTD */}
          <Route path="/employer/register" element={<EmployerRegister />} />
          {/* Trang đăng nhập cho NTD */}
          <Route path="/employer/login" element={<EmployerLogin />} />
          {/* Định tuyến lồng nhau cho Nhà tuyển dụng */}
          <Route path="/employer" element={<EmployerLayout />}>
            {/* Trang Quản lý của nhà tuyển dụng :Khi URL là /employer/dashboard */}
            <Route path="dashboard" element={<EmployerDashboard />} /> 
            {/* Trang Đăng tin mới: Khi URL là /employer/post-job */}
            <Route path="post-job" element={<PostJob />} />
            {/* Trang Sửa tin */}
            <Route path="edit-job/:id" element={<EditJob />} />
            {/* Trang Tin đã đăng */}
            <Route path="posted-jobs" element={<PostedJobs />} />
            {/* Trang quản lý hồ sơ ứng viên của NTD */}
            <Route path="applicants" element={<EmployerApplicants />} />
            {/* Trang thông tin công ty(NTD) */}
            <Route path="profile" element={<EmployerProfile />} />
            {/* Trang cài đặt tài khoản NTD */}
            <Route path="settings" element={<EmployerSettings />} />
          </Route>

          {/* Phân hệ Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} /> 
            <Route path="accounts" element={<AdminAccounts />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="industries" element={<AdminIndustries />} />
          </Route>

          {/* Trang danh sách công ty */}
          <Route path="/companies" element={<Companies />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  
  );
}

export default App;