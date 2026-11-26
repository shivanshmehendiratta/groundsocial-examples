# RapidAPI

RapidAPI's OpenAPI import documents Swagger 2.0 and OpenAPI 3.0.x. Groundsocial's spec is OpenAPI 3.1
(`https://api.groundsocial.dev/openapi.json`), so `to_rapidapi.py` produces a 3.0.3 file:

```bash
python3 to_rapidapi.py https://api.groundsocial.dev/openapi.json groundsocial-rapidapi-openapi-3.0.json
```

It converts 3.1-only constructs (`type: [x, "null"]`, `{"type": "null"}` alternatives, schema `examples` arrays,
numeric `exclusiveMinimum`), keeps the 593 data and utility endpoints, drops account/billing/sign-in endpoints
(RapidAPI handles keys and billing), removes the security schemes (RapidAPI sends its own key; set the Groundsocial
key once as a secret `Authorization: Bearer ...` header in the Gateway settings) and adds one tag per platform (85)
so RapidAPI groups the endpoints. The output passes `openapi-spec-validator` and is about 2.2 MB.

`groundsocial-rapidapi-openapi-3.0.json` is the file generated on 2026-11-26.
