use anchor_lang::prelude::*;

use crate::{
    constants::{MAX_CANDIDATES, MAX_RATING, MIN_RATING, REVIEW_SEED},
    error::ErrorCode,
    state::{ContestState, VoterReview},
};

#[derive(Accounts)]
pub struct SubmitReview<'info> {
    #[account(mut)]
    pub voter: Signer<'info>,
    #[account(mut)]
    pub state: Account<'info, ContestState>,
    #[account(
        init_if_needed,
        payer = voter,
        space = VoterReview::space(),
        seeds = [REVIEW_SEED, state.key().as_ref(), voter.key().as_ref()],
        bump
    )]
    pub voter_review: Account<'info, VoterReview>,
    pub system_program: Program<'info, System>,
}

pub fn process_review(ctx: Context<SubmitReview>, candidate_index: u8, rating: u8) -> Result<()> {
    require!(rating >= MIN_RATING && rating <= MAX_RATING, ErrorCode::InvalidRating);

    let index = candidate_index as usize;
    require!(index < MAX_CANDIDATES, ErrorCode::InvalidCandidateIndex);

    let state = &mut ctx.accounts.state;
    let voter_review = &mut ctx.accounts.voter_review;
    let voter_key = ctx.accounts.voter.key();

    if voter_review.voter == Pubkey::default() {
        voter_review.voter = voter_key;
        voter_review.state = state.key();
        voter_review.bump = ctx.bumps.voter_review;
    } else {
        require_keys_eq!(voter_review.voter, voter_key, ErrorCode::UnauthorizedReviewOwner);
        require_keys_eq!(voter_review.state, state.key(), ErrorCode::ReviewStateMismatch);
    }

    let previous_rating = voter_review.ratings[index];
    if previous_rating == 0 {
        state.total_reviews = state
            .total_reviews
            .checked_add(1)
            .ok_or(ErrorCode::MathOverflow)?;
    }

    let candidate = state
        .candidates
        .get_mut(index)
        .ok_or(ErrorCode::InvalidCandidateIndex)?;

    if previous_rating == 0 {
        candidate.review_count = candidate
            .review_count
            .checked_add(1)
            .ok_or(ErrorCode::MathOverflow)?;
    } else {
        candidate.total_score = candidate
            .total_score
            .checked_sub(previous_rating as u64)
            .ok_or(ErrorCode::MathOverflow)?;
    }

    candidate.total_score = candidate
        .total_score
        .checked_add(rating as u64)
        .ok_or(ErrorCode::MathOverflow)?;

    voter_review.ratings[index] = rating;
    voter_review.last_updated = Clock::get()?.unix_timestamp;

    Ok(())
}
