'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface GeometryPlaygroundProps {
  quality: 'low' | 'medium' | 'high';
}

const PRIMITIVES = [
  { id: 0, name: 'Torus Knot', params: { radius: 1.5, tube: 0.5, tubularSegments: 64, radialSegments: 12, p: 2, q: 3 } },
  { id: 1, name: 'Icosahedron', params: { radius: 1.5, detail: 2 } },
  { id: 2, name: 'Dodecahedron', params: { radius: 1.5, detail: 1 } },
  { id: 3, name: 'Octahedron', params: { radius: 1.5, detail: 2 } },
  { id: 4, name: 'Tetrahedron', params: { radius: 1.5, detail: 2 } },
] as const;

// Geometry modifiers
function applyTwist(geometry: THREE.BufferGeometry, amount: number) {
  const pos = geometry.attributes.position;
  const newPos = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const angle = z * amount;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    newPos[i * 3] = x * c - y * s;
    newPos[i * 3 + 1] = x * s + y * c;
    newPos[i * 3 + 2] = z;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(newPos, 3));
  geometry.computeVertexNormals();
}

function applyTaper(geometry: THREE.BufferGeometry, amount: number) {
  const pos = geometry.attributes.position;
  const newPos = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const scale = 1.0 + z * amount;
    newPos[i * 3] = x * scale;
    newPos[i * 3 + 1] = y * scale;
    newPos[i * 3 + 2] = z;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(newPos, 3));
  geometry.computeVertexNormals();
}

function applyNoise(geometry: THREE.BufferGeometry, amount: number, scale: number, time: number) {
  const pos = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  const newPos = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const nx = normal.getX(i);
    const ny = normal.getY(i);
    const nz = normal.getZ(i);
    
    // Simple noise approximation
    const noise = Math.sin(x * scale + time) * Math.cos(y * scale + time) * Math.sin(z * scale + time);
    
    newPos[i * 3] = x + nx * noise * amount;
    newPos[i * 3 + 1] = y + ny * noise * amount;
    newPos[i * 3 + 2] = z + nz * noise * amount;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(newPos, 3));
  geometry.computeVertexNormals();
}

function applySubdivision(geometry: THREE.BufferGeometry, levels: number) {
  // Simple subdivision - just increase segments for parametric geometries
  // For a real implementation, would use SubdivisionModifier
  return geometry;
}

