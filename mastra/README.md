# Mastra + Groundsocial MCP

```bash
npm install
GROUNDSOCIAL_API_KEY=gs_live_... npm run check                       # wiring check, no model
OPENAI_API_KEY=sk-... GROUNDSOCIAL_API_KEY=gs_live_... npm start -- "What are people saying about Mastra?"
```

`groundsocial.ts` creates the `MCPClient` and keeps six tools; Mastra prefixes them with the server name
(`groundsocial_reddit_search_posts`).
