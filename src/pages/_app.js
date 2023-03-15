import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { StoreProvider } from 'utils/Store';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    // We pass the session to the session provider and we can have session in all pages including log in.
    <SessionProvider session={session}>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </SessionProvider>
  );
}
