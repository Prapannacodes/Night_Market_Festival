import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  PerspectiveCamera,
  Environment,
  Float,
  ContactShadows
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { LiquidSphereVertexShader, LiquidSphereFragmentShader } from './shaders/liquidSphere';
import { ParticleText } from './ParticleText';

// --- Shared Shader Component ---
const MorphingCore = ({ scrollProgress }: { scrollProgress: number }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uCursor: { value: new THREE.Vector3(0, 0, 0) },
    uScroll: { value: 0 },
    uState: { value: 0 },
  }), []);

  useFrame((state) => {
    const { clock, mouse } = state;
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    if (!material) return;
    material.uniforms.uTime.value = clock.getElapsedTime();
    material.uniforms.uScroll.value = scrollProgress;
    material.uniforms.uCursor.value.set(mouse.x * 2, mouse.y * 2, 0);

    meshRef.current.rotation.y += 0.005;
  });

  const opacity = Math.max(0, 1 - scrollProgress * 3);

  return (
    <mesh ref={meshRef} scale={[1 + scrollProgress * 2, 1 + scrollProgress * 2, 1 + scrollProgress * 2]}>
      <sphereGeometry args={[1.5, 128, 128]} />
      <shaderMaterial
        vertexShader={LiquidSphereVertexShader}
        fragmentShader={LiquidSphereFragmentShader}
        uniforms={uniforms}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
};

// --- Fragmented Grid (Showcase) ---
const FragmentGrid = ({ scrollProgress }: { scrollProgress: number }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const count = 20;
  const fragments = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      pos: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
      rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = t * 0.1;
  });

  const opacity = Math.max(0, Math.min(1, (scrollProgress - 0.3) * 5));

  return (
    <group ref={groupRef}>
      {fragments.map((f, i) => (
        <mesh key={i} position={f.pos as any} rotation={f.rot as any}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#00F0FF" transparent opacity={opacity * 0.5} />
        </mesh>
      ))}
    </group>
  );
};

// --- Neural Network (Technology) ---
const NeuralNetwork = ({ scrollProgress }: { scrollProgress: number }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const count = 50;
  const points = useMemo(() => {
    return Array.from({ length: count }).map(() => new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8));
  }, []);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.z += 0.001;
  });

  const opacity = Math.max(0, Math.min(1, (scrollProgress - 0.5) * 5));

  return (
    <group ref={groupRef}>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#00F0FF" emissiveIntensity={2} transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
};

// --- Gravity Field (Experiment) ---
const GravityField = ({ scrollProgress }: { scrollProgress: number }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 3000;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) p[i] = (Math.random() - 0.5) * 15;
    return p;
  }, []);

  useFrame(() => {
    if (pointsRef.current) pointsRef.current.rotation.y += 0.002;
  });

  const opacity = Math.max(0, Math.min(1, (scrollProgress - 0.7) * 5));

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          {...({
            attach: "attributes-position",
            count: count,
            array: positions,
            itemSize: 3,
          } as any)}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#00F0FF" transparent opacity={opacity * 0.4} />
    </points>
  );
};

export const World = ({ scrollProgress }: { scrollProgress: number }) => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 void-overlay z-10" />
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <MorphingCore scrollProgress={scrollProgress} />
        </Float>

        <ParticleText text="DIGITAL VOID" scrollProgress={scrollProgress} />
        <FragmentGrid scrollProgress={scrollProgress} />
        <NeuralNetwork scrollProgress={scrollProgress} />
        <GravityField scrollProgress={scrollProgress} />

        <Environment preset="city" />

        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.1} mipmapBlur />
          <ChromaticAberration offset={0.001} />
        </EffectComposer>

        <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={20} blur={2} far={10} />
      </Canvas>
    </div>
  );
};
