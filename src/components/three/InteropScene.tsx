'use client';

import { Suspense, useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Environment, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Animated node representing an "interop" connection point
function InteropNode({ 
  position, 
  color, 
  scale = 1,
  onFlash 
}: { 
  position: [number, number, number]; 
  color: string; 
  scale?: number;
  onFlash?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashIntensity, setFlashIntensity] = useState(0);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      // Handle flash animation
      if (isFlashing) {
        setFlashIntensity((prev) => {
          const newIntensity = prev - delta * 3;
          if (newIntensity <= 0) {
            setIsFlashing(false);
            return 0;
          }
          return newIntensity;
        });
      }
    }
  });

  const handleClick = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setIsFlashing(true);
    setFlashIntensity(1);
    onFlash?.();
  }, [onFlash]);

  // Calculate emissive color based on flash intensity
  const emissiveColor = useMemo(() => new THREE.Color(color), [color]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere 
        ref={meshRef} 
        args={[0.5 * scale, 32, 32]} 
        position={position}
        onClick={handleClick}
      >
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive={emissiveColor}
          emissiveIntensity={flashIntensity * 2}
        />
      </Sphere>
      {/* Flash light effect */}
      {isFlashing && (
        <pointLight
          position={position}
          color={color}
          intensity={flashIntensity * 5}
          distance={3}
          decay={2}
        />
      )}
    </Float>
  );
}

// Connecting lines between nodes
function ConnectionLines({ nodes }: { nodes: [number, number, number][] }) {
  const lineRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    
    // Create connections between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.sqrt(
          Math.pow(nodes[i][0] - nodes[j][0], 2) +
          Math.pow(nodes[i][1] - nodes[j][1], 2) +
          Math.pow(nodes[i][2] - nodes[j][2], 2)
        );
        if (dist < 4) {
          positions.push(...nodes[i], ...nodes[j]);
        }
      }
    }
    
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [nodes]);

  useFrame((state) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#6366f1" transparent opacity={0.3} />
    </lineSegments>
  );
}

// Particle field for depth
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial size={0.02} color="#8b5cf6" transparent opacity={0.6} />
    </points>
  );
}

// Main scene component
function Scene() {
  // Node positions for the "constellation"
  const nodes: [number, number, number][] = useMemo(
    () => [
      [-3, 1.5, 0],
      [-1.5, -1, 1],
      [0, 2, -1],
      [1.5, 0, 0.5],
      [3, 1, -0.5],
      [-2, -1.5, -1],
      [2, -1.5, 0.5],
      [0, -0.5, 1.5],
    ],
    []
  );

  const colors = [
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#a855f7', // Purple
    '#d946ef', // Fuchsia
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
    '#d946ef',
  ];

  // Stable scales - computed once per node
  const scales = useMemo(
    () => nodes.map(() => 0.6 + Math.random() * 0.4),
    [nodes]
  );

  return (
    <>
      {/* Orbit controls for drag rotation */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        autoRotate
        autoRotateSpeed={0.3}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI - Math.PI / 4}
      />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
      
      {/* Background stars */}
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      
      {/* Interop nodes */}
      {nodes.map((pos, i) => (
        <InteropNode
          key={i}
          position={pos}
          color={colors[i]}
          scale={scales[i]}
        />
      ))}
      
      {/* Connection lines */}
      <ConnectionLines nodes={nodes} />
      
      {/* Particle field */}
      <ParticleField />
      
      {/* Environment for reflections */}
      <Environment preset="night" />
    </>
  );
}

// Fallback component
function FallbackGradient() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent-primary/10" />
  );
}

// Main export with controls
interface InteropSceneProps {
  enabled?: boolean;
}

export default function InteropScene({ enabled = true }: InteropSceneProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Don't render Three.js if disabled or reduced motion preferred
  if (!isClient || !enabled || prefersReducedMotion) {
    return <FallbackGradient />;
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Suspense fallback={<FallbackGradient />}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}

