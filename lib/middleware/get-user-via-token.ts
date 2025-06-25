import { UserProps } from "@/lib/types";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export async function getUserViaToken(req: NextRequest) {
  const session = (await getToken({
    cookieName: `${
      VERCEL_DEPLOYMENT ? "__Secure-" : ""
    }next-auth.mark.session-token`,
    req,
    secret: process.env.AUTH_SECRET,
  })) as {
    email?: string;
    user?: UserProps;
  };

  return session?.user;
}
