'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Minimal Three.js canvas for hero - single rotating wireframe shape
// No post-processing, no heavy shaders, minimal bundle impact

export function CanvasHero() {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const meshRef = useRef<THREE.Mesh>();
  const timeRef = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer - alpha for transparency, antialias for quality
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x for perf
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Geometry - simple icosahedron wireframe
    const geometry = new THREE.IcosahedronGeometry(1.2, 0);
    const material = new THREE.MeshBasicMaterial({
      color: 0xC8FF00,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    // Add a subtle inner glow sphere
    const innerGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0xC8FF00,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);

    // Animation loop
    const animate = (timestamp: number) => {
      animationRef.current = requestAnimationFrame(animate);
      
      const elapsed = timestamp * 0.0003;
      timeRef.current = elapsed;

      if (meshRef.current) {
        meshRef.current.rotation.x = elapsed * 0.15;
        meshRef.current.rotation.y = elapsed * 0.1;
        meshRef.current.rotation.z = elapsed * 0.05;
      }

      if (innerMesh) {
        innerMesh.rotation.x = -elapsed * 0.1;
        innerMesh.rotation.y = elapsed * 0.08;
      }

      renderer.render(scene, camera);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Resize handler
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
