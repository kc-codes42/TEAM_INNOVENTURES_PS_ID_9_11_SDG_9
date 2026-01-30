"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const LaunchPage = () => {
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Grid configuration
    const gridSize = 80;
    const nodes = [];
    const connections = [];

    // Create node grid
    for (let x = -2; x <= Math.ceil(window.innerWidth / gridSize) + 2; x++) {
      for (let y = -2; y <= Math.ceil(window.innerHeight / gridSize) + 2; y++) {
        nodes.push({
          x: x * gridSize,
          y: y * gridSize,
          baseX: x * gridSize,
          baseY: y * gridSize,
          vx: 0,
          vy: 0,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.01 + Math.random() * 0.02
        });
      }
    }

    // Create strategic connections (sparse architectural lines)
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      // Right connection
      const rightNode = nodes.find(n =>
        n.baseX === node.baseX + gridSize && n.baseY === node.baseY
      );
      if (rightNode && Math.random() > 0.3) {
        connections.push({ from: node, to: rightNode, opacity: 0.15 + Math.random() * 0.15 });
      }

      // Down connection
      const downNode = nodes.find(n =>
        n.baseX === node.baseX && n.baseY === node.baseY + gridSize
      );
      if (downNode && Math.random() > 0.3) {
        connections.push({ from: node, to: downNode, opacity: 0.15 + Math.random() * 0.15 });
      }

      // Diagonal connections (sparse)
      if (Math.random() > 0.85) {
        const diagNode = nodes.find(n =>
          n.baseX === node.baseX + gridSize && n.baseY === node.baseY + gridSize
        );
        if (diagNode) {
          connections.push({ from: node, to: diagNode, opacity: 0.1 + Math.random() * 0.1 });
        }
      }
    }

    let animationFrame;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      // Update node positions with subtle drift
      nodes.forEach(node => {
        node.pulse += node.pulseSpeed;
        const drift = Math.sin(node.pulse) * 2;
        node.x = node.baseX + drift;
        node.y = node.baseY + drift * 0.5;
      });

      // Draw connections
      connections.forEach(conn => {
        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.lineTo(conn.to.x, conn.to.y);
        ctx.strokeStyle = `rgba(100, 116, 139, ${conn.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach(node => {
        const intensity = (Math.sin(node.pulse) + 1) / 2;
        const size = 1.5 + intensity * 0.5;

        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${0.4 + intensity * 0.2})`;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const handleLaunch = () => {
    router.push('/login');
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      {/* Animated Grid Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-40"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/80" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">

        {/* System Badge */}
        <div className="mb-6 md:mb-8 px-3 md:px-4 py-1.5 md:py-2 border border-slate-700/50 rounded-full backdrop-blur-sm bg-slate-900/30">
          <span className="text-slate-400 text-xs md:text-sm font-medium tracking-wide uppercase">
            Infrastructure Intelligence Platform
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-center mb-4 md:mb-6 tracking-tight px-4">
          <span className="text-slate-100">Digital Twin</span>
          <br />
          <span className="text-slate-300">Architecture Visualizer</span>
        </h1>

        {/* Subtext */}
        <p className="text-slate-400 text-base sm:text-lg md:text-xl text-center max-w-2xl mb-10 md:mb-12 leading-relaxed px-6">
          Deterministic failure simulation across cloud infrastructure dependencies
        </p>

        {/* CTA Button */}
        <button
          onClick={handleLaunch}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-cyan-600 hover:bg-cyan-500 text-slate-50 font-semibold text-base sm:text-lg rounded-lg transition-all duration-300 shadow-lg shadow-cyan-600/20 hover:shadow-cyan-500/40 hover:scale-105"
        >
          <span className="relative z-10 flex items-center gap-2 sm:gap-3">
            Launch Visualizer
            <svg
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>

          {/* Hover glow effect */}
          <div className={`absolute inset-0 rounded-lg bg-cyan-400/20 blur-xl transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        </button>

        {/* Technical Specs */}
        <div className="mt-16 md:mt-20 flex flex-col sm:flex-row gap-6 sm:gap-12 text-sm px-6">
          <div className="text-center">
            <div className="text-slate-500 uppercase tracking-wider text-xs mb-1">Dependency</div>
            <div className="text-slate-300 font-mono text-xs sm:text-sm">Graph Analysis</div>
          </div>
          <div className="hidden sm:block w-px bg-slate-700/50" />
          <div className="text-center">
            <div className="text-slate-500 uppercase tracking-wider text-xs mb-1">Impact</div>
            <div className="text-slate-300 font-mono text-xs sm:text-sm">Propagation</div>
          </div>
          <div className="hidden sm:block w-px bg-slate-700/50" />
          <div className="text-center">
            <div className="text-slate-500 uppercase tracking-wider text-xs mb-1">Blast</div>
            <div className="text-slate-300 font-mono text-xs sm:text-sm">Radius Computation</div>
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-600/50 to-transparent" />
    </div>
  );
};

export default LaunchPage;