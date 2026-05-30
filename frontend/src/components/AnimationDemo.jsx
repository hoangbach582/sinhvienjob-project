import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Component demo để showcase các animations
 * Sử dụng: Import vào App.jsx hoặc tạo route /demo
 */
function AnimationDemo() {
  const [activeDemo, setActiveDemo] = useState('particles');

  // Memoize random particles to avoid re-render issues
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 8 + 4}px`,
      height: `${Math.random() * 8 + 4}px`,
      background: ['#818cf8', '#a78bfa', '#c084fc'][Math.floor(Math.random() * 3)],
      duration: `${Math.random() * 4 + 3}s`,
      delay: `${Math.random() * 2}s`,
    })), []
  );

  const demos = [
    { id: 'particles', name: 'Particle Float', icon: '✨' },
    { id: 'shimmer', name: 'Shimmer Slide', icon: '💫' },
    { id: 'glow', name: 'Glow Pulse', icon: '🌟' },
    { id: 'tilt', name: '3D Tilt', icon: '🎴' },
    { id: 'marquee', name: 'Marquee Scroll', icon: '🎪' },
    { id: 'blob', name: 'Blob Morph', icon: '🌊' },
    { id: 'neon', name: 'Neon Text', icon: '💡' },
    { id: 'ripple', name: 'Ripple Effect', icon: '💧' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 className="neon-text" style={{ fontSize: '3rem', fontWeight: 900, color: 'white', marginBottom: '16px' }}>
            🎬 Animation Showcase
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#94a3b8' }}>
            Khám phá các hiệu ứng animation đẹp mắt của SinhVienJob
          </p>
        </motion.div>

        {/* Demo Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '48px' }}>
          {demos.map((demo) => (
            <motion.button
              key={demo.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveDemo(demo.id)}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: activeDemo === demo.id ? '2px solid #6366f1' : '2px solid rgba(255,255,255,0.1)',
                background: activeDemo === demo.id ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(8px)',
              }}>
              <span style={{ fontSize: '20px' }}>{demo.icon}</span>
              {demo.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Demo Area */}
        <motion.div
          key={activeDemo}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '24px',
            padding: '48px',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(16px)',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
          {/* Particle Float Demo */}
          {activeDemo === 'particles' && (
            <div style={{ position: 'relative', width: '100%', height: '300px' }}>
              {particles.map((particle) => (
                <div
                  key={particle.id}
                  className="hero-particle"
                  style={{
                    position: 'absolute',
                    left: particle.left,
                    top: particle.top,
                    width: particle.width,
                    height: particle.height,
                    background: particle.background,
                    borderRadius: '50%',
                    '--duration': particle.duration,
                    '--delay': particle.delay,
                  }}
                />
              ))}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'white' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Particle Float</h3>
                <p style={{ color: '#94a3b8' }}>Particles bay lơ lửng với chuyển động tự nhiên</p>
              </div>
            </div>
          )}

          {/* Shimmer Slide Demo */}
          {activeDemo === 'shimmer' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', width: '100%' }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="shimmer-overlay"
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                  }}>
                  Card {i}
                </div>
              ))}
            </div>
          )}

          {/* Glow Pulse Demo */}
          {activeDemo === 'glow' && (
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <div
                className="badge-pulse-glow"
                style={{
                  padding: '16px 32px',
                  borderRadius: '16px',
                  background: 'rgba(99,102,241,0.2)',
                  border: '2px solid #6366f1',
                  color: 'white',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                }}>
                Badge Pulse
              </div>
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  animation: 'glowPulse 2s ease-in-out infinite',
                }}
              />
            </div>
          )}

          {/* 3D Tilt Demo */}
          {activeDemo === 'tilt' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              {[1, 2].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ rotateY: 10, rotateX: 5, scale: 1.05 }}
                  style={{
                    background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
                    borderRadius: '20px',
                    padding: '32px',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#7c3aed',
                    transformStyle: 'preserve-3d',
                    cursor: 'pointer',
                  }}>
                  Hover Me {i}
                </motion.div>
              ))}
            </div>
          )}

          {/* Marquee Demo */}
          {activeDemo === 'marquee' && (
            <div className="marquee-container" style={{ width: '100%' }}>
              <div className="marquee-track">
                {['FPT', 'VNG', 'Shopee', 'Tiki', 'MoMo', 'Viettel', 'FPT', 'VNG', 'Shopee', 'Tiki'].map((name, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '16px 32px',
                      background: 'white',
                      borderRadius: '12px',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#6366f1',
                      flexShrink: 0,
                    }}>
                    {name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blob Morph Demo */}
          {activeDemo === 'blob' && (
            <div
              className="blob-morph"
              style={{
                width: '200px',
                height: '200px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 20px 60px rgba(99,102,241,0.4)',
              }}
            />
          )}

          {/* Neon Text Demo */}
          {activeDemo === 'neon' && (
            <div style={{ textAlign: 'center' }}>
              <h2 className="neon-text" style={{ fontSize: '3rem', fontWeight: 900, color: '#6366f1', marginBottom: '24px' }}>
                NEON GLOW
              </h2>
              <p className="neon-text" style={{ fontSize: '1.5rem', color: '#8b5cf6' }}>
                Hiệu ứng đèn neon
              </p>
            </div>
          )}

          {/* Ripple Demo */}
          {activeDemo === 'ripple' && (
            <div style={{ display: 'flex', gap: '24px' }}>
              {[1, 2, 3].map((i) => (
                <button
                  key={i}
                  className="ripple-effect"
                  style={{
                    padding: '20px 40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}>
                  Click Me {i}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: '32px',
            padding: '24px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
          }}>
          <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>
            💡 Tips
          </h3>
          <ul style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.8, paddingLeft: '20px' }}>
            <li>Tất cả animations đều được tối ưu cho performance</li>
            <li>Sử dụng GPU acceleration với transform và opacity</li>
            <li>Hỗ trợ prefers-reduced-motion cho accessibility</li>
            <li>Có thể customize timing và easing functions</li>
            <li>Kết hợp nhiều animations để tạo hiệu ứng phức tạp</li>
          </ul>
        </motion.div>

        {/* Code Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '24px',
            padding: '24px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
          <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>
            📝 Code Example
          </h3>
          <pre style={{ color: '#94a3b8', fontSize: '0.875rem', overflow: 'auto' }}>
            <code>{`// Framer Motion Animation
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  whileHover={{ scale: 1.05 }}
>
  Your Content
</motion.div>

// CSS Animation
.element {
  animation: particleFloat 6s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(10px, -40px); }
}`}</code>
          </pre>
        </motion.div>
      </div>
    </div>
  );
}

export default AnimationDemo;
