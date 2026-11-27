function validName(value) { return typeof value === "string" && /^[a-z0-9_]{3,24}$/.test(value); }
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const me = (url.searchParams.get("me") || "").toLowerCase();
  const peer = (url.searchParams.get("with") || "").toLowerCase();
  if (!validName(me) || !validName(peer) || me === peer) return Response.json({ error: "Invalid conversation." }, { status: 400 });
  try {
    const result = await env.CHAT_DB.prepare("SELECT sender, recipient, body, created_at FROM messages WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?) ORDER BY id ASC LIMIT 300").bind(me, peer, peer, me).all();
    return Response.json({ messages: result.results || [] });
  } catch { return Response.json({ error: "Chat database is not configured yet." }, { status: 503 }); }
}
export async function onRequestPost({ request, env }) {
  try {
    const { to, body } = await request.json();
    const from = (request.headers.get("x-chat-user") || "").toLowerCase();
    if (!validName(from) || !validName(to) || from === to || typeof body !== "string" || !body.trim() || body.length > 4000) return Response.json({ error: "Invalid message." }, { status: 400 });
    const sender = await env.CHAT_DB.prepare("SELECT username FROM users WHERE username = ?").bind(from).first();
    const recipient = await env.CHAT_DB.prepare("SELECT username FROM users WHERE username = ?").bind(to).first();
    if (!sender || !recipient) return Response.json({ error: "Both users must exist before messaging." }, { status: 404 });
    await env.CHAT_DB.prepare("INSERT INTO messages (sender, recipient, body) VALUES (?, ?, ?)").bind(from, to, body.trim()).run();
    return Response.json({ sent: true });
  } catch { return Response.json({ error: "Chat database is not configured yet." }, { status: 503 }); }
}