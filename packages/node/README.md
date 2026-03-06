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

const { data: token, error } = await refport.embedTokens.create({
  tenantId: "user_123",
  partner: { email: "partner@example.com" },
});

const { error: saleError } = await refport.track.sale({
  clickId: "clk_...",
  customerExternalId: "cus_123",
  amount: 4999,
  currency: "usd",
});

const { data: lead } = await refport.track.lead({
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

At least one of `tenantId`, `enrollmentId`, or `partner` must be provided.

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `tenantId` | `string` | No | Your internal tenant/customer ID |
| `enrollmentId` | `string` | No | Existing enrollment ID |
| `partner.email` | `string` | No | Partner email (auto-creates and enrolls partner) |
| `partner.name` | `string` | No | Partner name |

Returns `{ data: { publicToken: string, expires: Date }, error: null }` on success, or `{ data: null, error: RefportError }` on failure.

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

All API methods return a `Result<T>` — a discriminated union of `{ data: T, error: null }` or `{ data: null, error: RefportError }`. No exceptions are thrown for API errors.

```ts
import { Refport, RefportValidationError } from "refport";

const { data, error } = await refport.track.sale(params);

if (error) {
  console.error(error.message, error.status, error.code);

  if (error instanceof RefportValidationError) {
    /* handle validation specifically */
  }
  return;
}

/* data is typed as TrackSaleResponse here */
console.log(data.sale.id);
```

| Error Class | Status | Code |
|-------------|--------|------|
| `RefportAuthError` | 401 | `UNAUTHORIZED` |
| `RefportNotFoundError` | 404 | `NOT_FOUND` |
| `RefportValidationError` | 422 | `VALIDATION_ERROR` |
| `RefportRateLimitError` | 429 | `RATE_LIMITED` |
| `RefportError` | other | varies |

## License

MIT
