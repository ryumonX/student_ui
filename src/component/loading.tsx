'use client'
import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import {
  CircleNotch,
  Rocket,
  Planet,
  Atom,
  Lightning,
  Star,
  Sparkle
} from 'phosphor-react';

const LoadingAnimation = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const particleRef = useRef<HTMLDivElement>(null);

  const icons = [CircleNotch, Rocket, Planet, Atom, Lightning, Star];
  const messages = [
    "Memuat data...",
    "Menyiapkan sistem...",
    "Mengoptimalkan...",
    "Hampir selesai...",
    "Menyalakan mesin...",
    "Bersiaplah!"
  ];

  // Warna gradasi biru
  const blueGradient = {
    light: '#4cc9f0',
    medium: '#4895ef',
    dark: '#4361ee',
    darker: '#3a0ca3',
    darkest: '#2a0757'
  };

  // Efek partikel
  useEffect(() => {
    if (!particleRef.current) return;

    const container = particleRef.current;
    const particleCount = 30;

    // Bersihkan partikel yang ada
    container.innerHTML = '';

    // Buat partikel baru
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = `${Math.random() * 10 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.backgroundColor = `rgba(76, 201, 240, ${Math.random() * 0.5 + 0.3})`;
      particle.style.borderRadius = '50%';
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.zIndex = '0';

      // Animasi partikel
      particle.style.animation = `float ${Math.random() * 10 + 5}s infinite ease-in-out`;
      particle.style.animationDelay = `${Math.random() * 2}s`;

      container.appendChild(particle);
    }

    // Tambahkan animasi float ke stylesheet
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        50% { transform: translate(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 100}px, ${Math.random() * 100}px) rotate(180deg); opacity: 0.7; }
        100% { transform: translate(0, 0) rotate(360deg); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // Animasi perubahan ikon dan progress
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % icons.length);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearInterval(progressInterval);
    };
  }, [icons.length]);

  const CurrentIcon = icons[activeIndex];

  // Style untuk fullscreen
  const containerStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    background: `linear-gradient(135deg, ${blueGradient.light}, ${blueGradient.darker})`,
    color: 'white',
    zIndex: 1000,
    overflow: 'hidden',
  };

  const iconStyle: CSSProperties = {
    animation: hovered
      ? 'pulse 1.5s infinite, spin 4s linear infinite'
      : 'spin 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite',
    filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.5))',
    color: 'white',
    zIndex: 10,
    transition: 'all 0.3s ease',
  };

  const particleStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  };

  return (
    <div
      style={containerStyle}
      onMouseEnter={() => {
        setHovered(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }}
      onMouseLeave={() => {
        setHovered(false);
        intervalRef.current = setInterval(() => {
          setActiveIndex(prev => (prev + 1) % icons.length);
        }, 2000);
      }}
    >
      {/* Efek partikel */}
      <div ref={particleRef} style={particleStyle} />

      {/* Efek gelombang */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '20%',
        background: `linear-gradient(to top, ${blueGradient.darkest}, transparent)`,
        zIndex: 2
      }} />

      {/* Ikon utama */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <CurrentIcon
          size={80}
          weight="duotone"
          style={iconStyle}
        />

        {/* Efek pulsating */}
        <div style={{
          position: 'absolute',
          top: '-25%',
          left: '-25%',
          width: '150%',
          height: '150%',
          borderRadius: '50%',
          border: `2px solid rgba(255, 255, 255, 0.3)`,
          animation: 'pulse 3s infinite',
          zIndex: -1,
        }} />
      </div>

      {/* Teks */}
      <div style={{
        textAlign: 'center',
        zIndex: 10,
        textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          marginBottom: '0.5rem'
        }}>
          {messages[activeIndex]}
        </h1>
        <p style={{
          fontSize: '1.1rem',
          opacity: 0.8,
          maxWidth: '500px',
          lineHeight: 1.6
        }}>
          Sistem sedang memuat konten dan mengoptimalkan pengalaman Anda
        </p>
      </div>

      {/* Progress bar */}
      <div style={{
        width: 'min(80vw, 500px)',
        height: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '10px',
        overflow: 'hidden',
        zIndex: 10,
        marginTop: '1rem',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${blueGradient.light}, ${blueGradient.medium})`,
          borderRadius: '10px',
          transition: 'width 0.1s ease',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
            animation: 'shimmer 1.5s infinite'
          }} />
        </div>
      </div>

      {/* Info tambahan */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        marginTop: '2rem',
        zIndex: 10,
        opacity: 0.8,
        fontSize: '0.9rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkle size={20} weight="fill" />
          <span>Loading aman dan terenkripsi</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 8px #10b981'
          }} />
          <span>Koneksi stabil</span>
        </div>
      </div>

      {/* Style inline untuk animasi */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0% { transform: scale(0.9); opacity: 0.7; }
            50% { transform: scale(1.1); opacity: 0.4; }
            100% { transform: scale(0.9); opacity: 0.7; }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingAnimation;