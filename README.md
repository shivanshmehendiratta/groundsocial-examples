# Groundsocial examples

Working examples and integration packages for [Groundsocial](https://groundsocial.dev), an API and MCP server for
public data from 80+ platforms (Reddit, X, TikTok, Instagram, YouTube, LinkedIn, Hacker News, GitHub, Google and
more).

| Folder | What it is | Checked against the live API |
|---|---|---|
| [openai-agents](openai-agents) | OpenAI Agents SDK agent on the Groundsocial MCP server (local `MCPServerStreamableHttp` and OpenAI's hosted MCP tool) | `check_mcp.py`: connect, filtered tool list, tool calls |
| [mastra](mastra) | Mastra agent using `@mastra/mcp` | `npm run check` |
| [vercel-ai-mcp](vercel-ai-mcp) | Vercel AI SDK with `@ai-sdk/mcp` | `npm run check` |
| [composio](composio) | Groundsocial as a local Composio toolkit | tool functions only (a Composio session needs a Composio key) |
| [activepieces-piece](activepieces-piece) | Activepieces piece (`@groundsocial/piece-groundsocial`) | `npm test` (7 tests incl. live) |
| [zapier](zapier) | Zapier Platform CLI app | `npm test` (schema validation + live calls) |
| [make](make) | Make custom app definition (base, connection, modules) | JSON only; needs a Make developer account |
| [rapidapi](rapidapi) | Converts the OpenAPI 3.1 spec to a 3.0.3 file RapidAPI can import | passes `openapi-spec-validator` |

Other packages:

- Python client: [groundsocial-python](https://github.com/shivanshmehendiratta/groundsocial-python)
- LangChain: [groundsocial-langchain](https://github.com/shivanshmehendiratta/groundsocial-langchain)
- LlamaIndex: [groundsocial-llamaindex](https://github.com/shivanshmehendiratta/groundsocial-llamaindex)
- CrewAI: [groundsocial-crewai](https://github.com/shivanshmehendiratta/groundsocial-crewai)
- Vercel AI SDK tools: [groundsocial-ai-sdk](https://github.com/shivanshmehendiratta/groundsocial-ai-sdk)
- n8n: [n8n-nodes-groundsocial](https://github.com/shivanshmehendiratta/n8n-nodes-groundsocial)
- Dify: [groundsocial-dify](https://github.com/shivanshmehendiratta/groundsocial-dify)
- Agent skills: [groundsocial-skills](https://github.com/shivanshmehendiratta/groundsocial-skills)

All examples read `GROUNDSOCIAL_API_KEY`. Get one at [groundsocial.dev](https://groundsocial.dev/app/sign-in?new=1)
(100 free credits, no card).

## A note on MCP tool counts

The MCP server exposes every endpoint as a tool (about 590). Most agent frameworks send every tool definition to
the model, so each example filters to the handful it needs and keeps `utility_find_get`, which finds the right
endpoint for anything else.

MIT licensed.
