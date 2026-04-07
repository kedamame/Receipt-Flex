import { decodeEventLog, parseAbi, parseAbiItem, type Hex } from "viem";
import { formatAddress, formatAssetAmount, formatEthAmount } from "@/lib/receipt/format";
import type { ParsedTransaction, ParsedTransactionContext } from "@/lib/receipt/types";

const transferEvent = parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 value)");

export const erc20MetadataAbi = parseAbi([
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
]);

export function extractTransactionHash(input: string) {
  const match = input.trim().match(/0x[a-fA-F0-9]{64}/);
  return match?.[0] as `0x${string}` | undefined;
}

export function extractErc20Transfer(context: ParsedTransactionContext) {
  for (const log of context.receipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi: [transferEvent],
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]]
      });

      if (decoded.eventName !== "Transfer") {
        continue;
      }

      return {
        amountRaw: decoded.args.value,
        contractAddress: log.address,
        from: decoded.args.from,
        to: decoded.args.to
      };
    } catch {
      continue;
    }
  }

  return null;
}

export function parseTransactionContext(context: ParsedTransactionContext): ParsedTransaction {
  const { block, receipt, token, transaction } = context;
  const gasFeeWei = receipt.effectiveGasPrice * receipt.gasUsed;
  const timestampMs = Number(block.timestamp) * 1000;
  const status = receipt.status === "success" ? "success" : "reverted";
  const explorerUrl = `https://basescan.org/tx/${transaction.hash}`;

  if (token) {
    const symbol = token.symbol?.trim() || "ERC20";
    const decimals = token.decimals ?? null;
    const amountFormatted = formatAssetAmount(token.amountRaw, decimals);

    return {
      hash: transaction.hash,
      network: "Base",
      kind: "erc20-transfer",
      status,
      label: "Degenerate Move",
      summary: `${amountFormatted} ${symbol} moved from ${formatAddress(token.from)} to ${formatAddress(token.to)}.`,
      timestampMs,
      blockNumber: receipt.blockNumber,
      from: token.from,
      to: token.to,
      gasFeeWei,
      valueWei: transaction.value,
      asset: {
        amountRaw: token.amountRaw,
        amountFormatted,
        symbol,
        decimals,
        contractAddress: token.contractAddress
      },
      warnings: [],
      fallbackReason: null,
      explorerUrl,
      transaction,
      receipt
    };
  }

  if (transaction.value > 0n && transaction.input === "0x") {
    return {
      hash: transaction.hash,
      network: "Base",
      kind: "eth-transfer",
      status,
      label: "Clean Send",
      summary: `${formatEthAmount(transaction.value)} ETH sent from ${formatAddress(transaction.from)} to ${formatAddress(transaction.to)}.`,
      timestampMs,
      blockNumber: receipt.blockNumber,
      from: transaction.from,
      to: transaction.to,
      gasFeeWei,
      valueWei: transaction.value,
      asset: {
        amountRaw: transaction.value,
        amountFormatted: formatEthAmount(transaction.value),
        symbol: "ETH",
        decimals: 18,
        contractAddress: "0x4200000000000000000000000000000000000006"
      },
      warnings: [],
      fallbackReason: null,
      explorerUrl,
      transaction,
      receipt
    };
  }

  return {
    hash: transaction.hash,
    network: "Base",
    kind: "contract-interaction",
    status,
    label: "Contract Dive",
    summary: `Contract interaction from ${formatAddress(transaction.from)} to ${formatAddress(transaction.to)}.`,
    timestampMs,
    blockNumber: receipt.blockNumber,
    from: transaction.from,
    to: transaction.to,
    gasFeeWei,
    valueWei: transaction.value,
    asset: null,
    warnings: ["fallback_used"],
    fallbackReason: "Fallback parser used because the tx is not a simple ETH or ERC20 transfer.",
    explorerUrl,
    transaction,
    receipt
  };
}
