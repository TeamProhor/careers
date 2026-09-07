interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: "HTML";
}

export async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set. Skipping Telegram notification.");
    return false;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
        } satisfies TelegramMessage),
      },
    );

    if (!res.ok) {
      console.error("Telegram API error:", res.status, await res.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return false;
  }
}

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
