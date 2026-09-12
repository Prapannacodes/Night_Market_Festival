import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const HUD = ({ scrollProgress }: { scrollProgress: number }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0, z: 0 });
  const [status, setStatus] = useState('SYSTEM_ACTIVE');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
        z: scrollProgress * 10,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [scrollProgress]);

  useEffect(() => {
    const statuses = ['SYNCING_VOID', 'NEURAL_LINK_ESTABLISHED', 'CORE_STABLE', 'SYSTEM_ACTIVE', 'DATA_STREAM_SYNCED'];
    const interval = setInterval(() => {
      setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 p-6 md:p-10 flex flex-col justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-accent/60 mix-blend-difference">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="font-bold text-white">Void_OS v1.0.4</span>
          </div>
          <div className="text-white/40">Status: {status}</div>
        </div>
        <div className="text-right">
          <div className="text-white/40">Connection: Stable</div>
          <div className="text-white">Uptime: 124:12:04</div>
        </div>
      </div>

      {/* Side Coordinates */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-6">
        <div className="flex flex-col">
          <span className="text-white/20">POS_X</span>
          <span className="text-white font-bold">{coords.x.toFixed(3)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white/20">POS_Y</span>
          <span className="text-white font-bold">{coords.y.toFixed(3)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white/20">POS_Z</span>
          <span className="text-white font-bold">{coords.z.toFixed(3)}</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-white/20">Sync_Progress</span>
            <div className="w-32 h-[1px] bg-white/10 relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-accent" 
                style={{ width: `${scrollProgress * 100}%` }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
              />
            </div>
          </div>
          <div className="text-[8px] text-white/20">Encryption: AES-256-GCM</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-white/30">Sector: {Math.floor(scrollProgress * 10)}</div>
          <div className="text-accent font-bold">Core_Energy: { (Math.sin(Date.now() * 0.001) * 10 + 90).toFixed(1) }%</div>
        </div>
      </div>
    </div>
  );
};
