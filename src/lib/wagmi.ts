import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { BASE_RPC_URL } from "@/lib/app-config";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({ appName: "Receipt Flex", preference: "all" })
  ],
  transports: {
    [base.id]: http(BASE_RPC_URL)
  },
  multiInjectedProviderDiscovery: true,
  storage: createStorage({ storage: cookieStorage }),
  ssr: true
});
