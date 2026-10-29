import Link from 'next/link';
import { Hero } from '@/components/hero';
import { ProjectsShowcase } from '@/components/projects-showcase';
import { About } from '@/components/about';
import { ContactForm } from '@/components/contact-form';
import { Footer } from '@/components/footer';

// Metadata for the home page - can be extended
export const metadata = {
  title: 'Explorer & Builder',
  description: 'Portfolio of Naman Soni — explorer who builds whatever sparks curiosity. AI/3D tools, generative art, and independent projects.',
};

export default function HomePage() {
  return (
    <main id="main" className="min-h-screen">
      <Hero />
      <ProjectsShowcase />
      <About />
      <ContactForm />
      <Footer />
    </main>
  );
}
