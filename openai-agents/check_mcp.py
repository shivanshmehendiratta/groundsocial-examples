"""Checks the MCP wiring used by agent.py without calling a model: connect, list the filtered tools, call two.

    GROUNDSOCIAL_API_KEY=gs_live_... python check_mcp.py
"""

import asyncio
import os

from agents.mcp import MCPServerStreamableHttp, create_static_tool_filter

from agent import TOOLS


async def main() -> None:
    async with MCPServerStreamableHttp(
        name="groundsocial",
        params={
            "url": "https://api.groundsocial.dev/mcp",
            "headers": {"Authorization": f"Bearer {os.environ['GROUNDSOCIAL_API_KEY']}"},
            "timeout": 60,
        },
        client_session_timeout_seconds=60,
        tool_filter=create_static_tool_filter(allowed_tool_names=TOOLS),
    ) as server:
        tools = await server.list_tools()
        names = sorted(t.name for t in tools)
        assert names == sorted(TOOLS), names
        print("tools:", names)
        found = await server.call_tool("utility_find_get", {"task": "tiktok video comments"})
        print("utility_find_get:", found.content[0].text[:120])
        posts = await server.call_tool("reddit_search_posts", {"q": "openai agents sdk", "limit": 2})
        assert not posts.is_error, posts.content[0].text[:300]
        print("reddit_search_posts:", posts.content[0].text[:160])
        print("ok")


if __name__ == "__main__":
    asyncio.run(main())
