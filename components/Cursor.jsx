'use client';
import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const pathRef = useRef(null);
  const trailPoints = useRef([]);
  const [mounted, setMounted] = useState(false);
  
  const trailLife = 150; 
  const dotSize = 12;
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDesktop(window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches);
  }, []);

  useEffect(() => {
    if (!mounted || !isDesktop) return;

    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      trailPoints.current.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    };

    const drawTrail = () => {
      const now = performance.now();
      const points = trailPoints.current;

      while (points.length && now - points[0].t > trailLife) {
        points.shift();
      }

      if (pathRef.current) {
        if (points.length < 2) {
          pathRef.current.setAttribute('d', '');
        } else {
          let d = `M ${points[0].x} ${points[0].y}`;
          for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const point = points[i];
            const midX = (prev.x + point.x) / 2;
            const midY = (prev.y + point.y) / 2;
            d += ` Q ${prev.x} ${prev.y} ${midX} ${midY}`;
          }
          pathRef.current.setAttribute('d', d);
        }
      }
      requestAnimationFrame(drawTrail);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const animId = requestAnimationFrame(drawTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [mounted, isDesktop]);

  if (!mounted || !isDesktop) return null;

  return (
    <>
      <div 
        ref={cursorRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          backgroundColor: 'white',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
          marginTop: `-${dotSize / 2}px`,
          marginLeft: `-${dotSize / 2}px`,
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
        }} 
      />
      
      <svg
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      >
        <path
          ref={pathRef}
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ 
            opacity: 0.6,
            filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.3))' 
          }}
        />
      </svg>
    </>
  );
}