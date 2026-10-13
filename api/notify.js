// api/notify.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
  const { type, name, email, subject, message, page, website } = req.body || {};

  // honeypot: bots ye hidden field bhar dete hain
  if (website) return res.status(200).json({ ok: true });

  const esc = (s = "") =>
    String(s).slice(0, 2000).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  let text;
  if (type === "visit") {
    const country = req.headers["x-vercel-ip-country"] || "?";
    const city = req.headers["x-vercel-ip-city"] || "?";
    text = `👀 <b>New visitor</b>\nPage: ${esc(page)}\nFrom: ${esc(decodeURIComponent(city))}, ${esc(country)}`;
  } else {
    if (!name || !email || !message)
      return res.status(400).json({ ok: false, error: "Missing fields" });
    text =
      `📩 <b>New portfolio message</b>\n\n` +
      `<b>Name:</b> ${esc(name)}\n<b>Email:</b> ${esc(email)}\n` +
      `<b>Subject:</b> ${esc(subject)}\n\n${esc(message)}`;
  }

  const tg = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: "HTML" }),
  });

  return res.status(tg.ok ? 200 : 500).json({ ok: tg.ok });
}