'use client';

export function About() {
  return (
    <section
      id="about"
      className="section"
      aria-labelledby="about-heading"
    >
      <div className="container">
        <header className="mb-16">
          <span className="caption text-primary-accent mb-4" style={{ letterSpacing: '0.1em' }}>
            03 / About
          </span>
          <h2 id="about-heading" className="display-lg text-primary mb-4">
            Hi, I'm Naman
          </h2>
        </header>

        <div className="grid-auto-fit max-w-5xl mx-auto">
          {/* Bio */}
          <div className="card">
            <h3 className="heading-md text-primary mb-4">Explorer & Builder</h3>
            <div className="prose prose-invert max-w-none">
              <p className="body-lg text-text-secondary mb-6">
                I'm a student and explorer who builds whatever sparks my curiosity.
                Not a professional full-stack developer — just someone who loves
                turning "what if" into working code.
              </p>
              <p className="body text-text-secondary mb-6">
                My interests live at the intersection of <strong className="text-primary">AI</strong>,
                <strong className="text-primary">3D graphics</strong>, <strong className="text-primary">generative art</strong>,
                and <strong className="text-primary">creative tools</strong>. I gravitate toward
                projects that feel like toys but solve real problems — local-first
                AI assistants, browser-based 3D editors, physics playgrounds,
                autonomous agents that browse the web for you.
              </p>
              <p className="body text-text-secondary">
                Everything I build is <strong className="text-primary">open source</strong>.
                I believe the best tools are transparent, hackable, and respect
                your data. No telemetry, no cloud lock-in, no dark patterns.
              </p>
            </div>
          </div>

          {/* Philosophy */}
          <div className="card">
            <h3 className="heading-md text-primary mb-4">How I Work</h3>
            <ul className="space-y-4" role="list">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex-center bg-surface-overlay border border-surface-border rounded-full caption text-primary-accent">01</span>
                <div>
                  <h4 className="heading-sm text-primary mb-1">Curiosity First</h4>
                  <p className="body text-text-secondary">Start with a question, not a roadmap. The best projects begin as experiments.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex-center bg-surface-overlay border border-surface-border rounded-full caption text-primary-accent">02</span>
                <div>
                  <h4 className="heading-sm text-primary mb-1">Local-First by Default</h4>
                  <p className="body text-text-secondary">Your data stays on your device. Cloud is optional, not required.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex-center bg-surface-overlay border border-surface-border rounded-full caption text-primary-accent">03</span>
                <div>
                  <h4 className="heading-sm text-primary mb-1">Ship the Toy</h4>
                  <p className="body text-text-secondary">Polish comes later. If it's fun and works, it's worth sharing.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex-center bg-surface-overlay border border-surface-border rounded-full caption text-primary-accent">04</span>
                <div>
                  <h4 className="heading-sm text-primary mb-1">Open Everything</h4>
                  <p className="body text-text-secondary">Source code, learnings, failures — all public. Community makes it better.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Tech focus areas */}
          <div className="card">
            <h3 className="heading-md text-primary mb-4">Current Focus</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Local LLMs & On-Device AI', desc: 'llama.cpp, ONNX, Core ML, TensorRT' },
                { title: '3D Graphics & WebGL', desc: 'Three.js, WebGPU, Gaussian Splatting, Shaders' },
                { title: 'Generative Systems', desc: 'Procedural art, Node-based editors, Creative coding' },
                { title: 'Browser Automation', desc: 'Playwright, Agents, Web scraping, RPA' },
                { title: 'Rust & Systems', desc: 'Tauri, WASM, Performance-critical code' },
                { title: 'Developer Experience', desc: 'CLI tools, Editor extensions, Workflow automation' },
              ].map((focus, i) => (
                <div
                  key={i}
                  className="p-4 bg-surface-overlay border border-surface-border rounded-lg transition-all hover:border-text-subtle"
                >
                  <h4 className="heading-sm text-primary mb-1">{focus.title}</h4>
                  <p className="body-sm text-text-muted">{focus.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="card">
            <h3 className="heading-md text-primary mb-4">Find Me</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/NamanSoni78"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                aria-label="GitHub"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a
                href="https://links.namansoni.in/namansoni78"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                aria-label="Links page"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                Links
              </a>
              <a
                href="mailto:hi@namansoni.in"
                className="btn btn-ghost"
                aria-label="Email"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
