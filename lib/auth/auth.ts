import NextAuth from "next-auth";
import { authOptions } from "./options";

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
