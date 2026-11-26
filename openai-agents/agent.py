"""An OpenAI Agents SDK agent that researches social media through the Groundsocial MCP server.

    pip install openai-agents
    export OPENAI_API_KEY=sk-... GROUNDSOCIAL_API_KEY=gs_live_...
    python agent.py "What are people on Reddit saying about the OpenAI Agents SDK?"
"""

import asyncio
import os
import sys

from agents import Agent, Runner
from agents.mcp import MCPServerStreamableHttp, create_static_tool_filter

# The server exposes every endpoint (~590 tools). Give the agent the few it needs:
# utility_find_get finds the right endpoint for anything else.
TOOLS = [
    "utility_find_get",
    "reddit_search_posts",
    "reddit_post_get",
    "hackernews_search_stories",
    "youtube_search_videos",
    "youtube_video_transcript",
]


async def main(question: str) -> None:
    async with MCPServerStreamableHttp(
        name="groundsocial",
        params={
            "url": "https://api.groundsocial.dev/mcp",
            "headers": {"Authorization": f"Bearer {os.environ['GROUNDSOCIAL_API_KEY']}"},
            "timeout": 60,
        },
        client_session_timeout_seconds=60,
        cache_tools_list=True,
        tool_filter=create_static_tool_filter(allowed_tool_names=TOOLS),
    ) as groundsocial:
        agent = Agent(
            name="Social researcher",
            instructions=(
                "You research what people say online. Use the Groundsocial tools to read Reddit, Hacker News and "
                "YouTube. Quote real posts with links. Say how many sources you read."
            ),
            mcp_servers=[groundsocial],
            model="gpt-5-mini",
        )
        result = await Runner.run(agent, question, max_turns=12)
        print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main(" ".join(sys.argv[1:]) or "What are developers saying about MCP servers this week?"))
