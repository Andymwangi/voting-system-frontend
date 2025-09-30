import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { refreshAccessToken, logoutUser } from '@/lib/api/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        studentId: { label: 'Student ID', type: 'text' },
        twoFactorCode: { label: '2FA Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          // Direct call to your backend API
          const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

          const response = await fetch(`${backendUrl}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              studentId: credentials.studentId,
              twoFactorCode: credentials.twoFactorCode,
              deviceInfo: {
                userAgent: 'NextAuth-Client',
                ipAddress: '127.0.0.1',
                platform: 'web',
                browser: 'NextAuth'
              }
            }),
          });

          const result = await response.json();

          if (response.ok && result.success && result.data?.user) {
            const user = result.data.user;
            return {
              id: user.id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
              studentId: user.studentId,
              role: user.role,
              faculty: user.faculty,
              department: user.department,
              course: user.course,
              yearOfStudy: user.yearOfStudy,
              profileImage: user.profileImage,
              isVerified: user.isVerified,
              twoFactorEnabled: user.twoFactorEnabled,
              accessToken: result.data.tokens?.accessToken,
              refreshToken: result.data.tokens?.refreshToken,
            };
          }

          // Handle specific error messages from backend
          throw new Error(result.message || 'Authentication failed');
        } catch (error) {
          console.error('NextAuth authentication error:', error);
          throw new Error(error instanceof Error ? error.message : 'Authentication failed');
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          userId: user.id,
          studentId: user.studentId,
          role: user.role,
          faculty: user.faculty,
          department: user.department,
          course: user.course,
          yearOfStudy: user.yearOfStudy,
          profileImage: user.profileImage,
          isVerified: user.isVerified,
          twoFactorEnabled: user.twoFactorEnabled,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        };
      }

      // Check if access token is expired (implement token refresh logic here)
      const now = Date.now();
      const tokenExpiry = (token.exp as number) * 1000;

      if (now < tokenExpiry) {
        return token;
      }

      // Token is expired, try to refresh it
      try {
        const response = await refreshAccessToken({ refreshToken: token.refreshToken as string });
        if (response.data.success && response.data.data) {
          return {
            ...token,
            accessToken: response.data.data.accessToken,
            refreshToken: response.data.data.refreshToken,
            exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
          };
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        return { ...token, error: 'RefreshAccessTokenError' };
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error) {
        session.error = token.error as string;
      }

      // Send properties to the client
      return {
        ...session,
        user: {
          ...session.user,
          id: token.userId as string,
          studentId: token.studentId as string,
          role: token.role as string,
          faculty: token.faculty as string,
          department: token.department as string,
          course: token.course as string,
          yearOfStudy: token.yearOfStudy as number,
          profileImage: token.profileImage as string,
          isVerified: token.isVerified as boolean,
          twoFactorEnabled: token.twoFactorEnabled as boolean,
        },
        accessToken: token.accessToken as string,
      };
    },
    async redirect({ url, baseUrl }) {
      // Determine redirect based on user role
      if (url.startsWith('/')) {
        // Check if it's a role-specific redirect
        if (url.includes('/admin')) {
          return `${baseUrl}/admin/dashboard`;
        } else if (url.includes('/voter')) {
          return `${baseUrl}/dashboard`;
        }
        return `${baseUrl}${url}`;
      }

      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;

      // Default redirect to dashboard
      return `${baseUrl}/dashboard`;
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log('User signed in:', user?.email);
    },
    async signOut({ session, token }) {
      // Call logout API to invalidate tokens
      if (token?.accessToken) {
        try {
          await logoutUser();
        } catch (error) {
          console.error('Logout API error:', error);
        }
      }
    },
    async session({ session, token }) {
      // Session is active
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};