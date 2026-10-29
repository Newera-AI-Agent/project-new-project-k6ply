'use client';
import { Metadata } from 'next';
import Link from 'next/link';
import { useState } from 'react';

interface CaseStudy {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: '3d' | 'ai' | 'tool' | 'art' | 'web';
  tech: string[];
  github: string;
  demo: string | null;
  images: string[];
  featured: boolean;
  challenges: string[];
  learnings: string[];
  date: string;
  status: 'live' | 'wip' | 'archived';
}

const caseStudies: CaseStudy[] = [
  {
    id: '3dfy',
    title: '3dfy — Browser-Based 3D Model Generator',
    shortDescription: 'Generate 3D models from text prompts directly in the browser using Three.js and WebGL shaders.',
    longDescription: '3dfy is an experimental tool that lets you create 3D models from natural language descriptions. It uses a combination of procedural generation techniques and pre-trained models running via ONNX Runtime Web to generate geometry, materials, and textures entirely client-side. No server required — everything runs in your browser.',
    category: '3d',
    tech: ['Three.js', 'TypeScript', 'ONNX Runtime Web', 'WebGL', 'GLSL', 'Web Workers'],
    github: 'https://github.com/NamanSoni78/3dfy',
    demo: 'https://3dfy.namansoni.in',
    images: ['/case-studies/3dfy-1.jpg', '/case-studies/3dfy-2.jpg', '/case-studies/3dfy-3.jpg'],
    featured: true,
    challenges: [
      'Running ML inference in the browser without WebGPU',
      'Generating watertight manifold geometry from implicit representations',
      'Keeping bundle size under 5MB for fast cold starts',
    ],
    learnings: [
      'ONNX Runtime Web is surprisingly capable for small models',
      'Marching cubes + dual contouring produces better topology than naive approaches',
      'Web Workers are essential for keeping the main thread responsive',
    ],
    date: '2025-01-10',
    status: 'live',
  },
  {
    id: 'local-llm-playground',
    title: 'Local LLM Playground — Tauri + Rust',
    shortDescription: 'A native desktop app for running and comparing local LLMs with a beautiful, minimal interface.',
    longDescription: 'Built to scratch my own itch — I wanted a clean way to test different quantized models locally without dealing with CLI flags or Docker. The app uses Tauri for the native shell, llama.cpp via Rust bindings for inference, and a React frontend. Features model management, chat history, system prompt templates, and benchmarking tools.',
    category: 'ai',
    tech: ['Rust', 'Tauri', 'React', 'llama.cpp', 'TypeScript', 'SQLite'],
    github: 'https://github.com/NamanSoni78/llm-playground',
    demo: null,
    images: ['/case-studies/llm-playground-1.jpg', '/case-studies/llm-playground-2.jpg'],
    featured: true,
    challenges: [
      'Cross-compilation for macOS/Windows/Linux from a single CI pipeline',
      'Managing llama.cpp versions and ABI compatibility',
      'Memory management for 7B+ parameter models on 8GB systems',
    ],
    learnings: [
      'Tauri\'s sidecar pattern makes bundling native binaries trivial',
      'SQLite + WAL mode handles concurrent read/write from Rust and JS',
      'Metal acceleration on macOS makes 7B models viable on M-series',
    ],
    date: '2024-11-15',
    status: 'live',
  },
  {
    id: 'generative-editor',
    title: 'Node-Based Generative Art Editor',
    shortDescription: 'A visual programming environment for creating generative art — connect nodes, tweak parameters, export as code or images.',
    longDescription: 'Inspired by TouchDesigner and Houdini but built for the web. Nodes represent operations (noise, transform, color, blend, export) and edges represent data flow. The editor compiles the graph to GLSL for real-time WebGL preview and can export standalone Three.js scenes or p5.js sketches. Built with React Flow for the graph, Web Workers for compilation, and a custom shader transpiler.',
    category: 'art',
    tech: ['React Flow', 'TypeScript', 'WebGL', 'GLSL', 'Web Workers', 'Zustand'],
    github: 'https://github.com/NamanSoni78/generative-editor',
    demo: 'https://gen.namansoni.in',
    images: ['/case-studies/gen-editor-1.jpg', '/case-studies/gen-editor-2.jpg', '/case-studies/gen-editor-3.jpg', '/case-studies/gen-editor-4.jpg'],
    featured: true,
    challenges: [
      'Cycles detection in the node graph for valid execution order',
      'Transpiling a dynamic node graph to optimized GLSL',
      'Synchronizing Web Worker state with React state',
    ],
    learnings: [
      'Topological sort + memoization makes graph evaluation fast',
      'Shadertoy-style fragment shaders are surprisingly expressive',
      'React Flow\'s internal state is hard to sync with external stores',
    ],
    date: '2024-09-28',
    status: 'wip',
  },
  {
    id: 'browser-agent',
    title: 'Autonomous Browser Agent Framework',
    shortDescription: 'An LLM-driven agent that can navigate, extract, and interact with any website — self-healing selectors and goal-oriented planning.',
    longDescription: 'Traditional scrapers break on layout changes. This agent uses an LLM to plan actions (click, type, scroll, wait), observes the DOM + screenshot, and self-corrects when selectors fail. Built on Playwright with a custom action space. Supports multi-step workflows like "find the cheapest flight to Tokyo next month" or "extract all product prices from this category page".',
    category: 'tool',
    tech: ['TypeScript', 'Playwright', 'OpenAI API', 'Zod', 'Node.js'],
    github: 'https://github.com/NamanSoni78/browser-agent',
    demo: null,
    images: ['/case-studies/browser-agent-1.jpg', '/case-studies/browser-agent-2.jpg'],
    featured: false,
    challenges: [
      'Defining a minimal but expressive action space for the LLM',
      'Handling dynamic content, shadow DOM, and iframe boundaries',
      'Cost optimization — reducing token usage per step',
    ],
    learnings: [
      'Function calling + structured output (Zod) beats prompt engineering',
      'Screenshot + accessibility tree gives better context than DOM alone',
      'Caching successful action sequences dramatically reduces cost',
    ],
    date: '2024-08-20',
    status: 'live',
  },
  {
    id: 'shader-lab',
    title: 'Shader Lab — Live GLSL Playground',
    shortDescription: 'Write, share, and explore fragment shaders with instant hot-reload, uniform controls, and a gallery of community shaders.',
    longDescription: 'A Shadertoy-inspired playground but with a focus on learning. Each uniform gets an auto-generated UI control (sliders, color pickers, texture selectors). Shaders can be forked, versioned, and exported as Three.js materials or raw GLSL. Includes a curated gallery of educational shaders with annotated code explaining the math.',
    category: '3d',
    tech: ['Three.js', 'React', 'TypeScript', 'GLSL', 'Monaco Editor', 'IndexedDB'],
    github: 'https://github.com/NamanSoni78/shader-lab',
    demo: 'https://shaderlab.namansoni.in',
    images: ['/case-studies/shader-lab-1.jpg', '/case-studies/shader-lab-2.jpg'],
    featured: false,
    challenges: [
      'Sandboxing user GLSL to prevent GPU hangs/crashes',
      'Parsing GLSL to extract uniform metadata for auto-UI',
      'IndexedDB for offline-first shader storage',
    ],
    learnings: [
      'WebGL context loss handling is critical for shader experimentation',
      'A simple regex-based uniform parser covers 90% of cases',
      'Compression (lz-string) makes shader sharing via URL viable',
    ],
    date: '2024-07-12',
    status: 'live',
  },
  {
    id: 'dotfiles',
    title: 'My Dotfiles — Declarative Dev Environment',
    shortDescription: 'A Nix + Home Manager configuration for reproducible, version-controlled development environments across machines.',
    longDescription: 'After years of manual setup, I moved to Nix. This repo contains my complete development environment: editors (Neovim, VS Code), shells (fish, zsh), languages (Node, Rust, Go, Python), tools (docker, k9s, fzf, ripgrep), and window management (yabai, skhd). Fully declarative — new machine setup is one command.',
    category: 'tool',
    tech: ['Nix', 'Home Manager', 'Nix-Darwin', 'Fish', 'Neovim'],
    github: 'https://github.com/NamanSoni78/dotfiles',
    demo: null,
    images: ['/case-studies/dotfiles-1.jpg'],
    featured: false,
    challenges: [
      'Learning the Nix language and module system',
      'Managing secrets (API keys, SSH) in a public repo',
      'macOS defaults and launch agents via Nix',
    ],
    learnings: [
      'Nix flakes + inputs pattern makes dependency management clean',
      'sops-nix + age for secrets in public repos',
      'The NixOS Discourse is an incredible resource',
    ],
    date: '2024-06-01',
    status: 'live',
  },
];

