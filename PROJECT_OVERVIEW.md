# 📚 SinhVienJob - Tổng Quan Dự Án (Project Overview)

Tài liệu này cung cấp một cái nhìn toàn cảnh về dự án **SinhVienJob** (Nền tảng việc làm dành cho sinh viên), bao gồm kiến trúc hệ thống, công nghệ sử dụng, và các tính năng chính.

---

## 🏗 Cấu Trúc Thư Mục Chính

Dự án được chia làm 2 phần chính hoạt động độc lập (Tách biệt Frontend và Backend):

- **`/backend`**: Mã nguồn phía Server (API, Database, Logic xử lý). Xây dựng bằng PHP (Laravel).
- **`/frontend`**: Mã nguồn giao diện người dùng (UI/UX). Xây dựng bằng ReactJS (Vite).

---

## ⚙️ Backend (Server-side)
Được phát triển bằng **Laravel Framework**, đóng vai trò cung cấp RESTful APIs cho Frontend xử lý.

### 🛠 Công nghệ & Thư viện chính
- **Framework**: Laravel 10.10 (Yêu cầu PHP ^8.1)
- **Authentication**: `laravel/sanctum` (Xác thực API bằng Token).
- **OAuth Login**: `laravel/socialite` (Hỗ trợ đăng nhập qua Google/Facebook/...).
- **Real-time (Websockets)**: `pusher/pusher-php-server` (Thông báo realtime).
- **Xử lý tài liệu**:
  - `barryvdh/laravel-dompdf`: Xuất file PDF (CV, Report...).
  - `maatwebsite/excel`: Nhập/Xuất dữ liệu bằng Excel.
- **Lưu trữ**: `league/flysystem-aws-s3-v3` (S3 Storage cho hình ảnh, CV).
- **Tracking**: `spatie/laravel-activitylog` (Ghi log các hoạt động trong hệ thống).

### 🌟 Chức năng chính
- Quản lý Sinh viên, Nhà tuyển dụng, Quản trị viên (Admin).
- Đăng tuyển việc làm (Full-time, Part-time, Internship).
- Quản lý hồ sơ (CV), ứng tuyển công việc.
- Hệ thống thông báo thời gian thực (Real-time notifications).
- Dashboard thống kê (cho Admin & Nhà tuyển dụng).

---

## 🎨 Frontend (Client-side)
Được xây dựng bằng **ReactJS 19** với **Vite**, chú trọng vào một giao diện hiện đại, mượt mà và nhiều hiệu ứng 3D.

### 🛠 Công nghệ & Thư viện chính
- **Core Framework**: React ^19.2 (Bootstrapped bằng Vite ^8.0).
- **Styling**: Tailwind CSS ^4.3 (Utility-first CSS, hỗ trợ responsive cực tốt).
- **Routing**: `react-router-dom` ^7.14 (Quản lý các trang).
- **Data Fetching & State**: `@tanstack/react-query` ^5 (Quản lý API caching), `axios`.
- **Form Management**: `react-hook-form` (Xử lý form mượt, không re-render).
- **Real-time**: `laravel-echo` & `pusher-js` (Nhận thông báo websocket từ Backend).
- **Biểu đồ (Charts)**: `recharts` (Dùng cho trang Dashboard thống kê).
- **Icons**: `lucide-react`.

### ✨ Thiết kế & Animations (UI/UX Nâng Cao)
Dự án được Redesign với giao diện cực kỳ hiện đại, sử dụng nhiều thư viện đồ họa:
- **3D Graphics**: `three`, `@react-three/fiber`, `@react-three/drei` (Hiệu ứng không gian 3D, particle bay lơ lửng ở Trang chủ).
- **Animations mượt mà**: Sử dụng kết hợp `framer-motion` và `gsap`.
- **Thiết kế**: Màu pastel nhẹ nhàng, thẻ (cards) 3D tilt theo chuột, hiệu ứng glow, hiệu ứng ánh sáng, shimmer sweep.

---

## 🚀 Hướng Dẫn Chạy Dự Án (Local Development)

Để chạy dự án trên máy cá nhân, bạn cần mở 2 terminal để chạy song song Backend và Frontend.

