# OpenAI Agents SDK + Groundsocial MCP

```bash
pip install openai-agents
export OPENAI_API_KEY=sk-... GROUNDSOCIAL_API_KEY=gs_live_...
python agent.py "What are people on Reddit saying about the OpenAI Agents SDK?"
python hosted_mcp.py "Summarize https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

- `agent.py` runs the MCP client in your process (`MCPServerStreamableHttp`) with a tool allowlist.
- `hosted_mcp.py` uses `HostedMCPTool`, so OpenAI's Responses API calls Groundsocial directly.
- `check_mcp.py` checks the wiring without a model (no OpenAI key needed).
