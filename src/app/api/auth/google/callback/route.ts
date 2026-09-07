import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { signJwt } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", req.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (req.headers.get("host")
      ? `${req.headers.get("x-forwarded-proto") || "http"}://${req.headers.get("host")}`
      : "https://careers.prohor.dev");
  const redirectUri = `${baseUrl.replace(/\/$/, "")}/api/auth/google/callback`;

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId || "",
        client_secret: clientSecret || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokens.access_token) {
      return NextResponse.redirect(
        new URL("/login?error=token_failed", req.url),
      );
    }

    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      },
    );
    const profile = await userRes.json();

    if (!profile.email) {
      return NextResponse.redirect(new URL("/login?error=no_email", req.url));
    }

    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, profile.email));

    if (!user) {
      const [newUser] = await db
        .insert(users)
        .values({
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          emailVerified: new Date(),
        })
        .returning();
      user = newUser;
    }

    if (!user) {
      return NextResponse.redirect(
        new URL("/login?error=user_creation_failed", req.url),
      );
    }

    const jwt = await signJwt({
      userId: user.id,
      email: user.email,
      name: user.name || undefined,
      image: user.image || undefined,
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
  } catch (err: unknown) {
    console.error("Google oauth callback error:", err);
    return NextResponse.redirect(new URL("/login?error=oauth_failed", baseUrl));
  }
}
