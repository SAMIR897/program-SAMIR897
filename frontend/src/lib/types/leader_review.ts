/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/leader_review.json`.
 */
export type LeaderReview = {
  "address": "DTEc4EeQ1Ug31uGfLZqvGz3Z44T2M7hYSYrL2vqDbbyE",
  "metadata": {
    "name": "leaderReview",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  116,
                  101,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "candidateNames",
          "type": {
            "vec": "string"
          }
        }
      ]
    },
    {
      "name": "submitReview",
      "discriminator": [
        106,
        30,
        50,
        83,
        89,
        46,
        213,
        239
      ],
      "accounts": [
        {
          "name": "voter",
          "writable": true,
          "signer": true
        },
        {
          "name": "state",
          "writable": true
        },
        {
          "name": "voterReview",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  118,
                  105,
                  101,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "state"
              },
              {
                "kind": "account",
                "path": "voter"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "candidateIndex",
          "type": "u8"
        },
        {
          "name": "rating",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "contestState",
      "discriminator": [
        196,
        14,
        19,
        228,
        209,
        39,
        0,
        4
      ]
    },
    {
      "name": "voterReview",
      "discriminator": [
        174,
        114,
        184,
        151,
        190,
        202,
        25,
        97
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidCandidateCount",
      "msg": "Exactly five candidates must be provided."
    },
    {
      "code": 6001,
      "name": "candidateNameTooLong",
      "msg": "Candidate name is too long."
    },
    {
      "code": 6002,
      "name": "invalidCandidateIndex",
      "msg": "Candidate index is out of range."
    },
    {
      "code": 6003,
      "name": "invalidRating",
      "msg": "Rating must be between 1 and 5 stars."
    },
    {
      "code": 6004,
      "name": "mathOverflow",
      "msg": "Arithmetic overflow detected."
    },
    {
      "code": 6005,
      "name": "unauthorizedReviewOwner",
      "msg": "This review account is owned by another voter."
    },
    {
      "code": 6006,
      "name": "reviewStateMismatch",
      "msg": "Review account belongs to a different contest state."
    }
  ],
  "types": [
    {
      "name": "candidateStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "totalScore",
            "type": "u64"
          },
          {
            "name": "reviewCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "contestState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "totalReviews",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "candidates",
            "type": {
              "vec": {
                "defined": {
                  "name": "candidateStats"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "voterReview",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "voter",
            "type": "pubkey"
          },
          {
            "name": "state",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "ratings",
            "type": {
              "array": [
                "u8",
                5
              ]
            }
          },
          {
            "name": "lastUpdated",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
