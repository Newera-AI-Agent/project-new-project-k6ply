'use client';
import { Metadata } from 'next';
import { useState, useEffect, useRef } from 'react';

interface Skill {
  name: string;
  level: number; // 0-100
  years: number;
  category: string;
  description: string;
  icon?: string;
}

interface SkillCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  skills: Skill[];
}

const categories: SkillCategory[] = [
  {
    id: 'frontend',
    name: 'Frontend & UI',
    description: 'Building accessible, performant, and delightful user interfaces.',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 9h6v6H9z"/></svg>',
    skills: [
      { name: 'React / Next.js', level: 95, years: 5, category: 'frontend', description: 'App Router, Server Components, RSC, streaming, Suspense' },
      { name: 'TypeScript', level: 92, years: 4, category: 'frontend', description: 'Advanced types, generics, template literals, type-level programming' },
      { name: 'Tailwind CSS', level: 90, years: 4, category: 'frontend', description: 'Design systems, custom configs, JIT, container queries' },
      { name: 'CSS & Animations', level: 88, years: 5, category: 'frontend', description: 'Custom properties, container queries, motion, FLIP technique' },
      { name: 'Accessibility (a11y)', level: 85, years: 3, category: 'frontend', description: 'WCAG 2.1 AA, ARIA, screen readers, semantic HTML' },
      { name: 'Testing (Vitest, Playwright)', level: 82, years: 3, category: 'frontend', description: 'Unit, integration, E2E, visual regression, a11y testing' },
      { name: 'State Management', level: 88, years: 4, category: 'frontend', description: 'Zustand, Jotai, TanStack Query, React Context, Signals' },
      { name: 'Performance Optimization', level: 85, years: 3, category: 'frontend', description: 'Core Web Vitals, bundle analysis, lazy loading, streaming' },
    ],
  },
  {
    id: 'graphics',
    name: '3D & Graphics',
    description: 'Real-time rendering, shaders, and creative coding on the web.',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>',
    skills: [
      { name: 'Three.js / React Three Fiber', level: 90, years: 4, category: 'graphics', description: 'Declarative 3D, shaders, post-processing, instancing' },
      { name: 'WebGL / GLSL', level: 85, years: 3, category: 'graphics', description: 'Fragment/vertex shaders, SDFs, raymarching, compute shaders' },
      { name: 'WebGPU / WGSL', level: 70, years: 1, category: 'graphics', description: 'Compute pipelines, bind groups, next-gen graphics API' },
      { name: 'Generative Art', level: 88, years: 3, category: 'graphics', description: 'Noise, fractals, flow fields, particle systems, L-systems' },
      { name: 'Shadertoy-style Shaders', level: 82, years: 3, category: 'graphics', description: 'Signed distance functions, ray marching, procedural textures' },
      { name: 'Blender / Geometry Nodes', level: 65, years: 2, category: 'graphics', description: 'Modeling, procedural geometry, Python scripting' },
    ],
  },
  {
    id: 'backend',
    name: 'Backend & Systems',
    description: 'Server-side logic, databases, and infrastructure.',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"/><line x1="6" y1="10" x2="18" y2="10"/><line x1="6" y1="14" x2="18" y2="14"/></svg>',
    skills: [
      { name: 'Node.js / Bun', level: 90, years: 5, category: 'backend', description: 'Streams, workers, native addons, performance tuning' },
      { name: 'Rust', level: 82, years: 3, category: 'backend', description: 'Async, Tokio, Axum, WASM bindings, FFI' },
      { name: 'PostgreSQL / SQLite', level: 85, years: 4, category: 'backend', description: 'Advanced queries, indexing, replication, migrations' },
      { name: 'Redis / Valkey', level: 80, years: 3, category: 'backend', description: 'Caching, pub/sub, streams, Lua scripting' },
      { name: 'GraphQL / tRPC', level: 85, years: 3, category: 'backend', description: 'Schema design, resolvers, subscriptions, type-safe APIs' },
      { name: 'Docker / Kubernetes', level: 75, years: 2, category: 'backend', description: 'Multi-stage builds, Helm, operators, GitOps' },
      { name: 'Linux / Nix / NixOS', level: 78, years: 2, category: 'backend', description: 'Declarative config, flakes, home-manager, containers' },
    ],
  },
  {
    id: 'ai',
    name: 'AI & ML Engineering',
    description: 'Local inference, model optimization, and AI-powered tooling.',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/><path d="M8 14h8"/><path d="M8 18h8"/></svg>',
    skills: [
      { name: 'Local LLM Inference', level: 88, years: 2, category: 'ai', description: 'llama.cpp, ollama, ONNX Runtime Web, quantization (GGUF)' },
      { name: 'RAG & Embeddings', level: 82, years: 2, category: 'ai', description: 'Vector DBs (Qdrant, pgvector), chunking, retrieval strategies' },
      { name: 'Agent Frameworks', level: 78, years: 1, category: 'ai', description: 'LangChain, LangGraph, custom tool-calling agents' },
      { name: 'Model Optimization', level: 80, years: 2, category: 'ai', description: 'Quantization (GPTQ, AWQ), distillation, pruning, speculative decoding' },
      { name: 'Computer Vision', level: 70, years: 2, category: 'ai', description: 'OpenCV, YOLO, segmentation, ONNX export' },
      { name: 'Prompt Engineering', level: 85, years: 2, category: 'ai', description: 'Few-shot, CoT, structured output, eval frameworks' },
    ],
  },
  {
    id: 'tools',
    name: 'Dev Tools & Workflow',
    description: 'The daily drivers that make development fast and reliable.',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    skills: [
      { name: 'Neovim / LazyVim', level: 90, years: 3, category: 'tools', description: 'LSP, DAP, treesitter, custom lua config, 100+ plugins' },
      { name: 'Git / GitHub Actions', level: 92, years: 5, category: 'tools', description: 'Advanced workflows, matrix builds, reusable actions, monorepos' },
      { name: 'CLI Development', level: 85, years: 3, category: 'tools', description: 'Clap, Cobra, ink, TUIs, completion, man pages' },
      { name: 'Observability', level: 78, years: 2, category: 'tools', description: 'OpenTelemetry, Prometheus, Grafana, Loki, Tempo' },
      { name: 'Database Tooling', level: 82, years: 3, category: 'tools', description: 'Prisma, Drizzle, sqlc, migration strategies, seeding' },
      { name: 'API Design', level: 88, years: 4, category: 'tools', description: 'OpenAPI, REST, gRPC, versioning, breaking change detection' },
    ],
  },
];

