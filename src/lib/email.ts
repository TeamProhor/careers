import { Resend } from "resend";

export async function sendApplicationConfirmation({
  email,
  name,
  jobTitle,
}: {
  email: string;
  name: string;
  jobTitle: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set. Skipping confirmation email.");
    return false;
  }

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM || "Prohor Careers <careers@prohor.dev>";

  try {
    await resend.emails.send({
      from,
      to: email,
      subject: "প্রহর ক্যারিয়ার - আবেদন গৃহীত হয়েছে",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 12px;">
          <h2 style="color: #111; font-size: 20px; font-weight: 600;">আবেদন গৃহীত হয়েছে</h2>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            হ্যালো ${name},
          </p>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            আপনার <strong>${jobTitle}</strong> পদে আবেদন সফলভাবে গৃহীত হয়েছে।
          </p>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            আমাদের টিম আপনার আবেদন পর্যালোচনা করবে এবং প্রয়োজনে আপনার সাথে যোগাযোগ করবে।
          </p>
          <div style="margin: 28px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://careers.prohor.dev"}" style="background-color: #000; color: #fff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: 500; display: inline-block;">
              ক্যারিয়ার পেজ দেখুন
            </a>
          </div>
          <p style="color: #999; font-size: 12px; line-height: 1.5;">
            এই ইমেইলটি স্বয়ংক্রিয়ভাবে প্রেরিত হয়েছে।
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    return false;
  }
}
