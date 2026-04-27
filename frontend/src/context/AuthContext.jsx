import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Tạo Context (Trạm phát sóng)
const AuthContext = createContext();

// 2. Tạo Provider (Bộ cung cấp dữ liệu cho toàn app)
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(''); // Thêm State lưu Tên

  // Kiểm tra xem người dùng đã đăng nhập từ trước chưa khi web vừa load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    const name = localStorage.getItem('user_name'); // Lấy tên từ bộ nhớ
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
      setUserName(name || '');
    }
  }, []);

  // Hàm gọi khi đăng nhập thành công
  const login = (token, role, name) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_role', role);
    localStorage.setItem('user_name', name); // Lưu tên vào bộ nhớ
    setIsLoggedIn(true);
    setUserRole(role);
    setUserName(name);
  };

  // Hàm gọi khi bấm Đăng xuất
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name'); // Xóa tên khi đăng xuất
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName('');
  };

  return (
    // Phát thêm userName đi toàn app
    <AuthContext.Provider value={{ isLoggedIn, userRole, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Tạo Hook tùy chỉnh để các Component khác dễ dàng sử dụng
export const useAuth = () => {
  return useContext(AuthContext);
};