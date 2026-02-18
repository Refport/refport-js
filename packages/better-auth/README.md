# @refport/better-auth

[Better Auth](https://www.better-auth.com/) plugin for [Refport](https://refport.co) referral tracking. Automatically tracks sign-up conversions as leads when users register through a referral link.

## Installation

```bash
npm install @refport/better-auth refport
```

## Server Setup

Add the plugin to your Better Auth server configuration:

```ts
import { betterAuth } from "better-auth";
import { refportPlugin } from "@refport/better-auth";
import { Refport } from "refport";

const refport = new Refport({ apiKey: process.env.REFPORT_API_KEY! });

export const auth = betterAuth({
  plugins: [
    refportPlugin({
      refport,
    }),
  ],
});
```

## Client Setup

Add the client plugin for type inference:

```ts
import { createAuthClient } from "better-auth/client";
import { refportPluginClient } from "@refport/better-auth/client";

export const authClient = createAuthClient({
  plugins: [refportPluginClient()],
});
```

## Options

| Option            | Type                           | Default      | Description                                 |
| ----------------- | ------------------------------ | ------------ | ------------------------------------------- |
| `refport`         | `Refport`                      | **required** | Refport SDK instance                        |
| `eventName`       | `string`                       | `"Sign Up"`  | Event name for the lead conversion          |
| `cookieName`      | `string`                       | `"refp_id"`  | Name of the cookie that stores the click ID |
| `customLeadTrack` | `(user, ctx) => Promise<void>` | —            | Override the default tracking logic         |

## How It Works

1. A visitor clicks a referral link and lands on your site
2. The `refport-js` browser SDK captures the `refp_id` URL parameter into a cookie
3. The visitor signs up using Better Auth
4. This plugin's `user.create.after` database hook fires:
   - Reads the `refp_id` cookie from the request
   - Calls `refport.track.lead()` with the user's details
   - Clears the cookie
5. The referral is now attributed in your Refport dashboard

Errors during tracking are logged but never block the sign-up flow.
