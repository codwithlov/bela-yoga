import { Schema, model, models, type Types } from "mongoose";

type SessionDocument = {
  userId: Types.ObjectId;
  expiresAt: Date;
  revokedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  lastSeenAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const sessionSchema = new Schema<SessionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revokedAt: {
      type: Date,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    lastSeenAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = models.Session || model<SessionDocument>("Session", sessionSchema);