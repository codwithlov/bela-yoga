import { Schema, model, models } from "mongoose";

type LoginRateLimitDocument = {
  key: string;
  attempts: number;
  windowStartedAt: Date;
  blockedUntil?: Date;
  lastAttemptAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

const loginRateLimitSchema = new Schema<LoginRateLimitDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    attempts: {
      type: Number,
      required: true,
      default: 0,
    },
    windowStartedAt: {
      type: Date,
      required: true,
    },
    blockedUntil: {
      type: Date,
    },
    lastAttemptAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

loginRateLimitSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

export const LoginRateLimit = models.LoginRateLimit || model<LoginRateLimitDocument>("LoginRateLimit", loginRateLimitSchema);