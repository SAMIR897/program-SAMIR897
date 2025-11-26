pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("As3b2ezRdvuFhQKH6C8FNJNm7s9YsqGhpyJE9LdF4Sr");

#[program]
pub mod leader_review {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, candidate_names: Vec<String>) -> Result<()> {
        initialize::process_initialize(ctx, candidate_names)
    }

    pub fn submit_review(ctx: Context<SubmitReview>, candidate_index: u8, rating: u8) -> Result<()> {
        submit_review::process_review(ctx, candidate_index, rating)
    }
}
