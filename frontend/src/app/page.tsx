"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import { useLeaderReview } from "@/hooks/useLeaderReview";
import { CandidateCard } from "@/components/CandidateCard";
import { StatCard } from "@/components/StatCard";
import { CONTEST_AUTHORITY, PROGRAM_ID } from "@/lib/config";

export default function Home() {
  const { publicKey, connected } = useWallet();
  const {
    loading,
    candidates,
    review,
    state,
    submitRating,
    isSubmitting,
    initializeContest,
    isInitializing,
    canInitialize,
  } = useLeaderReview();

  const ratings = review?.ratings ?? Array(5).fill(0);
  const userRatingFor = (idx: number) => ratings?.[idx] ?? 0;

  const initializedCandidateCount = state
    ? state.candidates.filter((candidate) => candidate.reviewCount.toNumber() > 0).length
    : 0;

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-4 py-10 sm:px-8">
      <header className="flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-midnight-900/80 via-midnight-800/70 to-black/50 p-8 text-white shadow-card lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">Leader Pulse</p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Transparent 5-star reviews for your five most influential leaders.
          </h1>
          <p className="text-base text-white/70">
            Every wallet can rate each candidate from one to five stars. Scores and averages are updated instantly on
            Solana, so your community always sees an honest, tamper-proof pulse.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1">
              <span className="h-2 w-2 rounded-full bg-accent" /> Devnet ready
            </span>
            {state?.createdAt && (
              <span>
                Contest live for{" "}
                {formatDistanceToNow(new Date(Number(state.createdAt) * 1000), {
                  addSuffix: false,
                })}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <WalletMultiButton className="!bg-white !text-midnight-900 !font-semibold" />
          <p className="text-xs text-white/60">Connected as {publicKey ? shortKey(publicKey.toBase58()) : "Guest"}</p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Authority"
          value={shortKey(CONTEST_AUTHORITY.toBase58())}
          helper="Seed for the contest PDA"
        />
        <StatCard label="Program" value={shortKey(PROGRAM_ID.toBase58())} helper="Anchor PDA program" />
        <StatCard
          label="Total Reviews"
          value={state ? state.totalReviews.toNumber().toLocaleString() : "0"}
          helper={state ? `${initializedCandidateCount} of 5 candidates rated` : "Awaiting initialization"}
        />
      </section>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel flex items-center justify-between px-6 py-4 text-white"
        >
          <p className="text-sm text-white/70">Syncing latest on-chain data…</p>
          <span className="h-4 w-4 animate-ping rounded-full bg-accent" />
        </motion.div>
      )}

      {!state && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel flex flex-col gap-4 p-6 text-white"
        >
          <h2 className="text-2xl font-semibold">Contest not initialized</h2>
          <p className="text-white/70">
            Deploy the PDA state once using the authorized wallet. This creates five candidate entries on-chain and
            unlocks community ratings.
          </p>
          <button
            type="button"
            onClick={initializeContest}
            disabled={!canInitialize || isInitializing}
            className="brand-gradient w-full rounded-full px-6 py-3 text-sm font-semibold text-white disabled:opacity-30 sm:w-auto"
          >
            {isInitializing ? "Creating state..." : "Initialize contest"}
          </button>
        </motion.section>
      )}

      {state && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Leaderboard</h2>
            <div className="flex items-center gap-4">
              <Link
                href="/votes"
                className="text-sm text-white/70 hover:text-white transition underline"
              >
                View Detailed Stats →
              </Link>
              <p className="text-sm text-white/60">
                {state.totalReviews.toNumber()} on-chain reviews • last sync just now
              </p>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {candidates.map((candidate, idx) => (
              <CandidateCard
                key={candidate.name}
                candidate={candidate}
                index={idx}
                myRating={userRatingFor(idx)}
                onRate={(index, rating) => submitRating(index, rating)}
                disabled={!connected || isSubmitting || loading}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function shortKey(key: string) {
  return `${key.slice(0, 4)}…${key.slice(-4)}`;
}
