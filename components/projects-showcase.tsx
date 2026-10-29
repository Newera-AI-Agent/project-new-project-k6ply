'use client';

import Link from 'next/link';
import { ProjectCard } from './project-card';

// Real projects from NamanSoni78 GitHub and links.namansoni.in/namansoni78
const projects = [
  {
    id: 'lnd-ai',
    title: 'LND Ai',
    description: 'Local-first AI assistant running entirely on-device. No cloud, no tracking, just your data and your models.',
    tech: ['Tauri', 'Rust', 'React', 'llama.cpp', 'ONNX Runtime'],
    github: 'https://github.com/NamanSoni78/lnd-ai',
    demo: null,
    featured: true,
    category: 'AI Tool',
  },
  {
    id: '3dfy',
    title: '3Dfy',
    description: 'Transform 2D images into 3D models using Gaussian Splatting. Upload a photo, get a Gaussian splat in seconds.',
    tech: ['Three.js', 'WebGL', 'Python', 'FastAPI', 'COLMAP', 'PyTorch'],
    github: 'https://github.com/NamanSoni78/3dfy',
    demo: 'https://3dfy.namansoni.in',
    featured: true,
    category: '3D / Graphics',
  },
  {
    id: 'onyx-image-editor',
    title: 'Onyx Image Editor',
    description: 'Browser-based image editor with layers, filters, and AI-powered tools. Photoshop-like experience in the browser.',
    tech: ['Fabric.js', 'Canvas API', 'Web Workers', 'TensorFlow.js', 'React'],
    github: 'https://github.com/NamanSoni78/onyx-image-editor',
    demo: 'https://onyx.namansoni.in',
    featured: true,
    category: 'Creative Tool',
  },
  {
    id: '2fa',
    title: '2FA Authenticator',
    description: 'Clean, offline-first two-factor authenticator. TOTP/HOTP support, encrypted vault, zero telemetry.',
    tech: ['Flutter', 'Dart', 'SQLCipher', 'Platform Channels', 'Biometrics'],
    github: 'https://github.com/NamanSoni78/2fa',
    demo: null,
    featured: false,
    category: 'Security',
  },
  {
    id: 'monyx-studio',
    title: 'Monyx Studio',
    description: 'Visual node-based editor for creating generative art and shaders. Connect nodes, see results instantly.',
    tech: ['React Flow', 'Three.js', 'GLSL', 'Zustand', 'TypeScript'],
    github: 'https://github.com/NamanSoni78/monyx-studio',
    demo: 'https://monyx.namansoni.in',
    featured: true,
    category: 'Generative Art',
  },
  {
    id: 'dance',
    title: 'Dance',
    description: 'Physics-based animation playground. Create fluid, organic motion with spring forces and constraints.',
    tech: ['Matter.js', 'Canvas', 'React', 'GSAP', 'Web Workers'],
    github: 'https://github.com/NamanSoni78/dance',
    demo: 'https://dance.namansoni.in',
    featured: false,
    category: 'Creative Coding',
  },
  {
    id: 'pi-browser-agent',
    title: 'Pi Browser Agent',
    description: 'Autonomous web agent that browses, extracts, and acts on your behalf. Local LLM + browser automation.',
    tech: ['Playwright', 'Ollama', 'TypeScript', 'Node.js', 'LangChain'],
    github: 'https://github.com/NamanSoni78/pi-browser-agent',
    demo: null,
    featured: false,
    category: 'AI Agent',
  },
];

export function ProjectsShowcase() {
  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section
      id="projects"
      className="section"
      aria-labelledby="projects-heading"
    >
      <div className="container">
        <header className="mb-16">
          <span className="caption text-primary-accent mb-4" style={{ letterSpacing: '0.1em' }}>
            02 / Projects
          </span>
          <h2 id="projects-heading" className="display-lg text-primary mb-4">
            Things I've built
          </h2>
          <p className="body-lg text-text-secondary max-w-2xl">
            A collection of independent projects exploring AI, 3D graphics, generative art, and creative tools.
            All open source — star them if they spark something.
          </p>
        </header>

        {/* Featured projects - larger cards */}
        {featuredProjects.length > 0 && (
          <div className="mb-16">
            <h3 className="heading-sm text-text-secondary mb-8">Featured</h3>
            <div className="grid-auto-fit">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} variant="featured" />
              ))}
            </div>
          </div>
        )}

        {/* Other projects */}
        {otherProjects.length > 0 && (
          <div>
            <h3 className="heading-sm text-text-secondary mb-8">Experiments</h3>
            <div className="grid-auto-fit">
              {otherProjects.map((project) => (
                <ProjectCard key={project.id} project={project} variant="default" />
              ))}
            </div>
          </div>
        )}

        {/* View all link */}
        <div className="mt-16 text-center">
          <Link
            href="https://github.com/NamanSoni78?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            View all on GitHub
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
