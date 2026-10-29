'use client';
import { Metadata } from 'next';
import Link from 'next/link';
import { useState } from 'react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  featured: boolean;
}

const posts: BlogPost[] = [
  {
    id: 'local-llm-guide',
    title: 'Running LLMs Locally: A Complete Guide to llama.cpp',
    excerpt: 'Everything you need to know about running large language models on your own hardware — from model selection to quantization, GPU offloading, and building a local-first AI assistant.',
    content: 'Full article content would go here...',
    date: '2025-01-15',
    category: 'AI & ML',
    tags: ['llama.cpp', 'local-ai', 'quantization', 'gpu'],
    readTime: '12 min read',
    featured: true,
  },
  {
    id: 'webgl-shader-intro',
    title: 'Writing Your First WebGL Shader: From Zero to Fractals',
    excerpt: 'A gentle introduction to GLSL and fragment shaders. We\'ll build a Mandelbrot set renderer step by step, covering coordinate systems, color mapping, and animation loops.',
    content: 'Full article content would go here...',
    date: '2024-12-20',
    category: 'Graphics',
    tags: ['webgl', 'glsl', 'shaders', 'fractals', 'three.js'],
    readTime: '18 min read',
    featured: true,
  },
  {
    id: 'rust-tauri-desktop',
    title: 'Building Native Desktop Apps with Rust and Tauri',
    excerpt: 'Why Electron apps feel bloated and how Tauri + Rust gives you tiny, fast, secure desktop applications. A practical walkthrough from project setup to system tray integration.',
    content: 'Full article content would go here...',
    date: '2024-11-28',
    category: 'Systems',
    tags: ['rust', 'tauri', 'desktop', 'wasm', 'performance'],
    readTime: '15 min read',
    featured: false,
  },
  {
    id: 'generative-art-nodes',
    title: 'Node-Based Generative Art: Building a Visual Programming Editor',
    excerpt: 'How I built a browser-based node editor for creating generative art — React Flow for the graph, Web Workers for computation, and WebGL for real-time preview.',
    content: 'Full article content would go here...',
    date: '2024-10-12',
    category: 'Creative Coding',
    tags: ['generative-art', 'react-flow', 'webgl', 'web-workers', 'typescript'],
    readTime: '22 min read',
    featured: true,
  },
  {
    id: 'browser-automation-agents',
    title: 'Autonomous Web Agents with Playwright: Beyond Simple Scraping',
    excerpt: 'Moving from brittle selectors to resilient, goal-driven browser automation. Using LLMs for action planning, self-healing selectors, and handling dynamic SPAs.',
    content: 'Full article content would go here...',
    date: '2024-09-05',
    category: 'Automation',
    tags: ['playwright', 'agents', 'llm', 'automation', 'testing'],
    readTime: '14 min read',
    featured: false,
  },
  {
    id: 'css-architecture-tokens',
    title: 'Design Tokens in CSS: A Practical Architecture for Scaling Design Systems',
    excerpt: 'Moving beyond hardcoded values. How to structure design tokens with CSS custom properties, handle theming, dark mode, and keep your design system maintainable.',
    content: 'Full article content would go here...',
    date: '2024-08-18',
    category: 'Frontend',
    tags: ['css', 'design-systems', 'tokens', 'architecture', 'theming'],
    readTime: '10 min read',
    featured: false,
  },
  {
    id: 'wasm-performance',
    title: 'When to Use WebAssembly: Real Performance Data from Production',
    excerpt: 'Benchmarking WASM vs JavaScript for image processing, physics simulation, and crypto. The cases where WASM shines, where it doesn\'t, and the tooling that makes it viable.',
    content: 'Full article content would go here...',
    date: '2024-07-22',
    category: 'Performance',
    tags: ['wasm', 'rust', 'performance', 'benchmarking', 'simd'],
    readTime: '16 min read',
    featured: false,
  },
  {
    id: 'local-first-philosophy',
    title: 'Local-First Software: Why Your Data Should Never Leave Your Device',
    excerpt: 'The philosophy behind local-first architecture, CRDTs for sync, and building apps that respect user sovereignty. Plus a look at the ecosystem: ElectricSQL, Automerge, Yjs.',
    content: 'Full article content would go here...',
    date: '2024-06-30',
    category: 'Architecture',
    tags: ['local-first', 'crdts', 'sync', 'privacy', 'offline-first'],
    readTime: '11 min read',
    featured: false,
  },
];

