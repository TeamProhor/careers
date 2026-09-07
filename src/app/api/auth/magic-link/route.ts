import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { sendMagicLinkEmail } from "@/lib/auth/email";
import { db } from "@/lib/db";
import { verificationTokens } from "@/lib/db/schema";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "সঠিক ইমেইল ঠিকানা প্রদান করুন" },
        { status: 400 },
      );
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.email, email));

    await db.insert(verificationTokens).values({
      email,
      token,
      expiresAt,
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (req.headers.get("host")
        ? `${req.headers.get("x-forwarded-proto") || "http"}://${req.headers.get("host")}`
        : "https://careers.prohor.dev");

    const magicLinkUrl = `${baseUrl.replace(/\/$/, "")}/api/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;

    await sendMagicLinkEmail({
      email,
      url: magicLinkUrl,
    });

    return NextResponse.json({
      success: true,
      message: "আপনার ইমেইলে একটি ম্যাজিক লিংক পাঠানো হয়েছে",
    });
  } catch (err: unknown) {
    console.error("Magic link error:", err);
    return NextResponse.json(
      { success: false, error: "ম্যাজিক লিংক পাঠাতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।" },
      { status: 500 },
    );
  }
}
