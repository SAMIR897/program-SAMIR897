"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnchorProvider, BN, Program, type IdlAccounts } from "@coral-xyz/anchor";
import type { AnchorWallet } from "@solana/wallet-adapter-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import toast from "react-hot-toast";

import idl from "@/lib/idl/leader_review.json";
import type { LeaderReview } from "@/lib/types/leader_review";
import {
  CANDIDATE_EMOJIS,
  CONTEST_AUTHORITY,
  PROGRAM_ID,
  REVIEW_SEED,
  STATE_SEED,
} from "@/lib/config";

const typedIdl = idl as LeaderReview;

type ContestStateAccount = IdlAccounts<LeaderReview>["contestState"];
type VoterReviewAccount = IdlAccounts<LeaderReview>["voterReview"];
type SubmitReviewAccounts = {
  voter: PublicKey;
  state: PublicKey;
  voterReview: PublicKey;
  systemProgram: PublicKey;
};

type InitializeAccounts = {
  authority: PublicKey;
  state: PublicKey;
  systemProgram: PublicKey;
};


const dummyWallet: AnchorWallet = {
  publicKey: CONTEST_AUTHORITY,
  async signTransaction(tx) {
    return tx;
  },
  async signAllTransactions(txs) {
    return txs;
  },
};

const statePda = PublicKey.findProgramAddressSync(
  [STATE_SEED, CONTEST_AUTHORITY.toBuffer()],
  PROGRAM_ID
)[0];

export function useLeaderReview() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [state, setState] = useState<ContestStateAccount | null>(null);
  const [review, setReview] = useState<VoterReviewAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const anchorWallet = useMemo(() => {
    if (
      wallet.publicKey &&
      wallet.signTransaction &&
      wallet.signAllTransactions
    ) {
      return wallet as AnchorWallet;
    }
    return dummyWallet;
  }, [wallet]);

  const provider = useMemo(
    () => new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions()),
    [connection, anchorWallet]
  );

  const program = useMemo(
    () => new Program<LeaderReview>(typedIdl, provider),
    [provider]
  );

  const reviewPda = useMemo(() => {
    if (!wallet.publicKey) return null;
    return PublicKey.findProgramAddressSync(
      [REVIEW_SEED, statePda.toBuffer(), wallet.publicKey.toBuffer()],
      PROGRAM_ID
    )[0];
  }, [wallet.publicKey]);

  const refreshState = useCallback(async () => {
    setLoading(true);
    try {
      const nextState = await program.account.contestState.fetch(statePda);
      setState(nextState);

      if (reviewPda) {
        try {
          const voterReview = await program.account.voterReview.fetch(reviewPda);
          setReview(voterReview);
        } catch (fetchError) {
          console.debug("No prior review for wallet", fetchError);
          setReview(null);
        }
      } else {
        setReview(null);
      }
    } catch (error) {
      setState(null);
      console.error("Failed to fetch contest state", error);
    } finally {
      setLoading(false);
    }
  }, [program.account.contestState, program.account.voterReview, reviewPda]);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  const submitRating = useCallback(
    async (candidateIndex: number, rating: number) => {
      if (!wallet.publicKey || !reviewPda) {
        toast.error("Connect your wallet first");
        return;
      }
      if (rating < 1 || rating > 5) {
        toast.error("Rating must be between 1 and 5 stars");
        return;
      }

      setIsSubmitting(true);
      try {
        const sig = await program.methods
          .submitReview(candidateIndex, rating)
          .accounts({
            voter: wallet.publicKey,
            state: statePda,
            voterReview: reviewPda,
            systemProgram: SystemProgram.programId,
          } as SubmitReviewAccounts)
          .rpc();

        toast.success("Review saved on-chain", {
          icon: "⚡️",
        });
        console.log("Review tx", sig);
        await refreshState();
      } catch (error: unknown) {
        console.error(error);
        const message =
          error instanceof Error ? error.message : "Transaction failed";
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [program.methods, refreshState, reviewPda, wallet.publicKey]
  );

  const initializeContest = useCallback(async () => {
    if (!wallet.publicKey) {
      toast.error("Connect your wallet");
      return;
    }
    if (!wallet.publicKey.equals(CONTEST_AUTHORITY)) {
      toast.error("Only the contest authority can initialize the state");
      return;
    }

    setIsInitializing(true);
    try {
      const sig = await program.methods
        .initialize([
          "Hariya Mali",
          "Rocky Bhai",
          "Mahendra Bahubali",
          "The Jailer",
          "ACP Praduman",
        ])
        .accounts({
          authority: wallet.publicKey,
          state: statePda,
          systemProgram: SystemProgram.programId,
        } as InitializeAccounts)
        .rpc();

      toast.success("Contest initialized", { icon: "🚀" });
      console.log("Init tx", sig);
      await refreshState();
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Initialization failed";
      toast.error(message);
    } finally {
      setIsInitializing(false);
    }
  }, [program.methods, refreshState, wallet.publicKey]);

  const enrichedCandidates = useMemo(() => {
    if (!state) return [];
    return state.candidates.map((candidate, idx) => {
      const totalScore = asNumber(candidate.totalScore);
      const reviewCount = asNumber(candidate.reviewCount);
      const average = reviewCount === 0 ? 0 : +(totalScore / reviewCount).toFixed(2);

      return {
        name: candidate.name,
        totalScore,
        reviewCount,
        average,
        emoji: CANDIDATE_EMOJIS[idx] ?? "⭐",
      };
    });
  }, [state]);

  return {
    loading,
    state,
    review,
    candidates: enrichedCandidates,
    reviewPda,
    statePda,
    submitRating,
    initializeContest,
    isSubmitting,
    isInitializing,
    canInitialize: wallet.publicKey?.equals(CONTEST_AUTHORITY) ?? false,
  };
}

function asNumber(value: BN | number) {
  if (typeof value === "number") return value;
  return value.toNumber();
}
