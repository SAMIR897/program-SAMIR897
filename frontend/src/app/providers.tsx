"use client";

import { ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { LedgerWalletAdapter } from "@solana/wallet-adapter-ledger";
import { clusterApiUrl } from "@solana/web3.js";
import { Toaster } from "react-hot-toast";
import "@solana/wallet-adapter-react-ui/styles.css";

const DEFAULT_ENDPOINT = clusterApiUrl("devnet");

export function Providers({ children }: { children: ReactNode }) {
  const endpoint = process.env.NEXT_PUBLIC_RPC_URL ?? DEFAULT_ENDPOINT;

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
      new LedgerWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: "confirmed" }}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
          <Toaster position="bottom-right" />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
