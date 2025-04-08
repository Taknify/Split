import NextAuth from 'next-auth';
import { compare } from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import Credentials from '@auth/core/providers/credentials';
import { getUserByEmail } from './models';

// Configure NextAuth
export const authConfig: NextAuthConfig = {
  // Use more explicit configuration to fix URL issues
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: 'credentials',
      // @ts-ignore - Type definition issue between @auth/core and next-auth
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Get user from database
          const user = await getUserByEmail(credentials.email as string);
          
          // If user doesn't exist or password doesn't match
          if (!user || !user.password) {
            return null;
          }
          
          // Compare passwords
          const passwordMatch = await compare(credentials.password as string, user.password as string);
          
          if (!passwordMatch) {
            return null;
          }
          
          // Return user without password
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/signout',
    error: '/auth/error',
    newUser: '/auth/register',
  },
  callbacks: {
    // Add user ID to session
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      console.log("NextAuth redirect called with:", { url, baseUrl });
      
      // Explicit handling of sign-out to home page
      if (url.includes('/signout') || url.includes('/api/auth/signout')) {
        console.log("Detected sign-out, redirecting to home page");
        return baseUrl;
      }
      
      // Handle redirects more explicitly and safely
      if (url.startsWith("/")) {
        const resolvedUrl = new URL(url, baseUrl).toString();
        console.log("Redirecting to:", resolvedUrl);
        return resolvedUrl;
      }
      
      // Try to safely handle URLs
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === new URL(baseUrl).origin) {
          console.log("Redirecting to same-origin URL:", url);
          return url;
        }
      } catch (error) {
        console.error("Error parsing URL:", error);
      }
      
      console.log("Fallback redirect to baseUrl:", baseUrl);
      return baseUrl;
    },
    authorized({ auth, request }) {
      // Get the current user
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.email === 'test@example.com';
      
      // Protect routes
      const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
      const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
      
      // Admin routes are only accessible by admin users
      if (isAdminRoute && !isAdmin) {
        return false;
      }
      
      // Dashboard routes are only accessible by logged-in users
      if (isDashboardRoute && !isLoggedIn) {
        return false;
      }
      
      return true;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

// Export NextAuth handler
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);