import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type RevealMode = 'char' | 'word' | 'line';

interface CinematicTextProps {
  text: string;
  className?: string;
  mode?: RevealMode;
  delay?: number;
  duration?: number;
  stagger?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  scrub?: boolean; 
  parallax?: number;
}

export const CinematicText: React.FC<CinematicTextProps> = ({
  text,
  className = '',
  mode = 'word',
  delay = 0,
  duration = 1,
  stagger = 0.05,
  direction = 'up',
  scrub = false,
  parallax = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const elements = mode === 'char' 
      ? containerRef.current.querySelectorAll('.ct-char')
      : mode === 'word' 
        ? containerRef.current.querySelectorAll('.ct-word')
        : containerRef.current.querySelectorAll('.ct-line');

    const isUp = direction === 'up';
    const isDown = direction === 'down';
    const isLeft = direction === 'left';
    const isRight = direction === 'right';

    const fromProps = {
      y: isUp ? '100%' : isDown ? '-100%' : 0,
      x: isLeft ? '100%' : isRight ? '-100%' : 0,
      opacity: 0,
      filter: 'blur(12px)',
      scale: 1.1,
    };

    const toProps = {
      y: 0,
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
    };

    gsap.set(elements, fromProps);

    const animation = gsap.to(elements, {
      ...toProps,
      duration: duration,
      stagger: stagger,
      delay: delay,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 90%',
        end: 'top 60%',
        scrub: scrub,
        toggleActions: 'play none none reverse',
      },
    });

    if (parallax !== 0) {
      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        y: parallax * 100,
        ease: 'none',
      });
    }

    return () => {
      animation.kill();
    };
  }, [text, mode, delay, duration, stagger, direction, scrub, parallax]);

  const splitText = () => {
    if (mode === 'char') {
      return text.split('').map((char, i) => (
        <span key={i} className="ct-char-wrap inline-block overflow-hidden">
          <span className="ct-char inline-block">{char === ' ' ? ' ' : char}</span>
        </span>
      ));
    }
    if (mode === 'word') {
      return text.split(' ').map((word, i) => (
        <span key={i} className="ct-word-wrap inline-block overflow-hidden mr-2">
          <span className="ct-word inline-block">{word}</span>
        </span>
      ));
    }
    return text.split('\n').map((line, i) => (
      <span key={i} className="ct-line-wrap block overflow-hidden">
        <span className="ct-line inline-block">{line}</span>
      </span>
    ));
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex flex-wrap">
        {splitText()}
      </div>
    </div>
  );
};
