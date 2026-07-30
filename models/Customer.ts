import { Schema, model, models } from 'mongoose';

type CustomerDocument = {
  phone?: string | null;
  email?: string | null;
  accountPhone?: string | null;
  accountEmail?: string | null;
  passwordHash?: string | null;
  avatar?: string | null;
  name?: string | null;
  address?: string | null;
  contactType: 'phone' | 'email';
  rawValue?: string | null;
  source: string;
  status: 'new' | 'contacted' | 'closed';
  requestCount: number;
  firstRequestAt: Date;
  lastRequestAt: Date;
  ipAddress?: string;
  userAgent?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
};

const customerSchema = new Schema<CustomerDocument>(
  {
    phone: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      default: null,
    },
    accountPhone: {
      type: String,
      trim: true,
      default: null,
    },
    accountEmail: {
      type: String,
      trim: true,
      default: null,
    },
    passwordHash: {
      type: String,
      trim: true,
      default: null,
    },
    avatar: {
      type: String,
      trim: true,
      default: null,
    },
    name: {
      type: String,
      trim: true,
      default: null,
    },
    address: {
      type: String,
      trim: true,
      default: null,
    },
    contactType: {
      type: String,
      enum: ['phone', 'email'],
      default: 'phone',
      required: true,
      index: true,
    },
    rawValue: {
      type: String,
      trim: true,
      default: null,
    },
    source: {
      type: String,
      required: true,
      default: 'Footer',
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
      required: true,
    },
    requestCount: {
      type: Number,
      default: 1,
      required: true,
    },
    firstRequestAt: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    lastRequestAt: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    ipAddress: {
      type: String,
      trim: true,
      default: null,
    },
    userAgent: {
      type: String,
      trim: true,
      default: null,
    },
    note: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

customerSchema.index({ source: 1, phone: 1 });
customerSchema.index(
  { accountEmail: 1 },
  {
    unique: true,
    partialFilterExpression: {
      accountEmail: { $type: 'string', $ne: '' },
    },
  },
);
customerSchema.index(
  { accountPhone: 1 },
  {
    unique: true,
    partialFilterExpression: {
      accountPhone: { $type: 'string', $ne: '' },
    },
  },
);

export const Customer = models.Customer || model<CustomerDocument>('Customer', customerSchema);
