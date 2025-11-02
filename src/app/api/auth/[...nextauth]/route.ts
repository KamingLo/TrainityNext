import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.password || !credentials?.email) throw new Error("Isi semua field form");

        await connectDB();

        const user = await User.findOne({ email: credentials?.email }).select("+password");
        if (!user) throw new Error("User tidak ditemukan");

        const valid = await bcrypt.compare(credentials!.password, user.password);
        if (!valid) throw new Error("Password salah");

        return { id: user._id, name: user.username, email: user.email, role: user.role };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,

  // ✅ ini tempat callbacks
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const u = user as any;
        (token as any).id = u.id;
        (token as any).role = u.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        const t = token as any;
        // ensure session.user exists and then assign custom properties
        (session.user as any) = (session.user as any) || {};
        (session.user as any).id = t.id as string;
        (session.user as any).role = t.role as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
