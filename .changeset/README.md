# Changesets

This repo uses [changesets](https://github.com/changesets/changesets) for versioning and publishing.

## Adding a changeset

```bash
pnpm changeset
```

Follow the prompts to select which packages changed and the semver bump type.

## Publishing

Merging to `main` with pending changesets triggers the release workflow, which either opens a version PR or publishes to npm.
