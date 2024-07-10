import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const welcomeMessage = screen.getByText(/Welcome to Solve-Ease./i);
  expect(welcomeMessage).toBeInTheDocument();
});

test('renders Get Started button', () => {
  render(<App />);
  const getStartedButton = screen.getByText(/Get Started/i);
  expect(getStartedButton).toBeInTheDocument();
});

test('renders Learn More button', () => {
  render(<App />);
  const learnMoreButton = screen.getByText(/Learn More/i);
  expect(learnMoreButton).toBeInTheDocument();
});
