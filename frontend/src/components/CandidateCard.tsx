"use client";

import { motion } from "framer-motion";
import { RatingStars } from "./RatingStars";
import { CANDIDATE_IMAGES } from "@/lib/config";

export type CandidateView = {
  name: string;
  average: number;
  totalScore: number;
  reviewCount: number;
  emoji: string;
};

type CandidateCardProps = {
  candidate: CandidateView;
  index: number;
  myRating: number;
  onRate: (index: number, rating: number) => void;
  disabled?: boolean;
};

export function CandidateCard({ candidate, index, myRating, onRate, disabled }: CandidateCardProps) {
  const imagePath = CANDIDATE_IMAGES[candidate.name] || "";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-panel flex flex-col gap-6 p-6 relative overflow-hidden"
      style={{
        backgroundImage: imagePath ? `url(${imagePath})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 z-0" />
      
      {/* Content with relative positioning */}
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Candidate</p>
            <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
              <span className="text-3xl">{candidate.emoji}</span>
              {candidate.name}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/60">Avg Rating</p>
            <p className="text-3xl font-black text-accent">{candidate.average.toFixed(2)}</p>
            <p className="text-xs text-white/50">{candidate.reviewCount} reviews</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-black/30 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Your Rating</p>
            <RatingStars value={myRating} onChange={(rating) => onRate(index, rating)} disabled={disabled} />
          </div>
          <button
            type="button"
            onClick={() => onRate(index, myRating || 1)}
            disabled={disabled}
            className="rounded-full px-5 py-2 text-sm font-semibold text-white brand-gradient disabled:opacity-40"
          >
            {disabled ? "Connect Wallet" : myRating ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
