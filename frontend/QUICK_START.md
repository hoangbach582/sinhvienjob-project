# 🚀 Quick Start Guide - Redesigned Homepage

## 📦 Installation

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Mở trình duyệt tại: `http://localhost:5173`

## 🎨 Xem Các Animations

### Trang Chủ
Truy cập: `http://localhost:5173`

Bạn sẽ thấy:
- ✨ Hero section với particles và 3D elements
- 📊 Stats cards với counter animation
- 🎴 Job cards với pastel colors và 3D tilt
- 💼 Benefits section với floating illustration
- 🏢 Companies marquee với auto-scroll

### Animation Demo (Optional)
Để xem tất cả animations trong một trang:

1. Thêm route trong `App.jsx`:
```javascript
import AnimationDemo from './components/AnimationDemo';

// Trong routes:
<Route path="/demo" element={<AnimationDemo />} />
```

2. Truy cập: `http://localhost:5173/demo`

## 🎯 Các Tính Năng Chính

### 1. Hero Section
**Hiệu ứng:**
- Particles bay lơ lửng
- Shooting stars
- Badge glow pulse
- Search bar focus glow
- 3D floating elements
- Text glow animation

**Tương tác:**
- Hover vào "Sinh Viên" để thấy scale effect
- Click vào search bar để thấy glow
- Di chuyển chuột để thấy parallax

### 2. Stats Section
**Hiệu ứng:**
- Counter đếm từ 0
- Icon bounce
- Card hover lift
- Gradient border glow

**Tương tác:**
- Scroll xuống để trigger counter
- Hover vào cards để thấy 3D effect

### 3. Job Cards
**Hiệu ứng:**
- Pastel gradient backgrounds
- 3D tilt theo mouse
- Shimmer sweep
- Border glow

**Tương tác:**
- Hover vào card để thấy 3D tilt
- Di chuyển chuột trên card để thấy perspective
- Click để xem chi tiết

### 4. Benefits Section
**Hiệu ứng:**
- Floating 3D elements
- Orbit rings
- Connection lines
- Particles

**Tương tác:**
- Scroll để trigger animations
- Xem các elements float tự động

### 5. Companies Section
**Hiệu ứng:**
- Auto-scrolling marquee
- 3D flip on hover
- Pulse animation

**Tương tác:**
- Hover vào logo để pause scroll
- Click để xem chi tiết công ty

## 🎨 Customize Colors

### Thay đổi màu chính
Edit `frontend/src/index.css`:

```css
@theme {
  --color-brand-blue: #3B82F6;      /* Thay đổi màu xanh */
  --color-brand-indigo: #6366F1;    /* Thay đổi màu indigo */
  --color-brand-purple: #A855F7;    /* Thay đổi màu tím */
}
```

### Thay đổi gradient
Edit component tương ứng:

```javascript
// Hero background
background: 'linear-gradient(135deg, #YOUR_COLOR_1, #YOUR_COLOR_2)'

// Job card backgrounds
const cardGradients = {
  'part_time': { bg: 'linear-gradient(135deg, #YOUR_COLOR_1, #YOUR_COLOR_2)' },
  // ...
}
```

## ⚡ Performance Tips

### Tối ưu cho Production
```bash
npm run build
```

### Giảm số lượng particles (nếu lag)
Edit `HeroSection.jsx`:
```javascript
// Giảm từ 25 xuống 15
const heroParticles = Array.from({ length: 15 }, ...);
```

### Tắt 3D scene trên mobile
Đã được tự động xử lý trong CSS:
```css
@media (max-width: 1024px) {
  .hero-3d-wrapper {
    display: none;
  }
}
```

## 🐛 Troubleshooting

### Issue: Animations không chạy
**Giải pháp:**
1. Clear browser cache
2. Hard refresh (Ctrl + Shift + R)
3. Kiểm tra console errors

### Issue: 3D scene không hiển thị
**Giải pháp:**
1. Kiểm tra đã cài Three.js:
```bash
npm install three @react-three/fiber @react-three/drei
```
2. Restart dev server

### Issue: Build errors
**Giải pháp:**
```bash
# Xóa node_modules và reinstall
rm -rf node_modules
npm install
npm run build
```

### Issue: Lag/Performance issues
**Giải pháp:**
1. Giảm số particles
2. Tắt một số animations
3. Sử dụng `prefers-reduced-motion`

## 📱 Test Responsive

### Desktop
- Mở trình duyệt ở full width
- Tất cả animations hoạt động

### Tablet (768px - 1024px)
- Resize browser window
- Grid layout điều chỉnh
- Một số animations đơn giản hóa

### Mobile (< 768px)
- Resize browser xuống mobile size
- 3D scene ẩn
- Single column layout
- Touch-friendly interactions

## 🎓 Learn More

### Files quan trọng
```
frontend/
├── src/
│   ├── components/
│   │   └── home/
│   │       ├── HeroSection.jsx          # Hero với search
│   │       ├── Hero3DScene.jsx          # 3D elements
│   │       ├── StatsSection.jsx         # Stats cards
│   │       ├── LatestJobsSection.jsx    # Job listings
│   │       ├── BenefitsSection.jsx      # Benefits
│   │       └── CompaniesSection.jsx     # Companies
│   ├── index.css                        # All animations
│   └── pages/
│       └── Home.jsx                     # Main page
├── REDESIGN_NOTES.md                    # Detailed docs
├── ANIMATION_SHOWCASE.md                # Animation list
└── QUICK_START.md                       # This file
```

### Documentation
- `REDESIGN_NOTES.md` - Chi tiết về redesign
- `ANIMATION_SHOWCASE.md` - Danh sách animations
- `REDESIGN_SUMMARY.md` - Tổng kết

## 🎉 Next Steps

1. ✅ Chạy dev server
2. ✅ Xem trang chủ mới
3. ✅ Test các animations
4. ✅ Customize colors (optional)
5. ✅ Build production
6. ✅ Deploy!

## 💡 Tips

### Để animations mượt hơn:
- Sử dụng Chrome/Edge (tốt nhất)
- Enable hardware acceleration
- Close các tabs không cần thiết
- Sử dụng máy có GPU

### Để customize:
- Đọc code comments
- Thử thay đổi values
- Test trên nhiều devices
- Giữ performance trong tầm kiểm soát

### Để debug:
- Mở DevTools (F12)
- Check Console tab
- Use React DevTools
- Monitor Performance tab

## 🚀 Deploy

### Build
```bash
npm run build
```

### Preview build
```bash
npm run preview
```

### Deploy to Vercel/Netlify
```bash
# Vercel
vercel

# Netlify
netlify deploy
```

## 📞 Need Help?

1. Check documentation files
2. Read code comments
3. Test in AnimationDemo
4. Check browser console
5. Verify dependencies

---

**Happy Coding! 🎨✨**
