import type { Address, Hex } from "viem";

export type ParsedTransactionKind = "eth-transfer" | "erc20-transfer" | "contract-interaction";
export type ParsedTransactionStatus = "success" | "reverted";
export type ParseWarningCode = "fallback_used";

export interface TokenDisplay {
  amountRaw: bigint;
  amountFormatted: string;
  symbol: string;
  decimals: number | null;
  contractAddress: Address;
}

export interface TransactionLike {
  hash: Hex;
  from: Address;
  to: Address | null;
  value: bigint;
  input: Hex;
}

export interface ReceiptLogLike {
  address: Address;
  data: Hex;
  topics: Hex[];
}

export interface ReceiptLike {
  blockHash: Hex | null;
  blockNumber: bigint;
  effectiveGasPrice: bigint;
  gasUsed: bigint;
  logs: ReceiptLogLike[];
  status: "success" | "reverted";
}

export interface BlockLike {
  timestamp: bigint;
}

export interface ParsedTransactionContext {
  transaction: TransactionLike;
  receipt: ReceiptLike;
  block: BlockLike;
  token?: {
    amountRaw: bigint;
    contractAddress: Address;
    from: Address;
    to: Address;
    symbol?: string | null;
    decimals?: number | null;
  } | null;
}

export interface ParsedTransaction {
  hash: Hex;
  network: "Base";
  kind: ParsedTransactionKind;
  status: ParsedTransactionStatus;
  label: "Clean Send" | "Degenerate Move" | "Contract Dive";
  summary: string;
  timestampMs: number;
  blockNumber: bigint;
  from: Address;
  to: Address | null;
  gasFeeWei: bigint;
  valueWei: bigint;
  asset: TokenDisplay | null;
  warnings: ParseWarningCode[];
  fallbackReason: string | null;
  explorerUrl: string;
  transaction: TransactionLike;
  receipt: ReceiptLike;
}
