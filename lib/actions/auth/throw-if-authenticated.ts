import { getSession } from "@/lib/auth";

export const throwIfAuthenticated = async ({
  next,
  ctx,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any;
}) => {
  const session = await getSession();

  if (session) {
    throw new Error("You are already logged in.");
  }

  return next({ ctx });
};
