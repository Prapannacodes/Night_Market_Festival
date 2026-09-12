import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticLinkProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

export const MagneticLink: React.FC<MagneticLinkProps> = ({ children, href, className }) => {
  const ref = useRef<HTMLDivElement>(null!);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const dist = Math.hypot(clientX - centerX, clientY - centerY);
    const maxDist = 80;
    
    if (dist < maxDist) {
      const strength = (maxDist - dist) / maxDist;
      setPosition({
        x: (clientX - centerX) * 0.4 * strength,
        y: (clientY - centerY) * 0.4 * strength,
      });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className={`relative inline-block ${className}`}
    >
      <a 
        href={href || '#'} 
        data-cursor="pointer" 
        data-cursor-label="EXPLORE"
        className="relative z-10 block"
      >
        {children}
      </a>
    </motion.div>
  );
};
