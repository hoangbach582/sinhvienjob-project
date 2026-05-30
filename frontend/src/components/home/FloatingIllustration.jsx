import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Laptop, CheckCircle, Zap } from 'lucide-react';

function FloatingIllustration() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '400px', perspective: '800px' }}>
      {/* Main glow */}
      <motion.div
        animate={{ opacity: [0.5, 0.8, 0.5], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(99,102,241,0.12) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
        }}
      />

      {/* Orbit ring */}
      <div className="orbit-ring" style={{
        width: '240px',
        height: '240px',
        top: 'calc(50% - 120px)',
        left: 'calc(50% - 120px)',
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <div style={{
            position: 'absolute',
            top: '-5px',
            left: '50%',
            width: '10px',
            height: '10px',
            background: 'linear-gradient(135deg, #818cf8, #c084fc)',
            borderRadius: '50%',
            boxShadow: '0 0 15px rgba(129,140,248,0.6)',
          }} />
        </motion.div>
      </div>

      {/* Second orbit ring */}
      <div className="orbit-ring" style={{
        width: '320px',
        height: '320px',
        top: 'calc(50% - 160px)',
        left: 'calc(50% - 160px)',
        borderColor: 'rgba(129, 140, 248, 0.12)',
        animationDirection: 'reverse',
        animationDuration: '18s',
      }}>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <div style={{
            position: 'absolute',
            bottom: '-3px',
            left: '50%',
            width: '6px',
            height: '6px',
            background: '#a78bfa',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(167,139,250,0.5)',
          }} />
        </motion.div>
      </div>

      {/* 💻 Main Laptop/Platform element */}
      <motion.div
        animate={{ y: [0, -15, 0], rotateY: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="shimmer-overlay"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '180px',
          height: '140px',
          background: 'linear-gradient(145deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9))',
          borderRadius: '20px',
          boxShadow: '0 30px 60px rgba(99,102,241,0.45), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transformStyle: 'preserve-3d',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Screen content */}
        <div style={{
          width: '140px',
          height: '90px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '12px',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
        }}>
          <div style={{ width: '50%', height: '6px', background: 'rgba(255,255,255,0.5)', borderRadius: '3px' }} />
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }} />
          <div style={{ width: '80%', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }} />
          <div style={{ marginTop: 'auto', display: 'flex', gap: '4px' }}>
            <div style={{ width: '30px', height: '14px', background: 'rgba(16,185,129,0.6)', borderRadius: '4px' }} />
            <div style={{ width: '30px', height: '14px', background: 'rgba(245,158,11,0.6)', borderRadius: '4px' }} />
          </div>
        </div>

        {/* Keyboard area */}
        <div style={{ width: '100px', height: '6px', background: 'rgba(0,0,0,0.2)', borderRadius: '3px' }} />
      </motion.div>

      {/* 🛡️ Shield - Top right */}
      <motion.div
        animate={{ y: [0, -12, 0], rotateZ: [-5, 5, -5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: '65px',
          height: '65px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 16px 40px rgba(16,185,129,0.4)',
          border: '2px solid rgba(255,255,255,0.25)',
        }}
      >
        <Shield style={{ width: '28px', height: '28px', color: 'white' }} />
      </motion.div>

      {/* ⭐ Star - Top left */}
      <motion.div
        animate={{ y: [0, -18, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '50px',
          height: '50px',
          background: 'linear-gradient(135deg, #f59e0b, #f97316)',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 30px rgba(245,158,11,0.4)',
          border: '2px solid rgba(255,255,255,0.2)',
        }}
      >
        <Star style={{ width: '22px', height: '22px', color: 'white', fill: 'white' }} />
      </motion.div>

      {/* ✅ CheckCircle - Bottom left */}
      <motion.div
        animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '20%',
          width: '55px',
          height: '55px',
          background: 'linear-gradient(135deg, #6366f1, #818cf8)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 14px 35px rgba(99,102,241,0.4)',
          border: '2px solid rgba(255,255,255,0.2)',
        }}
      >
        <CheckCircle style={{ width: '24px', height: '24px', color: 'white' }} />
      </motion.div>

      {/* ⚡ Zap - Bottom right */}
      <motion.div
        animate={{ y: [0, -14, 0], rotateZ: [0, 8, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '45px',
          height: '45px',
          background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px rgba(236,72,153,0.35)',
          border: '2px solid rgba(255,255,255,0.2)',
        }}
      >
        <Zap style={{ width: '20px', height: '20px', color: 'white' }} />
      </motion.div>

      {/* Connection lines between elements */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="benefitLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(129,140,248,0)" />
            <stop offset="50%" stopColor="rgba(129,140,248,0.2)" />
            <stop offset="100%" stopColor="rgba(129,140,248,0)" />
          </linearGradient>
        </defs>
        <motion.line
          x1="30%" y1="20%" x2="50%" y2="45%"
          stroke="url(#benefitLineGrad)" strokeWidth="1"
          animate={{ opacity: [0.1, 0.35, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.line
          x1="70%" y1="18%" x2="55%" y2="42%"
          stroke="url(#benefitLineGrad)" strokeWidth="1"
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        <motion.line
          x1="35%" y1="78%" x2="48%" y2="58%"
          stroke="url(#benefitLineGrad)" strokeWidth="1"
          animate={{ opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.line
          x1="72%" y1="72%" x2="55%" y2="55%"
          stroke="url(#benefitLineGrad)" strokeWidth="1"
          animate={{ opacity: [0.12, 0.28, 0.12] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
      </svg>

      {/* Floating particles */}
      {[
        { top: '30%', left: '5%', size: 6, bg: '#a78bfa' },
        { top: '60%', right: '5%', size: 8, bg: '#818cf8' },
        { top: '75%', left: '45%', size: 5, bg: '#c084fc' },
        { top: '5%', left: '45%', size: 7, bg: '#6366f1' },
      ].map((dot, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -12, 0], opacity: [0.3, 0.7, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          style={{
            position: 'absolute',
            top: dot.top,
            left: dot.left,
            right: dot.right,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            background: dot.bg,
            borderRadius: '50%',
            boxShadow: `0 0 ${dot.size * 2}px ${dot.bg}50`,
          }}
        />
      ))}
    </div>
  );
}

export default FloatingIllustration;
