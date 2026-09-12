import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down';
}

export const TextReveal: React.FC<TextRevealProps> = ({ text, className, delay = 0, direction = 'up' }) => {
  const containerRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const chars = containerRef.current.querySelectorAll('.char');
    
    gsap.fromTo(chars, 
      { 
        y: direction === 'up' ? '100%' : '-100%',
        opacity: 0 
      }, 
      { 
        y: '0%', 
        opacity: 1, 
        duration: 1, 
        stagger: 0.03, 
        delay: delay,
        ease: 'expo.out' 
      }
    );
  }, [text, delay, direction]);

  return (
    <div ref={containerRef} className={`overflow-hidden flex flex-wrap ${className}`}>
      {text.split('').map((char, i) => (
        <span key={i} className="char inline-block relative">
          <span className="block">{char === ' ' ? ' ' : char}</span>
        </span>
      ))}
    </div>
  );
};
