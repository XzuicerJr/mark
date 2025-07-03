import { auth } from "./auth";

export interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export const getSession = async () => {
  return auth() as Promise<Session | null>;
};
