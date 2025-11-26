import { clusterApiUrl, PublicKey } from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID ?? "As3b2ezRdvuFhQKH6C8FNJNm7s9YsqGhpyJE9LdF4Sr"
);

export const CONTEST_AUTHORITY = new PublicKey(
  process.env.NEXT_PUBLIC_CONTEST_AUTHORITY ?? "Awx1ouo1h4svLsLRP2KvKYmfYGm6HamYcqyKuY4B9Uye"
);

export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_URL ?? clusterApiUrl("devnet");

export const STATE_SEED = Buffer.from("contest");
export const REVIEW_SEED = Buffer.from("review");

export const CANDIDATE_EMOJIS = ["🌾", "🔥", "🛡️", "🚨", "🕵️"];

// Map candidate names to their image files
export const CANDIDATE_IMAGES: Record<string, string> = {
  "Hariya Mali": "/picture/hariya mali.jpg",
  "Rocky Bhai": "/picture/Rocky.jpg",
  "Mahendra Bahubali": "/picture/bahubali.jpg",
  "The Jailer": "/picture/jailer.avif",
  "ACP Praduman": "/picture/acp-pradyuman.webp",
};
