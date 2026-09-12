import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomCursor } from './components/CustomCursor';
import { SmoothScroll } from './components/SmoothScroll';
import { MagneticButton } from './components/MagneticButton';
import { MagneticLink } from './components/MagneticLink';
import { CinematicText } from './components/CinematicText';
import { HUD } from './components/HUD';
import { World } from './three/World';
import { useScrollProgress } from './hooks/useScrollProgress';
import './styles/globals.css';

gsap.registerPlugin(ScrollTrigger);

const Section = ({ id, title, children, className = "" }: { id: string, title: string, children?: React.ReactNode, className?: string }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 1 }}
    viewport={{ once: true }}
    className={`relative min-h-screen w-full flex flex-col justify-center px-6 md:px-20 py-20 border-b border-white/5 ${className}`}
  >
    <div className="max-w-7xl mx-auto w-full relative z-10">
      <h2 className="text-sm uppercase tracking-[0.3em] text-muted mb-8 opacity-50 section-title">{title}</h2>
      {children}
    </div>
  </motion.section>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const scrollProgress = useScrollProgress();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mainRef.current) return;

    // Cinematic camera dive effect
    gsap.to('.hero-visual', {
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      scale: 5,
      z: 15,
      opacity: 0,
      ease: 'none',
    });

    // Section Title Animations
    gsap.utils.toArray('.section-title').forEach((title: any) => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: 'top 95%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        x: -20,
        duration: 1,
        ease: 'power3.out',
      });
    });

    // Feature Card staggered reveal + Floating animation
    gsap.from('.feature-card', {
      scrollTrigger: {
        trigger: '#features',
        start: 'top 70%',
      },
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 1,
      ease: 'expo.out',
    });

    // Add a subtle continuous float to feature cards
    gsap.utils.toArray('.feature-card').forEach((card: any, i) => {
      gsap.to(card, {
        y: 'random(-10, 10)',
        x: 'random(-5, 5)',
        duration: 'random(2, 4)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.2,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <SmoothScroll>
      <div className="grain" />
      <CustomCursor />
      <HUD scrollProgress={scrollProgress} />
      <World scrollProgress={scrollProgress} />

      <AnimatePresence>
        {isLoading && (
          <motion.div
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 z-[10000] bg-background flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center"
            >
              <h1 className="text-2xl font-light tracking-[0.5em] text-white uppercase opacity-50">
                Initializing Void
              </h1>
              <motion.div
                className="w-48 h-[1px] bg-white/20 mt-4 relative overflow-hidden"
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-accent"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main ref={mainRef} className="relative w-full">
        {/* SECTION 01 - HERO */}
        <Section id="hero" title="01">
          <div className="relative z-10">
            <div className="overflow-hidden">
              <CinematicText
                text="DIGITAL VOID"
                mode="char"
                className="text-6xl md:text-9xl font-black leading-tight tracking-tighter text-gradient"
                delay={2.2}
                stagger={0.04}
                duration={1.5}
              />
            </div>
            <div className="overflow-hidden">
              <CinematicText
                text="An immersive exploration of generative geometry and cinematic interaction."
                mode="word"
                className="mt-8 text-lg md:text-xl text-muted max-w-2xl leading-relaxed"
                delay={3.0}
                stagger={0.08}
              />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 3.8 }}
              className="mt-12 flex gap-6"
            >
              <MagneticButton label="ENTER">
                <button className="px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-accent transition-all duration-300 uppercase tracking-widest text-xs">
                  Explore Experience
                </button>
              </MagneticButton>
            </motion.div>
          </div>
          <div className="hero-visual absolute inset-0 -z-10 pointer-events-none" />
        </Section>

        {/* SECTION 02 - INTRODUCTION */}
        <Section id="intro" title="02">
          <div className="parallax-text">
            <CinematicText
              text="We craft digital artifacts that defy the boundaries of the browser."
              mode="word"
              className="text-4xl md:text-7xl font-bold max-w-5xl leading-tight"
              delay={0.1}
              stagger={0.1}
              parallax={-0.2}
            />
          </div>
        </Section>

        {/* SECTION 03 - FEATURES */}
        <Section id="features" title="03">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { title: "Procedural Worlds", desc: "Custom GLSL shaders creating evolving environments that react to user intent." },
              { title: "Cinematic Motion", desc: "GSAP-driven choreography ensuring every pixel moves with purpose and elegance." },
              { title: "Immersive UI", desc: "Breaking the grid with fluid layouts and non-linear storytelling." },
              { title: "Digital Alchemy", desc: "Merging mathematical precision with pure artistic intuition." }
            ].map((feature, i) => (
              <div
                key={i}
                className="feature-card p-10 border border-white/10 rounded-3xl bg-surface/30 backdrop-blur-md hover:border-accent/50 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute -right-8 -bottom-8 text-8xl font-black text-white/[0.03] group-hover:text-accent/[0.1] transition-colors duration-500">
                  0{i+1}
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">{feature.title}</h3>
                <p className="text-muted leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* SECTION 04 - SHOWCASE */}
        <Section id="showcase" title="04" className="overflow-hidden">
          <div className="relative z-10">
            <div className="overflow-hidden">
              <CinematicText text="Fragmented Realities" mode="word" className="text-4xl md:text-6xl font-bold mb-8" delay={0.2} />
            </div>
            <p className="text-muted max-w-xl mb-12 text-lg">Hover over the fragments to unveil the hidden dimensions of our work.</p>
          </div>
        </Section>

        {/* SECTION 05 - TECHNOLOGY */}
        <Section id="technology" title="05" className="overflow-hidden">
          <div className="relative z-10">
            <div className="overflow-hidden">
              <CinematicText text="The Neural Grid" mode="word" className="text-4xl md:text-6xl font-bold mb-8" delay={0.2} />
            </div>
            <p className="text-muted max-w-xl mb-12 text-lg">A complex system of interconnected nodes driving the generative engine.</p>
          </div>
        </Section>

        {/* SECTION 06 - PHILOSOPHY */}
        <Section id="philosophy" title="06">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
            className="flex flex-col gap-12"
          >
            <div className="overflow-hidden">
              <CinematicText
                text="DESIGN IS NOT WHAT IT LOOKS LIKE, BUT HOW IT FEELS."
                mode="word"
                className="text-5xl md:text-9xl font-black leading-none tracking-tighter"
                delay={0.2}
                stagger={0.05}
              />
            </div>
            <p className="text-xl md:text-3xl text-muted max-w-4xl leading-relaxed font-light">
              We believe that the web should be a canvas for emotional experiences.
              By combining mathematical precision with artistic intuition, we build interfaces
              that breathe, react, and evolve.
            </p>
          </motion.div>
        </Section>

        {/* SECTION 07 - EXPERIMENT */}
        <Section id="experiment" title="07" className="overflow-hidden">
          <div className="relative z-10">
            <div className="overflow-hidden">
              <CinematicText text="Gravitational Field" mode="word" className="text-4xl md:text-6xl font-bold mb-8" delay={0.2} />
            </div>
            <p className="text-muted max-w-xl mb-12 text-lg">Interact with the particle field. Move your cursor to attract the digital dust.</p>
          </div>
        </Section>

        {/* SECTION 08 - FINAL CTA */}
        <Section id="cta" title="08" className="text-center items-center bg-gradient-to-b from-transparent to-accent/10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10"
          >
            <div className="overflow-hidden mb-12">
              <CinematicText text="READY TO ENTER?" mode="char" className="text-6xl md:text-9xl font-black tracking-tighter" delay={0.2} stagger={0.03} />
            </div>
            <MagneticButton label="DISCOVER">
              <button className="px-16 py-8 bg-white text-black text-2xl font-black rounded-full hover:bg-accent transition-all duration-300 transform hover:scale-110 uppercase tracking-widest">
                Start Your Journey
              </button>
            </MagneticButton>
          </motion.div>
        </Section>

        <footer className="relative w-full py-20 px-6 md:px-20 bg-black border-t border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-3xl font-black tracking-tighter">DIGITAL VOID</div>
            <div className="flex gap-12 text-sm uppercase tracking-[0.3em] text-muted">
              <MagneticLink href="#">Twitter</MagneticLink>
              <MagneticLink href="#">Instagram</MagneticLink>
              <MagneticLink href="#">Dribbble</MagneticLink>
            </div>
            <div className="text-xs text-muted uppercase tracking-widest">
              © 2026 Digital Void Studio.
            </div>
          </div>
        </footer>
      </main>
    </SmoothScroll>
  );
}

export default App;
