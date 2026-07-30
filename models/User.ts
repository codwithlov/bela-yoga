import type { UserRole } from "@/types/admin";
import { Schema, model, models } from "mongoose";

type UserDocument = {
  username: string;
  fullName?: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const User = models.User || model<UserDocument>("User", userSchema);