# CLAUDE.md

## Project Overview

Public SDKs for [Refport](https://refport.co) — referral tracking and partner management. Published to npm as `refport` (Node.js), `refport-js` (browser) and `@refport/react` (React).

## Architecture

```
packages/
  js/      → refport-js      — Browser SDK: click tracking (ESM + CJS)
  node/    → refport         — Node.js SDK (ESM-only, targets Node 22)
  react/   → @refport/react  — React SDK: embed component + tracking hook (ESM + CJS, "use client" banner)
```

pnpm workspace monorepo. No Turborepo — plain `pnpm -r run` scripts.

## Commands

```bash
pnpm build              # Build all packages (tsdown)
pnpm lint               # ESLint (flat config)
pnpm typecheck          # TypeScript check
pnpm format             # Prettier check
pnpm format:fix         # Prettier fix

pnpm changeset          # Create a changeset
pnpm version-packages   # Apply changesets (bump versions + changelog)
pnpm release            # Build + publish to npm
```

## Key Patterns

- **Build tool**: tsdown (rolldown-based). Configs in each package's `tsdown.config.ts`
- **Versioning**: Changesets with independent versioning. `.changeset/config.json` controls access and base branch
- **JS package**: Framework-agnostic browser SDK — captures `refp_id` URL param into a cookie for conversion attribution. Dependency of `@refport/react`
- **React package**: Outputs both ESM and CJS with `"use client"` banner via `outputOptions.banner` in tsdown. Includes `RefportEmbed` (portal component) and `useRefportTracking`/`RefportTracker` (click tracking)
- **Node package**: ESM-only, `@types/node` for global `fetch` types. Includes `Refport` client class and `getClickIdFromRequest()` cookie helper
- **CI/CD**: GitHub Actions — `ci.yml` (lint/typecheck/build on PR), `release.yml` (changesets/action with npm Trusted Publishers via OIDC)
- **No inline comments**: Use block comments over symbols when needed

## Publishing

Automated via GitHub Actions + npm Trusted Publishers (OIDC, no NPM_TOKEN needed). Merging a changeset to `main` triggers a "Version Packages" PR; merging that PR publishes to npm.

For manual publishing: `npm publish --access public --auth-type=web` from each package directory.

## Adding a New SDK Package

1. Create `packages/<name>/` with `package.json`, `tsconfig.json`, `tsdown.config.ts`, `src/index.ts`
2. Extend root `tsconfig.json`
3. Run `pnpm install` from root
