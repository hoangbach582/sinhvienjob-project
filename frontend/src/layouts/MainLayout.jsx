import React from 'react';
import Topbar from '../components/Topbar';
import Footer from '../components/FooterNew';

/**
 * MainLayout - Layout chung cho phân hệ Ứng viên / Public
 * Bao gồm: Topbar (sticky trên cùng) + Nội dung chính + Footer
 * Đảm bảo Footer luôn nằm dưới cùng ngay cả khi nội dung ngắn (sticky footer)
 */
function MainLayout({ children, showFooter = true, transparentTop = false, hideTopbar = false }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      {!hideTopbar && <Topbar transparentTop={transparentTop} />}

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
