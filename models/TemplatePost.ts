import { Schema, model, models } from 'mongoose';

type TemplatePostDocument = {
  templateId: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  description: string;
  authorName: string;
  status: 'draft' | 'review' | 'published';
  publishedAt?: Date | null;
  featured: boolean;
  placement: 'home_hero' | 'news_feed' | 'seo_landing' | 'organization_story';
  keywords: string;
  metaTitle: string;
  metaDescription: string;
  canonical: string;
  index: boolean;
  follow: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const templatePostSchema = new Schema<TemplatePostDocument>(
  {
    templateId: { type: Number, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    authorName: { type: String, required: true, trim: true },
    status: { type: String, enum: ['draft', 'review', 'published'], default: 'draft', required: true },
    publishedAt: { type: Date, default: null },
    featured: { type: Boolean, default: false },
    placement: {
      type: String,
      enum: ['home_hero', 'news_feed', 'seo_landing', 'organization_story'],
      default: 'news_feed',
      required: true,
    },
    keywords: { type: String, default: '', trim: true },
    metaTitle: { type: String, default: '', trim: true },
    metaDescription: { type: String, default: '', trim: true },
    canonical: { type: String, default: '', trim: true },
    index: { type: Boolean, default: true },
    follow: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const TemplatePost = models.TemplatePost || model<TemplatePostDocument>('TemplatePost', templatePostSchema);
