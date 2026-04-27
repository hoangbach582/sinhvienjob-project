import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login'; // Import trang login
import Register from './pages/Register'; // Import trang đăng ký
import Jobs from './pages/Jobs'; // Import trang danh sách việc làm
import JobDetail from './pages/JobDetail'; // Import trang chi tiết công việc
import StudentProfile from './pages/StudentProfile'; // Import trang hồ sơ sinh viên
import ApplyJob from './pages/ApplyJob'; // Import Form ứng tuyển 
import AppliedJobs from './pages/AppliedJobs'; // Import trang việc làm đã ứng tuyển của sinh viên

import EmployerRegister from './pages/EmployerRegister'; // Import trang đăng ký cho NTD
import EmployerLogin from './pages/EmployerLogin'; // Import trang đăng nhập cho NTD
import EmployerApplicants from './pages/EmployerApplicants'; // Import trang quản lý hồ sơ ứng viên của NTD
import EmployerProfile from './pages/EmployerProfile'; // Import trang thông tin công ty(NTD)
import Companies from './pages/Companies'; //Import trang danh sách công ty
// Import Layout và Page
import EmployerLayout from './layouts/EmployerLayout';
import EmployerDashboard from './pages/EmployerDashboard'; // Import trang dashboard nhà tuyển dụng
import PostJob from './pages/PostJob'; // Import trang Đăng tin
import PostedJobs from './pages/PostedJobs'; // Import trang Tin đã đăng
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard'; // Import trang Dashboard admin
import AdminAccounts from './pages/AdminAccounts'; // Import trang quản lý tài khoản admin
import AdminJobs from './pages/AdminJobs'; // Import trang quản lý tin tuyển dụng admin
import AdminIndustries from './pages/AdminIndustries'; // Import trang quản lý ngành nghề admin

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
          {/* Trang danh sách việc làm */}
          <Route path="/jobs" element={<Jobs />} />
          {/* Trang chi tiết công việc */}
          <Route path="/job/:id" element={<JobDetail />} />
          {/* Trang hồ sơ sinh viên */}
          <Route path="/profile" element={<StudentProfile />} />
          {/* Form ứng tuyển */}
          <Route path="/job/:id/apply" element={<ApplyJob />} />
          {/* Trang việc làm đã ứng tuyển */}
          <Route path="/my-jobs" element={<AppliedJobs />} />

          {/* Trang đăng ký cho NTD */}
          <Route path="/employer/register" element={<EmployerRegister />} />
          {/* Trang đăng nhập cho NTD */}
          <Route path="/employer/login" element={<EmployerLogin />} />
            

          {/* Phân hệ Nhà tuyển dụng */}
          {/* Định tuyến lồng nhau cho Nhà tuyển dụng */}
          <Route path="/employer" element={<EmployerLayout />}>
            {/* Trang Quản lý của nhà tuyển dụng :Khi URL là /employer/dashboard */}
            <Route path="dashboard" element={<EmployerDashboard />} /> 
            {/* Trang Đăng tin mới: Khi URL là /employer/post-job */}
            <Route path="post-job" element={<PostJob />} />
            {/* Trang Tin đã đăng */}
            <Route path="posted-jobs" element={<PostedJobs />} />
            {/* Trang quản lý hồ sơ ứng viên của NTD */}
            <Route path="applicants" element={<EmployerApplicants />} />
            {/* Trang thông tin công ty(NTD) */}
            <Route path="profile" element={<EmployerProfile />} />
          </Route>

          {/* Phân hệ Admin */}
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