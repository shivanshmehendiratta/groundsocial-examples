"""The same idea with OpenAI's hosted MCP tool: the Responses API calls Groundsocial for you.

    pip install openai-agents
    export OPENAI_API_KEY=sk-... GROUNDSOCIAL_API_KEY=gs_live_...
    python hosted_mcp.py "Summarize this video: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
"""

import asyncio
import os
import sys

from agents import Agent, HostedMCPTool, Runner


async def main(question: str) -> None:
    agent = Agent(
        name="Social researcher",
        instructions="Use the Groundsocial tools to read public social data. Cite links.",
        model="gpt-5-mini",
        tools=[
            HostedMCPTool(
                tool_config={
                    "type": "mcp",
                    "server_label": "groundsocial",
                    "server_url": "https://api.groundsocial.dev/mcp",
                    "headers": {"Authorization": f"Bearer {os.environ['GROUNDSOCIAL_API_KEY']}"},
                    "allowed_tools": ["utility_find_get", "youtube_video_transcript", "reddit_search_posts"],
                    "require_approval": "never",
                }
            )
        ],
    )
    result = await Runner.run(agent, question)
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main(" ".join(sys.argv[1:]) or "What is trending on Reddit about AI agents today?"))
