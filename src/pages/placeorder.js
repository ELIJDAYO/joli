import axios from 'axios';
import CheckoutWizard from 'components/CheckoutWizard';
import Layout from 'components/Layout';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getError } from 'utils/error';
import { Store } from 'utils/Store';

export default function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(
    /**So we use reduce function to accept accumulator and current items and the sum up accumulator by current
    item dot quantity multiply by current item dot price and the default item for accumulator is zero. */
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  // If the item price is greater than $200, it's free.
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.12);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  const router = useRouter();
  /** define use effect here in the use effect.
    I check the payment method. */
  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
  }, [paymentMethod, router]);
  // loading to handle place order action.
  const [loading, setLoading] = useState(false);
  /**If there is an error in placing order use set loading to false and toast the error message press control
   *
   */
  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      //   It's a post method because I'm going to create an order to slash API slash orders.
      const { data } = await axios.post('/api/orders', {
        //  send this ajax request.
        //  payload for this API
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);
      //   And clear the cookies too.
      dispatch({ type: 'CART_CLEAR_ITEMS' });
      Cookies.set(
        'cart',
        JSON.stringify({
          /**Set cart items to empty array, but keep payment method and shipping address
           * in the cart for next orders. */
          ...cart,
          cartItems: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3} />
      <h1 className="mb-4 text-xl">Place Order</h1>
      {/* it's not possible to checkout empty shopping cart */}
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      ) : (
        // for medium screen, create four columns and set the gap to five inside the screen.
        <div className="grid md:grid-cols-4 md:gap-5">
          {/* It creates a div a column and it occupy three of four columns, spans three of four columns,  */}
          <div className="overflow-x-auto md:col-span-3">
            {/* inside that create a cart set padding five in the car, 
            and inside this cart render each to its shipping address. */}
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </div>
              <div>
                {/*  link to edit it so user can go to the edit page for the shipping
                    address import link from next to slash link before going for the next cart. */}
                <Link href="/shipping">Edit</Link>
              </div>
            </div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Payment Method</h2>
              <div>{paymentMethod}</div>
              <div>
                <Link href="/payment">Edit</Link>
              </div>
            </div>
            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="    p-5 text-right">Quantity</th>
                    <th className="  p-5 text-right">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link
                          href={`/product/₱{item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          &nbsp;
                          {item.name}
                        </Link>
                      </td>
                      <td className=" p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">₱{item.price}</td>
                      <td className="p-5 text-right">
                        ₱{item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link href="/cart">Edit</Link>
              </div>
            </div>
          </div>
          <div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul>
                <li>
                  {/*  use the flex justify content to put items in their left */}
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>₱{itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>₱{taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>₱{shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>₱{totalPrice}</div>
                  </div>
                </li>
                <li>
                  <button
                    disabled={loading}
                    onClick={placeOrderHandler}
                    className="primary-button w-full"
                  >
                    {loading ? 'Loading...' : 'Place Order'}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
/**so only authenticated user can access to this page, otherwise
they will be redirected to the unauthorized page. */
PlaceOrderScreen.auth = true;
