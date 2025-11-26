use anchor_lang::prelude::*;

use crate::constants::{MAX_CANDIDATES, MAX_NAME_LEN};

#[account]
pub struct ContestState {
    pub authority: Pubkey,
    pub bump: u8,
    pub total_reviews: u64,
    pub created_at: i64,
    pub candidates: Vec<CandidateStats>,
}

impl ContestState {
    pub fn space() -> usize {
        8  // discriminator
        + 32 // authority
        + 1 // bump
        + 8 // total_reviews
        + 8 // created_at
        + 4 // vec len prefix
        + CandidateStats::space() * MAX_CANDIDATES
    }
}

#[account]
pub struct VoterReview {
    pub voter: Pubkey,
    pub state: Pubkey,
    pub bump: u8,
    pub ratings: [u8; MAX_CANDIDATES],
    pub last_updated: i64,
}

impl VoterReview {
    pub fn space() -> usize {
        8  // discriminator
        + 32 // voter
        + 32 // state
        + 1  // bump
        + MAX_CANDIDATES // ratings array
        + 8  // last_updated
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, Default)]
pub struct CandidateStats {
    pub name: String,
    pub total_score: u64,
    pub review_count: u64,
}

impl CandidateStats {
    pub fn space() -> usize {
        4 // string length prefix
        + MAX_NAME_LEN
        + 8 // total_score
        + 8 // review_count
    }
}
