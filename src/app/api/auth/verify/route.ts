import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { signJwt } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db/schema";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email");

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (req.headers.get("host")
      ? `${req.headers.get("x-forwarded-proto") || "http"}://${req.headers.get("host")}`
      : "https://careers.prohor.dev");

  if (!token || !email) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_token", baseUrl),
    );
  }

  const [record] = await db
    .select()
    .from(verificationTokens)
    .where(
      and(
        eq(verificationTokens.token, token),
        eq(verificationTokens.email, email),
        gt(verificationTokens.expiresAt, new Date()),
      ),
    );

  if (!record) {
    return NextResponse.redirect(
      new URL("/login?error=expired_token", baseUrl),
    );
  }

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.token, token));

  let [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        emailVerified: new Date(),
      })
      .returning();
    user = newUser;
  }

  if (!user) {
    return NextResponse.redirect(
      new URL("/login?error=user_creation_failed", baseUrl),
    );
  }

  const jwt = await signJwt({
    userId: user.id,
    email: user.email,
    name: user.name || undefined,
    image: user.image || undefined,
    isAdmin: user.isAdmin,
  });

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });

  return NextResponse.redirect(new URL("/", baseUrl));
}
