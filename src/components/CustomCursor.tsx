import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const [cursorType, setCursorType] = useState<'default' | 'hover' | 'cta'>('default');
  const [text, setText] = useState('');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button') || target.getAttribute('data-cursor="pointer"')) {
        setCursorType('hover');
        const label = target.getAttribute('data-cursor-label');
        if (label) setText(label);
      } else {
        setCursorType('default');
        setText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center"
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      {/* Main Dot */}
      <motion.div
        animate={{
          width: cursorType === 'default' ? 8 : 40,
          height: cursorType === 'default' ? 8 : 40,
          backgroundColor: cursorType === 'default' ? '#002366' : 'transparent',
          border: cursorType === 'default' ? 'none' : '1px solid #002366',
          borderRadius: '50%',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative flex items-center justify-center overflow-hidden"
      >
        {/* Hover Text */}
        {cursorType !== 'default' && text && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] font-bold text-[#002366] uppercase tracking-widest whitespace-nowrap px-2"
          >
            {text}
          </motion.span>
        )}
      </motion.div>

      {/* Aura/Ring */}
      <motion.div
        animate={{
          width: cursorType === 'default' ? 20 : 60,
          height: cursorType === 'default' ? 20 : 60,
          opacity: cursorType === 'default' ? 0.3 : 0.6,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="absolute border border-[#002366]/20 rounded-full pointer-events-none"
      />
    </motion.div>
  );
};
