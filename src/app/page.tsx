"use client";

import { useEffect, useMemo, useRef, useState, useTransition, type FormEvent } from "react";
import { toPng } from "html-to-image";
import Image from "next/image";
import { useAccount, useChainId, useConnect, useDisconnect } from "wagmi";
import { base } from "wagmi/chains";
import { ReceiptCard } from "@/components/receipt/ReceiptCard";
import styles from "@/components/receipt/HomePage.module.css";
import { APP_NAME, THEME_OPTIONS, type ReceiptThemeId } from "@/lib/app-config";
import { useFarcasterMiniApp } from "@/lib/farcaster";
import { fetchParsedTransaction } from "@/lib/receipt/fetch";
import { ReceiptFlexError } from "@/lib/receipt/errors";
import type { ParsedTransaction } from "@/lib/receipt/types";

const EXAMPLE_HASH = "0x1111111111111111111111111111111111111111111111111111111111111111";

function getConnectorLabel(id: string, isInMiniApp: boolean) {
  if (id === "injected") {
    return isInMiniApp ? "Farcaster Wallet" : "Browser Wallet";
  }

  if (id.toLowerCase().includes("coinbase")) {
    return "Coinbase Wallet";
  }

  if (id.toLowerCase().includes("walletconnect")) {
    return "WalletConnect";
  }

  return id;
}

function updateQueryString(hash: string) {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);

  if (hash) {
    url.searchParams.set("tx", hash);
  } else {
    url.searchParams.delete("tx");
  }

  window.history.replaceState({}, "", url);
}

