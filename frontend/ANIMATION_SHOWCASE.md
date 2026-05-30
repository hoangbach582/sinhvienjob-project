# 🎬 Animation Showcase - SinhVienJob

## 🌟 Danh Sách Hiệu Ứng Animation

### 1. Hero Section Animations

#### ✨ Particle Float
```css
.hero-particle {
  animation: particleFloat 6s ease-in-out infinite;
}
```
**Mô tả**: Các particles nhỏ bay lơ lửng trong hero section với chuyển động tự nhiên

#### 🌠 Shooting Stars
```css
.shooting-star {
  animation: shootingStar 3s ease-out infinite;
}
```
**Mô tả**: Sao băng di chuyển chéo qua màn hình

#### 💫 Badge Pulse Glow
```css
.badge-pulse-glow {
  animation: badgePulse 2s ease-in-out infinite;
}
```
**Mô tả**: Badge "Nền Tảng..." có hiệu ứng glow nhấp nháy

#### 🔍 Search Form Glow
```css
.search-form-glow:focus-within {
  box-shadow: 0 25px 50px rgba(0,0,0,0.3), 
              0 0 0 2px rgba(99, 102, 241, 0.3), 
              0 0 30px rgba(99, 102, 241, 0.15);
}
```
**Mô tả**: Search bar phát sáng khi focus

#### 📝 Text Glow
```css
.text-glow {
  animation: textGlow 3s ease-in-out infinite;
}
```
**Mô tả**: Text title có hiệu ứng glow nhấp nháy

### 2. 3D Effects

#### 🎴 Job Card 3D Tilt
```javascript
// Mouse move tilt effect
const handleMouseMove = (e) => {
  const rotateX = (y - 0.5) * -8;
  const rotateY = (x - 0.5) * 8;
  cardRef.current.style.transform = 
    `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
};
```
**Mô tả**: Job cards nghiêng theo hướng di chuyển chuột

#### 💎 Shimmer Overlay
```css
.shimmer-overlay::after {
  animation: shimmerSlide 4s ease-in-out infinite;
}
```
**Mô tả**: Ánh sáng quét qua card

#### 🎯 Company Logo 3D Flip
```css
.company-logo-3d:hover {
  transform: translateY(-6px) rotateY(8deg) scale(1.04);
}
```
**Mô tả**: Logo công ty xoay 3D khi hover

### 3. Stats Section Animations

#### 📊 Counter Animation
```javascript
gsap.to(obj, {
  val: numTarget,
  duration: 2.2,
  ease: 'power2.out',
  onUpdate: () => setCount(Math.floor(obj.val))
});
```
**Mô tả**: Số liệu đếm từ 0 lên giá trị thực

#### 🎨 Stat Card Glow
```css
.stat-card-glow::before {
  animation: borderGlow 4s ease infinite;
}
```
**Mô tả**: Border gradient xoay quanh card

#### 🚀 Icon Bounce
```css
.icon-animated {
  animation: iconBounce 0.6s ease forwards;
}
```
**Mô tả**: Icons nhảy lên khi xuất hiện

### 4. Floating Elements

#### 🎈 Float Variants
```css
.float-slow { animation: floatSlow 3s ease-in-out infinite; }
.float-medium { animation: floatMedium 4s ease-in-out infinite; }
.float-fast { animation: floatFast 5s ease-in-out infinite; }
```
**Mô tả**: 3 tốc độ float khác nhau cho elements

#### 🌀 Orbit Ring
```css
.orbit-ring {
  animation: rotateGlow 12s linear infinite;
}
```
**Mô tả**: Vòng tròn xoay quanh element chính

#### 🔗 Connection Lines
```css
.connection-line {
  animation: linePulse 3s ease-in-out infinite;
}
```
**Mô tả**: Đường kẻ nối giữa các elements nhấp nháy

### 5. Background Effects

#### 🌊 Blob Morph
```css
.blob-morph {
  animation: blobMorph 8s ease-in-out infinite;
}
```
**Mô tả**: Hình dạng blob biến đổi liên tục

#### 🎆 Glow Pulse
```css
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
}
```
**Mô tả**: Ánh sáng phát ra nhấp nháy

#### 🌈 Gradient Shift
```css
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```
**Mô tả**: Gradient di chuyển

### 6. Marquee Effects

#### 🎪 Marquee Scroll
```css
.marquee-track {
  animation: marqueeScroll 30s linear infinite;
}
```
**Mô tả**: Company logos cuộn tự động

#### ⏸️ Pause on Hover
```css
.marquee-track:hover {
  animation-play-state: paused;
}
```
**Mô tả**: Dừng cuộn khi hover

### 7. Advanced Effects

#### 🔮 Holographic Effect
```css
.holographic {
  animation: holographicShift 3s ease infinite;
}
```
**Mô tả**: Hiệu ứng hologram với nhiều màu

#### 💧 Ripple Effect
```css
.ripple-effect:active::after {
  animation: ripple 0.6s ease-out;
}
```
**Mô tả**: Gợn sóng khi click

#### 🪞 Glass Reflection
```css
.glass-reflection::before {
  animation: glassReflection 3s ease-in-out infinite;
}
```
**Mô tả**: Ánh sáng phản chiếu trên bề mặt kính

#### 💫 Neon Glow
```css
.neon-text {
  animation: neonPulse 2s ease-in-out infinite;
}
```
**Mô tả**: Text phát sáng như đèn neon

### 8. Scroll Animations

#### 📜 Reveal on Scroll
```css
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```
**Mô tả**: Elements xuất hiện khi scroll đến

#### 🎭 Stagger Fade In
```css
.stagger-item:nth-child(1) { animation-delay: 0.1s; }
.stagger-item:nth-child(2) { animation-delay: 0.2s; }
```
**Mô tả**: Elements xuất hiện lần lượt

### 9. Loading States

#### ⏳ Skeleton Shimmer
```css
.skeleton {
  animation: skeletonShimmer 1.5s ease-in-out infinite;
}
```
**Mô tả**: Loading skeleton với shimmer effect

#### 🔄 Spin Animation
```css
.animate-spin {
  animation: spin 1s linear infinite;
}
```
**Mô tả**: Xoay vòng liên tục

### 10. Framer Motion Animations

#### 🎬 Slide Up
```javascript
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
/>
```
**Mô tả**: Element trượt lên từ dưới

#### 🎪 Scale In
```javascript
<motion.div
  initial={{ scale: 0.8 }}
  animate={{ scale: 1 }}
  whileHover={{ scale: 1.05 }}
