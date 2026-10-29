import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Page from './page';
import '@testing-library/jest-dom';

// Mock the client components
vi.mock('@/components/hero', () => ({ Hero: () => <div data-testid="hero">Hero</div> }));
vi.mock('@/components/projects-showcase', () => ({ ProjectsShowcase: () => <div data-testid="projects">Projects</div> }));
vi.mock('@/components/about', () => ({ About: () => <div data-testid="about">About</div> }));
vi.mock('@/components/contact-form', () => ({ ContactForm: () => <div data-testid="contact">Contact</div> }));
vi.mock('@/components/footer', () => ({ Footer: () => <footer data-testid="footer">Footer</footer> }));
vi.mock('@/components/3d/canvas-hero', () => ({ CanvasHero: () => <div data-testid="canvas-hero">Canvas Hero</div> }));

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Page />);
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('projects')).toBeInTheDocument();
    expect(screen.getByTestId('about')).toBeInTheDocument();
    expect(screen.getByTestId('contact')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