function SkillBar({ skill, delay = 0 }: { skill: Skill; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [animatedLevel, setAnimatedLevel] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setTimeout(() => setAnimatedLevel(skill.level), delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [skill.level, delay]);

  return (
    <div className="skill-item" ref={ref} style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-baseline justify-between mb-2">
        <span className="body text-primary font-medium">{skill.name}</span>
        <span className="caption text-text-muted font-mono tabular-nums">{animatedLevel}%</span>
      </div>
      <div
        className="relative h-2 bg-surface-overlay border border-surface-border rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={animatedLevel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} proficiency: ${animatedLevel}%`}
      >
        <div
          className="h-full bg-gradient-to-r from-primary-accent to-primary-accent/60 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${animatedLevel}%` }}
        />
        {/* Glow effect at the end */}
        {animatedLevel > 80 && (
          <div
            className="absolute top-0 right-0 w-4 h-full bg-primary-accent/40 blur"
            style={{ transform: `translateX(${animatedLevel}%)` }}
            aria-hidden="true"
          />
        )}
      </div>
      <p className="caption text-text-muted mt-1">{skill.years}+ years • {skill.description}</p>
    </div>
  );
}

function CategoryCard({ category, index }: { category: SkillCategory; index: number }) {
  const [expanded, setExpanded] = useState(true);
  const avgLevel = Math.round(category.skills.reduce((a, b) => a + b.level, 0) / category.skills.length);

  return (
    <article className="card overflow-hidden transition-all duration-300 hover:border-primary-accent/50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 flex items-start gap-4 text-left"
        aria-expanded={expanded}
        aria-controls={`skills-${category.id}`}
      >
        <div
          className="flex-shrink-0 w-12 h-12 rounded-xl bg-surface-overlay border border-surface-border flex items-center justify-center text-primary-accent"
          aria-hidden="true"
        >
          {category.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="heading-md text-primary mb-1">{category.name}</h3>
          <p className="body-sm text-text-secondary">{category.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="font-mono text-2xl font-bold text-primary-accent">{avgLevel}%</div>
            <div className="caption text-text-muted">Average</div>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      <div
        id={`skills-${category.id}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-[2000px] opacity-100 pt-2' : 'max-h-0 opacity-0'}`}
        role="region"
        aria-label={`${category.name} skills`}
      >
        <div className="px-6 pb-6 space-y-6 border-t border-surface-border">
          {category.skills.map((skill, i) => (
            <SkillBar key={skill.name} skill={skill} delay={i * 80} />
          ))}
        </div>
      </div>
    </article>
  );
}
export const metadata: Metadata = {
  title: 'Skills — Naman Soni',
  description: 'Technical skills across frontend, 3D graphics, backend systems, AI/ML, and developer tooling. Proficiency levels based on years of production experience.',
  openGraph: {
    title: 'Skills — Naman Soni',
    description: 'Technical skills across frontend, 3D graphics, backend systems, AI/ML, and developer tooling.',
    type: 'website',
  },
};
export default function SkillsPage() {
  return (
    <section id="skills" className="section" aria-labelledby="skills-heading">
      <div className="container">
        <header className="mb-16">
          <span className="caption text-primary-accent mb-4" style={{ letterSpacing: '0.1em' }}>
            07 / Skills
          </span>
          <h2 id="skills-heading" className="display-lg text-primary mb-4">
            Technical Expertise
          </h2>
          <p className="body-lg text-text-secondary max-w-2xl">
            Proficiency levels reflect production experience. I believe in depth over breadth — these are the tools I reach for daily.
          </p>
        </header>

        <div className="grid gap-6" role="list" aria-label="Skill categories">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>

        {/* Philosophy */}
        <div className="mt-20 p-8 card" style={{ background: 'linear-gradient(135deg, var(--card) 0%, var(--card-hover) 100%)' }}>}
          <h3 className="heading-md text-primary mb-4">How I Think About Skills</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h4 className="heading-sm text-primary-accent mb-2">Depth > Breadth</h4>
              <p className="body text-text-secondary">I\'d rather know one tool deeply than ten superficially. Mastery compounds; surface knowledge decays.</p>
            </div>
            <div>
              <h4 className="heading-sm text-primary-accent mb-2">Fundamentals Transfer</h4>
              <p className="body text-text-secondary">Understanding how browsers render, how memory works, how networks fail — these outlast any framework.</p>
            </div>
            <div>
              <h4 className="heading-sm text-primary-accent mb-2">Build to Learn</h4>
              <p className="body text-text-secondary">The projects in my case studies taught me more than any tutorial. I learn by shipping.</p>
            </div>
          </div>
        </div>

        {/* Currently Learning */}
        <div className="mt-12">
          <h3 className="heading-md text-primary mb-6">Currently Exploring</h3>
          <div className="flex flex-wrap gap-3" aria-label="Technologies currently learning">
            {[
              'WebGPU / WGSL',
              'Rust (async, io-uring)',
              'WebAssembly Component Model',
              'Local-first sync (CRDTs, Yjs)',
              'Formal verification (TLA+)',
              'Nix flakes at scale',
            ].map((tech) => (
              <span
                key={tech}
                className="caption px-3 py-1.5 bg-surface-overlay border border-primary-accent/30 rounded-full text-primary-accent"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
