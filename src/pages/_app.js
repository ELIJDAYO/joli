import '@/styles/globals.css';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { StoreProvider } from 'utils/Store';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    // We pass the session to the session provider and we can have session in all pages including log in.
    <SessionProvider session={session}>
      <StoreProvider>
        {/* it's not going to load the paperless script and be loaded manually using the paypalDispatch in
        the pages that we want. */}
        <PayPalScriptProvider deferLoading={true}>
          {Component.auth ? (
            <Auth adminOnly={Component.auth.adminOnly}>
              {' '}
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </PayPalScriptProvider>
      </StoreProvider>
    </SessionProvider>
  );
}
/**It accept the children and inside this component we get thereafter from user out there and we use you
session hook said the require two true so only logged in user can access to it and for unauthorized direct user to unauthorized page, 
we need to implement it and set the message to locking required controls,*/
function Auth({ children, adminOnly }) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=login required');
    },
  });
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  // It's coming from the properties of the Auth component or useSession.
  if (adminOnly && !session.user.isAdmin) {
    router.push('/unauthorized?message=admin login required');
  }
  return children;
}
