import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { BASE_RPC_URL } from "@/lib/app-config";

export const basePublicClient = createPublicClient({
  chain: base,
  transport: http(BASE_RPC_URL)
});

