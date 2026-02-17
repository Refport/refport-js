# @refport/react

React SDK for [Refport](https://refport.co) — embed the referral portal and track referral clicks.

Ships with a `"use client"` banner, compatible with Next.js App Router out of the box.

## Install

```bash
npm install @refport/react
```

## Embed Portal

```tsx
import { RefportEmbed } from "@refport/react";

function ReferralPage() {
  return (
    <RefportEmbed
      token="pub_..."
      theme="light"
      onError={(err) => console.error(err.message)}
    />
  );
}
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `token` | `string` | Public embed token (required) |
| `theme` | `"light" \| "dark" \| "system"` | Color theme |
| `themeOptions` | `{ backgroundColor?, primaryColor?, textColor? }` | Custom theme colors |
| `cssVars` | `Record<string, string>` | Custom CSS variables |
| `baseUrl` | `string` | API base URL (defaults to `https://app.refport.co`) |
| `onError` | `(error: { code: string; message: string }) => void` | Error callback |

All standard `<div>` props (except `children`) are also forwarded to the wrapper element.

## Click Tracking

### `useRefportTracking(options?)`

React hook that captures the `refp_id` URL parameter on mount and stores it in a cookie. Wraps the `refport-js` SDK.

```tsx
import { useRefportTracking } from "@refport/react";

function App() {
  const { tracked, clickId, source } = useRefportTracking();

  useEffect(() => {
    if (clickId) {
      console.log(`Tracking: ${clickId} (from ${source})`);
    }
  }, [clickId]);

  return <>{/* your app */}</>;
}
```

Returns a `RefportTrackingResult`:

```ts
{ tracked: boolean; clickId: string | null; source: "url" | "cookie" | null }
```

Accepts `RefportTrackingOptions` — see [refport-js](https://www.npmjs.com/package/refport-js) for the full options list.

### `<RefportTracker>`

Renderless component alternative to the hook. Fires `onTrack` when a click ID is detected.

```tsx
import { RefportTracker } from "@refport/react";

function App() {
  return (
    <>
      <RefportTracker onTrack={(result) => console.log(result.clickId)} />
      {/* your app */}
    </>
  );
}
```

| Prop | Type | Description |
|------|------|-------------|
| `options` | `RefportTrackingOptions` | Tracking configuration |
| `onTrack` | `(result: RefportTrackingResult) => void` | Called when a click ID is present |

### `getClickId(cookieName?)`

Reads the click ID from the cookie. Returns `string | null`. Re-exported from `refport-js`.

### `reset(options?)`

Deletes the tracking cookie. Re-exported from `refport-js`.

## License

MIT
