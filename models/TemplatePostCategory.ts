import { Schema, model, models } from 'mongoose';

type TemplatePostCategoryDocument = {
  templateId: number;
  name: string;
  slug: string;
  sortOrder: number;
  status: 'active' | 'hidden';
  createdAt: Date;
  updatedAt: Date;
};

const templatePostCategorySchema = new Schema<TemplatePostCategoryDocument>(
  {
    templateId: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    sortOrder: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['active', 'hidden'], default: 'active', required: true },
  },
  { timestamps: true },
);

export const TemplatePostCategory = models.TemplatePostCategory || model<TemplatePostCategoryDocument>('TemplatePostCategory', templatePostCategorySchema);
