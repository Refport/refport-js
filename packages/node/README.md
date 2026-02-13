# @refport/node

Official Node.js SDK for [Refport](https://refport.co) — referral tracking and partner management.

## Install

```bash
npm install @refport/node
```

## Quick Start

```ts
import { Refport } from "@refport/node";

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
```

## License

MIT
