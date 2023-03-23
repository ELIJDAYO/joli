import axios from 'axios';
import Layout from 'components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useReducer } from 'react';
import { getError } from 'utils/error';

function reducer(state, action) {
  switch (action.type) {
    // It means that I send ajax request to backend and I want to show a loading message and no error.
    // return is previous states
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    //   It happens after getting data from back end.
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}
function OrderScreen() {
  // order/:id
  const { query } = useRouter();
  const orderId = query.id;
  /** first parameter is the reducer function.
    We need to implement the reducer function later.
    Second parameter is default value. 
    second thing that we are going to get from the reducer hook is dispatch to dispatch actions.
    */
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    // we load data on page load. So I set loading to true.
    loading: true,
    //  to get the order. So I set the order to empty object
    order: {},
    error: '',
  });
  /** define the use effect because I'm going to send an AJAX request to backend on page load. */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        //  then send an ajax request to backend using axios
        const { data } = await axios.get(`/api/orders/${orderId}`);
        // pass the data of the order as a payload so it's going to be saved inside the order in the reducer at line 33
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (
      !order._id ||
      // It means that we have order. But it's about the previously visited order ID.
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
    }
    // If there is a change in the orderId, useEffect runs again.
  }, [order, orderId]);
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  return (
    /** use layouts inside a return function use layouts and the title of this page is Order */
    <Layout title={`Order ${orderId}`}>
      <h1 className="mb-4 text-xl">{`Order ${orderId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>
                {/* get this from order obj */}
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </div>
              {isDelivered ? (
                <div className="alert-success">Delivered at {deliveredAt}</div>
              ) : (
                <div className="alert-error">Not delivered</div>
              )}
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-lg">Payment Method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-success">Paid at {paidAt}</div>
              ) : (
                <div className="alert-error">Not paid</div>
              )}
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
                  {/* Display table, head for item, quantity, price and subtotal and create table party to show the order */}
                  {orderItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
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
            </div>
          </div>
          <div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul>
                <li>
                  {/* I'm using flex and justify between to put the label in the left side and the value in the right side. */}
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>₱{itemsPrice}</div>
                  </div>
                </li>{' '}
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
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
// only authenticated user can have access to this page and export it
OrderScreen.auth = true;
export default OrderScreen;
