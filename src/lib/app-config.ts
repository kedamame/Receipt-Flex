const FALLBACK_APP_URL = "https://receipt-flex.vercel.app";

export const APP_NAME = "Receipt Flex";
export const APP_TAGLINE = "Base receipts with arcade energy.";
export const APP_DESCRIPTION =
  "Paste a Base tx hash and turn it into a bright, shareable receipt card for Farcaster, Base App, and the open web.";
export const APP_SUBTITLE = "Base tx into poster receipt";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || FALLBACK_APP_URL;
export const BASE_APP_ID =
  process.env.NEXT_PUBLIC_BASE_APP_ID || "69d4ea1b91c13596e896212a";
export const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org";
export const BUILDER_CODE = process.env.NEXT_PUBLIC_BUILDER_CODE || "bc_your_builder_code";
export const CANONICAL_DOMAIN = new URL(APP_URL).host;

export const FARCASTER_ACCOUNT_ASSOCIATION = {
  header: process.env.NEXT_PUBLIC_FARCASTER_HEADER || "REPLACE_WITH_WARPCAST_HEADER",
  payload: process.env.NEXT_PUBLIC_FARCASTER_PAYLOAD || "REPLACE_WITH_WARPCAST_PAYLOAD",
  signature: process.env.NEXT_PUBLIC_FARCASTER_SIGNATURE || "REPLACE_WITH_WARPCAST_SIGNATURE"
} as const;

export const APP_MANIFEST = {
  version: "1",
  name: APP_NAME,
  homeUrl: APP_URL,
  iconUrl: `${APP_URL}/icon.png`,
  splashImageUrl: `${APP_URL}/splash.png`,
  splashBackgroundColor: "#0d5cff",
  subtitle: APP_SUBTITLE,
  description: APP_DESCRIPTION,
  screenshotUrls: [
    `${APP_URL}/screenshot1.png`,
    `${APP_URL}/screenshot2.png`,
    `${APP_URL}/screenshot3.png`
  ],
  primaryCategory: "utility",
  tags: ["base", "receipts", "shareable", "tx", "miniapp"],
  heroImageUrl: `${APP_URL}/og-image.png`,
  tagline: "Paste. Parse. Post.",
  ogTitle: "Receipt Flex",
  ogDescription: "Turn any Base transaction hash into a crisp, saved-and-shared receipt card.",
  ogImageUrl: `${APP_URL}/og-image.png`,
  requiredChains: ["eip155:8453"],
  requiredCapabilities: [],
  noindex: false,
  canonicalDomain: CANONICAL_DOMAIN
} as const;

export const MINIAPP_EMBED = {
  version: "1",
  imageUrl: `${APP_URL}/opengraph-image`,
  button: {
    title: "Open Receipt Flex",
    action: {
      type: "launch_miniapp",
      name: APP_NAME,
      url: APP_URL,
      splashImageUrl: `${APP_URL}/splash.png`,
      splashBackgroundColor: "#0d5cff"
    }
  }
} as const;

export const THEME_OPTIONS = [
  {
    id: "velocity",
    label: "Velocity",
    blurb: "Bright race-ticket energy."
  },
  {
    id: "terminal",
    label: "Terminal",
    blurb: "Sharp receipt printer contrast."
  },
  {
    id: "sunbeam",
    label: "Sunbeam",
    blurb: "Poster warmth with clean contrast."
  }
] as const;

export type ReceiptThemeId = (typeof THEME_OPTIONS)[number]["id"];
