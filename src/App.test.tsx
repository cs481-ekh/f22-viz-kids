import * as React from "react";
import { render, screen } from '@testing-library/react';
import App from '../src/App';

test('renders the landing page', () => {
  render(<App />);
  const element = screen.getByText(/Hello, world!/i);
  expect(element).toBeInTheDocument();
});
