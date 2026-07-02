import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Import CSS toàn cục (chứa các cấu hình Tailwind CSS)
import App from './App.jsx' // Import component gốc của toàn bộ ứng dụng

// Import các Provider để bọc toàn bộ ứng dụng
import { ThemeProvider } from './context/ThemeContext.jsx' // Provider dùng để quản lý giao diện Sáng/Tối (Dark/Light mode)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // Thư viện React Query dùng để quản lý việc gọi API (Caching, Fetching, Syncing dữ liệu)

// Khởi tạo một đối tượng QueryClient mới (Chứa các cấu hình bộ nhớ cache mặc định)
const queryClient = new QueryClient()

// Tìm thẻ div có id="root" trong file index.html và nhúng toàn bộ React App vào đó
createRoot(document.getElementById('root')).render(
  // StrictMode giúp phát hiện các lỗi tiềm ẩn trong quá trình phát triển (chỉ chạy ở môi trường Dev)
  <StrictMode>
    {/* Cung cấp khả năng gọi API siêu tốc và tự động cache dữ liệu cho toàn bộ ứng dụng */}
    <QueryClientProvider client={queryClient}>
      {/* Cung cấp khả năng đổi màu giao diện cho toàn bộ các trang */}
      <ThemeProvider>
        {/* Component chính chứa tất cả hệ thống định tuyến (Router) và giao diện con */}
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
