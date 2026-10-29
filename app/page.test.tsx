import { render, screen } from '@testing-library/react';
import Page from './page';
import '@testing-library/jest-dom';

// Mock the client components
jest.mock('./components/hero', () => () => <div data-testid="hero">Hero</div>);
jest.mock('./components/projects-showcase', () => () => <div data-testid="projects">Projects</div>);
jest.mock('./components/about', () => () => <div data-testid="about">About</div>);
jest.mock('./components/contact-form', () => () => <div data-testid="contact">Contact</div>);
jest.mock('./components/footer', () => () => <footer data-testid="footer">Footer</footer>);

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
