import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const MagneticButton: React.FC<{ children: React.ReactNode, label: string }> = ({ children, label }) => {
  const ref = useRef<HTMLDivElement>(null!);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const dist = Math.hypot(clientX - centerX, clientY - centerY);
    const maxDist = 100;
    
    if (dist < maxDist) {
      const strength = (maxDist - dist) / maxDist;
      setPosition({
        x: (clientX - centerX) * 0.3 * strength,
        y: (clientY - centerY) * 0.3 * strength,
      });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      className="relative inline-block"
    >
      <div 
        data-cursor="pointer" 
        data-cursor-label={label} 
        className="relative z-10"
      >
        {children}
      </div>
    </motion.div>
  );
};
