use anchor_lang::prelude::*;

use crate::{
    constants::{MAX_CANDIDATES, MAX_NAME_LEN, STATE_SEED},
    error::ErrorCode,
    state::{CandidateStats, ContestState},
};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = ContestState::space(),
        seeds = [STATE_SEED, authority.key().as_ref()],
        bump
    )]
    pub state: Account<'info, ContestState>,
    pub system_program: Program<'info, System>,
}

pub fn process_initialize(ctx: Context<Initialize>, candidate_names: Vec<String>) -> Result<()> {
    require!(candidate_names.len() == MAX_CANDIDATES, ErrorCode::InvalidCandidateCount);

    let mut candidates = Vec::with_capacity(MAX_CANDIDATES);
    for name in candidate_names.into_iter() {
        require!(name.len() <= MAX_NAME_LEN, ErrorCode::CandidateNameTooLong);
        candidates.push(CandidateStats {
            name,
            total_score: 0,
            review_count: 0,
        });
    }

    let clock = Clock::get()?;
    ctx.accounts.state.set_inner(ContestState {
        authority: ctx.accounts.authority.key(),
        bump: ctx.bumps.state,
        total_reviews: 0,
        created_at: clock.unix_timestamp,
        candidates,
    });

    Ok(())
}
