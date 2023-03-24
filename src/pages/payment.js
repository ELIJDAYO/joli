import CheckoutWizard from 'components/CheckoutWizard';
import Layout from 'components/Layout';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Store } from 'utils/Store';

export default function PaymentScreen() {
  // set the selected payment method default value to empty a string.
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  // Then get the payment method from the context.
  const { state, dispatch } = useContext(Store);
  // from cart get shipping address and payment method
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;

  const router = useRouter();

  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error('Payment method is required');
    }
    // If the selected method is selected Dispatch this action.
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
    /**And then save the selected payment method in the cookies and redirect user to the place order screen */
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );

    router.push('/placeorder');
  };
  /**What we are going to do in the use effect is to check for.

For shipping address dot address if it doesn't exist.

Redirect user to their shipping address. */
  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push('/shipping');
    }
    setSelectedPaymentMethod(paymentMethod || '');
    /**have all variables in the use effect function inside the dependency array. */
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {['PayPal', 'GCash', 'CashOnDelivery'].map((payment) => (
          <div key={payment} className="mb-4">
            <input
              name="paymentMethod"
              className="p-2 outline-none focus:ring-0"
              id={payment}
              type="radio"
              /**We need to define selected payment state later for unchanged update the selected
               * payment using set selected
               * payments next to the input box. */
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectedPaymentMethod(payment)}
            />

            <label className="p-2" htmlFor={payment}>
              {payment}
            </label>
          </div>
        ))}
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => router.push('/shipping')}
            type="button"
            className="default-button"
          >
            Back
          </button>
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
}
// make this authenticated.
PaymentScreen.auth = true;