### 1️⃣ Khởi chạy Backend
Mở Terminal, di chuyển vào thư mục backend:
```bash
cd backend

# Cài đặt thư viện PHP
composer install

# Copy file cấu hình môi trường và tạo Key
cp .env.example .env
php artisan key:generate

# Khởi chạy server Laravel (Mặc định chạy ở cổng 8000)
php artisan serve
```
*(Lưu ý: Đảm bảo bạn đã cấu hình Database trong file `.env` và chạy lệnh `php artisan migrate` để tạo các bảng trong cơ sở dữ liệu).*

### 2️⃣ Khởi chạy Frontend
Mở Terminal khác, di chuyển vào thư mục frontend:
```bash
cd frontend

# Cài đặt các thư viện Node.js
npm install

# Khởi chạy Vite server
npm run dev
```
*(Sau lệnh này, truy cập vào đường dẫn http://localhost:5173 trên trình duyệt để xem giao diện).*

---
📌 **Tài liệu tham khảo thêm**: Bạn có thể xem các file `.md` trong thư mục `frontend` (như `FINAL_REPORT.md`, `TOM_TAT_REDESIGN.md`) để xem chi tiết về kiến trúc các hiệu ứng 3D và Animation của trang chủ.

---

## 🧠 Kiến Thức Cơ Bản Cần Biết Để Chỉnh Sửa Code (Dành Cho Người Mới Bắt Đầu)

Đừng hoảng sợ nếu đây là lần đầu tiên bạn tiếp xúc với một dự án kết hợp cả React và Laravel. Dự án SinhVienJob được tổ chức rất logic và theo chuẩn công nghiệp thực tế. Để có thể tự tin đọc hiểu, sửa lỗi (fix bug) và viết thêm tính năng mới, bạn hãy đọc chậm rãi và nắm vững các khái niệm nền tảng dưới đây.

### 1. Phía Backend (Laravel / PHP) - "Trái tim" của hệ thống
Backend không có giao diện đồ họa. Nhiệm vụ duy nhất của nó là nhận yêu cầu (Request) từ Frontend, thao tác với Cơ sở dữ liệu (Database), tính toán logic và trả về kết quả dưới dạng dữ liệu thô (thường là định dạng JSON).

- **Định tuyến (Routing - `routes/api.php`):** 
  - Đây là "tấm bản đồ" của Backend. Khi Frontend muốn lấy "Danh sách công việc", nó sẽ gọi đến một đường dẫn (URL) cụ thể. File `api.php` chính là nơi quy định đường dẫn đó sẽ được xử lý bởi đoạn code nào. 
  - *Mẹo tìm code:* Nếu bạn thấy Frontend gọi API đến `/api/jobs`, hãy mở file `routes/api.php` lên và tìm chữ `jobs`, bạn sẽ biết ngay Controller nào đang chịu trách nhiệm xử lý nó.

- **Controllers (`app/Http/Controllers/`):** 
  - Đây là bộ não xử lý logic. Khi một Route được gọi, nó sẽ trỏ tới một hàm cụ thể trong Controller. 
  - Ví dụ: Hàm `JobController@index` sẽ chứa code móc nối Database để lấy danh sách công việc. Hàm `JobController@store` sẽ kiểm tra dữ liệu và tạo công việc mới. Nếu bạn muốn sửa logic tính toán, hay thêm bớt các trường dữ liệu trả về cho Frontend, hãy vào đây tìm đúng hàm để sửa.

- **Models & Eloquent ORM (`app/Models/`):**
  - Thay vì phải viết những câu lệnh SQL dài dòng, dễ sai sót (`SELECT * FROM jobs WHERE...`), Laravel cung cấp công cụ có tên là Eloquent ORM. 
  - Mỗi một Model đại diện cho một bảng trong Database. Ví dụ Model `Job.php` đại diện cho bảng `jobs`. 
  - Trong file Model, bạn sẽ thấy các hàm "quan hệ" (Relationships) như `belongsTo(Company::class)`. Điều này có nghĩa là "Mỗi công việc thuộc về một công ty". Khái niệm này giúp bạn móc nối dữ liệu giữa các bảng với nhau cực kỳ dễ dàng bằng code hướng đối tượng.

- **Migrations & Seeders (`database/`):**
  - **Migrations:** Là các file lưu trữ "cấu trúc" của Database. Thay vì dùng phần mềm như phpMyAdmin để tạo bảng, tạo cột bằng tay, bạn viết code tạo bảng trong file Migrations. Nếu source code bạn tải về máy chưa có Database, bạn chỉ cần chạy lệnh `php artisan migrate` là toàn bộ các bảng sẽ tự động được tạo ra y hệt máy gốc.
  - **Seeders:** Là nơi chứa code để tạo "dữ liệu giả" (dummy data). Chạy lệnh `php artisan db:seed` sẽ tự động nhét hàng ngàn user, công ty, công việc mẫu vào Database để bạn tha hồ test giao diện mà không phải gõ tay từng bài.

- **Bảo mật (Sanctum & Middleware):**
  - Không phải ai cũng được phép gọi API (Ví dụ: khách vãng lai không được phép xóa công việc). Laravel dùng hệ thống Middleware (như một trạm kiểm soát vé). Khi Frontend gọi API, nó phải đưa ra một cái vé (Token - sinh ra lúc đăng nhập). Nếu vé hợp lệ, Middleware `auth:sanctum` mới mở cửa cho yêu cầu đi vào Controller.

### 2. Phía Frontend (React 19 / Vite) - "Gương mặt" của hệ thống
Frontend của dự án là một Single Page Application (SPA). Nghĩa là khi bạn click chuyển trang, trình duyệt không hề tải lại (F5) toàn bộ trang web mới như web kiểu cũ. Thay vào đó, React chỉ đang "vẽ lại" (re-render) một phần nhỏ giao diện. Điều này tạo ra cảm giác mượt mà như dùng App điện thoại.

- **Component (Thành phần giao diện):** 
  - Code HTML không được viết liền tù tì 1000 dòng từ trên xuống dưới. Nó được chia nhỏ thành các mảnh lego gọi là Components (ví dụ: thẻ công việc `JobCard.jsx`, thanh điều hướng `Navbar.jsx`). 
  - Việc của bạn là ghép các mảnh lego này lại với nhau thành một cái trang (Page) hoàn chỉnh. Nếu sếp yêu cầu sửa giao diện cái nút bấm trong thẻ công việc, bạn chỉ cần tìm đúng file `JobCard.jsx` để sửa, không sợ ảnh hưởng đến chỗ khác.

- **React Hooks (Các hàm ma thuật):** Bạn sẽ thấy chúng xuất hiện ở mọi file React. Dưới đây là 3 hàm quan trọng nhất phải hiểu:
  - `useState`: Dùng để bộ nhớ lưu trữ dữ liệu có thể thay đổi trên màn hình. Ví dụ: Bạn cần một biến để đếm số lần click chuột. Nếu dùng biến bình thường `let count = 0`, khi đếm lên 1, giao diện màn hình sẽ KHÔNG tự cập nhật con số mới. Bạn phải dùng `useState` thì React mới biết để vẽ lại UI.
  - `useEffect`: Dùng để thiết lập một hành động tự động. Đa số được dùng cho mục đích: "Ngay khi trang web vừa mở lên xong, hãy tự động chạy code gọi API lên Backend lấy dữ liệu về đây".
  - `useRef`: Dùng để can thiệp trực tiếp vào một thẻ HTML cụ thể (như tự động trỏ chuột vào ô `<input>`) hoặc dùng để lưu các giá trị ngầm mà khi thay đổi không làm cho màn hình bị giật/load lại.

- **Data Fetching với React Query (`@tanstack/react-query`):**
  - Thường người mới học hay dùng `fetch` hoặc `axios` cộng với `useEffect` để lấy dữ liệu. Nhưng dự án này dùng một thư viện xịn cấp doanh nghiệp là React Query.
  - Hàng xịn ở chỗ nó có cơ chế "Cache" (lưu nháp). Nếu bạn vừa vào "Trang Chủ" (load 100 công việc), xong bấm qua "Trang Cá nhân", rồi lại bấm quay lại "Trang Chủ", danh sách 100 công việc sẽ hiện ra NGAY LẬP TỨC (do lấy từ cache trong RAM) mà không cần đợi API load lại vòng nữa.
  - Dùng `useQuery` để lấy dữ liệu (GET), và dùng `useMutation` để Gửi/Sửa dữ liệu (POST/PUT). `useMutation` tự động trả về cho bạn biến `isLoading` (để hiện icon xoay xoay) và biến `isError` rất tiện lợi.

- **Styling với Tailwind CSS:** 
  - Khác với cách làm truyền thống là phải tạo file `.css` lằng nhằng, Tailwind cho phép bạn gõ thẳng cách hiển thị vào class của HTML.
  - Thay vì viết CSS `display: flex; justify-content: center; color: red;`, bạn chỉ cần gõ vào HTML: `<div className="flex justify-center text-red-500">`. Code rất ngắn, sạch, và bạn có thể xây dựng giao diện phức tạp nhanh gấp 5 lần bình thường.

- **Quản lý Form (React Hook Form):** 
  - Form Đăng ký, Form Đăng tin... thường có rất nhiều ô nhập liệu. Nếu dùng `useState` thuần, mỗi khi bạn gõ 1 ký tự "a", toàn bộ Form khổng lồ sẽ bị React tính toán vẽ lại 1 lần, gây giật lag nghiêm trọng.
  - `React Hook Form` sử dụng kỹ thuật thông minh. Form chỉ vẽ lại khi bạn thực sự bấm nút Submit hoặc khi cần chửi (hiện thông báo lỗi "Email không hợp lệ"). Điều này giúp Form mượt mà kể cả khi có 100 trường dữ liệu đi kèm trình soạn thảo văn bản.

- **Xử lý Chuyển động (Animations & 3D):**
  - **Framer Motion:** Thư viện giúp tạo hiệu ứng cực nhàn. Thay vì viết CSS Keyframe đau đầu, bạn chỉ cần bọc thẻ HTML bằng thẻ `<motion.div>`, cho nó trạng thái `initial={{ opacity: 0 }}` (lúc bắt đầu: mờ tịt) và `animate={{ opacity: 1 }}` (lúc kết thúc: hiện rõ), framer-motion sẽ tự động tính toán quá trình chuyển cảnh từ mờ sang rõ cho bạn mượt mà.
  - **Three.js & React Three Fiber:** Dùng để vẽ đồ hoạ không gian 3D (ví dụ: các hạt bụi lấp lánh bay lơ lửng ở trang chủ). Nó dựa trên khái niệm Không gian (Scene), Máy ảnh (Camera) và Ánh sáng (Lights) giống như làm game. Nếu bạn mới học, hãy coi khối code 3D này là "Hộp đen", chỉ nên tò mò sửa các thông số dễ hiểu như: đổi mã màu (`color`), tăng giảm số lượng hạt (`count`) hoặc tốc độ xoay.

### 3. Ví Dụ Cụ Thể: Luồng Dữ Liệu Từ A Đến Z (Toàn hệ thống)
Để dễ hình dung nhất, giả sử người dùng bấm nút **"Lưu Công Việc"**, chuyện gì sẽ xảy ra từ đầu chí cuối giữa hai bờ Frontend - Backend?
1. **[Frontend]** Sinh viên click chuột vào nút "Lưu". Hàm `onClick` chạy, nó gọi một hàm `useMutation` (React Query) và truyền mã số (ID) của công việc cần lưu vào.
2. **[Frontend]** Thư viện `Axios` tự động moi cái Token (được cất trong Cookie lúc đăng nhập) nhét vào phần Header của Request và phóng một lệnh `POST` bay thẳng đến địa chỉ `http://localhost:8000/api/save-job`.
3. **[Backend]** Laravel nhận được request. Trạm gác `Middleware` kiểm tra xem Token trong Header có hợp lệ và chưa hết hạn không. Thấy an toàn, nó mới mở cổng cho request đi tiếp.
4. **[Backend]** Tấm bản đồ `routes/api.php` soi thấy đường dẫn `/save-job`, nó liền quăng cái request này qua cho hàm xử lý tên là `JobController@save`.
5. **[Backend]** Bên trong hàm Controller đó, đoạn code sử dụng Eloquent Model để INSERT (thêm) một dòng dữ liệu mới vào bảng `saved_jobs` trong Database MySQL.
6. **[Backend]** Sau khi Database báo thêm thành công, Controller lập tức trả về Frontend một đoạn tin nhắn chuẩn JSON: `{ "status": "success", "message": "Đã lưu công việc thành công!" }`.
7. **[Frontend]** React Query bắt được cục JSON đó. Code React lập tức làm mới giao diện, đổi màu cái nút Lưu từ trắng sang xanh, và đồng thời bắn một thông báo nhỏ mượt mà (Toast) từ góc màn hình lên báo "Lưu thành công".

💡 **Bí kíp:** Khi nắm được chuỗi 7 bước này, bạn sẽ làm chủ hoàn toàn dự án. Nếu có bug xảy ra (ví dụ: bấm nút Lưu mà chả thấy hiện gì), bạn chỉ cần mở tab Network (F12) lên xem. Nếu API gọi báo lỗi đỏ lòm 500, thì lỗi đang ở **Bước 5** (Backend code sai). Nếu API báo 200 xanh lè nhưng giao diện không đổi màu nút, thì lỗi đang ở **Bước 7** (Frontend quên cập nhật State). Do đó, bạn sẽ luôn biết chính xác phải mở file nào ra để tìm lỗi!

---

## 🎓 Phụ lục: Bộ câu hỏi bảo vệ đồ án tốt nghiệp (Dự kiến)

Dưới đây là danh sách các câu hỏi giả định từ Hội đồng bảo vệ đồ án, được chia thành hai phần Lý thuyết và Thực hành. Các câu hỏi được thiết kế sát với công nghệ thực tế đang sử dụng trong dự án SinhVienJob.

**Thành viên Hội đồng bảo vệ (Theo hình ảnh):**
- **Chủ tịch Hội đồng:** ThS. Bùi Thị Hòa
- **Thư ký:** ThS. Lê Thị Kiều Ngân
- **Ủy viên:** KS. Mai Tiến Đạt, KS. Phạm Hồng Cảnh

### 📚 Phần 1: Lý Thuyết (Theory)

**ThS. Bùi Thị Hòa (Chủ tịch) hỏi:**
1. Kiến trúc hệ thống của ứng dụng được chia thành Frontend và Backend độc lập. Ưu điểm và nhược điểm của kiến trúc này so với kiến trúc Monolithic (nguyên khối) là gì?
   > **Đáp án gợi ý:** 
   > - **Ưu điểm:** Dễ dàng mở rộng (Scale độc lập), Frontend và Backend có thể phát triển song song bởi các team khác nhau, dễ dàng nâng cấp công nghệ ở một phía mà không ảnh hưởng phía kia. App mobile sau này cũng có thể dùng chung Backend API này.
   > - **Nhược điểm:** Tốn thêm thời gian thiết lập ban đầu (CORS, cấu hình 2 server), quá trình Deploy phức tạp hơn vì phải quản lý 2 luồng CI/CD độc lập, đôi khi gặp khó khăn trong SEO nếu Frontend không dùng SSR (như Next.js).

2. Em sử dụng Token (Laravel Sanctum) để xác thực người dùng. Hãy giải thích cơ chế hoạt động của Token-based Authentication và cách em bảo mật Token trên phía Frontend (tránh XSS, CSRF)?
   > **Đáp án gợi ý:** 
   > - **Cơ chế:** Khi User login thành công, Backend tạo 1 chuỗi Token (PAT) và gửi về Frontend. Frontend lưu lại và gắn Token này vào header `Authorization: Bearer <token>` cho mỗi request API tiếp theo để chứng minh thân phận.
   > - **Bảo mật:** Thay vì lưu vào `localStorage` (dễ bị tấn công XSS do script độc hại đọc được), cách bảo mật tốt nhất là backend set token vào `HttpOnly Cookie`. Cách này chặn JavaScript client đọc token, kết hợp với cấu hình CORS chặt chẽ ở Backend để phòng chống CSRF. (Nếu dùng LocalStorage thì phải escape data cẩn thận mỗi khi render để chống XSS).

**ThS. Lê Thị Kiều Ngân (Thư ký) hỏi:**
3. Dự án có sử dụng WebSockets (Pusher) cho tính năng Real-time. Em hãy trình bày sự khác biệt giữa WebSockets và HTTP Polling thông thường? Khi nào nên dùng cái nào?
   > **Đáp án gợi ý:** 
   > - **HTTP Polling:** Client cứ cách N giây lại gọi API (Request) lên Server một lần để hỏi xem có dữ liệu mới không. Nhược điểm: tốn tài nguyên server, độ trễ cao, sinh ra quá nhiều request thừa thãi.
   > - **WebSockets:** Mở 1 kết nối TCP duy nhất, giữ kết nối (persistent) 2 chiều. Bất cứ khi nào server có dữ liệu mới, nó sẽ tự động "đẩy" (push) về client. Ưu điểm: cực kỳ nhanh, realtime, tốn ít tài nguyên hơn khi chạy lâu dài. Nên dùng WebSockets cho chat, realtime notifications.

4. Tại sao em lại chọn React 19 và Vite cho dự án này thay vì các công nghệ khác? Vite mang lại lợi ích gì cho quá trình phát triển (Development) và đóng gói (Build) so với Webpack?
   > **Đáp án gợi ý:** 
   > - **React 19:** Phiên bản mới với các tính năng xịn như Actions, compiler cải tiến, xử lý bất đồng bộ mượt mà hơn.
   > - **Vite vs Webpack:** Vite tận dụng ES Modules gốc của trình duyệt, không bundle toàn bộ source code khi chạy dev server, nên thời gian khởi động (Cold Start) gần như lập tức. Tính năng HMR (Cập nhật module nóng) của Vite cũng cực kỳ nhanh bất kể project lớn đến đâu, giúp tiết kiệm thời gian code UI.

**KS. Mai Tiến Đạt (Ủy viên) hỏi:**
5. Cơ sở dữ liệu của hệ thống được thiết kế như thế nào để đảm bảo tính toàn vẹn dữ liệu giữa Sinh viên, Nhà tuyển dụng, Hồ sơ ứng tuyển (CV) và Công việc (Jobs)?
   > **Đáp án gợi ý:** 
   > - Hệ thống sử dụng Khóa ngoại (Foreign Keys) với các ràng buộc chuẩn xác. Ví dụ: Bảng `jobs` có `company_id` tham chiếu tới bảng `companies`. Bảng `applications` (hồ sơ ứng tuyển) là bảng trung gian, lưu trữ `student_id` và `job_id`. Khi một công ty bị xóa, các `jobs` hoặc `applications` tương ứng sẽ được xử lý tự động qua cơ chế `ON DELETE CASCADE` hoặc được đánh dấu `soft delete` để không làm vỡ báo cáo dữ liệu cũ.

6. Trong hệ thống có chức năng đăng nhập qua Google (OAuth 2.0). Hãy trình bày luồng hoạt động chuẩn của OAuth 2.0 khi người dùng click vào nút "Đăng nhập bằng Google" cho đến khi đăng nhập thành công.
   > **Đáp án gợi ý:** 
   > 1. User click "Login with Google", Frontend redirect user đến URL xác thực của Google (có kèm `client_id` của web).
   > 2. User đồng ý cấp quyền trên giao diện của Google.
   > 3. Google redirect ngược lại Callback URL của Backend (Laravel Socialite) kèm theo một mã `Authorization Code`.
   > 4. Backend dùng Code này gọi ngược lên Google để đổi lấy `Access Token`. Dùng Token đó để lấy thông tin Email, Name của User.
   > 5. Backend kiểm tra Email này trong DB, nếu chưa có thì tạo user mới, nếu có rồi thì gen ra Token (Sanctum) của hệ thống rồi trả về cho Frontend để đăng nhập.

### 💻 Phần 2: Thực Hành (Practice)

**KS. Phạm Hồng Cảnh (Ủy viên) yêu cầu:**
1. **Performance & 3D:** Em có sử dụng Three.js để render không gian 3D trên trang chủ. Điều này có ảnh hưởng đến hiệu năng của ứng dụng không? Em đã tối ưu hóa component 3D này như thế nào để không gây lag trên máy tính cấu hình yếu? Hãy show code xử lý phần này.
   > **Đáp án & Kịch bản thực hành:** 
   > *"Dạ có ảnh hưởng, render 3D tiêu thụ khá nhiều GPU. Để tối ưu, em giới hạn số lượng objects (chỉ vẽ khoảng 25 hạt particles), bỏ qua đổ bóng phức tạp (shadows), và đặc biệt em ẩn toàn bộ component 3D đi khi người dùng xem trên điện thoại bằng cách render fallback UI. Em cũng sử dụng `requestAnimationFrame` để chỉ render khi trình duyệt không bận rộn."* (Lúc này bạn hãy mở file `Hero3DScene.jsx` hoặc `StatsSection.jsx` ra để trỏ vào đoạn code liên quan).

2. **State Management:** Em sử dụng React Query để quản lý state API. Hãy giải thích cách React Query cache lại dữ liệu danh sách công việc và cách em invalid cache (làm mới dữ liệu) khi có một công việc mới được nhà tuyển dụng tạo ra.
   > **Đáp án & Kịch bản thực hành:** 
   > *"React Query lưu API response vào bộ nhớ theo khóa, ví dụ `['jobs', 'list']`. Khi chuyển sang trang khác và quay lại, nó load từ cache ra ngay lập tức, UI hiện lên luôn không cần đợi xoay loading. Khi em gọi hàm tạo job mới, ở callback `onSuccess` của mutation, em gọi lệnh `queryClient.invalidateQueries({ queryKey: ['jobs', 'list'] })`. Lệnh này đánh dấu data cũ là stale (hết hạn) và React Query sẽ chạy ngầm gọi API lần nữa để update UI với job vừa mới tạo."*

**ThS. Bùi Thị Hòa (Chủ tịch) yêu cầu:**
3. **Bảo mật API (Security):** Nếu một người dùng cố tình thay đổi `job_id` trên URL hoặc gọi API để sửa/xóa một công việc không thuộc về công ty của họ, Backend (Laravel) của em xử lý phân quyền (Authorization) và báo lỗi như thế nào?
   > **Đáp án & Kịch bản thực hành:** 
   > *"Ở Backend Laravel, em áp dụng cơ chế Policies / FormRequest. Trước khi thực thi lệnh Update/Delete, hệ thống sẽ lấy Job đó lên, so sánh `job->company_id` với `Auth::user()->company_id` (ID của người đang gọi API). Nếu không khớp, Backend lập tức throw ra Exception và trả về HTTP Status Code `403 Forbidden` (Cấm truy cập). Frontend bắt được mã 403 sẽ văng ra thông báo lỗi đỏ 'Bạn không có quyền thực hiện hành động này' bằng thư viện react-hot-toast."*

4. **Real-time Demo:** Hãy thao tác demo tính năng gửi thông báo. Khi nhà tuyển dụng duyệt CV của sinh viên, thao tác đó được trigger ở backend như thế nào và đẩy về frontend ra sao để hiển thị realtime?
   > **Đáp án & Kịch bản thực hành:** 
   > (Bạn hãy mở 2 trình duyệt: 1 bên NTD, 1 bên Sinh viên). *"Khi NTD bấm 'Duyệt CV', API được gọi. Backend cập nhật status trong DB, sau đó Laravel sẽ `broadcast` một Event thông qua Websocket Server (Pusher), đính kèm ID của sinh viên. Ở phía trình duyệt của sinh viên, thư viện `laravel-echo` luôn lắng nghe trên Private Channel `private-user.{student_id}`. Khi bắt được event, code Frontend lập tức dispatch thông báo lên góc màn hình và cập nhật con số đỏ trên icon cái chuông mà không cần tải lại trang."*

**KS. Mai Tiến Đạt (Ủy viên) yêu cầu:**
5. **Xử lý form phức tạp:** Trong React, em quản lý form đăng tin tuyển dụng có nhiều trường dữ liệu như thế nào? React Hook Form giúp giải quyết vấn đề gì so với việc dùng State thông thường?
   > **Đáp án & Kịch bản thực hành:** 
   > *"Form đăng tin có rất nhiều trường. Nếu dùng `useState` thông thường, mỗi lần gõ 1 ký tự, cả Component Form sẽ bị re-render lại, gây lag (đặc biệt khi có nhúng trình soạn thảo văn bản). React Hook Form sử dụng `Uncontrolled Components` kết hợp với `ref`, form chỉ render lại khi thực sự cần (ví dụ khi có lỗi validate). Nó cũng giúp quản lý các hàm validate dễ dàng, kết hợp với Schema Validation (Zod/Yup) làm code form rất gọn gàng và performance cực cao."*

6. **Xử lý Upload File:** Việc upload CV (PDF) lên hệ thống được thực hiện qua luồng như thế nào? Em hãy mở phần code xử lý upload (Backend) và cho biết file sẽ được lưu ở đâu (Local storage hay AWS S3)?
   > **Đáp án & Kịch bản thực hành:** 
   > *"Luồng diễn ra: Frontend dùng chuẩn `FormData` đính kèm file gửi qua POST request. Backend (Laravel) nhận file qua biến `$request->file('cv')`. Để đảm bảo bảo mật, Backend bắt buộc validate định dạng phải là `mimes:pdf` và dung lượng `< 5MB`. Sau đó, thay vì lưu vào ổ cứng máy chủ (`storage/app/public`), em cấu hình `Storage::disk('s3')->put()` để đẩy trực tiếp file lên bucket của AWS S3. Đường dẫn public URL trả về từ S3 sẽ được lưu vào DB, giúp hệ thống không tốn tài nguyên ổ cứng và load file nhanh hơn."* (Hãy sẵn sàng mở file Controller ở Backend chứa đoạn code upload để chứng minh).
