import React from 'react';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';

/**
 * MainLayout - Layout chung cho phân hệ Ứng viên / Public
 * Bao gồm: Topbar (cố định trên cùng) + Nội dung chính + Footer
 * Đảm bảo Footer luôn nằm dưới cùng ngay cả khi nội dung ngắn (sticky footer)
 */
function MainLayout({ children, backgroundColor = '#F8FAFC', showFooter = true }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor
    }}>
      {/* Thanh điều hướng trên cùng */}
      <Topbar />

      {/* Nội dung chính - flex: 1 để đẩy footer xuống dưới cùng */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
}

export default MainLayout;
