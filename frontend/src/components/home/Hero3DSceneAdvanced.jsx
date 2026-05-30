import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, MeshDistortMaterial, Sphere, useTexture, Text3D, Center } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// 3D Briefcase Component
function Briefcase({ position }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={meshRef} position={position}>
        {/* Main body */}
        <mesh castShadow>
          <boxGeometry args={[2.5, 1.8, 0.8]} />
          <meshStandardMaterial 
            color="#6366f1" 
            metalness={0.6} 
            roughness={0.2}
            emissive="#4f46e5"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Handle */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <torusGeometry args={[0.6, 0.15, 16, 32, Math.PI]} />
          <meshStandardMaterial 
            color="#8b5cf6" 
            metalness={0.8} 
            roughness={0.1}
          />
        </mesh>
        {/* Lock */}
        <mesh position={[0, 0, 0.45]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
}

// 3D Document Component
function Document({ position, rotation }) {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group position={position} rotation={rotation}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 2, 0.05]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.1} 
            roughness={0.4}
          />
        </mesh>
        {/* Lines on document */}
        {[0.5, 0.2, -0.1, -0.4].map((y, i) => (
          <mesh key={i} position={[0, y, 0.03]}>
            <boxGeometry args={[1.2, 0.08, 0.01]} />
            <meshStandardMaterial color="#e0e7ff" />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// 3D Magnifying Glass
function MagnifyingGlass({ position }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <group ref={meshRef} position={position}>
        {/* Glass */}
        <mesh castShadow>
          <torusGeometry args={[0.8, 0.1, 16, 32]} />
          <meshStandardMaterial 
            color="#a855f7" 
            metalness={0.8} 
            roughness={0.1}
          />
        </mesh>
        <mesh>
          <circleGeometry args={[0.8, 32]} />
          <meshStandardMaterial 
            color="#e0e7ff" 
            transparent 
            opacity={0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Handle */}
        <mesh position={[0.6, -0.8, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1, 16]} />
          <meshStandardMaterial color="#8b5cf6" metalness={0.7} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

// 3D User Icon
function UserIcon({ position }) {
  return (
    <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.6}>
      <group position={position}>
        {/* Circle background */}
        <mesh castShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
          <meshStandardMaterial 
            color="#818cf8" 
            metalness={0.5} 
            roughness={0.3}
            emissive="#6366f1"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.2, 0.15]} castShadow>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Body */}
        <mesh position={[0, -0.2, 0.15]} castShadow>
          <capsuleGeometry args={[0.25, 0.4, 16, 32]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    </Float>
  );
}

// Floating Orb with distortion
function FloatingOrb({ position, color }) {
  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={2}>
      <Sphere args={[0.5, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </Sphere>
    </Float>
  );
}

// Particle system
function Particles() {
  const count = 100;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  const particlesRef = useRef();

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#a78bfa"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Main Scene
function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#6366f1" />
      
      {/* Main objects */}
      <Briefcase position={[0, 0, 0]} />
      <Document position={[-2.5, 1, -1]} rotation={[0.2, 0.3, -0.1]} />
      <Document position={[2, 0.5, -0.5]} rotation={[-0.1, -0.2, 0.15]} />
      <MagnifyingGlass position={[2.5, -1.5, 1]} />
      <UserIcon position={[-2.8, -1.2, 0.5]} />
      
      {/* Floating orbs */}
      <FloatingOrb position={[-3, 2.5, -2]} color="#fbbf24" />
      <FloatingOrb position={[3.5, 2, -1.5]} color="#a855f7" />
      <FloatingOrb position={[1, -2.5, -1]} color="#6366f1" />
      
      {/* Particles */}
      <Particles />
      
      <Environment preset="city" />
    </>
  );
}

// Loading fallback
function Loader() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#a855f7',
      fontSize: '14px',
      fontWeight: 600
    }}>
      Loading 3D Scene...
    </div>
  );
}

function Hero3DSceneAdvanced() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: 50 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="hero-3d-scene" 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Suspense fallback={<Loader />}>
        <Canvas
          shadows
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
          }}
          style={{ 
            width: '100%', 
            height: '100%',
            background: 'transparent'
          }}>
          <Scene />
        </Canvas>
      </Suspense>
      
      {/* Glow effects overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.15), transparent 70%)',
        pointerEvents: 'none',
        mixBlendMode: 'screen'
      }} />
    </motion.div>
  );
}

export default Hero3DSceneAdvanced;
