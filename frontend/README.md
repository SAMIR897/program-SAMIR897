# Leader Pulse Frontend

A modern Next.js + Tailwind interface for the Leader Pulse review program. Wallets connect with Phantom, Solflare, or Ledger, view live averages for five leaders, and push one-tap star ratings that are sent to the Anchor program on Solana devnet.


## Tech Stack
- **Next.js 16 / App Router** with TypeScript
- **Tailwind CSS 3** + custom glassmorphism theme
- **Framer Motion** micro-animations
- **Solana wallet adapter** providers (Phantom, Solflare, Ledger)
- **Anchor client** generated from `anchor_project/target/idl/leader_review.json`
- Toast notifications via `react-hot-toast`

## Quick Start
```bash
cd frontend
npm install
cp .env.example .env.local # update with deployed program + authority
npm run dev
```
Then open http://localhost:3000 and connect your wallet.

### Required Env Vars
| Name | Description |
|------|-------------|
| `NEXT_PUBLIC_RPC_URL` | RPC endpoint (default devnet) |
| `NEXT_PUBLIC_PROGRAM_ID` | Deployed Anchor program id |
| `NEXT_PUBLIC_CONTEST_AUTHORITY` | Wallet that initialized the contest state |

## Build & Deploy
```bash
npm run lint   # eslint/type checking
npm run build  # production build (used by Vercel)
```
The generated site is fully static and can be deployed via [Vercel](https://vercel.com) or any static host. Make sure the same `.env` values are configured in your hosting provider.

## UI Features
- Wallet connect button with auto network detection
- Hero section summarising the contest status and live uptime
- KPI cards for program id, authority PDA seeds, total review count
- Animated candidate cards with emoji, averages, review counts, and 1–5 star selectors
- Admin-only initialize CTA when the PDA has not been created yet
- Toast feedback for every transaction

## Troubleshooting
- **Program mismatch**: ensure the program id in `.env.local` matches the ID deployed on devnet (also update `anchor_project/src/lib.rs`).
- **Contest not initialized**: the devnet authority must run `anchor run initialize` or use the admin button after connecting the authority wallet.
- **RPC rate limits**: switch `NEXT_PUBLIC_RPC_URL` to a dedicated devnet RPC provider when sharing the demo.
