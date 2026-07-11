import { Schema, model, models } from 'mongoose';

type TemplateStoreItemDocument = {
  templateId: number;
  name: string;
  sku: string;
  category: string;
  type: 'product' | 'service' | 'package';
  organizationName?: string | null;
  description?: string | null;
  price: number;
  unit: string;
  stockQuantity?: number | null;
  status: 'active' | 'draft' | 'hidden';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const templateStoreItemSchema = new Schema<TemplateStoreItemDocument>(
  {
    templateId: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true, uppercase: true },
    category: { type: String, required: true, trim: true },
    type: { type: String, enum: ['product', 'service', 'package'], required: true },
    organizationName: { type: String, trim: true, default: null },
    description: { type: String, trim: true, default: null },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
    stockQuantity: { type: Number, min: 0, default: null },
    status: { type: String, enum: ['active', 'draft', 'hidden'], default: 'draft', required: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const TemplateStoreItem = models.TemplateStoreItem || model<TemplateStoreItemDocument>('TemplateStoreItem', templateStoreItemSchema);
