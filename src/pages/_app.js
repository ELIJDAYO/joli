import '@/styles/globals.css';
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
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}{' '}
      </StoreProvider>
    </SessionProvider>
  );
}
/**It accept the children and inside this component we get thereafter from user out there and we use you
session hook said the require two true so only logged in user can access to it and for unauthorized direct user to unauthorized page, 
we need to implement it and set the message to locking required controls,*/
function Auth({ children }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=login required');
    },
  });
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return children;
}
