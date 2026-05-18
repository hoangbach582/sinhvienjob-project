import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * ConfirmDialog component - Hộp thoại xác nhận hành động có thiết kế premium
 * Props:
 *  - isOpen: Trạng thái đóng/mở hộp thoại (boolean)
 *  - title: Tiêu đề hộp thoại (string)
 *  - message: Nội dung mô tả/cảnh báo (string)
 *  - onConfirm: Callback khi người dùng click xác nhận (function)
 *  - onCancel: Callback khi người dùng click hủy bỏ (function)
 */
function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  useEffect(() => {
    if (!isOpen) return;

    // Ngăn chặn cuộn trang phía sau khi Dialog đang hiển thị
    document.body.style.overflow = 'hidden';

    // Xử lý sự kiện nhấn phím Esc để đóng hộp thoại
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.4)', // Nền tối bán trong suốt phù hợp tone màu slate
        backdropFilter: 'blur(4px)', // Hiệu ứng làm mờ nền kính mờ cao cấp
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel()} // Click ra ngoài overlay sẽ đóng
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)', // Đổ bóng nhẹ sâu
          animation: 'slideUp 0.2s ease-out', // Sử dụng animation có sẵn trong index.css
          overflow: 'hidden',
        }}
      >
        {/* Phần nội dung cảnh báo */}
        <div style={{ padding: '24px 24px 12px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#FEF3F2', // Đỏ nhạt
            color: '#EF4444', // Đỏ cảnh báo nổi bật
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}>
            <AlertTriangle size={24} />
          </div>
          
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', margin: '0 0 8px 0' }}>
            {title}
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.5', whiteSpace: 'pre-line' }}>
            {message}
          </p>
        </div>

        {/* Nút hành động ở phía dưới */}
        <div style={{
          padding: '16px 24px 24px 24px',
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
        }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '10px 16px',
              background: '#F1F5F9', // Nền xám nhạt
              color: '#475569',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E2E8F0'; // Hover xám đậm hơn rõ ràng
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#F1F5F9';
              e.currentTarget.style.color = '#475569';
            }}
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '10px 16px',
              background: '#EF4444', // Màu đỏ cảnh báo xác nhận xóa/hủy
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#DC2626'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#EF4444'}
          >
            Xác nhận hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
