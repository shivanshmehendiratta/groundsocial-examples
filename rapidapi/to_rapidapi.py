"""Convert Groundsocial's OpenAPI 3.1 spec into an OpenAPI 3.0.3 file RapidAPI Hub can import.

    python3 to_rapidapi.py [input.json|url] [output.json]

What it changes:
- 3.1 -> 3.0.3: `type: [x, "null"]` becomes `type: x` + `nullable: true`, schema `examples: [...]` becomes
  `example`, numeric `exclusiveMinimum/Maximum` become `minimum/maximum` + boolean flags, `webhooks` dropped.
- Keeps only the public data endpoints (API-key secured) and the free utility/platform endpoints. Account, key,
  billing, sign-in and agent-signup endpoints are dropped: on RapidAPI, Rapid handles keys and billing.
- Removes the security schemes (RapidAPI adds its own X-RapidAPI-Key; the provider key is set once as a secret
  header in the Gateway settings).
- Adds one tag per platform so RapidAPI groups the endpoints.
"""

import json
import sys
import urllib.request

SRC = sys.argv[1] if len(sys.argv) > 1 else "https://api.groundsocial.dev/openapi.json"
OUT = sys.argv[2] if len(sys.argv) > 2 else "groundsocial-rapidapi-openapi-3.0.json"
DROP_PREFIXES = ("/v1/auth", "/v1/accounts", "/v1/me", "/v1/agent", "/v1/credits")


def load(src):
    if src.startswith("http"):
        with urllib.request.urlopen(src, timeout=120) as r:
            return json.load(r)
    return json.load(open(src))


def fix_schema(o):
    if isinstance(o, list):
        return [fix_schema(v) for v in o]
    if not isinstance(o, dict):
        return o
    o = {k: fix_schema(v) for k, v in o.items()}
    t = o.get("type")
    if isinstance(t, list):
        rest = [x for x in t if x != "null"]
        if "null" in t:
            o["nullable"] = True
        if len(rest) == 1:
            o["type"] = rest[0]
        elif rest:
            o.pop("type")
            o["anyOf"] = [{"type": x} for x in rest]
        else:
            o.pop("type")
    if isinstance(o.get("examples"), list):
        ex = o.pop("examples")
        if ex and "example" not in o:
            o["example"] = ex[0]
    for k, flag in (("exclusiveMinimum", "minimum"), ("exclusiveMaximum", "maximum")):
        v = o.get(k)
        if isinstance(v, (int, float)) and not isinstance(v, bool):
            o[flag] = v
            o[k] = True
    for key in ("anyOf", "oneOf"):
        alts = o.get(key)
        if isinstance(alts, list) and any(a == {"type": "null"} for a in alts):
            alts = [a for a in alts if a != {"type": "null"}]
            o["nullable"] = True
            if len(alts) == 1 and not any(k in o for k in ("type", "properties", "$ref")):
                o.pop(key)
                o.update(alts[0]) if "$ref" not in alts[0] else o.update({"allOf": alts})
            else:
                o[key] = alts
    if o.get("type") == "null":
        o.pop("type")
        o["nullable"] = True
    pat = o.get("pattern")
    if isinstance(pat, str):
        # The source spec writes some patterns JS-style ("...$/u") with \p{Cc}; 3.0 tools expect plain ECMA regexes.
        if pat.endswith("/u"):
            pat = pat[:-2]
        o["pattern"] = pat.replace("\\p{Cc}", "\\x00-\\x1F\\x7F")
    if "const" in o:
        o["enum"] = [o.pop("const")]
    return o


def prune_components(spec):
    """Drop component schemas nothing references any more (account and signup models)."""
    schemas = spec["components"].get("schemas", {})
    while True:
        text = json.dumps({k: v for k, v in spec.items() if k != "components"}) + json.dumps(
            {k: v for k, v in spec["components"].items()}
        )
        unused = [name for name in schemas if f'"#/components/schemas/{name}"' not in text]
        if not unused:
            return
        for name in unused:
            schemas.pop(name)


def main():
    spec = load(SRC)
    out = {
        "openapi": "3.0.3",
        "info": {**spec["info"], "title": "Groundsocial", "x-logo": {"url": "https://storage.googleapis.com/supersend-public-assets/groundsocial/press/logo-mark-512.png"}},
        "servers": spec["servers"],
        "tags": [],
        "paths": {},
        "components": {k: v for k, v in spec.get("components", {}).items() if k != "securitySchemes"},
    }
    tags = {}
    for path, item in spec["paths"].items():
        if path.startswith(DROP_PREFIXES):
            continue
        new_item = {}
        for method, op in item.items():
            if method not in ("get", "post", "put", "patch", "delete"):
                continue
            sec = [list(s) for s in (op.get("security") or [])]
            if any("session" in s for s in sec):
                continue
            op = dict(op)
            op.pop("security", None)
            platform = (op.get("operationId") or path.split("/")[2]).split(".")[0]
            tags.setdefault(platform, platform)
            op["tags"] = [platform]
            new_item[method] = fix_schema(op)
        if new_item:
            out["paths"][path] = new_item
    out["components"] = fix_schema(out["components"])
    prune_components(out)
    out["tags"] = [{"name": t} for t in sorted(tags)]
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, separators=(",", ":"), ensure_ascii=False)
    n = sum(len(v) for v in out["paths"].values())
    print(f"{OUT}: {n} operations, {len(tags)} tags, {len(json.dumps(out)) / 1e6:.2f} MB")


if __name__ == "__main__":
    main()