export function GeometryPlayground({ quality }: GeometryPlaygroundProps) {
  const [primitiveIndex, setPrimitiveIndex] = useState(0);
  const [wireframe, setWireframe] = useState(false);
  const [paused, setPaused] = useState(false);
  const [twist, setTwist] = useState(0);
  const [taper, setTaper] = useState(0);
  const [noiseAmount, setNoiseAmount] = useState(0);
  const [noiseScale, setNoiseScale] = useState(5);
  const [subdivision, setSubdivision] = useState(0);
  const [colorMode, setColorMode] = useState(0); // 0: normal, 1: matcap, 2: wireframe color
  
  const meshRef = useRef<THREE.Mesh>();
  const baseGeometryRef = useRef<THREE.BufferGeometry>();
  const { camera, scene, gl } = useThree();
  
  // Create base geometry
  const createBaseGeometry = () => {
    const prim = PRIMITIVES[primitiveIndex];
    let geo: THREE.BufferGeometry;
    
    switch (prim.name) {
      case 'Torus Knot':
        geo = new THREE.TorusKnotGeometry(
          prim.params.radius,
          prim.params.tube,
          prim.params.tubularSegments,
          prim.params.radialSegments,
          prim.params.p,
          prim.params.q
        );
        break;
      case 'Icosahedron':
        geo = new THREE.IcosahedronGeometry(prim.params.radius, prim.params.detail);
        break;
      case 'Dodecahedron':
        geo = new THREE.DodecahedronGeometry(prim.params.radius, prim.params.detail);
        break;
      case 'Octahedron':
        geo = new THREE.OctahedronGeometry(prim.params.radius, prim.params.detail);
        break;
      case 'Tetrahedron':
        geo = new THREE.TetrahedronGeometry(prim.params.radius, prim.params.detail);
        break;
      default:
        geo = new THREE.IcosahedronGeometry(1.5, 2);
    }
    
    return geo;
  };
  
  const baseGeometry = useMemo(() => createBaseGeometry(), [primitiveIndex]);
  
  // Update geometry with modifiers
  useEffect(() => {
    if (!meshRef.current) return;
    
    // Clone base geometry
    const geo = baseGeometry.clone();
    baseGeometryRef.current = geo;
    
    // Apply modifiers
    if (twist !== 0) applyTwist(geo, twist);
    if (taper !== 0) applyTaper(geo, taper);
    if (noiseAmount !== 0) applyNoise(geo, noiseAmount, noiseScale, 0);
    
    meshRef.current.geometry.dispose();
    meshRef.current.geometry = geo;
  }, [baseGeometry, twist, taper, noiseAmount, noiseScale, subdivision]);
  
  // Materials
  const material = useMemo(() => {
    const mats = [
      // Normal material with custom shader
      new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.3,
        roughness: 0.4,
        wireframe: false,
        flatShading: false,
      }),
      // Matcap-style
      new THREE.MeshMatcapMaterial({
        color: 0xC8FF00,
      }),
      // Wireframe
      new THREE.MeshBasicMaterial({
        color: 0xC8FF00,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
      }),
    ];
    return mats[colorMode];
  }, [colorMode, wireframe]);
  
  // Animation
  useFrame((state) => {
    if (paused || !meshRef.current) return;
    
    const t = state.clock.getElapsedTime();
    
    // Rotate
    meshRef.current.rotation.x = t * 0.1;
    meshRef.current.rotation.y = t * 0.15;
    
    // Animate noise
    if (noiseAmount > 0 && baseGeometryRef.current) {
      const geo = meshRef.current.geometry as THREE.BufferGeometry;
      const baseGeo = baseGeometryRef.current;
      
      // Re-apply noise with time
      const pos = geo.attributes.position;
      const basePos = baseGeo.attributes.position;
      const normal = geo.attributes.normal;
      const newPos = new Float32Array(pos.count * 3);
      
      for (let i = 0; i < pos.count; i++) {
        const x = basePos.getX(i);
        const y = basePos.getY(i);
        const z = basePos.getZ(i);
        const nx = normal.getX(i);
        const ny = normal.getY(i);
        const nz = normal.getZ(i);
        
        const noise = Math.sin(x * noiseScale + t) * Math.cos(y * noiseScale + t) * Math.sin(z * noiseScale + t);
        
        newPos[i * 3] = x + nx * noise * noiseAmount;
        newPos[i * 3 + 1] = y + ny * noise * noiseAmount;
        newPos[i * 3 + 2] = z + nz * noise * noiseAmount;
      }
      
      geo.setAttribute('position', new THREE.BufferAttribute(newPos, 3));
      geo.computeVertexNormals();
      geo.attributes.position.needsUpdate = true;
      geo.attributes.normal.needsUpdate = true;
    }
  });
  
  // Export GLTF
  const exportGLTF = async () => {
    if (!meshRef.current) return;
    
    const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');
    const exporter = new GLTFExporter();
    
    exporter.parse(
      meshRef.current,
      (gltf) => {
        const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `geometry-${PRIMITIVES[primitiveIndex].name.toLowerCase().replace(' ', '-')}.gltf`;
        a.click();
        URL.revokeObjectURL(url);
      },
      { binary: false }
    );
  };
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '5') {
        setPrimitiveIndex(parseInt(e.key) - 1);
      } else if (e.key === ' ') {
        setPaused(p => !p);
      } else if (e.key.toLowerCase() === 'w') {
        setWireframe(w => !w);
      } else if (e.key.toLowerCase() === 'e') {
        exportGLTF();
      } else if (e.key.toLowerCase() === 'm') {
        setColorMode(c => (c + 1) % 3);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [exportGLTF]);
  
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7]} intensity={1.5} castShadow>
        <OrthographicCameraHelper />
      </directionalLight>
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <pointLight position={[0, 3, 3]} color={0xC8FF00} intensity={0.5} />
      <pointLight position={[0, -3, -3]} color={0x0080FF} intensity={0.3} />
      
      {/* Mesh */}
      <mesh ref={meshRef} geometry={baseGeometry} material={material} castShadow receiveShadow />
      
      {/* Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={20}
        autoRotate={!paused}
        autoRotateSpeed={0.5}
      />
      
      {/* UI Panel */}
      <div className="absolute inset-0 flex" style={{ zIndex: 10, pointerEvents: 'none' }}>{
        <div className="w-72 h-full bg-surface/95 backdrop-blur-sm border-l border-surface-border flex flex-col p-4 overflow-auto" style={{ pointerEvents: 'auto' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="heading-sm text-primary">Controls</h3>
            <button onClick={exportGLTF} className="btn btn-ghost btn-sm" title="Export GLTF (E)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
          </div>
          
          {/* Primitive Selector */}
          <div className="mb-4">
            <label className="caption text-text-muted block mb-2">Primitive</label>
            <div className="grid grid-cols-5 gap-1">
              {PRIMITIVES.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setPrimitiveIndex(i)}
                  className={`p-2 rounded-lg text-xs font-mono transition-all
                    ${primitiveIndex === i
                      ? 'bg-primary-accent text-surface font-semibold'
                      : 'bg-surface-overlay text-text-secondary hover:text-primary'}
                  `}
                >
                  {p.name.split(' ').map(w => w[0]).join('')}
                </button>
              ))}
            </div>
          </div>
          
          {/* Modifiers */}
          <div className="space-y-4 mb-4">
            <div>
              <label className="caption text-text-muted block mb-1">Twist: {twist.toFixed(1)}</label>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={twist}
                onChange={(e) => setTwist(parseFloat(e.target.value))}
                className="w-full accent-primary-accent"
              />
            </div>
            <div>
              <label className="caption text-text-muted block mb-1">Taper: {taper.toFixed(1)}</label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.05"
                value={taper}
                onChange={(e) => setTaper(parseFloat(e.target.value))}
                className="w-full accent-primary-accent"
              />
            </div>
            <div>
              <label className="caption text-text-muted block mb-1">Noise Amount: {noiseAmount.toFixed(2)}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={noiseAmount}
                onChange={(e) => setNoiseAmount(parseFloat(e.target.value))}
                className="w-full accent-primary-accent"
              />
            </div>
            <div>
              <label className="caption text-text-muted block mb-1">Noise Scale: {noiseScale.toFixed(0)}</label>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={noiseScale}
                onChange={(e) => setNoiseScale(parseFloat(e.target.value))}
                className="w-full accent-primary-accent"
              />
            </div>
          </div>
          
          {/* Toggles */}
          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={wireframe}
                onChange={(e) => setWireframe(e.target.checked)}
                className="w-4 h-4 accent-primary-accent rounded"
              />
              <span className="body-sm text-text">Wireframe (W)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={paused}
                onChange={(e) => setPaused(e.target.checked)}
                className="w-4 h-4 accent-primary-accent rounded"
              />
              <span className="body-sm text-text">Pause Animation (Space)</span>
            </label>
          </div>
          
          {/* Color Mode */}
          <div className="mb-4">
            <label className="caption text-text-muted block mb-2">Material</label>
            <div className="flex gap-2">
              {['PBR', 'Matcap', 'Wire'].map((m, i) => (
                <button
                  key={m}
                  onClick={() => setColorMode(i)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all
                    ${colorMode === i
                      ? 'bg-primary-accent text-surface'
                      : 'bg-surface-overlay text-text-secondary hover:text-primary'}
                  `}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          
          {/* Shortcuts */}
          <details className="text-text-muted">
            <summary className="caption cursor-pointer mb-2">Keyboard Shortcuts</summary>
            <ul className="body-xs space-y-1 font-mono">
              <li>1-5: Select primitive</li>
              <li>Space: Pause/Resume</li>
              <li>W: Toggle wireframe</li>
              <li>M: Cycle material</li>
              <li>E: Export GLTF</li>
              <li>Drag: Rotate camera</li>
              <li>Scroll: Zoom</li>
            </ul>
          </details>
        </div>
      }</div>
    </>
  );
}
