import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      studentId: string;
      role: string;
      faculty: string;
      department: string;
      course: string;
      yearOfStudy: number;
      profileImage: string;
      isVerified: boolean;
      twoFactorEnabled: boolean;
    } & DefaultSession['user'];
    accessToken: string;
    error?: string;
  }

  interface User extends DefaultUser {
    studentId: string;
    role: string;
    faculty: string;
    department: string;
    course: string;
    yearOfStudy: number;
    profileImage: string;
    isVerified: boolean;
    twoFactorEnabled: boolean;
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    userId: string;
    studentId: string;
    role: string;
    faculty: string;
    department: string;
    course: string;
    yearOfStudy: number;
    profileImage: string;
    isVerified: boolean;
    twoFactorEnabled: boolean;
    accessToken: string;
    refreshToken: string;
    error?: string;
  }
}