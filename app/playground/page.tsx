'use client';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamic imports for heavy 3D components (client-side only)
const ParticleField = dynamic(() => import('@/components/3d/particle-field').then(m => m.ParticleField), { ssr: false, loading: () => <CanvasPlaceholder /> });
const ShaderPlayground = dynamic(() => import('@/components/3d/shader-playground').then(m => m.ShaderPlayground), { ssr: false, loading: () => <CanvasPlaceholder /> });
const GeometryPlayground = dynamic(() => import('@/components/3d/geometry-playground').then(m => m.GeometryPlayground), { ssr: false, loading: () => <CanvasPlaceholder /> });

function CanvasPlaceholder() {
  return (
    <div className="relative aspect-video bg-surface-overlay border border-surface-border rounded-2xl flex items-center justify-center overflow-hidden">
      <div className="text-center p-8">
        <div className="w-12 h-12 border-2 border-primary-accent/30 border-t-primary-accent rounded-full animate-spin mx-auto mb-4" />
        <p className="body text-text-secondary">Loading WebGL...</p>
      </div>
    </div>
  );
}

interface Demo {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType;
  tags: string[];
}

export const metadata: Metadata = {
  title: '3D Playground — Naman Soni',
  description: 'Interactive WebGL experiments: particle fields, custom shaders, and generative geometry. Built with Three.js and React Three Fiber.',
  openGraph: {
    title: '3D Playground — Naman Soni',
    description: 'Interactive WebGL experiments: particle fields, custom shaders, and generative geometry.',
    type: 'website',
  },
};

