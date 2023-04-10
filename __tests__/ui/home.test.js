import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Index from '@/pages/index';

describe('Home', () => {
  it('render homepage', () => {
    render(<Index />);
    // check if all components are rendered
    // expect(screen.toBeInTheDocument('p')).toBeInTheDocument();
    const layout = screen.getByRole('Layout');
    expect(layout).toBeInTheDocument();
  });
});
