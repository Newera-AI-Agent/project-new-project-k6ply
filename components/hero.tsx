'use client';

import Link from 'next/link';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { CanvasHero } from './3d/canvas-hero';

// Type-driven hero - no generic WebGL by default
// Only renders CanvasHero when motion is NOT reduced

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Subtle noise texture on the hero section only */}
      <div className="absolute inset-0 noise-overlay" aria-hidden="true" />

      {/* Radial gradient glow - single surface, not full-page */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '60vw',
          height: '60vw',
          maxWidth: '500px',
          maxHeight: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgb(200 255 0 / 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 container flex flex-col items-center text-center py-20">
        {/* Typographic number - no emoji */}
        <span className="caption text-primary-accent mb-6" style={{ letterSpacing: '0.1em' }}>
          01 / Portfolio
        </span>

        {/* Main headline - type only */}
        <h1 className="display-xl text-primary mb-8 max-w-[90ch] leading-[1.05]">
          Explorer who builds<br />
          <span className="text-text-secondary font-normal">whatever sparks curiosity</span>
        </h1>

        {/* Sub-headline */}
        <p className="body-lg text-text-secondary max-w-2xl mb-12 px-4">
          AI/3D tools. Generative art. Independent projects.<br />
          Not a professional full-stack developer — just exploring.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <Link
            href="#projects"
            className="btn btn-primary w-full sm:w-auto"
            aria-label="View projects"
          >
            View Projects
            <svg
              width="20"
              height="20"
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
          <Link
            href="https://github.com/NamanSoni78"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary w-full sm:w-auto"
            aria-label="GitHub profile"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-subtle caption animate-bounce-slow" aria-hidden="true">
          Scroll
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Signature 3D motion - only when NOT reduced motion */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <CanvasHero />
        </div>
      )}
    </section>
  );
}
