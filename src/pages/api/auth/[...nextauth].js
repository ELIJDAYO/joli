/* 
But if user enter the incorrect email pass for the log in the user and in the header menu we show the
username and we direct user to the homepage

That is every request for signing and sign out and checking.
The authentication will be redirected to this file and we need to handle it here.
*/
import bcryptjs from 'bcryptjs';
import User from 'models/Users';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import db from 'utils/db';

export default NextAuth({
  // We are going to authenticate user using JWT strategy, so set the session inside that.

  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id;
      //   So the user id is coming from database and the token is in the nextAuth lifecycle.
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
  /**
   * Providers is an array and the provider that we are going to use in this project is credentials provider.
So we are going to authenticate user based on the MongoDB database, not using GitHub authentication
or Google log in. 
   */
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();
        const user = await User.findOne({
          email: credentials.email,
        });
        await db.disconnect();
        /**The next step is checking the user and password together.
        If user exists, it means that we have user with this email and credential that password to pass for 
        credential == password entered in the text field*/
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: 'f',
            isAdmin: user.isAdmin,
          };
        }
        throw new Error('Invalid email or password');
      },
      secret: process.env.NEXTAUTH_SECRET,
    }),
  ],
});
