# Chat

A standalone, WhatsApp-inspired username-based messaging web app. This repository is independent of CineFlix.

## Features
- Username entry without an email/password form
- Search for users by username
- One-to-one text conversations
- Responsive mobile and desktop interface
- Cloudflare Pages Functions + D1 database backend
- Automatic message refresh every 2.5 seconds

## Deploy on Cloudflare Pages
1. Create a Cloudflare D1 database named `chat-db`.
2. In the D1 console, run the SQL in `schema.sql`.
3. Connect this GitHub repository to a new Cloudflare Pages project.
4. In Pages project **Settings → Functions → D1 database bindings**, add a binding:
   - Variable name: `CHAT_DB`
   - Database: `chat-db`
5. Redeploy the project.

No build command is required; the site is static HTML/CSS/JS with Pages Functions.

## Important security note
This starter uses username-only identity, so usernames are not proof of identity and users can impersonate one another. The current API is a prototype, not suitable for sensitive/private conversations. Before public production use, add real authentication, server-verified sessions, rate limits, abuse controls, and message privacy protections. The browser must send a signed session rather than choosing its own sender identity.

## Local preview
Serve the repository with a Cloudflare Pages-compatible local runtime after configuring a local D1 database binding named `CHAT_DB`.
