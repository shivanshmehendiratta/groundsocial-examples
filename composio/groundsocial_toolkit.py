"""Groundsocial as a local Composio toolkit (Composio's experimental local tools API, composio>=0.35).

Composio's built-in toolkits are added by the Composio team; until Groundsocial is one, this file gives a Composio
session two Groundsocial tools that run in your process.

    pip install composio httpx
    export COMPOSIO_API_KEY=... GROUNDSOCIAL_API_KEY=gs_live_...
"""

import json
import os
import re
from typing import Any, Optional
from urllib.parse import quote

import httpx
from composio import Composio
from pydantic import BaseModel, Field

BASE_URL = "https://api.groundsocial.dev"


def _request(method: str, path: str, params: Optional[dict] = None, body: Optional[dict] = None) -> Any:
    headers = {"authorization": f"Bearer {os.environ['GROUNDSOCIAL_API_KEY']}"}
    r = httpx.request(method, BASE_URL + path, params=params, json=body, headers=headers, timeout=60)
    data = r.json()
    if r.status_code >= 400:
        return {"error": data.get("error", data)}
    return data


def gs_find(task: str, platform: Optional[str] = None) -> Any:
    data = _request("GET", "/v1/utility/find", {"task": task, **({"platform": platform} if platform else {})})
    keep = ("id", "title", "summary", "credits", "inputs")
    return [{k: r.get(k) for k in keep} for r in data.get("results", [])[:8]]


_ENDPOINTS: dict = {}


def gs_call(endpoint: str, params: dict) -> Any:
    if not _ENDPOINTS:
        for ep in _request("GET", "/v1/utility/endpoints")["endpoints"]:
            _ENDPOINTS[ep["id"]] = _ENDPOINTS[ep["tool"]] = ep
    ep = _ENDPOINTS.get(endpoint)
    if ep is None:
        return {"error": {"code": "unknown_endpoint", "hint": "Use GROUNDSOCIAL_FIND_ENDPOINTS to get the id."}}
    params, path = dict(params), ep["path"]
    for name in re.findall(r"\{([^}]+)\}", path):
        if name not in params:
            return {"error": {"code": "invalid_request", "hint": f"Inputs: {', '.join(ep['inputs'])}"}}
        path = path.replace("{" + name + "}", quote(str(params.pop(name)), safe=""))
    if ep["method"] == "GET":
        return _request("GET", path, params=params)
    return _request(ep["method"], path, body=params)


class FindInput(BaseModel):
    task: str = Field(description="What you want, in plain words, e.g. 'comments on a tiktok video'")
    platform: Optional[str] = Field(default=None, description="Only this platform, e.g. 'reddit'")


class CallInput(BaseModel):
    endpoint: str = Field(description="Endpoint id, e.g. 'reddit.search.posts'")
    params: dict = Field(default_factory=dict, description="The endpoint inputs, e.g. {'q': 'composio'}")


def build_toolkit(composio: Composio):
    groundsocial = composio.experimental.Toolkit(
        slug="GROUNDSOCIAL",
        name="Groundsocial",
        description="Public posts, comments, profiles and search from 80+ platforms (Reddit, X, TikTok, YouTube...)",
    )

    @groundsocial.tool()
    def find_endpoints(input: FindInput, ctx):
        """Find the Groundsocial endpoint for a task, with its inputs (* = required) and cost. Free."""
        return {"results": gs_find(input.task, input.platform)}

    @groundsocial.tool()
    def call_endpoint(input: CallInput, ctx):
        """Call a Groundsocial endpoint by id and get the platform's JSON. Errors include a hint."""
        return {"data": gs_call(input.endpoint, input.params)}

    return groundsocial


if __name__ == "__main__":
    composio = Composio()
    session = composio.create(user_id="default", experimental={"local_toolkits": [build_toolkit(composio)]})
    print(json.dumps([t["function"]["name"] for t in session.tools()], indent=1))
