import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Мэйл болон нууц үгээ оруулна уу...");
        }
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body:JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            })
          })
          if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Нэвтрэхэд алдаа гарлаа.");
          }
          const user = await response.json()

          if (!user) {
            throw new Error("No user found");
          }
          return {
            id: user._id,
            lastName: user.lastName,
            firtstName: user.firstName,
            email: user.email,
            orginization: user.organization,
            role: user.role,
          };
        }catch (error) {
          console.error("Нэвтрэхэд алдаа гарлаа:", error);
          throw new Error("Нэвтрэхэд алдаа гарлаа.");
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages:{
    signIn:"/auth/login",
  },
  session:{
    strategy:"jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
