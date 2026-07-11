import { Schema, model, models } from 'mongoose';

type TemplateSectionDocument = {
  templateId: number;
  page: 'home' | 'venue_detail' | 'match_listing' | 'store';
  name: string;
  type: 'hero' | 'listing' | 'cta' | 'feature_grid' | 'faq';
  status: 'active' | 'draft';
  displayOrder: number;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
};

const templateSectionSchema = new Schema<TemplateSectionDocument>(
  {
    templateId: { type: Number, required: true, unique: true },
    page: { type: String, enum: ['home', 'venue_detail', 'match_listing', 'store'], required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['hero', 'listing', 'cta', 'feature_grid', 'faq'], required: true },
    status: { type: String, enum: ['active', 'draft'], default: 'draft', required: true },
    displayOrder: { type: Number, required: true, min: 1 },
    summary: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const TemplateSection = models.TemplateSection || model<TemplateSectionDocument>('TemplateSection', templateSectionSchema);
