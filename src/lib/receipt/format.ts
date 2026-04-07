import { formatEther, formatUnits } from "viem";

export function formatAddress(value: string | null | undefined, size = 4) {
  if (!value) {
    return "Contract Creation";
  }

  return `${value.slice(0, size + 2)}...${value.slice(-size)}`;
}

export function formatHash(value: string, size = 5) {
  return `${value.slice(0, size + 2)}...${value.slice(-size)}`;
}

export function formatAmount(value: bigint, decimals = 18, maxFractionDigits = 4) {
  const formatted = formatUnits(value, decimals);
  const [whole, fraction] = formatted.split(".");

  if (!fraction) {
    return whole;
  }

  return `${whole}.${fraction.slice(0, maxFractionDigits).replace(/0+$/, "")}`.replace(/\.$/, "");
}

export function formatAssetAmount(value: bigint, decimals: number | null) {
  if (decimals === null) {
    return value.toString();
  }

  return formatAmount(value, decimals);
}

export function formatEthAmount(value: bigint) {
  const formatted = formatEther(value);
  const [whole, fraction] = formatted.split(".");

  if (!fraction) {
    return whole;
  }

  return `${whole}.${fraction.slice(0, 5).replace(/0+$/, "")}`.replace(/\.$/, "");
}

export function formatGasFee(value: bigint) {
  const eth = Number(formatEther(value));
  if (!Number.isFinite(eth)) {
    return `${formatEthAmount(value)} ETH`;
  }

  if (eth < 0.0001) {
    return `${(eth * 1e6).toFixed(2)} gwei`;
  }

  return `${eth.toFixed(6).replace(/0+$/, "").replace(/\.$/, "")} ETH`;
}

export function formatTimestamp(timestampMs: number) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(timestampMs);
}

export function formatRelativeTime(timestampMs: number, now = Date.now()) {
  const diff = Math.round((timestampMs - now) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60]
  ];

  for (const [unit, seconds] of units) {
    if (Math.abs(diff) >= seconds || unit === "minute") {
      return rtf.format(Math.round(diff / seconds), unit);
    }
  }

  return rtf.format(diff, "second");
}

