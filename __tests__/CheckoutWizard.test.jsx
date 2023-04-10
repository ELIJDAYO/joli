import { render } from "@testing-library/react";
import CheckoutWizard from "../components/CheckoutWizard";

describe('CheckoutWizard', () => {
    it('Tests if component renders', () => {
        //Might be a bit incomplete
        render (<CheckoutWizard activeStep={0}/>);
        render (<CheckoutWizard activeStep={1}/>);
        render (<CheckoutWizard activeStep={2}/>);
        render (<CheckoutWizard activeStep={3}/>);
    })
  })