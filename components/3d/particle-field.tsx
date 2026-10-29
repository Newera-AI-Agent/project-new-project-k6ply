'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

interface ParticleFieldProps {
  quality: 'low' | 'medium' | 'high';
}

// Particle behaviors
const BEHAVIORS = [
  { name: 'Flow', id: 0 },
  { name: 'Orbit', id: 1 },
  { name: 'Explosion', id: 2 },
  { name: 'Morph', id: 3 },
] as const;

// Vertex shader for GPU particle simulation
const particleVertexShader = `\n  attribute float particleId;
  attribute vec3 startPosition;
  attribute vec3 velocity;
  attribute float life;
  attribute float delay;
  
  uniform float uTime;
  uniform float uBehavior;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  uniform bool uPaused;
  
  varying float vLife;
  varying float vParticleId;
  varying vec3 vPosition;
  
  // Noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  vec3 curlNoise(vec3 p) {
    const float e = 0.1;
    vec3 dx = vec3(e, 0.0, 0.0);
    vec3 dy = vec3(0.0, e, 0.0);
    vec3 dz = vec3(0.0, 0.0, e);
    
    float x = snoise(p + dx) - snoise(p - dx);
    float y = snoise(p + dy) - snoise(p - dy);
    float z = snoise(p + dz) - snoise(p - dz);
    
    return vec3(y - z, z - x, x - y);
  }
  
  void main() {
    vParticleId = particleId;
    vLife = life;
    
    float t = uPaused ? 0.0 : uTime;
    float localTime = max(0.0, t - delay);
    
    vec3 pos = startPosition;
    
    if (uBehavior == 0.0) { // Flow
      vec3 noise = curlNoise(pos * 0.5 + t * 0.3);
      pos += noise * localTime * 0.5;
      pos.y += sin(localTime * 2.0 + particleId * 10.0) * 0.5;
    } else if (uBehavior == 1.0) { // Orbit
      float angle = localTime * 0.5 + particleId * 6.28;
      float radius = length(startPosition) * 0.5 + 2.0;
      pos.x = cos(angle) * radius;
      pos.z = sin(angle) * radius;
      pos.y += sin(localTime * 3.0 + particleId) * 0.3;
    } else if (uBehavior == 2.0) { // Explosion
      pos += velocity * localTime * 5.0;
      pos.y -= localTime * localTime * 2.0; // gravity
      if (localTime > life) {
        pos = startPosition;
      }
    } else if (uBehavior == 3.0) { // Morph
      vec3 target1 = vec3(sin(particleId * 10.0), cos(particleId * 10.0), 0.0) * 5.0;
      vec3 target2 = vec3(cos(particleId * 10.0), sin(particleId * 10.0), 0.0) * 5.0;
      float morph = sin(t * 0.5) * 0.5 + 0.5;
      pos = mix(target1, target2, morph);
      pos += curlNoise(pos * 0.3 + t * 0.2) * 0.5;
    }
    
    // Mouse interaction
    vec3 toMouse = uMouse - pos;
    float dist = length(toMouse);
    if (dist < 5.0 && uMouseStrength > 0.0) {
      pos += normalize(toMouse) * uMouseStrength * (5.0 - dist) * 0.1;
    }
    
    vPosition = pos;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (50.0 / -mvPosition.z) * (1.0 - localTime / max(life, 1.0)) * (quality == 2 ? 2.0 : quality == 1 ? 1.5 : 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `\n  varying float vLife;
  varying float vParticleId;
  varying vec3 vPosition;
  
  uniform float uTime;
  uniform bool uColorMode;
  
  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    
    vec3 color;
    if (uColorMode) {
      // Rainbow mode
      float hue = mod(vParticleId * 0.1 + uTime * 0.1, 1.0);
      vec3 hsv = vec3(hue, 0.8, 1.0);
      vec3 rgb = clamp(abs(mod(hsv.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
      color = hsv.z - hsv.y * (hsv.z - rgb) * hsv.x;
      color = mix(color, vec3(1.0), 0.3);
    } else {
      // Primary accent mode
      float intensity = smoothstep(0.0, 1.0, vPosition.y / 5.0);
      color = mix(vec3(0.2, 0.5, 0.0), vec3(0.78, 1.0, 0.0), intensity);
    }
    
    gl_FragColor = vec4(color, alpha * 0.8);
  }
`;

const PARTICLE_COUNT = {
  low: 5000,
  medium: 15000,
  high: 30000,
};

export function ParticleField({ quality }: ParticleFieldProps) {
  const count = PARTICLE_COUNT[quality];
  const [behavior, setBehavior] = useState(0);
  const [paused, setPaused] = useState(false);
  const [colorMode, setColorMode] = useState(false);
  const [mousePos, setMousePos] = useState(new THREE.Vector3());
  const [mouseStrength, setMouseStrength] = useState(0);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const life = new Float32Array(count);
    const delay = new Float32Array(count);
    const particleId = new Float32Array(count);
    const startPosition = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const radius = 5 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      startPosition[i * 3] = x;
      startPosition[i * 3 + 1] = y;
      startPosition[i * 3 + 2] = z;
      
      velocities[i * 3] = (Math.random() - 0.5) * 2;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 2;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 2;
      
      life[i] = 5 + Math.random() * 10;
      delay[i] = Math.random() * 5;
      particleId[i] = i;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geo.setAttribute('life', new THREE.BufferAttribute(life, 1));
    geo.setAttribute('delay', new THREE.BufferAttribute(delay, 1));
    geo.setAttribute('particleId', new THREE.BufferAttribute(particleId, 1));
    geo.setAttribute('startPosition', new THREE.BufferAttribute(startPosition, 3));
    
    return geo;
  }, [count]);
  
  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uBehavior: { value: 0 },
      uMouse: { value: new THREE.Vector3() },
      uMouseStrength: { value: 0 },
      uPaused: { value: false },
      uColorMode: { value: false },
    },
  }), []);
  
  const pointsRef = useRef<THREE.Points>(null);
  const { camera, size } = useThree();
  
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    material.uniforms.uTime.value = state.clock.getElapsedTime();
    material.uniforms.uBehavior.value = behavior;
    material.uniforms.uMouse.value = mousePos;
    material.uniforms.uMouseStrength.value = mouseStrength;
    material.uniforms.uPaused.value = paused;
    material.uniforms.uColorMode.value = colorMode;
  });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      const vector = new THREE.Vector3(x, y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));
      
      mousePos.copy(pos);
      setMouseStrength(1);
    };
    
    const handleMouseLeave = () => {
      setMouseStrength(0);
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '4') {
        setBehavior(parseInt(e.key) - 1);
      } else if (e.key === ' ') {
        setPaused(p => !p);
      } else if (e.key.toLowerCase() === 'c') {
        setColorMode(c => !c);
      } else if (e.key.toLowerCase() === 'r') {
        // Randomize - recreate geometry
        window.dispatchEvent(new CustomEvent('reset-particles'));
      }
    };
    
    const canvas = document.querySelector('canvas');
    canvas?.addEventListener('mousemove', handleMouseMove);
    canvas?.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      canvas?.removeEventListener('mousemove', handleMouseMove);
      canvas?.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [camera]);
  
  return (
    <>
      <points ref={pointsRef} geometry={geometry} material={material} />
    </>
  );
}
