use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Exactly five candidates must be provided.")]
    InvalidCandidateCount,
    #[msg("Candidate name is too long.")]
    CandidateNameTooLong,
    #[msg("Candidate index is out of range.")]
    InvalidCandidateIndex,
    #[msg("Rating must be between 1 and 5 stars.")]
    InvalidRating,
    #[msg("Arithmetic overflow detected.")]
    MathOverflow,
    #[msg("This review account is owned by another voter.")]
    UnauthorizedReviewOwner,
    #[msg("Review account belongs to a different contest state.")]
    ReviewStateMismatch,
}
