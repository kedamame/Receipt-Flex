"use client";

import { useEffect, useRef, useState } from "react";

export interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

interface FarcasterState {
  isInMiniApp: boolean;
  isLoading: boolean;
  user: FarcasterUser | null;
}

export function useFarcasterMiniApp(): FarcasterState {
  const [state, setState] = useState<FarcasterState>({
    isInMiniApp: false,
    isLoading: true,
    user: null
  });
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    import("@farcaster/miniapp-sdk")
      .then(async ({ sdk }) => {
        const isMiniApp = await sdk.isInMiniApp();

        if (!isMiniApp) {
          setState({ isInMiniApp: false, isLoading: false, user: null });
          return;
        }

        await sdk.actions.ready();

        try {
          const provider = await sdk.wallet.getEthereumProvider();
          if (provider && typeof window !== "undefined") {
            (window as Window & { ethereum?: unknown }).ethereum = provider;
          }
        } catch {
          // Optional wallet bridge.
        }

        let user: FarcasterUser | null = null;

        try {
          const context = await sdk.context;
          if (context?.user) {
            const contextUser = context.user as {
              fid: number;
              username?: string;
              displayName?: string;
              pfpUrl?: string;
            };
            user = {
              fid: contextUser.fid,
              username: contextUser.username,
              displayName: contextUser.displayName,
              pfpUrl: contextUser.pfpUrl
            };
          }
        } catch {
          // Context is optional in browser fallbacks.
        }

        setState({ isInMiniApp: true, isLoading: false, user });
      })
      .catch(() => {
        setState({ isInMiniApp: false, isLoading: false, user: null });
      });
  }, []);

  return state;
}

