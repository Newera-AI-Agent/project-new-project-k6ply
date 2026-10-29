import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-border py-12" role="contentinfo">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="heading-sm text-primary">Naman Soni</p>
          <p className="body-sm text-text-muted">
            Explorer & Builder · {year}
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-6">
          <Link
            href="https://github.com/NamanSoni78"
            target="_blank"
            rel="noopener noreferrer"
            className="link body-sm"
          >
            GitHub
          </Link>
          <Link
            href="https://links.namansoni.in/namansoni78"
            target="_blank"
            rel="noopener noreferrer"
            className="link body-sm"
          >
            Links
          </Link>
          <Link
            href="mailto:hi@namansoni.in"
            className="link body-sm"
          >
            Email
          </Link>
          <Link
            href="https://github.com/NamanSoni78?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="link body-sm"
          >
            All Projects
          </Link>
        </nav>

        <p className="caption text-text-subtle" aria-hidden="true">
          Built with Next.js, Three.js, and curiosity
        </p>
      </div>
    </footer>
  );
}
