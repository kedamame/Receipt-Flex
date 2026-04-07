import { describe, expect, it } from "vitest";
import { parseTransactionContext } from "@/lib/receipt/parse";
import type { BlockLike, ReceiptLike, TransactionLike } from "@/lib/receipt/types";

function makeTransaction(overrides: Partial<TransactionLike> = {}) {
  return {
    hash: "0x1111111111111111111111111111111111111111111111111111111111111111",
    from: "0x1111111111111111111111111111111111111111",
    to: "0x2222222222222222222222222222222222222222",
    value: 1_000_000_000_000_000_000n,
    input: "0x",
    ...overrides
  } satisfies TransactionLike;
}

function makeReceipt(overrides: Partial<ReceiptLike> = {}) {
  return {
    blockHash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    blockNumber: 12345n,
    effectiveGasPrice: 1000n,
    gasUsed: 21000n,
    logs: [],
    status: "success",
    ...overrides
  } satisfies ReceiptLike;
}

function makeBlock(overrides: Partial<BlockLike> = {}) {
  return {
    timestamp: 1_710_000_000n,
    ...overrides
  } satisfies BlockLike;
}

describe("parseTransactionContext", () => {
  it("classifies simple ETH transfers", () => {
    const parsed = parseTransactionContext({
      transaction: makeTransaction(),
      receipt: makeReceipt(),
      block: makeBlock()
    });

    expect(parsed.kind).toBe("eth-transfer");
    expect(parsed.label).toBe("Clean Send");
    expect(parsed.asset?.symbol).toBe("ETH");
  });

  it("classifies ERC20 transfers when token metadata is present", () => {
    const parsed = parseTransactionContext({
      transaction: makeTransaction({ value: 0n, input: "0xa9059cbb" }),
      receipt: makeReceipt(),
      block: makeBlock(),
      token: {
        amountRaw: 1250000n,
        contractAddress: "0x3333333333333333333333333333333333333333",
        from: "0x1111111111111111111111111111111111111111",
        to: "0x2222222222222222222222222222222222222222",
        symbol: "USDC",
        decimals: 6
      }
    });

    expect(parsed.kind).toBe("erc20-transfer");
    expect(parsed.label).toBe("Degenerate Move");
    expect(parsed.asset?.amountFormatted).toBe("1.25");
  });

  it("falls back for generic contract interactions", () => {
    const parsed = parseTransactionContext({
      transaction: makeTransaction({ value: 0n, input: "0x12345678" }),
      receipt: makeReceipt(),
      block: makeBlock()
    });

    expect(parsed.kind).toBe("contract-interaction");
    expect(parsed.warnings).toContain("fallback_used");
  });
});
