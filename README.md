# FDR documentation site

Standalone static documentation for Flight Data Recorder. This project is
intentionally separate from the FDR source repository and can be deployed to
any static host.

Production: <https://fdr-docs.pages.dev/>

## Run locally

```sh
npm install
npm run dev
```

## Production build

```sh
npm ci
npm run build
```

Publish the generated `dist/` directory. Navigation uses URL fragments, so it
works without server-side rewrite rules.

Deploy the production build to the existing Cloudflare Pages project with:

```sh
npx wrangler pages deploy dist --project-name fdr-docs --branch main
```

## Documentation coverage

The site contains 22 pages spanning complete user, operator, deployment,
validation, performance, security, contribution, packaging, release, and
roadmap material.
Machine-generated logs, recorded screenshots, and TSV files remain linked
evidence rather than duplicated prose. Architecture and operational flows use
native text, tables, and numbered steps so they inherit the active theme and
render consistently. See `SOURCE_MAP.md` for the source-to-route audit.

## Visual attribution

The documentation styling closely follows the Haiku User Guide, whose CSS and
alert artwork are distributed by the Haiku project under the MIT License. The
FDR wordmark and waveform artwork are original to this site. Haiku and its
logo are trademarks of their respective owners; this project is not affiliated
with or endorsed by the Haiku project.

The copied alert artwork is documented in `THIRD_PARTY_NOTICES.md`.
