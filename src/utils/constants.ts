export const DESIGN_SYSTEM = {
  colors: {
    background: '#050505',
    foreground: '#FFFFFF',
    muted: '#888888',
    accent: '#00F0FF',
    accentMuted: 'rgba(0, 240, 255, 0.3)',
    surface: '#111111',
    border: '#222222',
  },
  typography: {
    fontFamily: {
      heading: '"Inter", "system-ui", "sans-serif"',
      body: '"Inter", "system-ui", "sans-serif"',
      mono: '"JetBrains Mono", "monospace"',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
    },
  },
  animation: {
    spring: {
      stiffness: 100,
      damping: 20,
      mass: 1,
    },
    easing: {
      outExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
      inOutQuad: 'cubic-bezier(0.45, 0, 0.55, 1)',
    }
  }
} as const;