export default function HomePage() {
  const { isInMiniApp, isLoading, user } = useFarcasterMiniApp();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const [input, setInput] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<ReceiptThemeId>("velocity");
  const [parsed, setParsed] = useState<ParsedTransaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [, startTransition] = useTransition();
  const cardRef = useRef<HTMLDivElement>(null);
  const initializedFromQuery = useRef(false);

  useEffect(() => {
    if (initializedFromQuery.current || typeof window === "undefined") {
      return;
    }

    initializedFromQuery.current = true;
    const hash = new URL(window.location.href).searchParams.get("tx");

    if (!hash) {
      return;
    }

    setInput(hash);
    setIsParsing(true);
    void fetchParsedTransaction(hash)
      .then((result) => {
        startTransition(() => {
          setParsed(result);
          setError(null);
          setNotice(result.fallbackReason);
          updateQueryString(result.hash);
        });
      })
      .catch((caught: unknown) => {
        startTransition(() => {
          setParsed(null);
          setNotice(null);
          setError(caught instanceof Error ? caught.message : "Unable to parse that transaction.");
        });
      })
      .finally(() => setIsParsing(false));
  }, []);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    const url = new URL(window.location.href);
    url.searchParams.set("tx", parsed?.hash || input);
    return url.toString();
  }, [input, parsed?.hash]);

  const handleParse = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setNotice(null);
    setError(null);
    setIsParsing(true);
    void fetchParsedTransaction(input)
      .then((result) => {
        startTransition(() => {
          setParsed(result);
          setNotice(result.fallbackReason);
          updateQueryString(result.hash);
        });
      })
      .catch((caught: unknown) => {
        startTransition(() => {
          setParsed(null);
          setNotice(null);

          if (caught instanceof ReceiptFlexError) {
            setError(caught.message);
            return;
          }

          setError(caught instanceof Error ? caught.message : "Unable to parse that transaction.");
        });
      })
      .finally(() => setIsParsing(false));
  };

  const handleDownload = async () => {
    if (!cardRef.current || !parsed) {
      return;
    }

    const dataUrl = await toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2.5
    });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `receipt-flex-${parsed.hash.slice(2, 10)}.png`;
    link.click();
    setNotice("PNG saved to your device.");
  };

  const handleShare = async () => {
    if (!parsed) {
      return;
    }

    const text = `${parsed.label} on Base\n${parsed.summary}\n${shareUrl}`;

    if (isInMiniApp) {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        await sdk.actions.composeCast({
          text,
          embeds: [shareUrl]
        });
        setNotice("Opened Farcaster cast composer.");
        return;
      } catch {
        // Fall through to generic browser sharing when composeCast is unavailable.
      }
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: APP_NAME,
          text,
          url: shareUrl
        });
        return;
      } catch {
        // Fall back to clipboard for browsers or miniapps that decline share sheets.
      }
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      setNotice(isInMiniApp ? "Copied share text. Paste it into Farcaster or Base App." : "Share text copied to clipboard.");
      return;
    }

    setNotice("Share sheet unavailable on this device.");
  };

  const sampleHint = parsed?.hash || EXAMPLE_HASH;
  const isWrongChain = isConnected && chainId !== base.id;

  return (
    <main className={styles.pageShell}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>Farcaster miniapp + Base web app</span>
          <h1>Turn Base tx hashes into poster-bright receipt cards.</h1>
          <p>
            Receipt Flex reads Base public RPC data, classifies ETH, ERC20, or fallback interactions,
            then lets you save or share the flex without a backend.
          </p>
          <div className={styles.modeRow}>
            <span className={styles.modeBadge}>{isInMiniApp ? "Inside Farcaster" : "Browser / Base App"}</span>
            <span className={styles.modeBadge}>Base mainnet only</span>
            <span className={styles.modeBadge}>No login required</span>
          </div>
        </div>

        <aside className={styles.sidePanel}>
          <div className={styles.identityCard}>
            <div>
              <span className={styles.panelLabel}>Context</span>
              <strong>{isLoading ? "Detecting..." : isInMiniApp ? "Miniapp mode live" : "Open web mode live"}</strong>
            </div>
            {user ? (
              <div className={styles.userRow}>
                {user.pfpUrl ? (
                  <Image
                    alt=""
                    className={styles.avatar}
                    height={48}
                    src={user.pfpUrl}
                    unoptimized
                    width={48}
                  />
                ) : null}
                <div>
                  <div className={styles.userName}>{user.displayName || user.username || `fid ${user.fid}`}</div>
                  <div className={styles.userSubtle}>Farcaster context attached</div>
                </div>
              </div>
            ) : (
              <div className={styles.userSubtle}>Core flow works from a hash alone.</div>
            )}
          </div>

          <div className={styles.walletCard}>
            <div className={styles.walletHeader}>
              <div>
                <span className={styles.panelLabel}>Optional wallet</span>
                <strong>{isConnected ? "Connected" : "Connect if you want context"}</strong>
              </div>
              {isConnected ? (
                <button className={styles.ghostButton} onClick={() => disconnect()} type="button">
                  Disconnect
                </button>
              ) : null}
            </div>

            {isConnected ? (
              <div className={styles.connectedState}>
                <span className={styles.connectedAddress}>{address}</span>
                <span className={styles.connectedNetwork}>
                  {chainId === base.id ? "Base network" : "Unsupported network"}
                </span>
              </div>
            ) : (
              <div className={styles.walletButtons}>
                {connectors.map((connector) => (
                  <button
                    key={connector.id}
                    className={styles.walletButton}
                    disabled={isConnecting}
                    onClick={() => connect({ connector })}
                    type="button"
                  >
                    {getConnectorLabel(connector.id, isInMiniApp)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>
      </section>

      <section className={styles.workspace}>
        <div className={styles.controlsColumn}>
          <form className={styles.parseForm} onSubmit={handleParse}>
            <label className={styles.inputLabel} htmlFor="txHash">
              Paste a Base tx hash
            </label>
            <textarea
              className={styles.hashInput}
              id="txHash"
              onChange={(event) => setInput(event.target.value)}
              placeholder="0x..."
              rows={4}
              value={input}
            />
            <div className={styles.formActions}>
                <button className={styles.primaryButton} disabled={isParsing || !input.trim()} type="submit">
                {isParsing ? "Parsing..." : "Parse receipt"}
              </button>
              <button
                className={styles.ghostButton}
                onClick={() => {
                  setInput("");
                  setParsed(null);
                  setError(null);
                  setNotice(null);
                  updateQueryString("");
                }}
                type="button"
              >
                Reset
              </button>
            </div>
            <p className={styles.helperText}>
              Tip: Basescan links also work because the parser extracts the first tx hash it finds.
            </p>
          </form>

          <div className={styles.statusStack}>
            {error ? <div className={styles.errorBanner}>{error}</div> : null}
            {notice ? <div className={styles.noticeBanner}>{notice}</div> : null}
            {isWrongChain ? (
              <div className={styles.errorBanner}>
                Unsupported network on the connected wallet. Switch to Base for wallet-powered actions.
              </div>
            ) : null}
          </div>

          <div className={styles.themePanel}>
            <div className={styles.themeHeader}>
              <span className={styles.panelLabel}>Visual theme</span>
              <strong>Pick your receipt vibe</strong>
            </div>
            <div className={styles.themeGrid}>
              {THEME_OPTIONS.map((theme) => (
                <button
                  key={theme.id}
                  className={theme.id === selectedTheme ? styles.themeButtonActive : styles.themeButton}
                  onClick={() => setSelectedTheme(theme.id)}
                  type="button"
                >
                  <span>{theme.label}</span>
                  <small>{theme.blurb}</small>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actionPanel}>
            <span className={styles.panelLabel}>Save and share</span>
            <div className={styles.actionRow}>
              <button className={styles.primaryButton} disabled={!parsed} onClick={() => void handleDownload()} type="button">
                Download PNG
              </button>
              <button className={styles.secondaryButton} disabled={!parsed} onClick={() => void handleShare()} type="button">
                Share
              </button>
            </div>
            <p className={styles.previewLinkText}>
              <span>Deep link preview:</span>
              <span className={styles.previewHash}>{parsed?.hash || sampleHint}</span>
            </p>
          </div>
        </div>

        <div className={styles.previewColumn}>
          <div className={styles.previewHeader}>
            <div>
              <span className={styles.panelLabel}>Preview card</span>
              <strong>{parsed ? parsed.label : "Waiting for a receipt"}</strong>
            </div>
            <a className={styles.inlineLink} href={parsed?.explorerUrl || "https://basescan.org"} rel="noreferrer" target="_blank">
              Open explorer
            </a>
          </div>
          <ReceiptCard parsed={parsed} ref={cardRef} themeId={selectedTheme} />
        </div>
      </section>
    </main>
  );
}
