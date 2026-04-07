import { APP_MANIFEST, FARCASTER_ACCOUNT_ASSOCIATION } from "@/lib/app-config";

export const minikitConfig = {
  accountAssociation: FARCASTER_ACCOUNT_ASSOCIATION,
  miniapp: APP_MANIFEST
} as const;

