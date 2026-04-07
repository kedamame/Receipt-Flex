# Receipt Flex

Receipt Flex is a dual-mode miniapp that works inside Farcaster, in Base App web surfaces, and in regular browsers. Paste a Base transaction hash and it renders a bright, shareable receipt card without needing a backend, database, cron job, or custom indexer.

## What it does

- Accepts a Base tx hash or a pasted URL that contains one.
- Fetches transaction, receipt, and block data from Base public RPC.
- Parses three MVP cases:
  - ETH transfer
  - ERC20 transfer
  - Generic contract interaction fallback
- Renders a mobile-first receipt card with 3 visual themes.
- Saves the card as PNG in the browser.
- Shares a deep link using `?tx=` and Web Share or clipboard fallback.

## Stack

- Next.js 14 App Router
- TypeScript
- wagmi + viem
- Farcaster miniapp SDK
- React Query
- `next/og` image routes for icon, splash, OG, embed, and screenshots

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Fill in any values you have now. Placeholder values are okay for MVP bootstrapping.
3. Install dependencies:

```bash
npm install
```

If you want a more cautious install first, use:

```bash
npm install --ignore-scripts
```

4. Start the dev server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Environment variables

| Variable | Required now | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Yes | Canonical app URL used in metadata and manifest |
| `NEXT_PUBLIC_BASE_APP_ID` | Placeholder okay | Base App metadata value |
| `NEXT_PUBLIC_BASE_RPC_URL` | Optional | Override Base public RPC URL |
| `NEXT_PUBLIC_BUILDER_CODE` | Optional | ERC-8021 builder code for future tx-writing flows |
| `NEXT_PUBLIC_FARCASTER_HEADER` | Placeholder okay | Warpcast manifest association header |
| `NEXT_PUBLIC_FARCASTER_PAYLOAD` | Placeholder okay | Warpcast manifest association payload |
| `NEXT_PUBLIC_FARCASTER_SIGNATURE` | Placeholder okay | Warpcast manifest association signature |

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`

## Project notes

- Manifest is served from `src/app/.well-known/farcaster.json/route.ts` using `minikit.config.ts`.
- The app keeps core functionality hash-first. Wallet connection is optional.
- Parsing logic is isolated under `src/lib/receipt/` for easier testing.
- `src/lib/onchain/prepare-builder-transaction.ts` includes ERC-8021 attribution support for future Base Build-compatible write actions.

## Known placeholders

- `NEXT_PUBLIC_FARCASTER_HEADER`
- `NEXT_PUBLIC_FARCASTER_PAYLOAD`
- `NEXT_PUBLIC_FARCASTER_SIGNATURE`
- `NEXT_PUBLIC_BUILDER_CODE`
- Production `NEXT_PUBLIC_APP_URL`

## Production TODO

- Replace all placeholder env values.
- Generate real Farcaster `accountAssociation` values with the Warpcast Manifest Tool for the final domain.
- Register the final Base App id and swap it into metadata.
- Decide the final builder code if write actions are added.
- Run `npm run lint`, `npm run build`, and `npm run test` after dependencies are installed.
- Verify `/.well-known/farcaster.json`, `icon.png`, `splash.png`, `og-image.png`, `opengraph-image`, and screenshot routes on the deployed domain.
- Test inside Farcaster, Base App, and a normal mobile browser.
