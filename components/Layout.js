import { Menu } from '@headlessui/react';
import Cookies from 'js-cookie';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Store } from 'utils/Store';

export default function Layout({ title, children }) {
  // use youth hook, import it and get session and a status.
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  // after rendering the page the update cart items coutns and change the value in the header
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    // next update the Store.js
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };
  return (
    <>
      <Head>
        <title>{title ? title + ' - Joli' : 'Joli'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position="bottom-center" limit={1} />
      <div className="flex min-h-screen flex-col justify-between bg-white">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md">
            <Link href="/" className="text-lg font-bold text-black">
              Joli
            </Link>
            <div>
              <Link href="/cart" className="p-2 text-black">
                Cart
                {cartItemsCount > 0 && (
                  <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                    {/* accumulator + current item qty = sum of all qty in cart items*/}
                    {/* {cart.cartItems.reduce((a, c) => a + c.quantity, 0)} */}
                    {cartItemsCount}
                  </span>
                )}{' '}
              </Link>

              {/* If it's loading, show loading, let's put it inside parentheses.
              Otherwise check session that user. 
              If it does exist, then show the user name.
              Otherwise show a link to the login page and make it inside that.*/}
              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1 ">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            className={`${
                              active ? 'bg-blue-500' : 'bg-white text-black'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            href="/profile"
                          >
                            Profile&nbsp;
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            className={`${
                              active ? 'bg-blue-500' : 'bg-white text-black'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            href="/order-history"
                          >
                            Order History&nbsp;
                          </Link>
                        )}
                      </Menu.Item>
                      {session.user.isAdmin && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              className={`${
                                active ? 'bg-blue-500' : 'bg-white text-black'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              href="/admin/dashboard"
                            >
                              Admin Dashboard&nbsp;
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            className={`${
                              active ? 'bg-blue-500' : 'bg-white text-black'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            href="#"
                            onClick={logoutClickHandler}
                          >
                            Logout&nbsp;
                          </Link>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login" className="p-2 text-black">
                  Login
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4 text-black">
          {children}
        </main>
        <footer className="flex h-10 justify-center items-center shadow-inner text-black">
          <p>Copyright © 2023 Joli</p>
        </footer>
      </div>
    </>
  );
}
