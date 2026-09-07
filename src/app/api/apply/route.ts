import { NextResponse } from "next/server";
import { sendApplicationConfirmation } from "@/lib/email";
import { sendTelegramMessage, formatApplicationMessage } from "@/lib/telegram";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, jobTitle, jobId, workLinks } = body;

    if (!name || !email || !jobTitle || !jobId) {
      return NextResponse.json(
        { success: false, error: "সমস্ত প্রয়োজনীয় তথ্য পূরণ করুন" },
        { status: 400 },
      );
    }

    if (!Array.isArray(workLinks) || workLinks.length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: "অনুগ্রহ করে কাজের অন্তত ৩টি লিঙ্ক প্রদান করুন",
        },
        { status: 400 },
      );
    }

    const telegramMsg = formatApplicationMessage({
      name,
      email,
      phone,
      jobTitle,
      jobId,
      workLinks,
    });

    const telegramSent = await sendTelegramMessage(telegramMsg);

    const emailSent = await sendApplicationConfirmation({
      email,
      name,
      jobTitle,
    });

    return NextResponse.json({
      success: true,
      data: {
        telegramSent,
        emailSent,
      },
    });
  } catch (error) {
    console.error("Apply error:", error);
    return NextResponse.json(
      { success: false, error: "আবেদন জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।" },
      { status: 500 },
    );
  }
}
