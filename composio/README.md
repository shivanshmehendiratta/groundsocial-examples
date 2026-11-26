# Composio

Composio's built-in toolkits are added by the Composio team. Until Groundsocial is one, `groundsocial_toolkit.py`
registers two Groundsocial tools as a local toolkit with Composio's experimental local tools API (composio 0.35):
`GROUNDSOCIAL_FIND_ENDPOINTS` and `GROUNDSOCIAL_CALL_ENDPOINT`.

```bash
pip install composio httpx
export COMPOSIO_API_KEY=... GROUNDSOCIAL_API_KEY=gs_live_...
python groundsocial_toolkit.py      # prints the session's tool names
```

The tool functions were run against the live API; the Composio session part needs a Composio project key and was not
run here. Alternatively, add `https://api.groundsocial.dev/mcp` as a custom MCP server wherever your agent already
uses Composio.
