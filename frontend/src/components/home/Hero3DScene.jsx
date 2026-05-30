import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Search, FileText, Briefcase, Award, Shield } from 'lucide-react';

// Generate random stars
const stars = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 5,
  opacity: Math.random() * 0.6 + 0.2,
}));

function Hero3DScene() {
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Stronger parallax transforms
  const magnifyX = useTransform(springX, [-1, 1], [-20, 20]);
  const magnifyY = useTransform(springY, [-1, 1], [-15, 15]);
  const cvX = useTransform(springX, [-1, 1], [15, -15]);
  const cvY = useTransform(springY, [-1, 1], [12, -12]);
  const briefX = useTransform(springX, [-1, 1], [-12, 12]);
  const briefY = useTransform(springY, [-1, 1], [-16, 16]);

  // 3D rotation based on mouse
  const rotateY = useTransform(springX, [-1, 1], [-8, 8]);
  const rotateX = useTransform(springY, [-1, 1], [5, -5]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={containerRef}
      className="hero-3d-wrapper scene-3d"
      style={{ position: 'relative', rotateY, rotateX }}
    >
      {/* Star particles */}
      <div className="hero-stars">
        {stars.map((star) => (
          <div
            key={star.id}
            className="hero-star"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* Orbit ring around magnifying glass */}
      <div className="orbit-ring" style={{
        width: '200px',
        height: '200px',
        top: 'calc(15% - 40px)',
        right: 'calc(10% - 40px)',
      }}>
        {/* Orbiting dot */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <div style={{
            position: 'absolute',
            top: '-4px',
            left: '50%',
            width: '8px',
            height: '8px',
            background: '#818cf8',
            borderRadius: '50%',
            boxShadow: '0 0 12px rgba(129,140,248,0.6)',
          }} />
        </motion.div>
      </div>

      {/* Main glow orb */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.15) 40%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'glowPulse 4s ease-in-out infinite',
      }} />

      {/* 🔍 Magnifying Glass - Main floating element */}
      <motion.div
        style={{ x: magnifyX, y: magnifyY }}
        className="float-element"
      >
        <motion.div
          animate={{ y: [0, -15, 0], rotateZ: [0, 3, -2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="shimmer-overlay"
          style={{
            position: 'absolute',
            top: '15%',
            right: '10%',
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 60px rgba(99,102,241,0.5), inset 0 -4px 12px rgba(0,0,0,0.2), 0 0 0 3px rgba(129,140,248,0.2)',
            border: '3px solid rgba(255,255,255,0.25)',
          }}
        >
          <Search style={{ width: '50px', height: '50px', color: 'white', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
          {/* Glass reflection */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '16px',
            width: '35px',
            height: '20px',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
            transform: 'rotate(-30deg)',
            filter: 'blur(2px)',
          }} />
        </motion.div>
      </motion.div>

      {/* 📄 CV/Document - Floating card with shimmer */}
      <motion.div
        style={{ x: cvX, y: cvY }}
        className="float-element"
      >
        <motion.div
          animate={{ y: [0, -20, 0], rotateZ: [-3, 2, -3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="shimmer-overlay"
          style={{
            position: 'absolute',
            top: '5%',
            left: '5%',
            width: '100px',
            height: '130px',
            background: 'linear-gradient(145deg, #ffffff 0%, #f0f0ff 100%)',
            borderRadius: '16px',
            padding: '14px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            transform: 'rotate(-8deg)',
          }}
        >
          {/* CV content lines */}
          <div style={{ width: '60%', height: '10px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '4px' }} />
          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '4px' }} />
          <div style={{ width: '80%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }} />
          <div style={{ width: '90%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }} />
          <div style={{ width: '70%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }} />
          <div style={{ marginTop: 'auto', display: 'flex', gap: '4px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: '100%', height: '4px', background: '#cbd5e1', borderRadius: '2px', marginBottom: '3px' }} />
              <div style={{ width: '60%', height: '4px', background: '#e2e8f0', borderRadius: '2px' }} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* 💼 Briefcase */}
      <motion.div
        style={{ x: briefX, y: briefY }}
        className="float-element"
      >
        <motion.div
          animate={{ y: [0, -12, 0], rotateZ: [5, -2, 5] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '5%',
            width: '80px',
            height: '70px',
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 16px 40px rgba(245,158,11,0.4), inset 0 -3px 8px rgba(0,0,0,0.15)',
            border: '2px solid rgba(255,255,255,0.25)',
          }}
        >
          <Briefcase style={{ width: '32px', height: '32px', color: 'white' }} />
        </motion.div>
      </motion.div>

      {/* ⭐ Award star */}
      <motion.div
        animate={{ y: [0, -18, 0], rotateZ: [0, 10, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        style={{
          position: 'absolute',
          bottom: '30%',
          left: '15%',
          width: '55px',
          height: '55px',
          background: 'linear-gradient(135deg, #10b981, #14b8a6)',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 30px rgba(16,185,129,0.4)',
          border: '2px solid rgba(255,255,255,0.2)',
        }}
      >
        <Award style={{ width: '24px', height: '24px', color: 'white' }} />
      </motion.div>

      {/* 🛡️ Shield - small floating */}
      <motion.div
        animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute',
          top: '55%',
          right: '25%',
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
        <Shield style={{ width: '20px', height: '20px', color: 'white' }} />
      </motion.div>

      {/* Connection lines between elements */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(129,140,248,0)" />
            <stop offset="50%" stopColor="rgba(129,140,248,0.25)" />
            <stop offset="100%" stopColor="rgba(129,140,248,0)" />
          </linearGradient>
        </defs>
        <motion.line
          x1="25%" y1="20%" x2="75%" y2="25%"
          stroke="url(#lineGrad)" strokeWidth="1"
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.line
          x1="15%" y1="65%" x2="70%" y2="75%"
          stroke="url(#lineGrad)" strokeWidth="1"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </svg>

      {/* Floating dots / particles */}
      {[
        { top: '20%', left: '40%', size: 8, bg: '#a78bfa', delay: 0 },
        { top: '70%', left: '60%', size: 6, bg: '#6366f1', delay: 1.5 },
        { top: '40%', right: '15%', size: 10, bg: '#818cf8', delay: 0.8 },
        { top: '80%', left: '25%', size: 5, bg: '#c084fc', delay: 2 },
        { top: '10%', left: '55%', size: 4, bg: '#a78bfa', delay: 3 },
        { top: '60%', left: '10%', size: 7, bg: '#818cf8', delay: 1.2 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -15, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: dot.delay }}
          style={{
            position: 'absolute',
            top: dot.top,
            left: dot.left,
            right: dot.right,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            background: dot.bg,
            borderRadius: '50%',
            boxShadow: `0 0 ${dot.size * 2}px ${dot.bg}60`,
          }}
        />
      ))}
    </motion.div>
  );
}

export default Hero3DScene;
