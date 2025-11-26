# Leader Pulse Anchor Program

Leader Pulse is a Solana program built with Anchor that lets each wallet rate a fixed set of five community leaders from one to five stars. The program aggregates every review on-chain so the frontend can show transparent averages and totals for every candidate.

## Architecture

- **ContestState PDA** (`["contest", authority]`) keeps the list of candidate names, their aggregate score, number of reviews, creation timestamp, total reviews, and the authority that initialized the contest.
- **VoterReview PDA** (`["review", contest_state, voter]`) stores each wallet's star ratings for every candidate and the last time the wallet submitted a review.
- **Instructions**
  - `initialize(candidateNames: string[])`: One-time setup called by the authority to create the `ContestState` account with exactly five unique candidates (Hariya Mali, Rocky Bhai, Mahendra Bahubali, The Jailer, ACP Praduman).
  - `submit_review(candidateIndex: u8, rating: u8)`: Records or updates a voter's rating for one candidate and recomputes the aggregates without double-counting reviews.

## Getting Started

```bash
# install deps
yarn install

# run the TypeScript test suite (covers happy + unhappy flows)
anchor test

# build the program (SBPF artifact written to target/deploy)
anchor build
```

### Prerequisites
- Anchor CLI 0.32+
- Rust toolchain + Solana CLI (configured for devnet)
- Node 18+ / Yarn 1.22+

### Deploying to Devnet

```bash
solana config set --url https://api.devnet.solana.com
solana-keygen new --no-bip39-passphrase
solana airdrop 2
anchor build
anchor deploy --provider.cluster devnet
```

Take note of the new `Program Id` and update:
1. `programs/leader_review/src/lib.rs` (`declare_id!`)
2. `Anchor.toml` (under `[programs.devnet]`)
3. `frontend/.env.local` (`NEXT_PUBLIC_PROGRAM_ID`)

### Accounts & PDAs

| Account         | Seeds                                      | Notes                                    |
|-----------------|--------------------------------------------|------------------------------------------|
| ContestState    | `["contest", authority_pubkey]`            | Created once by authority                |
| VoterReview     | `["review", contest_state, voter_pubkey]`  | Auto-created when a wallet reviews       |

### Error Handling

Custom errors live in `src/error.rs`:
- `InvalidCandidateCount`
- `CandidateNameTooLong`
- `InvalidCandidateIndex`
- `InvalidRating`
- `MathOverflow`
- `UnauthorizedReviewOwner`
- `ReviewStateMismatch`

### Testing

`tests/leader_review.ts` covers:
- Successful contest initialization
- Duplicate initialization rejection
- Happy path reviews + average recalculation
- Updating an existing review (no double counting)
- Invalid rating (0 or >5)
- Invalid candidate index (>4)

Run `anchor test` anytime you update the program logic—the suite spins up a local validator, executes the instructions, and asserts the expected state transitions.
