'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const glitchTexts = [
  '404',
  'NOT FOUND',
  'MISSING',
  'VOID',
  'NULL',
  'UNDEFINED',
];

export default function NotFound() {
  const [glitchIndex, setGlitchIndex] = useState(0);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Cycle glitch text
    const glitchInterval = setInterval(() => {
      setGlitchIndex((prev) => (prev + 1) % glitchTexts.length);
    }, 3000);

    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20,
    }));
    setParticles(newParticles);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <section
      id="not-found"
      className="section min-h-[70vh] flex items-center justify-center relative overflow-hidden"
      aria-labelledby="not-found-heading"
    >
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary-accent/30"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Grid lines background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168, 255, 50, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 255, 50, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container relative z-10 text-center">
        {/* Glitch effect number */}
        <div className="mb-8" aria-hidden="true">
          <div className="relative inline-block">
            <span
              className="relative z-10 block font-mono text-9xl md:text-[12rem] font-bold text-primary tracking-tight"
              style={{ lineHeight: 1, letterSpacing: '-0.05em' }}
            >
              404
            </span>
            <span
              className="absolute inset-0 font-mono text-9xl md:text-[12rem] font-bold text-primary-accent/50 tracking-tight animate-glitch"
              style={{ lineHeight: 1, letterSpacing: '-0.05em', clipPath: 'polygon(0 0, 100% 0, 100% 35%, 0 35%)' }}
              aria-hidden="true"
            >
              404
            </span>
            <span
              className="absolute inset-0 font-mono text-9xl md:text-[12rem] font-bold text-red/50 tracking-tight animate-glitch"
              style={{ lineHeight: 1, letterSpacing: '-0.05em', clipPath: 'polygon(0 65%, 100% 65%, 100% 100%, 0 100%)', animationDelay: '0.5s' }}
              aria-hidden="true"
            >
              404
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1
          id="not-found-heading"
          className="display-lg md:display-xl text-primary mb-6"
        >
          Page Not Found
        </h1>

        {/* Description */}
        <p className="body-lg text-text-secondary mb-12 max-w-md mx-auto">
          The page you\'re looking for doesn\'t exist — or maybe it never did. 
          <span className="text-primary-accent">The void stares back.</span>
        </p>

        {/* Search/Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            href="/"
            className="btn btn-primary group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 transition-transform group-hover:-translate-x-1" aria-hidden="true">
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back Home
          </Link>
          <Link
            href="/case-studies"
            className="btn btn-secondary group"
          >
            Browse Projects
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">
              <path d="M5 12h14" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link
            href="/blog"
            className="btn btn-secondary group"
          >
            Read Blog
            <svg width="20" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </Link>
        </div>

        {/* Helpful links */}
        <div className="card p-8 max-w-xl mx-auto" style={{ background: 'linear-gradient(135deg, var(--card) 0%, var(--card-hover) 100%)' }}>}
          <h3 className="heading-sm text-primary mb-6">Maybe you meant:</h3>
          <nav aria-label="Suggested pages">
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                { href: '/case-studies', label: 'Case Studies', desc: 'Deep dives into my projects' },
                { href: '/blog', label: 'Blog', desc: 'Technical writing & tutorials' },
                { href: '/skills', label: 'Skills', desc: 'Technical expertise breakdown' },
                { href: '/playground', label: '3D Playground', desc: 'Interactive WebGL experiments' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-4 p-4 bg-surface-overlay border border-surface-border rounded-xl hover:border-primary-accent/50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-surface border border-surface-border flex items-center justify-center text-primary-accent group-hover:bg-primary-accent/10 transition-colors" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        {item.href === '/case-studies' && <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>}
                        {item.href === '/blog' && <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>}
                        {item.href === '/skills' && <><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" /><line x1="12" y1="22" x2="12" y2="15.5" /><polyline points="22 8.5 12 15.5 2 8.5" /></>}
                        {item.href === '/playground' && <><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>}
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="heading-sm text-primary group-hover:text-primary-accent transition-colors">{item.label}</div>
                      <div className="caption text-text-muted">{item.desc}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Fun footer message */}
        <p className="mt-12 caption text-text-subtle">
          <span className="font-mono text-primary-accent">//</span> If you think this is a bug,{' '}
          <a href="mailto:hello@namansoni.in" className="underline hover:text-primary-accent transition-colors">
            let me know
          </a>
          {' '}<span className="font-mono text-primary-accent">//</span>
        </p>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25% { transform: translate(30px, -30px) scale(1.2); opacity: 0.6; }
          50% { transform: translate(-20px, 20px) scale(0.8); opacity: 0.4; }
          75% { transform: translate(10px, 40px) scale(1.1); opacity: 0.5; }
        }
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(2px, -2px); }
          60% { transform: translate(-1px, 1px); }
          80% { transform: translate(1px, -1px); }
        }
        .animate-glitch {
          animation: glitch 0.3s ease-in-out infinite alternate;
        }
      `}</style>
    </section>
  );
}
