import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userAvatar, setUserAvatar] = useState('');

  // 1. KHÔI PHỤC TRẠNG THÁI (Đọc được cả chuẩn cũ lẫn chuẩn mới)
  useEffect(() => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    
    // Thử lấy object user (Cách mới)
    let userData = null;
    try {
        userData = JSON.parse(localStorage.getItem('user'));
    } catch (e) {}

    // Lấy thông tin (Ưu tiên các biến rời rạc của cách cũ, nếu không có thì lấy từ object)
    const role = localStorage.getItem('role') || (userData ? userData.role : '');
    const name = localStorage.getItem('name') || (userData ? (userData.name || userData.full_name) : '');
    const avatar = localStorage.getItem('avatar') || (userData ? userData.avatar : '');

    if (token && (role || name)) {
      setIsLoggedIn(true);
      setUser(userData || null);
      setUserName(name || '');
      setUserRole(role || '');
      setUserAvatar(avatar || '');
    }
  }, []);

  // 2. HÀM LOGIN THÔNG MINH (Tự động thích nghi với Login.jsx của bạn)
  const login = (token, param2, param3, param4) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('token', token); // Lưu cả 2 phòng hờ
    
    let role = '', name = '', avatar = '';
    let userObj = {};

    // Nếu truyền vào một Object (token, user)
    if (typeof param2 === 'object' && param2 !== null) {
        userObj = param2;
        role = userObj.role || '';
        name = userObj.name || userObj.full_name || '';
        avatar = userObj.avatar || '';
    } 
    // Nếu truyền vào các biến rời rạc (token, role, name, avatar)
    else {
        role = param2 || '';
        name = param3 || '';
        avatar = param4 || '';
        userObj = { role, name, avatar };
    }

    // LƯU ĐỒNG THỜI CẢ 2 KIỂU VÀO TRÌNH DUYỆT
    localStorage.setItem('user', JSON.stringify(userObj));
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
    if (avatar) localStorage.setItem('avatar', avatar);

    setIsLoggedIn(true);
    setUser(userObj);
    setUserRole(role);
    setUserName(name);
    setUserAvatar(avatar);
  };

  // 3. ĐĂNG XUẤT (Dọn sạch sẽ mọi loại key)
  const logout = () => {
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
  };

  // 4. CẬP NHẬT TOPBAR (VÀ LOCALSTORAGE) TỨC THÌ TỪ TRANG PROFILE
  const updateUser = (updatedInfo) => {
    // Cập nhật key rời rạc
    if (updatedInfo.name || updatedInfo.full_name) {
        const newName = updatedInfo.name || updatedInfo.full_name;
        localStorage.setItem('name', newName);
        setUserName(newName);
    }
    if (updatedInfo.avatar !== undefined) {
        localStorage.setItem('avatar', updatedInfo.avatar);
        setUserAvatar(updatedInfo.avatar);
    }

    // Cập nhật key object
    let currentUser = {};
    try {
        currentUser = JSON.parse(localStorage.getItem('user')) || {};
    } catch (e) {}
    
    const newUser = { ...currentUser, ...updatedInfo };
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, userName, userRole, userAvatar, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);