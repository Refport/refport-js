# @refport/react

React component for embedding the [Refport](https://refport.co) referral portal.

## Install

```bash
npm install @refport/react
```

## Usage

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

## Props

| Prop | Type | Description |
|------|------|-------------|
| `token` | `string` | Public embed token (required) |
| `theme` | `"light" \| "dark" \| "system"` | Color theme |
| `themeOptions` | `object` | Custom colors (`backgroundColor`, `primaryColor`, `textColor`) |
| `cssVars` | `Record<string, string>` | Custom CSS variables |
| `baseUrl` | `string` | API base URL (defaults to `https://app.refport.co`) |
| `onError` | `(error) => void` | Error callback |

All standard `<div>` props (except `children`) are also forwarded to the wrapper element.

## License

MIT
