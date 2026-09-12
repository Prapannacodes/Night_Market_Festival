import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleTextProps {
  text: string;
  scrollProgress: number;
  color?: string;
}

export const ParticleText: React.FC<ParticleTextProps> = ({ text, scrollProgress, color = '#00F0FF' }) => {
  const pointsRef = useRef<THREE.Points>(null!);

  // 1. Sample text positions from a canvas
  const { targetPositions, randomPositions } = useMemo(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 100;
    canvas.height = 100;

    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 50, 50);

    const imageData = ctx.getImageData(0, 0, 100, 100).data;
    const targets: number[] = [];
    const randoms: number[] = [];

    for (let y = 0; y < 100; y++) {
      for (let x = 0; x < 100; x++) {
        const alpha = imageData[(y * 100 + x) * 4 + 3];
        if (alpha > 128) {
          // Map 0-100 to -5 to 5
          targets.push((x - 50) * 0.1, (50 - y) * 0.1, 0);
          randoms.push((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
        }
      }
    }

    return {
      targetPositions: new Float32Array(targets),
      randomPositions: new Float32Array(randoms),
    };
  }, [text]);

  const uniforms = useMemo(() => ({
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#4DFFFF') }, // Slightly more vibrant cyan
    uOpacity: { value: 0 },
  }), []);

  useFrame((state) => {
    const { clock } = state;
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      // Reveal in the first 20% of scroll, then fade out by 40%
      const progress = Math.min(1, scrollProgress * 5);
      const opacity = progress < 1 ? progress : Math.max(0, 1 - (scrollProgress - 0.2) * 5);

      material.uniforms.uProgress.value = progress;
      material.uniforms.uTime.value = clock.getElapsedTime();
      material.uniforms.uOpacity.value = opacity;
    }
  });

  return (
    <points ref={pointsRef} scale={[1.5, 1.5, 1.5]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={targetPositions.length / 3}
          array={targetPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-randomPos"
          count={randomPositions.length / 3}
          array={randomPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          uniform float uProgress;
          uniform float uTime;
          attribute vec3 randomPos;
          varying float vOpacity;

          void main() {
            vec3 targetPos = position;

            // Add a cinematic swirl effect during transition
            float angle = uTime * 0.3 + length(randomPos) * 0.5;
            float s = sin(angle);
            float c = cos(angle);
            mat3 rotation = mat3(
              c, 0, s,
              0, 1, 0,
              -s, 0, c
            );

            vec3 morphedPos = mix(rotation * randomPos, targetPos, uProgress);

            // Organic floaty motion
            morphedPos.x += sin(uTime * 0.5 + position.y) * 0.05 * (1.0 - uProgress);
            morphedPos.y += cos(uTime * 0.5 + position.x) * 0.05 * (1.0 - uProgress);

            vec4 mvPosition = modelViewMatrix * vec4(morphedPos, 1.0);
            gl_PointSize = (2.0 + uProgress * 2.0) * (1.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;

            vOpacity = uProgress;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uOpacity;
          varying float vOpacity;

          void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;

            float alpha = smoothstep(0.5, 0.0, dist) * vOpacity * uOpacity;
            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </points>
  );
};
