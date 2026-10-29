import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Page from './page';
import '@testing-library/jest-dom';

// Mock the client components
vi.mock('./components/hero', () => ({ default: () => <div data-testid="hero">Hero</div> }));
vi.mock('./components/projects-showcase', () => ({ default: () => <div data-testid="projects">Projects</div> }));
vi.mock('./components/about', () => ({ default: () => <div data-testid="about">About</div> }));
vi.mock('./components/contact-form', () => ({ default: () => <div data-testid="contact">Contact</div> }));
vi.mock('./components/footer', () => ({ default: () => <footer data-testid="footer">Footer</footer> }));

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
