export function formatApplicationMessage(data: {
  name: string;
  email: string;
  phone?: string;
  jobTitle: string;
  jobId: string;
  workLinks: string[];
}): string {
  const lines = [
    " New Application Received!",
    "",
    ` Name: ${data.name}`,
    ` Email: ${data.email}`,
    data.phone ? ` Phone: ${data.phone}` : null,
    ` Position: ${data.jobTitle} (${data.jobId})`,
    "",
    " Work Links:",
    ...data.workLinks.map((link, i) => `  ${i + 1}. ${link}`),
    "",
    ` Time: ${new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka" })}`,
  ];

  return lines.filter(Boolean).join("\n");
}

export async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_KEY;
  const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      "NEXT_PUBLIC_TELEGRAM_BOT_KEY or NEXT_PUBLIC_TELEGRAM_CHAT_ID not set.",
    );
    return false;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      },
    );

    return res.ok;
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return false;
  }
}
