import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";

export type SessionUser = {
  id: string;
  email: string;
  isStaticAdmin: boolean;
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login"
  },
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const staticAdmin = isStaticAdmin({
          email: credentials.email,
          password: credentials.password
        });

        if (staticAdmin) {
          return { id: "static-admin", email: credentials.email };
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user?.passwordHash) {
          return null;
        }

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) {
          return null;
        }

        return { id: user.id, email: user.email };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.isStaticAdmin = user.id === "static-admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.email = String(token.email);
        session.user.isStaticAdmin = Boolean(token.isStaticAdmin);
      }
      return session;
    }
  }
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !session.user.id) {
    return null;
  }
  return {
    id: session.user.id,
    email: session.user.email,
    isStaticAdmin: Boolean(session.user.isStaticAdmin)
  };
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export function isStaticAdmin(credentials: { email: string; password: string }) {
  const enabled = process.env.ENABLE_STATIC_ADMIN !== "false";
  if (!enabled) return false;
  return credentials.email === "admin@admin.com" && credentials.password === "admin123";
}
