import { Schema, model, models } from 'mongoose';

type TemplateCmsPageDocument = {
  templateId: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: 'draft' | 'published';
  keywords: string;
  metaTitle: string;
  metaDescription: string;
  canonical: string;
  index: boolean;
  follow: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const templateCmsPageSchema = new Schema<TemplateCmsPageDocument>(
  {
    templateId: { type: Number, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    summary: { type: String, default: '', trim: true },
    content: { type: String, default: '', trim: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', required: true },
    keywords: { type: String, default: '', trim: true },
    metaTitle: { type: String, default: '', trim: true },
    metaDescription: { type: String, default: '', trim: true },
    canonical: { type: String, default: '', trim: true },
    index: { type: Boolean, default: true },
    follow: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const TemplateCmsPage = models.TemplateCmsPage || model<TemplateCmsPageDocument>('TemplateCmsPage', templateCmsPageSchema);