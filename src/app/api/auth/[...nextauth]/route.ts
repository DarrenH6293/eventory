import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

async function createOrGetUser({ email, username }: { email: string; username?: string }) {
  try {
    const getRes = await fetch(`${API_BASE}/user?email=${encodeURIComponent(email)}`);
    if (getRes.ok) {
      const user = await getRes.json();
      return user;
    }

    const createRes = await fetch(`${API_BASE}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!createRes.ok) throw new Error('Failed to create user');

    return await createRes.json();
  } catch (err) {
    console.error('Error in createOrGetUser:', err);
    throw err;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/',
    error: '/',
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const dbUser = await createOrGetUser({ email: user.email });

      user.id = dbUser.id;

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
