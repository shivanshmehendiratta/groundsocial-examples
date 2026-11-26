# @groundsocial/piece-groundsocial

An [Activepieces](https://www.activepieces.com) piece. Actions: **Call Endpoint** (any of ~590 endpoints, picked from
a dropdown), **Find Endpoints** (free), **Search Reddit Posts**, **Get YouTube Transcript**. Auth is a Groundsocial API
key, checked with one 1-credit call.

Activepieces paused outside pull requests to its repo, so this is published as a community npm piece. Once it is on
npm: **Settings → My Pieces → Install Piece →** `@groundsocial/piece-groundsocial`.

```bash
npm install
GROUNDSOCIAL_API_KEY=gs_live_... npm test     # 7 tests, live ones need the key
npm run build
```

Built against `@activepieces/pieces-framework` 0.32. Tested by running each action's `run()` against the live API;
not yet installed in a running Activepieces instance.
