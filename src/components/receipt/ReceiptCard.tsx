"use client";

import { forwardRef } from "react";
import { type ReceiptThemeId } from "@/lib/app-config";
import {
  formatAddress,
  formatGasFee,
  formatHash,
  formatRelativeTime,
  formatTimestamp
} from "@/lib/receipt/format";
import type { ParsedTransaction } from "@/lib/receipt/types";
import styles from "./ReceiptCard.module.css";

interface ReceiptCardProps {
  parsed: ParsedTransaction | null;
  themeId: ReceiptThemeId;
}

const themeLabels: Record<ReceiptThemeId, string> = {
  velocity: "Velocity",
  terminal: "Terminal",
  sunbeam: "Sunbeam"
};

export const ReceiptCard = forwardRef<HTMLDivElement, ReceiptCardProps>(function ReceiptCard(
  { parsed, themeId },
  ref
) {
  return (
    <div className={`${styles.card} ${styles[themeId]}`} ref={ref}>
      <div className={styles.headerRow}>
        <div>
          <span className={styles.eyebrow}>Receipt Flex</span>
          <h2>{parsed ? parsed.label : "Awaiting Base tx"}</h2>
        </div>
        <div className={styles.statusPill}>{parsed ? parsed.status : "preview"}</div>
      </div>

      <div className={styles.ticketMeta}>
        <span>{themeLabels[themeId]}</span>
        <span>Base mainnet</span>
        <span>{parsed ? formatRelativeTime(parsed.timestampMs) : "Paste a hash to start"}</span>
      </div>

      <div className={styles.mainValue}>
        {parsed?.asset ? (
          <>
            <strong>{parsed.asset.amountFormatted}</strong>
            <span>{parsed.asset.symbol}</span>
          </>
        ) : (
          <>
            <strong>ETH / ERC20</strong>
            <span>plus safe fallback parsing</span>
          </>
        )}
      </div>

      <div className={styles.grid}>
        <div className={styles.dataBlock}>
          <span className={styles.blockLabel}>From</span>
          <strong>{parsed ? formatAddress(parsed.from, 5) : "0xFLEX...CARD"}</strong>
        </div>
        <div className={styles.dataBlock}>
          <span className={styles.blockLabel}>To</span>
          <strong>{parsed ? formatAddress(parsed.to, 5) : "0xBASE...RPC"}</strong>
        </div>
        <div className={styles.dataBlock}>
          <span className={styles.blockLabel}>Hash</span>
          <strong>{parsed ? formatHash(parsed.hash, 6) : "0x000000...0000"}</strong>
        </div>
        <div className={styles.dataBlock}>
          <span className={styles.blockLabel}>Gas Fee</span>
          <strong>{parsed ? formatGasFee(parsed.gasFeeWei) : "Auto once parsed"}</strong>
        </div>
      </div>

      <div className={styles.timelineRow}>
        <div>
          <span className={styles.blockLabel}>Timestamp</span>
          <strong>{parsed ? formatTimestamp(parsed.timestampMs) : "Onchain time will appear here"}</strong>
        </div>
        <div>
          <span className={styles.blockLabel}>Block</span>
          <strong>{parsed ? parsed.blockNumber.toString() : "Base block"}</strong>
        </div>
      </div>

      <div className={styles.summaryBox}>
        <span className={styles.blockLabel}>Summary</span>
        <p>{parsed ? parsed.summary : "ETH transfer, ERC20 transfer, or generic contract interaction."}</p>
      </div>

      {parsed?.warnings.length ? (
        <div className={styles.warningBox}>
          Fallback parser used. This tx still renders cleanly, but the card keeps the interaction generic.
        </div>
      ) : null}
    </div>
  );
});

