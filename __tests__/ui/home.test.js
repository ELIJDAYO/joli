import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import CheckoutWizard from '../../components/CheckoutWizard';
import AdminSidebar from "../../components/AdminSidebar"
import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextDecoder, TextEncoder });

describe('CheckoutWizard', () => {
  it('Tests if component renders', () => {
    render(<CheckoutWizard activeStep={0} />);
    render(<CheckoutWizard activeStep={1} />);
    render(<CheckoutWizard activeStep={2} />);
    render(<CheckoutWizard activeStep={3} />);
  });
});

describe('AdminSidebar', () => {
  it('Tests if component renders', async () => {
      const test = render (<AdminSidebar CurrentPage="Dashboard"/>);
      render (<AdminSidebar CurrentPage="Orders"/>);
      render (<AdminSidebar CurrentPage="Products"/>);
      render (<AdminSidebar CurrentPage="Users"/>);

      await test.findAllByText("Dashboard").then((result) => {
          expect(result.length).toBe(4);
      });
      await test.findAllByText("Orders").then((result) => {
          expect(result.length).toBe(4);
      });
      await test.findAllByText("Products").then((result) => {
          expect(result.length).toBe(4);
      });
      await test.findAllByText("Users").then((result) => {
          expect(result.length).toBe(4);
      });
  })
})
