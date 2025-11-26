"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useLeaderReview } from "@/hooks/useLeaderReview";
import { CANDIDATE_IMAGES } from "@/lib/config";

export default function VotesPage() {
  const { publicKey, connected } = useWallet();
  const { loading, state, candidates } = useLeaderReview();

  // Show wallet connection prompt if not connected
  if (!connected) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-6 px-4 py-10">
        <div className="glass-panel p-8 text-center text-white max-w-md">
          <h1 className="text-3xl font-semibold mb-4">Connect Wallet Required</h1>
          <p className="text-white/70 mb-6">
            Please connect your Solana wallet to view detailed vote statistics.
          </p>
          <div className="flex flex-col items-center gap-4">
            <WalletMultiButton className="!bg-white !text-midnight-900 !font-semibold" />
            <Link 
              href="/" 
              className="text-sm text-white/70 hover:text-white transition underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-4 px-4 py-10">
        <div className="text-white">Loading vote statistics...</div>
      </main>
    );
  }

  if (!state) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-4 px-4 py-10">
        <div className="glass-panel p-8 text-center text-white">
          <h1 className="text-2xl font-semibold mb-4">Contest Not Initialized</h1>
          <p className="text-white/70 mb-6">The contest has not been initialized yet.</p>
          <Link href="/" className="brand-gradient rounded-full px-6 py-3 text-sm font-semibold text-white">
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  // Sort candidates by average rating (descending)
  const sortedCandidates = [...candidates].sort((a, b) => b.average - a.average);

  function shortKey(key: string) {
    return `${key.slice(0, 4)}…${key.slice(-4)}`;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-4 py-10 sm:px-8">
      <header className="flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-midnight-900/80 via-midnight-800/70 to-black/50 p-8 text-white shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">Vote Statistics</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl mt-2">
              Detailed Voting Breakdown
            </h1>
            <p className="text-base text-white/70 mt-4">
              See exactly how many votes each candidate received. All data is stored on-chain and publicly verifiable.
            </p>
            <p className="text-sm text-white/50 mt-2">
              Connected as: {publicKey ? shortKey(publicKey.toBase58()) : "Unknown"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <WalletMultiButton className="!bg-white !text-midnight-900 !font-semibold" />
            <Link
              href="/"
              className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-white/70">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1">
            <span className="h-2 w-2 rounded-full bg-accent" /> {state.totalReviews.toNumber()} Total Votes
          </span>
        </div>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Vote Statistics by Candidate</h2>
        
        <div className="grid gap-6">
          {sortedCandidates.map((candidate, idx) => {
            const imagePath = CANDIDATE_IMAGES[candidate.name] || "";
            const percentage = state.totalReviews.toNumber() > 0 
              ? ((candidate.reviewCount / state.totalReviews.toNumber()) * 100).toFixed(1)
              : 0;

            return (
              <motion.div
                key={candidate.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel relative overflow-hidden p-6"
                style={{
                  backgroundImage: imagePath ? `url(${imagePath})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 z-0" />
                
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Candidate Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl">{candidate.emoji}</span>
                        <div>
                          <h3 className="text-3xl font-bold text-white">{candidate.name}</h3>
                          <p className="text-sm text-white/60">Rank #{idx + 1}</p>
                        </div>
                      </div>
                      
                      {/* Vote Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-black/30 rounded-lg p-4">
                          <p className="text-xs uppercase tracking-wide text-white/50 mb-1">Total Votes</p>
                          <p className="text-2xl font-bold text-accent">{candidate.reviewCount}</p>
                          <p className="text-xs text-white/60 mt-1">{percentage}% of total</p>
                        </div>
                        
                        <div className="bg-black/30 rounded-lg p-4">
                          <p className="text-xs uppercase tracking-wide text-white/50 mb-1">Average Rating</p>
                          <p className="text-2xl font-bold text-accent">{candidate.average.toFixed(2)}</p>
                          <p className="text-xs text-white/60 mt-1">out of 5.00</p>
                        </div>
                        
                        <div className="bg-black/30 rounded-lg p-4">
                          <p className="text-xs uppercase tracking-wide text-white/50 mb-1">Total Score</p>
                          <p className="text-2xl font-bold text-white">{candidate.totalScore}</p>
                          <p className="text-xs text-white/60 mt-1">sum of all ratings</p>
                        </div>
                        
                        <div className="bg-black/30 rounded-lg p-4">
                          <p className="text-xs uppercase tracking-wide text-white/50 mb-1">Vote Share</p>
                          <div className="mt-2">
                            <div className="w-full bg-black/50 rounded-full h-2">
                              <div
                                className="bg-accent h-2 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <p className="text-xs text-white/60 mt-1">{percentage}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