/>
```
**Mô tả**: Element phóng to khi xuất hiện và hover

#### 🌊 Stagger Children
```javascript
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={itemVariants}
      custom={i}
    />
  ))}
</motion.div>
```
**Mô tả**: Children elements xuất hiện lần lượt

## 🎨 Color Animations

### Gradient Text Flow
```css
.gradient-text-animated {
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #6366f1);
  animation: gradientTextFlow 3s linear infinite;
}
```

### Border Glow Rotation
```css
.gradient-border-animated::before {
  animation: gradientBorderRotate 3s linear infinite;
}
```

## 🎯 Performance Tips

### GPU Acceleration
```css
.optimized-animation {
  will-change: transform;
  transform: translateZ(0);
}
```

### Reduce Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 📊 Animation Timing Functions

### Easing Functions
```css
/* Smooth */
cubic-bezier(0.16, 1, 0.3, 1)

/* Bounce */
cubic-bezier(0.68, -0.55, 0.265, 1.55)

/* Elastic */
cubic-bezier(0.175, 0.885, 0.32, 1.275)
```

## 🎮 Interactive Animations

### Hover States
- Scale up: `scale(1.05)`
- Lift up: `translateY(-6px)`
- Rotate: `rotateY(8deg)`
- Glow: `box-shadow: 0 0 30px rgba(...)`

### Click States
- Scale down: `scale(0.97)`
- Ripple effect
- Color change

### Focus States
- Glow border
- Scale up
- Color highlight

## 🌈 Animation Combinations

### Card Hover Effect
```css
.card:hover {
  transform: translateY(-10px) rotateX(2deg) scale(1.02);
  box-shadow: 0 30px 60px rgba(99, 102, 241, 0.22);
}
```

### Button Press Effect
```css
.button:active {
  transform: scale(0.97);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}
```

## 🎪 Demo Scenarios

### Scenario 1: Hero Entry
1. Badge fades in with scale
2. Title words reveal one by one
3. Search bar slides up
4. Tags stagger in from left
5. 3D scene fades in from right

### Scenario 2: Job Card Interaction
1. Card lifts up on hover
2. 3D tilt follows mouse
3. Shimmer sweeps across
4. Border glows
5. Details button animates

### Scenario 3: Stats Reveal
1. Section scrolls into view
2. Cards fade in with stagger
3. Icons bounce
4. Numbers count up
5. Border glow activates on hover

## 🚀 Usage Examples

### Basic Animation
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Complex Animation
```jsx
<motion.div
  initial={{ opacity: 0, y: 50, scale: 0.9 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ 
    duration: 0.8, 
    ease: [0.16, 1, 0.3, 1],
    delay: 0.2 
  }}
  whileHover={{ 
    scale: 1.05, 
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)" 
  }}
>
  Content
</motion.div>
```

### GSAP Timeline
```javascript
const tl = gsap.timeline();
tl.from('.element1', { opacity: 0, y: 50, duration: 0.6 })
  .from('.element2', { opacity: 0, x: -50, duration: 0.6 }, '-=0.3')
  .from('.element3', { opacity: 0, scale: 0, duration: 0.6 }, '-=0.3');
```

---

**🎨 Tất cả animations đều được tối ưu cho performance và accessibility!**
