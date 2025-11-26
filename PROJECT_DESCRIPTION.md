# Project Description

**Deployed Frontend URL:** https://program-samir-897.vercel.app

**Solana Program ID:** As3b2ezRdvuFhQKH6C8FNJNm7s9YsqGhpyJE9LdF4Sr (deployed on devnet)

## Project Overview

### Description
Leader Pulse is a PDA-driven review board for five fictional leaders (Hariya Mali, Rocky Bhai, Mahendra Bahubali, The Jailer, ACP Praduman). Every wallet can vote 1–5 stars for each leader. Ratings are stored directly on Solana, and the frontend renders live averages, totals, and each wallet's personal scores. The goal is to showcase Anchor concepts (PDAs, deterministic accounts, aggregate math) alongside a polished React UI.

### Key Features
- **One-click wallet ratings** with validation (only 1–5 stars).
- **Deterministic PDAs** per contest and voter, preventing duplicate state or tampering.
- **Live leaderboard** that shows averages, totals, and review counts per candidate.
- **Admin-only initialization** so only the authority can create the contest.
- **Toast + UI feedback** for every transaction, plus helpful copy when the state is missing.

### How to Use the dApp
1. **Connect Wallet** – Phantom, Solflare, or Ledger via the wallet adapter modal.
2. **Initialize (authority only)** – If the contest hasn't been created, the authority wallet can initialize the PDA from the UI.
3. **Rate leaders** – Click the stars on any candidate card and press *Save* to sign the transaction.
4. **Review stats** – Totals and averages update automatically after the transaction confirms.
5. **Refresh / share** – Because data lives on-chain, anyone visiting the site sees the latest results.

## Program Architecture

### PDA Usage
- **ContestState PDA**: `findProgramAddressSync(["contest", authority_pubkey], programId)`
  - Holds authority, bump, candidate metadata, total review count, timestamps.
- **VoterReview PDA**: `findProgramAddressSync(["review", contest_state, voter_pubkey], programId)`
  - Tracks a specific wallet's ratings for each candidate and the last update time.

### Program Instructions
- **initialize(candidate_names: Vec<String>)**
  - Authority-only. Ensures exactly five names (<=32 chars) and writes the `ContestState` PDA.
- **submit_review(candidate_index: u8, rating: u8)**
  - Anyone can call (requires signer). Validates candidate index + rating bounds, lazily creates the `VoterReview` PDA, updates averages, and prevents double counting by subtracting previous ratings.

### Account Structure
```rust
#[account]
pub struct ContestState {
    pub authority: Pubkey,
    pub bump: u8,
    pub total_reviews: u64,
    pub created_at: i64,
    pub candidates: Vec<CandidateStats>,
}

#[account]
pub struct VoterReview {
    pub voter: Pubkey,
    pub state: Pubkey,
    pub bump: u8,
    pub ratings: [u8; MAX_CANDIDATES],
    pub last_updated: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, Default)]
pub struct CandidateStats {
    pub name: String,
    pub total_score: u64,
    pub review_count: u64,
}
```

## Testing

### Test Coverage
All tests live in `anchor_project/tests/leader_review.ts` and use the Anchor client.

**Happy Path Tests:**
- Initializes a contest with five candidates.
- Submits a brand-new review and confirms aggregates update.
- Updates an existing review and verifies totals don't double-count.

**Unhappy Path Tests:**
- Initialization fails when fewer than five names are provided.
- `submit_review` rejects ratings outside 1–5.
- `submit_review` rejects an out-of-range candidate index.

### Running Tests
```bash
cd anchor_project
yarn install
anchor test
```

### Additional Notes for Evaluators
- The frontend consumes the exact IDL emitted during `anchor build` (`frontend/src/lib/idl/leader_review.json`), so any redeployments only require copying the new IDL + updating `.env.local`.
- `frontend/.env.example` documents the environment variables needed for Vercel or local development.
- The UI build (`npm run build`) and program tests (`anchor test`) are both included in the submission logs to show the project passes linting and compiles cleanly.
