export async function onRequestPost({ request, env }) {
  try {
    const { username } = await request.json();
    if (typeof username !== "string" || !/^[a-zA-Z0-9_]{3,24}$/.test(username)) return Response.json({ error: "Username must be 3–24 letters, numbers, or underscores." }, { status: 400 });
    const name = username.toLowerCase();
    await env.CHAT_DB.prepare("INSERT OR IGNORE INTO users (username) VALUES (?)").bind(name).run();
    return Response.json({ username: name });
  } catch { return Response.json({ error: "Chat database is not configured yet." }, { status: 503 }); }
}
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").toLowerCase().trim();
  if (!q || q.length > 24) return Response.json({ users: [] });
  try {
    const result = await env.CHAT_DB.prepare("SELECT username FROM users WHERE username LIKE ? ORDER BY username LIMIT 30").bind("%" + q + "%").all();
    return Response.json({ users: (result.results || []).map(row => ({ username: row.username })) });
  } catch { return Response.json({ error: "Chat database is not configured yet." }, { status: 503 }); }
}