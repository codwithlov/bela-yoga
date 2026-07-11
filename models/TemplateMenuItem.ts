import { Schema, model, models } from 'mongoose';

type TemplateMenuItemCustomPageSectionDocument = {
  id: number;
  title: string;
  summary: string;
  content: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  sortOrder: number;
};

type TemplateMenuItemCustomPageDocument = {
  eyebrow: string;
  summary: string;
  content: string;
  sections: TemplateMenuItemCustomPageSectionDocument[];
  relatedPostIds: number[];
  keywords: string;
  metaTitle: string;
  metaDescription: string;
};

type TemplateMenuItemDocument = {
  templateId: number;
  title: string;
  path: string;
  location: 'header' | 'footer' | 'account';
  parentId?: number | null;
  sortOrder: number;
  badge?: string | null;
  pageType: 'custom' | 'post' | 'cms_page';
  pageRef?: number | null;
  customPage?: TemplateMenuItemCustomPageDocument | null;
  createdAt: Date;
  updatedAt: Date;
};

const templateMenuItemCustomPageSectionSchema = new Schema<TemplateMenuItemCustomPageSectionDocument>(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    summary: { type: String, default: '', trim: true },
    content: { type: String, default: '' },
    ctaLabel: { type: String, default: null, trim: true },
    ctaHref: { type: String, default: null, trim: true },
    sortOrder: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const templateMenuItemCustomPageSchema = new Schema<TemplateMenuItemCustomPageDocument>(
  {
    eyebrow: { type: String, default: 'Custom page', trim: true },
    summary: { type: String, default: '', trim: true },
    content: { type: String, default: '' },
    sections: { type: [templateMenuItemCustomPageSectionSchema], default: [] },
    relatedPostIds: { type: [Number], default: [] },
    keywords: { type: String, default: '', trim: true },
    metaTitle: { type: String, default: '', trim: true },
    metaDescription: { type: String, default: '', trim: true },
  },
  { _id: false },
);

const templateMenuItemSchema = new Schema<TemplateMenuItemDocument>(
  {
    templateId: { type: Number, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true },
    location: { type: String, enum: ['header', 'footer', 'account'], required: true },
    parentId: { type: Number, default: null },
    sortOrder: { type: Number, required: true, min: 1 },
    badge: { type: String, trim: true, default: null },
    pageType: { type: String, enum: ['custom', 'post', 'cms_page'], default: 'custom', required: true },
    pageRef: { type: Number, default: null },
    customPage: { type: templateMenuItemCustomPageSchema, default: null },
  },
  { timestamps: true },
);

export const TemplateMenuItem = models.TemplateMenuItem || model<TemplateMenuItemDocument>('TemplateMenuItem', templateMenuItemSchema);
