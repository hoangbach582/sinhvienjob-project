import React, { useState } from "react";
import Topbar from "../components/Topbar";
import Footer from "../components/FooterNew";
import FeedbackModal from "../components/FeedbackModal";
import { MessageSquarePlus } from "lucide-react";

/**
 * MainLayout - Layout chung cho phân hệ Ứng viên / Public
 * Bao gồm: Topbar (sticky trên cùng) + Nội dung chính + Footer
 * Đảm bảo Footer luôn nằm dưới cùng ngay cả khi nội dung ngắn (sticky footer)
 */
function MainLayout({
  children,
  showFooter = true,
  transparentTop = false,
  hideTopbar = false,
}) {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {!hideTopbar && <Topbar transparentTop={transparentTop} />}

      {/* Nội dung chính - flex: 1 để đẩy footer xuống dưới cùng */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* Footer */}
      {showFooter && <Footer />}

      {/* Nút Góp ý Nổi */}
      <button
        onClick={() => setIsFeedbackOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-105 transition-all z-40 cursor-pointer"
        title="Gửi phản hồi / báo lỗi"
      >
        <MessageSquarePlus size={24} />
      </button>

      {/* Modal Feedback */}
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
}

export default MainLayout;
