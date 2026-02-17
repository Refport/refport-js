# refport

Official Node.js SDK for [Refport](https://refport.co) — referral tracking and partner management.

## Install

```bash
npm install refport
```

## Quick Start

```ts
import { Refport } from "refport";

const refport = new Refport({ apiKey: "rk_..." });

const { publicToken } = await refport.embedTokens.create({
  programId: "prog_...",
  partner: { email: "partner@example.com" },
});

await refport.track.sale({
  clickId: "clk_...",
  customerExternalId: "cus_123",
  amount: 4999,
  currency: "usd",
});

await refport.track.lead({
  clickId: "clk_...",
  eventName: "signup",
  customerExternalId: "cus_123",
});
```

## Configuration

```ts
const refport = new Refport({
  apiKey: "rk_...",
  baseUrl: "https://app.refport.co", // optional, defaults to production
});
```

## Embed Tokens

### `refport.embedTokens.create(params)`

Creates a public embed token for the referral portal.

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `programId` | `string` | Yes | Program ID |
| `tenantId` | `string` | No | Tenant ID |
| `referralId` | `string` | No | Referral ID |
| `partner.email` | `string` | No | Partner email (auto-creates partner) |
| `partner.name` | `string` | No | Partner name |

Returns `{ publicToken: string, expires: Date }`.

## Tracking

### `refport.track.sale(params)`

Records a sale conversion.

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `clickId` | `string` | Yes | Click ID from the tracking cookie |
| `customerExternalId` | `string` | Yes | Your customer ID |
| `amount` | `number` | Yes | Sale amount in cents |
| `currency` | `string` | No | Currency code (e.g. `"usd"`) |
| `eventName` | `string` | No | Custom event name |
| `invoiceId` | `string` | No | Invoice ID |
| `paymentProcessor` | `string` | No | `"stripe"`, `"shopify"`, `"polar"`, `"paddle"`, `"revenuecat"`, or `"custom"` |
| `customerEmail` | `string` | No | Customer email |
| `customerName` | `string` | No | Customer name |
| `customerAvatar` | `string` | No | Customer avatar URL |
| `metadata` | `Record<string, unknown>` | No | Custom metadata |

### `refport.track.lead(params)`

Records a lead conversion. Returns `null` if the click has no associated link.

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `clickId` | `string` | Yes | Click ID from the tracking cookie |
| `eventName` | `string` | Yes | Event name (e.g. `"signup"`) |
| `customerExternalId` | `string` | Yes | Your customer ID |
| `customerEmail` | `string` | No | Customer email |
| `customerName` | `string` | No | Customer name |
| `customerAvatar` | `string` | No | Customer avatar URL |
| `metadata` | `Record<string, unknown>` | No | Custom metadata |

## Server-Side Helpers

### `getClickIdFromRequest(req, cookieName?)`

Extracts the click ID from a server request. Works with Express (`req.cookies`), Web API `Request` objects, and plain `{ headers }` objects.

```ts
import { getClickIdFromRequest } from "refport";

// Express
app.post("/api/checkout", (req, res) => {
  const clickId = getClickIdFromRequest(req);
});

// Web API (Next.js, Remix, etc.)
export async function POST(request: Request) {
  const clickId = getClickIdFromRequest(request);
}
```

### `getClickIdFromCookie(cookieHeader, cookieName?)`

Parses a raw `Cookie` header string and returns the click ID.

```ts
import { getClickIdFromCookie } from "refport";

const clickId = getClickIdFromCookie(req.headers.cookie);
```

## Error Handling

All API methods throw typed errors on failure:

| Error Class | Status | Code |
|-------------|--------|------|
| `RefportAuthError` | 401 | `UNAUTHORIZED` |
| `RefportNotFoundError` | 404 | `NOT_FOUND` |
| `RefportValidationError` | 422 | `VALIDATION_ERROR` |
| `RefportRateLimitError` | 429 | `RATE_LIMITED` |
| `RefportError` | other | varies |

```ts
import { Refport, RefportValidationError } from "refport";

try {
  await refport.track.sale(params);
} catch (err) {
  if (err instanceof RefportValidationError) {
    console.error(err.message, err.status, err.code);
  }
}
```

## License

MIT
