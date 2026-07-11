import { Schema, model, models } from "mongoose";

type BankDocument = {
  bankId: string;
  name: string;
  bin: number;
  code: string;
  shortName: string;
  logoUrl?: string;
  iconUrl?: string;
  lookupSupported: boolean;
  swiftCode?: string;
  createdAt: Date;
  updatedAt: Date;
};

const bankSchema = new Schema<BankDocument>(
  {
    bankId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bin: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    shortName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    iconUrl: {
      type: String,
      trim: true,
    },
    lookupSupported: {
      type: Boolean,
      default: true,
    },
    swiftCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Bank = models.Bank || model<BankDocument>("Bank", bankSchema);