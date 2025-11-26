import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import { LeaderReview } from "../target/types/leader_review";

const CANDIDATE_NAMES = [
  "Hariya Mali",
  "Rocky Bhai",
  "Mahendra Bahubali",
  "The Jailer",
  "ACP Praduman",
];

describe("leader_review", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.LeaderReview as Program<LeaderReview>;
  const wallet = provider.wallet as anchor.Wallet;

  const [statePda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("contest"), wallet.publicKey.toBuffer()],
    program.programId
  );

  const [reviewPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("review"), statePda.toBuffer(), wallet.publicKey.toBuffer()],
    program.programId
  );

  it("initializes contest state", async () => {
    await program.methods
      .initialize(CANDIDATE_NAMES)
      .accounts({
        authority: wallet.publicKey,
        state: statePda,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .rpc();

    const state = await program.account.contestState.fetch(statePda);
    expect(state.candidates).to.have.lengthOf(5);
    expect(state.candidates[0].name).to.equal(CANDIDATE_NAMES[0]);
  });


  it("rejects invalid candidate lists", async () => {
    const outsider = anchor.web3.Keypair.generate();
    const airdropSig = await provider.connection.requestAirdrop(outsider.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(airdropSig);

    const [altStatePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("contest"), outsider.publicKey.toBuffer()],
      program.programId
    );

    await expectAnchorError(
      program.methods
        .initialize(["Only", "Four", "Names", "Allowed"])
        .accounts({
          authority: outsider.publicKey,
          state: altStatePda,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .signers([outsider])
        .rpc()
    );
  });

  it("records a new review and aggregates", async () => {
    await program.methods
      .submitReview(0, 4)
      .accounts({
        voter: wallet.publicKey,
        state: statePda,
        voterReview: reviewPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .rpc();

    const state = await program.account.contestState.fetch(statePda);
    const voterReview = await program.account.voterReview.fetch(reviewPda);

    expect(state.candidates[0].totalScore.toNumber()).to.equal(4);
    expect(state.candidates[0].reviewCount.toNumber()).to.equal(1);
    expect(state.totalReviews.toNumber()).to.equal(1);
    expect(voterReview.ratings[0]).to.equal(4);
  });

  it("updates an existing review without double counting", async () => {
    await program.methods
      .submitReview(0, 2)
      .accounts({
        voter: wallet.publicKey,
        state: statePda,
        voterReview: reviewPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .rpc();

    const state = await program.account.contestState.fetch(statePda);
    const voterReview = await program.account.voterReview.fetch(reviewPda);

    expect(state.candidates[0].totalScore.toNumber()).to.equal(2);
    expect(state.candidates[0].reviewCount.toNumber()).to.equal(1);
    expect(state.totalReviews.toNumber()).to.equal(1);
    expect(voterReview.ratings[0]).to.equal(2);
  });

  it("rejects invalid ratings", async () => {
    await expectAnchorError(
      program.methods
        .submitReview(1, 0)
        .accounts({
          voter: wallet.publicKey,
          state: statePda,
          voterReview: reviewPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .rpc()
    );
  });

  it("rejects invalid candidate index", async () => {
    await expectAnchorError(
      program.methods
        .submitReview(9, 3)
        .accounts({
          voter: wallet.publicKey,
          state: statePda,
          voterReview: reviewPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .rpc()
    );
  });
});

async function expectAnchorError(promise: Promise<unknown>) {
  try {
    await promise;
    throw new Error("Expected instruction to fail");
  } catch (error) {
    expect(error).to.be.instanceOf(Error);
  }
}
