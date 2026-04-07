import { basePublicClient } from "@/lib/base-client";
import { ReceiptFlexError } from "@/lib/receipt/errors";
import { erc20MetadataAbi, extractErc20Transfer, extractTransactionHash, parseTransactionContext } from "@/lib/receipt/parse";
import type { ParsedTransaction } from "@/lib/receipt/types";

async function readTokenMetadata(contractAddress: `0x${string}`) {
  const [symbolResult, decimalsResult] = await Promise.allSettled([
    basePublicClient.readContract({
      abi: erc20MetadataAbi,
      address: contractAddress,
      functionName: "symbol"
    }),
    basePublicClient.readContract({
      abi: erc20MetadataAbi,
      address: contractAddress,
      functionName: "decimals"
    })
  ]);

  return {
    symbol: symbolResult.status === "fulfilled" ? symbolResult.value : null,
    decimals: decimalsResult.status === "fulfilled" ? Number(decimalsResult.value) : null
  };
}

function isNotFoundError(error: unknown) {
  return error instanceof Error && /not found|missing/i.test(error.message);
}

export async function fetchParsedTransaction(input: string): Promise<ParsedTransaction> {
  const hash = extractTransactionHash(input);

  if (!hash) {
    throw new ReceiptFlexError("invalid_hash");
  }

  let transaction;
  let receipt;

  try {
    [transaction, receipt] = await Promise.all([
      basePublicClient.getTransaction({ hash }),
      basePublicClient.getTransactionReceipt({ hash })
    ]);
  } catch (error) {
    if (isNotFoundError(error)) {
      throw new ReceiptFlexError("receipt_not_found");
    }

    throw new ReceiptFlexError("rpc_error", error instanceof Error ? error.message : undefined);
  }

  if (!receipt.blockHash) {
    throw new ReceiptFlexError("receipt_not_found");
  }

  const block = await basePublicClient.getBlock({ blockHash: receipt.blockHash });

  const transfer = extractErc20Transfer({ transaction, receipt, block });

  if (transfer) {
    const tokenMetadata = await readTokenMetadata(transfer.contractAddress);

    return parseTransactionContext({
      transaction,
      receipt,
      block,
      token: {
        ...transfer,
        ...tokenMetadata
      }
    });
  }

  return parseTransactionContext({ transaction, receipt, block });
}
