import Link from 'next/link';
import { useState, FormEvent } from 'react';

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  label: string;
}

export function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const socialLinks: SocialLink[] = [
    {
      name: 'GitHub',
      href: 'https://github.com/NamanSoni78',
      label: 'View my code on GitHub',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/namansoni78',
      label: 'Follow me on Twitter',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.124H15.31l-5.214-6.334L3.437 21.75H.272l8.104-9.408L.114 2.25h3.267l6.334 7.202L23.574 2.25z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/namansoni78',
      label: 'Connect on LinkedIn',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: 'RSS',
      href: '/blog/rss.xml',
      label: 'Subscribe to RSS feed',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 11a9 9 0 0 1 9 9" />
          <path d="M4 4a16 16 0 0 1 16 16" />
          <circle cx="5" cy="19" r="1" />
        </svg>
      ),
    },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    // Simulate API call - replace with actual newsletter service (Buttondown, ConvertKit, etc.)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo, always succeed
    setStatus('success');
    setEmail('');

    // Reset after 3 seconds
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <footer className="border-t border-surface-border py-16" role="contentinfo">
      <div className="container">
        {/* Main content grid */}
        <div className="grid gap-12 md:grid-cols-[1fr_auto_1fr] items-start">
          {/* Brand / About */}
          <div className="flex flex-col gap-6">
            <p className="heading-md text-primary">Naman Soni</p>
            <p className="body text-text-secondary max-w-xs">
              Explorer & Builder. Writing code, shaders, and words about the intersection of technology and creativity.
            </p>
            <p className="caption text-text-subtle">
              Built with Next.js, Three.js, and curiosity · {year}
            </p>
          </div>

          {/* Newsletter */}
          <div className="hidden lg:block w-full max-w-md">
            <h3 className="heading-sm text-primary mb-4">Stay Updated</h3>
            <p className="body-sm text-text-secondary mb-4">
              Occasional essays on graphics, systems, and building things. No spam, unsubscribe anytime.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2" aria-label="Newsletter signup">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={status === 'submitting' || status === 'success'}
                className="flex-1 input bg-surface border-surface-border text-primary placeholder:text-text-subtle focus:border-primary-accent focus:ring-1 focus:ring-primary-accent"
                aria-describedby="footer-email-status"
              />
              <button
                type="submit"
                disabled={status === 'submitting' || status === 'success'}
                className="btn btn-primary whitespace-nowrap"
                aria-live="polite"
              >
                {status === 'submitting' && (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Subscribing...
                  </>
                )}
                {status === 'success' ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Subscribed!
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
              <p id="footer-email-status" className="sr-only" aria-live="polite">
                {status === 'success' && 'Successfully subscribed to newsletter'}
                {status === 'error' && 'Failed to subscribe. Please try again.'}
              </p>
            </form>
          </div>

          {/* Social Links */}
          <nav aria-label="Social links" className="flex flex-col gap-6 md:items-end md:justify-end">
            <h3 className="heading-sm text-primary hidden lg:block">Connect</h3>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link w-10 h-10 rounded-xl bg-surface-overlay border border-surface-border flex items-center justify-center text-text-secondary hover:text-primary-accent hover:border-primary-accent/50 hover:bg-primary-accent/5 transition-all duration-200 group"
                  aria-label={social.label}
                >
                  {social.icon}
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-surface-border">
          <nav aria-label="Footer navigation" className="flex flex-col md:flex-row items-center justify-between gap-6 flex-wrap">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href="/case-studies" className="link body-sm">Case Studies</Link>
              <Link href="/blog" className="link body-sm">Blog</Link>
              <Link href="/skills" className="link body-sm">Skills</Link>
              <Link href="/playground" className="link body-sm">3D Playground</Link>
              <Link href="https://links.namansoni.in/namansoni78" target="_blank" rel="noopener noreferrer" className="link body-sm">All Links</Link>
              <Link href="mailto:hi@namansoni.in" className="link body-sm">Contact</Link>
            </div>
            <p className="caption text-text-subtle" aria-hidden="true">
              © {year} Naman Soni. Open source at heart.
            </p>
          </nav>
        </div>
      </div>

      <style jsx global>{`
        .social-link:focus-visible {
          outline: 2px solid var(--primary-accent);
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .social-link {
            transition: none;
          }
        }
      `}</style>
    </footer>
  );
}