export default function PlaygroundPage() {
  const [activeDemo, setActiveDemo] = useState<string>('particles');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [showInfo, setShowInfo] = useState(true);

  const demos: Demo[] = [
    {
      id: 'particles',
      title: 'Particle Field',
      description: '10,000+ particles with GPU-accelerated simulation. Mouse interaction creates gravitational forces. Press keys 1-4 for different behaviors.',
      component: ParticleField,
      tags: ['GPU Compute', 'Instancing', 'Interactive'],
    },
    {
      id: 'shaders',
      title: 'Shader Playground',
      description: 'Real-time GLSL shader editor. Modify fragment shader code and see instant results. Includes SDF primitives, noise, and animation uniforms.',
      component: ShaderPlayground,
      tags: ['GLSL', 'Live Coding', 'SDF/Raymarching'],
    },
    {
      id: 'geometry',
      title: 'Generative Geometry',
      description: 'Procedural mesh generation with geometry nodes-inspired controls. Morph between forms, adjust subdivision, and export geometry.',
      component: GeometryPlayground,
      tags: ['Procedural', 'Geometry Nodes', 'Export'], 
    },
  ];

  const currentDemo = demos.find(d => d.id === activeDemo)!;

  return (
    <section id="playground" className="section min-h-screen" aria-labelledby="playground-heading">
      <div className="container">
        {/* Header */}
        <header className="mb-12">
          <span className="caption text-primary-accent mb-4" style={{ letterSpacing: '0.1em' }}>
            08 / Playground
          </span>
          <h1 id="playground-heading" className="display-lg text-primary mb-4">
            3D Playground
          </h1>
          <p className="body-lg text-text-secondary max-w-2xl">
            Interactive WebGL experiments running in your browser. Each demo showcases a different technique — particle systems, shader programming, and procedural geometry. All built with Three.js.
          </p>
        </header>

        {/* Demo Selector */}
        <div className="flex flex-wrap gap-3 mb-8" role="tablist" aria-label="Select 3D demo">
          {demos.map((demo) => (
            <button
              key={demo.id}
              role="tab"
              aria-selected={activeDemo === demo.id}
              aria-controls={`panel-${demo.id}`}
              id={`tab-${demo.id}`}
              onClick={() => setActiveDemo(demo.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 
                ${activeDemo === demo.id 
                  ? 'bg-primary-accent text-surface font-semibold shadow-[0_0_20px_rgba(200,255,0,0.3)]' 
                  : 'bg-surface-overlay border border-surface-border text-text-secondary hover:border-primary-accent/50 hover:text-primary' }}
              >
                {demo.title}
                {demo.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-primary-accent/10 text-primary-accent/80">
                    {tag}
                  </span>
                ))}
              </button>
            ))}
        </div>

        {/* Quality Selector */}
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="caption text-text-muted">Quality:</span>
            <div className="flex bg-surface-overlay border border-surface-border rounded-lg p-1" role="radiogroup" aria-label="Rendering quality">
              {['low', 'medium', 'high'].map(q => (
                <button
                  key={q}
                  role="radio"
                  aria-checked={quality === q}
                  onClick={() => setQuality(q)}
                  className={`px-3 py-1.5 rounded-md text-sm font-mono transition-colors
                    ${quality === q
                      ? 'bg-primary-accent text-surface font-semibold'
                      : 'text-text-secondary hover:text-primary'}
                  `}
                >
                  {q.charAt(0).toUpperCase() + q.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="btn btn-ghost ml-auto"
            aria-expanded={showInfo}
            aria-controls="demo-info"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            {showInfo ? 'Hide Info' : 'Show Info'}
          </button>
        </div>

        {/* Demo Panel */}
        <div id="demo-panel" role="tabpanel" aria-labelledby={`tab-${activeDemo}`} className="mb-12">
          <div className="aspect-video md:aspect-[4/3] lg:aspect-[16/9] rounded-2xl overflow-hidden bg-surface border border-surface-border">
            <currentDemo.component quality={quality} />
          </div>
        </div>

        {/* Demo Info */}
        <div
          id="demo-info"
          className={`card p-6 transition-all duration-300 overflow-hidden ${showInfo ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 mb-0 pt-0 pb-0'}`}
          aria-hidden={!showInfo}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="heading-md text-primary mb-2">{currentDemo.title}</h3>
              <p className="body text-text-secondary">{currentDemo.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentDemo.tags.map(tag => (
                <span key={tag} className="caption px-3 py-1 bg-surface-overlay border border-surface-border rounded-full text-text-secondary">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Controls Help */}
          <div className="mt-6 pt-6 border-t border-surface-border grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeDemo === 'particles' && (
              <>
                <div className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg">
                  <kbd className="px-2 py-1 bg-surface border border-surface-border rounded text-primary-accent font-mono text-sm">1-4</kbd>
                  <span className="body-sm text-text-secondary">Switch behavior modes</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg">
                  <kbd className="px-2 py-1 bg-surface border border-surface-border rounded text-primary-accent font-mono text-sm">Mouse</kbd>
                  <span className="body-sm text-text-secondary">Attract/repel particles</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg">
                  <kbd className="px-2 py-1 bg-surface border border-surface-border rounded text-primary-accent font-mono text-sm">Space</kbd>
                  <span className="body-sm text-text-secondary">Reset simulation</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg">
                  <kbd className="px-2 py-1 bg-surface border border-surface-border rounded text-primary-accent font-mono text-sm">P</kbd>
                  <span className="body-sm text-text-secondary">Pause/Resume</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg">
                  <kbd className="px-2 py-1 bg-surface border border-surface-border rounded text-primary-accent font-mono text-sm">C</kbd>
                  <span className="body-sm text-text-secondary">Toggle color mode</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg">
                  <kbd className="px-2 py-1 bg-surface border border-surface-border rounded text-primary-accent font-mono text-sm">R</kbd>
                  <span className="body-sm text-text-secondary">Randomize positions</span>
                </div>
              </>
            )}
            {activeDemo === 'shaders' && (
              <>
                <div className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg">
                  <kbd className="px-2 py-1 bg-surface border border-surface-border rounded text-primary-accent font-mono text-sm">Ctrl+Enter</kbd>
                  <span className="body-sm text-text-secondary">Compile shader</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg">
                  <kbd className="px-2 py-1 bg-surface border border-surface-border rounded text-primary-accent font-mono text-sm">Escape</kbd>
                  <span className="body-sm text-text-secondary">Blur editor</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg">
                  <span className="body-sm text-text-secondary">Uniforms: <code className="font-mono text-primary-accent">uTime, uResolution, uMouse</code></span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg">
                  <span className="body-sm text-text-secondary">Built-ins: <code className="font-mono text-primary-accent">sdSphere, sdBox, noise, fbm</code></span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg">
                  <span className="body-sm text-text-secondary">Click line numbers to toggle breakpoints</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg">
                  <span className="body-sm text-text-secondary">Error line highlighted in red</span>
                </div>
              </>
            )}
            {activeDemo === 'geometry' && (
              <>
                <div className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg">
                  <kbd className="px-2 py-1 bg-surface border border-surface-border rounded text-primary-accent font-mono text-sm">1-5</kbd>
                  <span className="body-sm text-text-secondary">Select primitive type</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg">
                  <kbd className="px-2 py-1 bg-surface border border-surface-border rounded text-primary-accent font-mono text-sm">Mouse Drag</kbd>
                  <span className="body-sm text-text-secondary">Rotate view</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg">
                  <kbd className="px-2 py-1 bg-surface border border-surface-border rounded text-primary-accent font-mono text-sm">Scroll</kbd>
                  <span className="body-sm text-text-secondary">Zoom camera</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg">
                  <kbd className="px-2 py-1 bg-surface border border-surface-border rounded text-primary-accent font-mono text-sm">Space</kbd>
                  <span className="body-sm text-text-secondary">Pause animation</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg">
                  <kbd className="px-2 py-1 bg-surface border border-surface-border rounded text-primary-accent font-mono text-sm">E</kbd>
                  <span className="body-sm text-text-secondary">Export GLTF</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-overlay rounded-lg">
                  <kbd className="px-2 py-1 bg-surface border border-surface-border rounded text-primary-accent font-mono text-sm">W</kbd>
                  <span className="body-sm text-text-secondary">Toggle wireframe</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Technical Details */}
        <details className="card p-6 mt-8" style={{ background: 'linear-gradient(135deg, var(--card) 0%, var(--card-hover) 100%)' }}>
          <summary className="heading-sm text-primary cursor-pointer flex items-center justify-between">
            Technical Details
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </summary>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div>
              <h4 className="heading-sm text-primary-accent mb-3">Performance</h4>
              <ul className="space-y-2 text-text-secondary body-sm">
                <li>• Instanced rendering for 10k+ objects</li>
                <li>• GPU particle simulation via compute shaders</li>
                <li>• Frustum culling & LOD for geometry</li>
                <li>• Pixel ratio capped at 2x for perf</li>
                <li>• RequestAnimationFrame with delta time</li>
              </ul>
            </div>
            <div>
              <h4 className="heading-sm text-primary-accent mb-3">Tech Stack</h4>
              <ul className="space-y-2 text-text-secondary body-sm">
                <li>• Three.js r160+ (ESM)</li>
                <li>• React Three Fiber v8</li>
                <li>• Drei helpers & controls</li>
                <li>• GLSL shaders (ES modules)</li>
                <li>• TypeScript strict mode</li>
              </ul>
            </div>
            <div>
              <h4 className="heading-sm text-primary-accent mb-3">Accessibility</h4>
              <ul className="space-y-2 text-text-secondary body-sm">
                <li>• Respects prefers-reduced-motion</li>
                <li>• Keyboard operable controls</li>
                <li>• ARIA labels on all interactive elements</li>
                <li>• High contrast mode support</li>
                <li>• Focus visible outlines</li>
              </ul>
            </div>
          </div>
        </details>
      </div>

      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}
