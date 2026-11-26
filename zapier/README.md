# Zapier

A [Zapier Platform CLI](https://github.com/zapier/zapier-platform) app: **Call Endpoint**, **Get YouTube Transcript**
(actions) and **Search Reddit Posts** (search). Auth is a Groundsocial API key, tested with one 1-credit call.

```bash
npm install
GROUNDSOCIAL_API_KEY=gs_live_... npm test     # validates the app schema and runs each operation live
```

To publish (needs a Zapier developer account):

```bash
npm install -g zapier-platform-cli
zapier login
zapier register "Groundsocial"
zapier push
```
