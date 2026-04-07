export type ReceiptFlexErrorCode =
  | "invalid_hash"
  | "unsupported_network"
  | "receipt_not_found"
  | "rpc_error";

export class ReceiptFlexError extends Error {
  code: ReceiptFlexErrorCode;

  constructor(code: ReceiptFlexErrorCode, message?: string) {
    super(
      message ||
        {
          invalid_hash: "That does not look like a valid transaction hash.",
          unsupported_network: "This app only parses Base mainnet transactions right now.",
          receipt_not_found: "We could not find that transaction on Base yet.",
          rpc_error: "The Base public RPC did not answer cleanly. Please try again."
        }[code]
    );

    this.code = code;
    this.name = "ReceiptFlexError";
  }
}