const categories = [
  { id: 'all', label: 'All', count: caseStudies.length },
  { id: '3d', label: '3D & Graphics', count: caseStudies.filter(c => c.category === '3d').length },
  { id: 'ai', label: 'AI & ML', count: caseStudies.filter(c => c.category === 'ai').length },
  { id: 'tool', label: 'Tools & CLI', count: caseStudies.filter(c => c.category === 'tool').length },
  { id: 'art', label: 'Creative Coding', count: caseStudies.filter(c => c.category === 'art').length },
  { id: 'web', label: 'Web Apps', count: caseStudies.filter(c => c.category === 'web').length },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getStatusBadge(status: CaseStudy['status']) {
  const config = {
    live: { class: 'bg-success/20 text-success border-success/30', label: 'Live' },
    wip: { class: 'bg-warning/20 text-warning border-warning/30', label: 'In Progress' },
    archived: { class: 'bg-text-muted/20 text-text-muted border-text-muted/30', label: 'Archived' },
  };
  return config[status];
}

export const metadata: Metadata = {
  title: 'Case Studies — Naman Soni',
  description: 'Deep dives into projects I\'ve built — 3D graphics, local AI, generative art, browser automation, and developer tools.',
  openGraph: {
    title: 'Case Studies — Naman Soni',
    description: 'Deep dives into projects I\'ve built — 3D graphics, local AI, generative art, browser automation, and developer tools.',
    type: 'website',
  },
};

export default function CaseStudiesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);

  const filteredCases = activeCategory === 'all'
    ? caseStudies
    : caseStudies.filter((c) => c.category === activeCategory);

  return (
    <section id="case-studies" className="section" aria-labelledby="case-studies-heading">
      <div className="container">
        <header className="mb-16">
          <span className="caption text-primary-accent mb-4" style={{ letterSpacing: '0.1em' }}>
            06 / Case Studies
          </span>
          <h2 id="case-studies-heading" className="display-lg text-primary mb-4">
            Deep Dives
          </h2>
          <p className="body-lg text-text-secondary max-w-2xl">
            Not just a list of repos — the context, constraints, failures, and decisions behind each project.
          </p>
        </header>

        {/* Category Filter */}
        <div className="mb-12" role="group" aria-label="Filter case studies by category">
          <div className="flex flex-wrap gap-2" id="case-category-filters">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedCase(null);
                }}
                className={`btn transition-colors ${activeCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
                aria-pressed={activeCategory === cat.id}
              >
                {cat.label}
                <span className="ml-2 px-2 py-0.5 text-xs bg-surface-overlay border border-surface-border rounded-full">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal for detailed view */}
        {selectedCase && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/90 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-detail-title"
            onClick={() => setSelectedCase(null)}
          >
            <div
              className="card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="caption text-primary-accent mb-2" style={{ letterSpacing: '0.08em' }}>
                      {selectedCase.category.toUpperCase()}
                    </span>
                    <h3 id="case-detail-title" className="display-sm text-primary mb-2">
                      {selectedCase.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className={`caption px-2 py-1 rounded-full border ${getStatusBadge(selectedCase.status).class}`}>
                        {getStatusBadge(selectedCase.status).label}
                      </span>
                      <time dateTime={selectedCase.date} className="caption text-text-muted">
                        {formatDate(selectedCase.date)}
                      </time>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="btn btn-ghost p-2"
                    aria-label="Close case study details"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Image Gallery */}
                {selectedCase.images.length > 0 && (
                  <div className="mb-8">
                    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(selectedCase.images.length, 2)}, 1fr)` }}>
                      {selectedCase.images.map((img, i) => (
                        <div key={i} className="aspect-video bg-surface-overlay border border-surface-border overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center text-text-muted">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                            <span className="ml-2 caption">Screenshot {i + 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="prose prose-invert max-w-none mb-8">
                  <p className="body-lg text-text-secondary mb-4">{selectedCase.longDescription}</p>
                </div>

                {/* Challenges & Learnings */}
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                  <div className="card p-6">
                    <h4 className="heading-sm text-primary mb-3">Challenges</h4>
                    <ul className="space-y-2" role="list">
                      {selectedCase.challenges.map((challenge, i) => (
                        <li key={i} className="flex gap-3 body text-text-secondary">
                          <span className="flex-shrink-0 w-5 h-5 text-primary-accent">→</span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="card p-6">
                    <h4 className="heading-sm text-primary mb-3">Key Learnings</h4>
                    <ul className="space-y-2" role="list">
                      {selectedCase.learnings.map((learning, i) => (
                        <li key={i} className="flex gap-3 body text-text-secondary">
                          <span className="flex-shrink-0 w-5 h-5 text-success">✓</span>
                          {learning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="mb-8">
                  <h4 className="heading-sm text-primary mb-3">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2" aria-label="Technologies used">
                    {selectedCase.tech.map((tech) => (
                      <span
                        key={tech}
                        className="caption px-3 py-1 bg-surface-overlay border border-surface-border rounded-full text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-3 pt-6 border-t border-surface-border">
                  {selectedCase.demo && (
                    <Link
                      href={selectedCase.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      aria-label={`View live demo of ${selectedCase.title}`}
                    >
                      Live Demo
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </Link>
                  )}
                  <Link
                    href={selectedCase.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    aria-label={`View ${selectedCase.title} on GitHub`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    Code
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Case Studies Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Case studies">
          {filteredCases.map((caseStudy, index) => (
            <article
              key={caseStudy.id}
              className={`card relative overflow-hidden transition-all duration-300 hover:border-primary-accent/50 cursor-pointer ${caseStudy.featured ? 'ring-1 ring-primary-accent/30' : ''}`}
              role="listitem"
              onClick={() => setSelectedCase(caseStudy)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedCase(caseStudy); } }}
              tabIndex={0}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Featured badge */}
              {caseStudy.featured && (
                <span className="absolute top-4 right-4 z-10 caption px-2 py-1 bg-primary-accent text-bg rounded-full" aria-label="Featured project">
                  Featured
                </span>
              )}

              {/* Status */}
              <span className={`absolute top-4 left-4 z-10 caption px-2 py-1 rounded-full border ${getStatusBadge(caseStudy.status).class}`}>
                {getStatusBadge(caseStudy.status).label}
              </span>

              {/* Category */}
              <span className="inline-block caption text-primary-accent mb-3" style={{ letterSpacing: '0.08em' }}>
                {categories.find(c => c.id === caseStudy.category)?.label}
              </span>

              {/* Title */}
              <h3 className="heading-md text-primary mb-3">{caseStudy.title}</h3>

              {/* Short Description */}
              <p className="body text-text-secondary mb-4 line-clamp-2">{caseStudy.shortDescription}</p>

              {/* Tech Stack Preview */}
              <div className="flex flex-wrap gap-2 mb-4" aria-label="Technologies used">
                {caseStudy.tech.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className="caption px-2 py-1 bg-surface-overlay border border-surface-border rounded text-text-muted"
                  >
                    {tech}
                  </span>
                ))}
                {caseStudy.tech.length > 5 && (
                  <span className="caption px-2 py-1 bg-surface-overlay border border-surface-border rounded text-text-muted">
                    +{caseStudy.tech.length - 5} more
                  </span>
                )}
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between pt-4 border-t border-surface-border">
                <time dateTime={caseStudy.date} className="caption text-text-muted">
                  {formatDate(caseStudy.date)}
                </time>
                <span className="caption text-primary-accent" aria-label="Click to view details">
                  View details →
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredCases.length === 0 && (
          <div className="text-center py-16" role="status">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-text-subtle mb-4" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <path d="M9 9h6v6H9z" />
            </svg>
            <h3 className="heading-md text-primary mb-2">No projects in this category</h3>
            <p className="body text-text-secondary">Check back later — I\'m always building something new.</p>
          </div>
        )}
      </div>
    </section>
  );
}
