import React, { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

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
    document.body.style.overflow = "hidden";

    // Xử lý sự kiện nhấn phím Esc để đóng hộp thoại
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-1000 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()} // Click ra ngoài overlay sẽ đóng
    >
      <div className="bg-white rounded-2xl w-full max-w-[400px] shadow-2xl animate-[slideUp_0.2s_ease-out] overflow-hidden">
        {/* Phần nội dung cảnh báo */}
        <div className="px-6 pt-6 pb-3 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
            <AlertTriangle size={24} />
          </div>

          <h3 className="text-base font-semibold text-slate-900 mb-2">
            {title}
          </h3>
          <p className="text-[13px] text-slate-500 leading-relaxed whitespace-pre-line m-0">
            {message}
          </p>
        </div>

        {/* Nút hành động ở phía dưới */}
        <div className="px-6 pt-4 pb-6 flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-150 ease-in-out hover:bg-slate-200 hover:text-slate-900"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 bg-red-500 text-white border-none rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-150 ease-in-out hover:bg-red-600"
          >
            Xác nhận hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
