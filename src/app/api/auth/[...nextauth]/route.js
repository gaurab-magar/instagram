import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth ({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks:{
    async session({ session, token }) {
      session.user.username = token.name.split(' ').join('').toLowerCase();
      session.user.uid = token.uid;
      return session;
    }
  }

});

export { handler as GET , handler as POST };