const categories = ['All', 'AI & ML', 'Graphics', 'Systems', 'Creative Coding', 'Automation', 'Frontend', 'Performance', 'Architecture'];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export const metadata: Metadata = {
  title: 'Blog — Naman Soni',
  description: 'Technical writing on AI, graphics, systems programming, generative art, and building local-first software.',
  openGraph: {
    title: 'Blog — Naman Soni',
    description: 'Technical writing on AI, graphics, systems programming, generative art, and building local-first software.',
    type: 'website',
  },
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [displayCount, setDisplayCount] = useState(6);

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  const displayedPosts = filteredPosts.slice(0, displayCount);
  const hasMore = displayCount < filteredPosts.length;

  return (
    <section id="blog" className="section" aria-labelledby="blog-heading">
      <div className="container">
        <header className="mb-16">
          <span className="caption text-primary-accent mb-4" style={{ letterSpacing: '0.1em' }}>
            05 / Writing
          </span>
          <h2 id="blog-heading" className="display-lg text-primary mb-4">
            Technical Writing
          </h2>
          <p className="body-lg text-text-secondary max-w-2xl">
            Deep dives into the things I\'m building and learning. No SEO fluff, no AI-generated content — just honest technical exploration.
          </p>
        </header>

        {/* Category Filter */}
        <div className="mb-12" role="group" aria-label="Filter posts by category">
          <div className="flex flex-wrap gap-2" id="category-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setDisplayCount(6);
                }}
                className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'} transition-colors`}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Blog posts">
          {displayedPosts.map((post, index) => (
            <article
              key={post.id}
              className={`card relative overflow-hidden transition-all duration-300 hover:border-primary-accent/50 ${post.featured ? 'ring-1 ring-primary-accent/30' : ''}`}
              role="listitem"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Featured badge */}
              {post.featured && (
                <span className="absolute top-4 right-4 z-10 caption px-2 py-1 bg-primary-accent text-bg rounded-full" aria-label="Featured post">
                  Featured
                </span>
              )}

              {/* Category */}
              <span className="inline-block caption text-primary-accent mb-3" style={{ letterSpacing: '0.08em' }}>
                {post.category}
              </span>

              {/* Title */}
              <h3 className="heading-md text-primary mb-3">
                <Link
                  href={`/blog/${post.id}`}
                  className="hover:text-primary-accent transition-colors"
                >
                  {post.title}
                </Link>
              </h3>

              {/* Excerpt */}
              <p className="body text-text-secondary mb-4 line-clamp-3">{post.excerpt}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4" aria-label="Tags">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="caption px-2 py-1 bg-surface-overlay border border-surface-border rounded text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 4 && (
                  <span className="caption px-2 py-1 bg-surface-overlay border border-surface-border rounded text-text-muted">
                    +{post.tags.length - 4} more
                  </span>
                )}
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between pt-4 border-t border-surface-border">
                <time dateTime={post.date} className="caption text-text-muted">
                  {formatDate(post.date)}
                </time>
                <span className="caption text-text-muted" aria-label="Reading time">
                  {post.readTime}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={() => setDisplayCount((prev) => prev + 6)}
              className="btn btn-secondary"
              aria-label={`Load ${Math.min(6, filteredPosts.length - displayCount)} more posts`}
            >
              Load More ({filteredPosts.length - displayCount} remaining)
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16" role="status">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-text-subtle mb-4" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <h3 className="heading-md text-primary mb-2">No posts in this category</h3>
            <p className="body text-text-secondary">Check back later or explore another category.</p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-20 p-8 card text-center" style={{ background: 'linear-gradient(135deg, var(--card) 0%, var(--card-hover) 100%)' }}>}
          <h3 className="heading-md text-primary mb-3">Enjoying these posts?</h3>
          <p className="body text-text-secondary mb-6 max-w-md mx-auto">
            Get new articles delivered straight to your inbox. No spam, unsubscribe anytime.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="#" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="blog-email" className="sr-only">Email address</label>
            <input
              type="email"
              id="blog-email"
              placeholder="your@email.com"
              className="input flex-1"
              required
              autoComplete="email"
            />
            <button type="submit" className="btn btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="caption text-text-subtle mt-3">By subscribing, you agree to our privacy policy.</p>
        </div>
      </div>
    </section>
  );
}
