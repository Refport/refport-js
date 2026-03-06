# refport-js

Browser SDK for [Refport](https://refport.co) — captures referral click IDs from URLs, stores them in cookies for conversion attribution, and embeds the referral portal.

## Install

```bash
npm install refport-js
```

## Embed Portal

```ts
import { createEmbed } from "refport-js";

const embed = createEmbed(document.getElementById("portal")!, {
  token: "pub_...",
  theme: "light",
  cssVars: { "--accent": "#ff6600" },
  onError: (err) => console.error(err.message),
});

embed.destroy();
```

### `createEmbed(target, options)`

Mounts a Refport referral portal iframe into the given DOM element. Returns a `RefportEmbedInstance` with:

- `container` — the wrapper `<div>` element
- `iframe` — the `<iframe>` element
- `destroy()` — removes the embed and cleans up event listeners

### Embed Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `token` | `string` | — | Public embed token (required) |
| `theme` | `"light" \| "dark" \| "system"` | — | Color theme |
| `cssVars` | `Record<string, string>` | — | Custom CSS variables |
| `baseUrl` | `string` | `"https://app.refport.co"` | API base URL |
| `onError` | `(error: { code: string; message: string }) => void` | — | Error callback |

## Click Tracking

```ts
import { init, getClickId, reset } from "refport-js";

const result = init();

if (result.clickId) {
  console.log(`Click ID: ${result.clickId} (from ${result.source})`);
}

const clickId = getClickId();

reset();
```

### `init(options?)`

Checks the URL for a `refp_id` query parameter. If found, stores it in a cookie and optionally strips the parameter from the URL. Falls back to reading an existing cookie.

Returns a `RefportTrackingResult`:

```ts
{ tracked: boolean; clickId: string | null; source: "url" | "cookie" | null }
```

- `tracked: true` — a new click ID was captured from the URL
- `tracked: false, source: "cookie"` — click ID was already stored
- `tracked: false, source: null` — no click ID found

### `getClickId(cookieName?)`

Reads the click ID from the cookie. Returns `string | null`.

### `reset(options?)`

Deletes the tracking cookie. Accepts `cookieName`, `path`, and `domain` options.

### Tracking Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cookieName` | `string` | `"refp_id"` | Cookie name |
| `paramName` | `string` | `"refp_id"` | URL query parameter name |
| `maxAge` | `number` | `7776000` (90 days) | Cookie max age in seconds |
| `path` | `string` | `"/"` | Cookie path |
| `domain` | `string` | — | Cookie domain |
| `sameSite` | `"Strict" \| "Lax" \| "None"` | `"Lax"` | Cookie SameSite attribute |
| `secure` | `boolean` | Auto-detected from protocol | Cookie Secure flag |
| `cleanUrl` | `boolean` | `true` | Remove the query parameter from the URL after capture |

## License

MIT
