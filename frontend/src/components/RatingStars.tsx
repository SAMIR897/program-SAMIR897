"use client";

import { Fragment } from "react";

const stars = [1, 2, 3, 4, 5];

type RatingStarsProps = {
  value: number;
  onChange?: (rating: number) => void;
  disabled?: boolean;
};

export function RatingStars({ value, onChange, disabled }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1" aria-label="rating control">
      {stars.map((star) => {
        const isActive = value >= star;
        return (
          <Fragment key={star}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange?.(star)}
              className={`text-2xl transition-transform ${
                isActive ? "text-accent" : "text-white/40"
              } ${disabled ? "cursor-not-allowed" : "hover:scale-110"}`}
              aria-label={`Set rating to ${star}`}
            >
              ★
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}
