import React, { createContext, useState, useContext, useEffect } from 'react';

// Tạo Context để quản lý trạng thái Đăng nhập (Auth) trên toàn bộ ứng dụng React
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Các state lưu trữ thông tin người dùng đang đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Lưu toàn bộ object user
  const [userName, setUserName] = useState(''); // Tên hiển thị trên Topbar
  const [userRole, setUserRole] = useState(''); // Quyền (student/employer/admin)
  const [userAvatar, setUserAvatar] = useState(''); // Ảnh đại diện
  const [token, setToken] = useState(null); // Token dùng để gọi API Backend

  /**
   * 1. KHÔI PHỤC TRẠNG THÁI KHI REFRESH TRANG (useEffect chạy 1 lần khi app load)
   * Mục đích: Lấy lại thông tin đăng nhập từ Local Storage để người dùng không bị văng ra khi f5 (refresh) trình duyệt.
   */
  useEffect(() => {
    // Đọc token từ Local Storage
    const rawToken = localStorage.getItem('access_token') || localStorage.getItem('token');
    const localToken = (rawToken && rawToken !== 'null' && rawToken !== 'undefined') ? rawToken : null;
    
    // Đọc Object User từ Local Storage (Chuẩn mới)
    let userData = null;
    try {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== 'null' && userStr !== 'undefined') {
            userData = JSON.parse(userStr);
        }
    } catch (e) {}

    // Đọc các biến rời rạc từ Local Storage (Chuẩn cũ dự phòng)
    const rawRole = localStorage.getItem('role');
    const role = (rawRole && rawRole !== 'null' && rawRole !== 'undefined') ? rawRole : (userData ? userData.role : '');
    
    const rawName = localStorage.getItem('name');
    const name = (rawName && rawName !== 'null' && rawName !== 'undefined') ? rawName : (userData ? (userData.name || userData.full_name) : '');
    
    const rawAvatar = localStorage.getItem('avatar');
    const avatar = (rawAvatar && rawAvatar !== 'null' && rawAvatar !== 'undefined') ? rawAvatar : (userData ? userData.avatar : '');

    // Kiểm tra tính hợp lệ: Phải có CẢ Token VÀ Role thì mới coi là đã đăng nhập
    if (localToken && role) {
      setIsLoggedIn(true);
      setUser(userData || null);
      setUserName(name || '');
      setUserRole(role || '');
      setUserAvatar(avatar || '');
      setToken(localToken);
    } else {
      // Nếu dữ liệu bị lỗi hoặc thiếu (Corrupted data), dọn dẹp sạch sẽ để tránh lỗi UI
      localStorage.removeItem('access_token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      localStorage.removeItem('avatar');

      setIsLoggedIn(false);
      setUser(null);
      setUserName('');
      setUserRole('');
      setUserAvatar('');
      setToken(null);
    }
  }, []);

  /**
   * 2. HÀM ĐĂNG NHẬP (Lưu dữ liệu vào Context & Local Storage)
   * Mục đích: Được gọi từ trang Login.jsx sau khi nhận phản hồi thành công từ Backend.
   * Hỗ trợ 2 kiểu tham số để tương thích với các đoạn code cũ và mới.
   */
  const login = (token, param2, param3, param4) => {
    // Lưu Token vào Local Storage
    localStorage.setItem('access_token', token);
    localStorage.setItem('token', token); // Lưu trùng 2 tên phòng trường hợp file cũ gọi tên khác
    
    let role = '', name = '', avatar = '';
    let userObj = {};

    // Xử lý tham số: Nếu param2 là một Object (Kiểu mới)
    if (typeof param2 === 'object' && param2 !== null) {
        userObj = param2;
        role = userObj.role || '';
        name = userObj.name || userObj.full_name || '';
        avatar = userObj.avatar || '';
    } 
    // Xử lý tham số: Nếu param2, param3 là các chuỗi rời rạc (Kiểu cũ)
    else {
        role = param2 || '';
        name = param3 || '';
        avatar = param4 || '';
        userObj = { role, name, avatar };
    }

    // Lưu dữ liệu vào Local Storage để giữ trạng thái sau khi refresh
    localStorage.setItem('user', JSON.stringify(userObj));
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
    if (avatar) localStorage.setItem('avatar', avatar);

    // Cập nhật State trong Context để UI render lại (ví dụ đổi nút Đăng nhập thành Avatar)
    setIsLoggedIn(true);
    setUser(userObj);
    setUserRole(role);
    setUserName(name);
    setUserAvatar(avatar);
    setToken(token);
  };

  /**
   * 3. HÀM ĐĂNG XUẤT (Xóa dữ liệu)
   * Mục đích: Xóa mọi thông tin liên quan đến user trong hệ thống và đưa về trạng thái Guest.
   */
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('avatar');
    
    // Cập nhật lại State về rỗng
    setIsLoggedIn(false);
    setUser(null);
    setUserName('');
    setUserRole('');
    setUserAvatar('');
    setToken(null);
  };

  /**
   * 4. HÀM CẬP NHẬT THÔNG TIN NGƯỜI DÙNG (Real-time update)
   * Mục đích: Khi người dùng đổi Tên hoặc Avatar ở trang Profile, 
   * Topbar phải lập tức thay đổi mà không cần tải lại trang.
   */
  const updateUser = (updatedInfo) => {
    // Cập nhật các biến rời rạc
    if (updatedInfo.name || updatedInfo.full_name) {
        const newName = updatedInfo.name || updatedInfo.full_name;
        localStorage.setItem('name', newName); // Lưu xuống trình duyệt
        setUserName(newName); // Render lại UI ngay lập tức
    }
    if (updatedInfo.avatar !== undefined) {
        localStorage.setItem('avatar', updatedInfo.avatar);
        setUserAvatar(updatedInfo.avatar);
    }

    // Cập nhật Object JSON
    let currentUser = {};
    try {
        currentUser = JSON.parse(localStorage.getItem('user')) || {};
    } catch (e) {}
    
    // Gộp dữ liệu cũ và mới
    const newUser = { ...currentUser, ...updatedInfo };
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // Trả về Provider bọc các component con, cung cấp cho chúng các State và Function
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, userName, userRole, userAvatar, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook: Giúp các component khác gọi context này ngắn gọn hơn bằng cách dùng `useAuth()`
export const useAuth = () => useContext(AuthContext);