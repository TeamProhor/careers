import { cookies } from "next/headers";
import type { AuthSession } from "./jwt";
import { verifyJwt } from "./jwt";

export const AUTH_COOKIE_NAME = "prohor_auth_token";

export async function getCurrentUser(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyJwt(token);
}
