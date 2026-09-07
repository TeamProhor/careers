import { Resend } from "resend";

export async function sendMagicLinkEmail({
  email,
  url,
}: {
  email: string;
  url: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "RESEND_API_KEY is not set. Skipping sending magic link email.",
    );
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM || "Prohor Auth <auth@prohor.dev>";

  return resend.emails.send({
    from,
    to: email,
    subject: "প্রহর ক্যারিয়ার - সাইন ইন করার ম্যাজিক লিংক",
    html: `
			<div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 12px;">
				<h2 style="color: #111; font-size: 20px; font-weight: 600;">প্রহর ক্যারিয়ার-এ স্বাগতম</h2>
				<p style="color: #666; font-size: 14px; line-height: 1.6;">
					আপনার অ্যাকাউন্টে সাইন ইন করতে এবং আবেদন সম্পন্ন করতে নিচের বাটনে ক্লিক করুন:
				</p>
				<div style="margin: 28px 0;">
					<a href="${url}" style="background-color: #000; color: #fff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: 500; display: inline-block;">
						সাইন ইন করুন
					</a>
				</div>
				<p style="color: #999; font-size: 12px; line-height: 1.5;">
					এই লিংকটির মেয়াদ ১৫ মিনিট। আপনি যদি এই অনুরোধ না করে থাকেন তবে এটি উপেক্ষা করুন।
				</p>
			</div>
		`,
  });
}
