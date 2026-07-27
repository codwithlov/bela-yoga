import { connectToDatabase } from '@/lib/db';
import {
  type AdminTemplateCustomPage,
  type AdminTemplateCustomPageSection,
  type AdminTemplatePage,
  type AdminTemplateMenuItem,
  type AdminTemplatePostCategory,
  type AdminTemplatePost,
  type AdminTemplateSection,
  type AdminTemplateStoreItem,
} from '@/lib/template-cms-data';
import { TemplateCmsPage } from '@/models/TemplateCmsPage';
import { TemplateMenuItem } from '@/models/TemplateMenuItem';
import { TemplatePostCategory } from '@/models/TemplatePostCategory';
import { TemplatePost } from '@/models/TemplatePost';
import { TemplateSection } from '@/models/TemplateSection';
import { TemplateStoreItem } from '@/models/TemplateStoreItem';
import type { Menu } from '@/interfaces/menu';
import type { IPublicStoreItem } from '@/interfaces/discovery';
import type { IAdminMenuCustomPage, IAdminMenuTargetOption } from '@/interfaces/admin';
import { GUEST_ACTION } from '@/constants/route';

const getDefaultPostDescription = (item: Pick<AdminTemplatePost, 'title' | 'excerpt' | 'category'>) => (
  `<p>${item.excerpt}</p><h2>${item.category}</h2><p>${item.title} hiện đang dùng nội dung mẫu của BelaYoga CMS. Đội ngũ nội dung có thể thay bằng bài viết chi tiết, hình ảnh buổi tập và các khối CTA phù hợp.</p>`
);

const getDefaultCanonical = (slug: string) => `${GUEST_ACTION}/${slug}`;
const getDefaultPageCanonical = (slug: string) => `/${slug}`;
const slugifyCategory = (value: string) => (value || '')
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');
const normalizeMenuPath = (path: string) => {
  if (!path) return '/';
  const ensured = path.startsWith('/') ? path : `/${path}`;
  return ensured.length > 1 ? ensured.replace(/\/+$/, '') : ensured;
};
const stripTags = (value: string) => (value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const createDefaultCustomPage = (title: string, path: string): AdminTemplateCustomPage => ({
  eyebrow: 'BelaYoga page',
  summary: `${title} là trang nội dung được quản trị trực tiếp từ menu. Bạn có thể dùng trang này để làm landing page cho lớp học, workshop hoặc chương trình ưu đãi của BelaYoga.`,
  content: `<p>${title} là trang custom được điều khiển từ menu. Bạn có thể dùng editor để viết nội dung dài, chèn ảnh, CTA và khối giới thiệu.</p><h2>Quản trị nội dung linh hoạt</h2><p>Trang này hỗ trợ nội dung chính, danh sách section và khối bài viết liên quan để đội ngũ nội dung triển khai landing page nhanh hơn.</p>`,
  sections: [
    {
      id: 1,
      title: `Điểm nổi bật của ${title}`,
      summary: 'Khối section đầu tiên để mô tả thông điệp và giá trị chính của trang.',
      content: `<p>Section này có thể dùng cho thông điệp chính, lợi ích hoặc mô tả dịch vụ liên quan đến ${title}.</p>`,
      cta_label: 'Xem thêm',
      cta_href: '/gioi-thieu',
      sort_order: 1,
    },
  ],
  related_post_ids: [],
  keywords: `${title}, custom page, belayoga cms`,
  meta_title: title,
  meta_description: `${title} là trang custom của BelaYoga, được quản trị từ menu với nội dung, section và bài viết liên quan.`,
});

const normalizeCustomPageSection = (item: Partial<AdminTemplateCustomPageSection> | undefined, index: number): AdminTemplateCustomPageSection => ({
  id: Number(item?.id || Date.now() + index),
  title: String(item?.title || `Section ${index + 1}`),
  summary: String(item?.summary || ''),
  content: String(item?.content || '<p>Nội dung section...</p>'),
  cta_label: item?.cta_label ? String(item.cta_label) : null,
  cta_href: item?.cta_href ? normalizeMenuPath(String(item.cta_href)) : null,
  sort_order: Number(item?.sort_order || index + 1),
});

const normalizeCustomPage = (input: Partial<AdminTemplateCustomPage> | null | undefined, title: string, path: string): AdminTemplateCustomPage => {
  const fallback = createDefaultCustomPage(title, path);
  const sections = (input?.sections || fallback.sections).map((item, index) => normalizeCustomPageSection(item, index)).sort((a, b) => a.sort_order - b.sort_order);

  return {
    eyebrow: String(input?.eyebrow || fallback.eyebrow),
    summary: String(input?.summary || fallback.summary),
    content: String(input?.content || fallback.content),
    sections,
    related_post_ids: Array.from(new Set((input?.related_post_ids || fallback.related_post_ids).map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0))),
    keywords: String(input?.keywords || fallback.keywords),
    meta_title: String(input?.meta_title || title || fallback.meta_title),
    meta_description: String(input?.meta_description || input?.summary || fallback.meta_description),
  };
};

const normalizePostRecord = (item: Partial<AdminTemplatePost> & Pick<AdminTemplatePost, 'title' | 'slug' | 'category' | 'excerpt' | 'author_name' | 'status' | 'featured' | 'placement'>): AdminTemplatePost => ({
  id: Number(item.id || 0),
  title: item.title,
  slug: item.slug,
  category: item.category,
  excerpt: item.excerpt,
  description: item.description || getDefaultPostDescription(item),
  author_name: item.author_name,
  status: item.status,
  published_at: item.published_at ?? null,
  featured: Boolean(item.featured),
  placement: item.placement,
  keywords: item.keywords || `${item.category}, ${item.slug.replace(/-/g, ' ')}`,
  meta_title: item.meta_title || item.title,
  meta_description: item.meta_description || item.excerpt,
  canonical: item.canonical || getDefaultCanonical(item.slug),
  index: item.index ?? true,
  follow: item.follow ?? true,
});

const mapPost = (item: AdminTemplatePost) => ({
  templateId: item.id,
  title: item.title,
  slug: item.slug,
  category: item.category,
  excerpt: item.excerpt,
  description: item.description,
  authorName: item.author_name,
  status: item.status,
  publishedAt: item.published_at ? new Date(item.published_at) : null,
  featured: item.featured,
  placement: item.placement,
  keywords: item.keywords,
  metaTitle: item.meta_title,
  metaDescription: item.meta_description,
  canonical: item.canonical,
  index: item.index,
  follow: item.follow,
});

const mapPostCategory = (item: AdminTemplatePostCategory) => ({
  templateId: item.id,
  name: item.name,
  slug: slugifyCategory(item.name),
  sortOrder: item.sort_order,
  status: item.status,
});

const mapStoreItem = (item: AdminTemplateStoreItem) => ({
  templateId: item.id,
  name: item.name,
  sku: item.sku,
  category: item.category,
  type: item.type,
  organizationName: item.organization_name,
  description: null,
  price: Number(item.price),
  unit: item.unit,
  stockQuantity: item.stock_quantity,
  status: item.status,
  featured: item.featured,
});

const mapMenuItem = (item: AdminTemplateMenuItem) => ({
  templateId: item.id,
  title: item.title,
  path: normalizeMenuPath(item.path),
  location: item.location,
  parentId: item.parent_id,
  sortOrder: item.sort_order,
  badge: item.badge,
  pageType: item.page_type,
  pageRef: item.page_ref,
  customPage: item.page_type === 'custom' ? normalizeCustomPage(item.custom_page, item.title, item.path) : null,
});

const mapCmsPage = (item: AdminTemplatePage) => ({
  templateId: item.id,
  title: item.title,
  slug: item.slug,
  summary: item.summary,
  content: item.content,
  status: item.status,
  keywords: item.keywords,
  metaTitle: item.meta_title,
  metaDescription: item.meta_description,
  canonical: item.canonical,
  index: item.index,
  follow: item.follow,
});

const mapSection = (item: AdminTemplateSection) => ({
  templateId: item.id,
  page: item.page,
  name: item.name,
  type: item.type,
  status: item.status,
  displayOrder: item.display_order,
  summary: item.summary,
});

const serializePost = (doc: any): AdminTemplatePost => normalizePostRecord({
  id: doc.templateId,
  title: doc.title,
  slug: doc.slug,
  category: doc.category,
  excerpt: doc.excerpt,
  description: doc.description,
  author_name: doc.authorName,
  status: doc.status,
  published_at: doc.publishedAt ? new Date(doc.publishedAt).toISOString() : null,
  featured: Boolean(doc.featured),
  placement: doc.placement,
  keywords: doc.keywords,
  meta_title: doc.metaTitle,
  meta_description: doc.metaDescription,
  canonical: doc.canonical,
  index: doc.index,
  follow: doc.follow,
});

const serializePostCategory = (doc: any): AdminTemplatePostCategory => ({
  id: doc.templateId,
  name: doc.name,
  sort_order: Number(doc.sortOrder || 1),
  status: doc.status || 'active',
});

const serializeStoreItem = (doc: any): AdminTemplateStoreItem => ({
  id: doc.templateId,
  name: doc.name,
  sku: doc.sku,
  category: doc.category,
  type: doc.type,
  organization_name: doc.organizationName || null,
  price: Number(doc.price),
  unit: doc.unit,
  stock_quantity: doc.stockQuantity ?? null,
  status: doc.status,
  featured: Boolean(doc.featured),
});

const serializeMenuItem = (doc: any): AdminTemplateMenuItem => ({
  id: doc.templateId,
  title: doc.title,
  path: normalizeMenuPath(doc.path),
  location: doc.location,
  parent_id: doc.parentId ?? null,
  sort_order: doc.sortOrder,
  badge: doc.badge ?? null,
  page_type: doc.pageType || 'custom',
  page_ref: doc.pageRef ?? null,
  custom_page: (doc.pageType || 'custom') === 'custom' ? normalizeCustomPage({
    eyebrow: doc.customPage?.eyebrow,
    summary: doc.customPage?.summary,
    content: doc.customPage?.content,
    sections: doc.customPage?.sections?.map((item: any) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      content: item.content,
      cta_label: item.ctaLabel ?? null,
      cta_href: item.ctaHref ?? null,
      sort_order: item.sortOrder,
    })),
    related_post_ids: doc.customPage?.relatedPostIds,
    keywords: doc.customPage?.keywords,
    meta_title: doc.customPage?.metaTitle,
    meta_description: doc.customPage?.metaDescription,
  }, doc.title, doc.path) : null,
});

const serializeCmsPage = (doc: any): AdminTemplatePage => ({
  id: doc.templateId,
  title: doc.title,
  slug: doc.slug,
  summary: doc.summary || '',
  content: doc.content || '',
  status: doc.status,
  keywords: doc.keywords || doc.slug,
  meta_title: doc.metaTitle || doc.title,
  meta_description: doc.metaDescription || doc.summary || '',
  canonical: doc.canonical || getDefaultPageCanonical(doc.slug),
  index: doc.index ?? true,
  follow: doc.follow ?? true,
});

const serializeSection = (doc: any): AdminTemplateSection => ({
  id: doc.templateId,
  page: doc.page,
  name: doc.name,
  type: doc.type,
  status: doc.status,
  display_order: doc.displayOrder,
  summary: doc.summary,
});

async function withFallback<T>(loader: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await loader();
  } catch {
    return fallback;
  }
}

export async function ensureTemplateCmsSeed() {
  await connectToDatabase();
  const fallbackCategoryName = 'Chưa phân loại';

  await TemplateMenuItem.deleteMany({
    templateId: { $in: [3105, 3106, 3107, 3108, 3109] },
  });

  const fallbackSlug = slugifyCategory(fallbackCategoryName);
  const fallbackCategory = await TemplatePostCategory.findOne({ slug: fallbackSlug }).lean();
  if (!fallbackCategory) {
    const maxCategory: any = await TemplatePostCategory.findOne().sort({ templateId: -1 }).lean();
    const nextCategoryId = Math.max(9200, Number(maxCategory?.templateId || 9200)) + 1;
    const categoryCount = await TemplatePostCategory.countDocuments();

    await TemplatePostCategory.create({
      templateId: nextCategoryId,
      name: fallbackCategoryName,
      slug: fallbackSlug,
      sortOrder: categoryCount + 1,
      status: 'active',
    });
  }

  const currentPostCategories = await TemplatePost.find({}, { category: 1, _id: 0 }).lean();
  const categoryNames = Array.from(new Set(currentPostCategories.map((item: any) => String(item.category || '').trim()).filter(Boolean)));

  if (categoryNames.length) {
    const existing = await TemplatePostCategory.find({}, { name: 1 }).lean();
    const existingNames = new Set(existing.map((item: any) => String(item.name || '').trim().toLowerCase()));

    const nextCategories = categoryNames.filter((name) => !existingNames.has(name.toLowerCase()));
    if (nextCategories.length) {
      const maxDoc: any = await TemplatePostCategory.findOne().sort({ templateId: -1 }).lean();
      let nextTemplateId = Math.max(9200, Number(maxDoc?.templateId || 9200));
      await TemplatePostCategory.insertMany(nextCategories.map((name, index) => {
        nextTemplateId += 1;
        return {
          templateId: nextTemplateId,
          name,
          slug: slugifyCategory(name),
          sortOrder: (existing.length + index + 1),
          status: 'active',
        };
      }));
    }
  }

  const categoryDocs = await TemplatePostCategory.find({}, { name: 1 }).lean();
  const availableCategoryNames = new Set(categoryDocs.map((item: any) => String(item.name || '').trim().toLowerCase()).filter(Boolean));
  const postDocs = await TemplatePost.find({}, { templateId: 1, category: 1 }).lean();
  const invalidPostIds = postDocs
    .filter((item: any) => !availableCategoryNames.has(String(item.category || '').trim().toLowerCase()))
    .map((item: any) => item.templateId);

  if (invalidPostIds.length) {
    await TemplatePost.updateMany(
      { templateId: { $in: invalidPostIds } },
      { $set: { category: fallbackCategoryName } },
    );
  }

}

export async function getAdminPostCategoriesFromStore() {
  return withFallback(async () => {
    await ensureTemplateCmsSeed();
    const docs = await TemplatePostCategory.find().sort({ sortOrder: 1, updatedAt: -1 }).lean();
    return docs.map(serializePostCategory);
  }, [] as AdminTemplatePostCategory[]);
}

export async function createAdminPostCategory(input: { name: string; sort_order?: number; status?: 'active' | 'hidden' }) {
  await ensureTemplateCmsSeed();
  const maxDoc: any = await TemplatePostCategory.findOne().sort({ templateId: -1 }).lean();
  const templateId = Math.max(9200, Number(maxDoc?.templateId || 9200)) + 1;
  const existingCount = await TemplatePostCategory.countDocuments();
  const normalizedName = String(input.name || '').trim();

  const created = await TemplatePostCategory.create({
    templateId,
    name: normalizedName,
    slug: slugifyCategory(normalizedName),
    sortOrder: Number(input.sort_order || existingCount + 1),
    status: input.status || 'active',
  });

  return serializePostCategory(created.toObject());
}

export async function updateAdminPostCategory(templateId: number, input: { name: string; sort_order?: number; status?: 'active' | 'hidden' }) {
  await ensureTemplateCmsSeed();
  const normalizedName = String(input.name || '').trim();

  const current: any = await TemplatePostCategory.findOne({ templateId }).lean();
  const updated = await TemplatePostCategory.findOneAndUpdate(
    { templateId },
    {
      name: normalizedName,
      slug: slugifyCategory(normalizedName),
      sortOrder: Number(input.sort_order || current?.sortOrder || 1),
      status: input.status || current?.status || 'active',
    },
    { new: true },
  ).lean();

  if (current?.name && current.name !== normalizedName) {
    await TemplatePost.updateMany({ category: current.name }, { $set: { category: normalizedName } });
  }

  return updated ? serializePostCategory(updated) : null;
}

export async function deleteAdminPostCategory(templateId: number) {
  await ensureTemplateCmsSeed();
  const deleted: any = await TemplatePostCategory.findOneAndDelete({ templateId }).lean();
  if (!deleted) {
    return null;
  }

  const fallbackCategoryName = 'Chưa phân loại';
  let reassignedCount = 0;

  if (String(deleted.name || '').trim().toLowerCase() !== fallbackCategoryName.toLowerCase()) {
    const updateResult = await TemplatePost.updateMany(
      { category: deleted.name },
      { $set: { category: fallbackCategoryName } },
    );
    reassignedCount = Number(updateResult.modifiedCount || 0);
  }

  let fallbackCategoryCreated = false;
  const fallbackSlug = slugifyCategory(fallbackCategoryName);
  const fallbackCategory = await TemplatePostCategory.findOne({ slug: fallbackSlug }).lean();

  if (!fallbackCategory) {
    const maxDoc: any = await TemplatePostCategory.findOne().sort({ templateId: -1 }).lean();
    const nextTemplateId = Math.max(9200, Number(maxDoc?.templateId || 9200)) + 1;
    const existingCount = await TemplatePostCategory.countDocuments();

    await TemplatePostCategory.create({
      templateId: nextTemplateId,
      name: fallbackCategoryName,
      slug: fallbackSlug,
      sortOrder: existingCount + 1,
      status: 'active',
    });
    fallbackCategoryCreated = true;
  }

  return {
    deleted_category: serializePostCategory(deleted),
    reassigned_count: reassignedCount,
    reassigned_to: fallbackCategoryName,
    fallback_category_created: fallbackCategoryCreated,
  };
}

export async function getAdminPostsFromStore() {
  return withFallback(async () => {
    await ensureTemplateCmsSeed();
    const docs = await TemplatePost.find().sort({ publishedAt: -1, updatedAt: -1 }).lean();
    return docs.map(serializePost);
  }, [] as AdminTemplatePost[]);
}

export async function getPublicPostsFromStore(limit?: number) {
  const items = await withFallback(async () => {
    await ensureTemplateCmsSeed();
    const docs = await TemplatePost.find({ status: 'published' }).sort({ featured: -1, publishedAt: -1, updatedAt: -1 }).lean();
    return docs.map(serializePost);
  }, [] as AdminTemplatePost[]);

  return items.slice(0, limit && limit > 0 ? limit : items.length);
}

export async function getPublicPostBySlugFromStore(slug: string) {
  const items = await withFallback(async () => {
    await ensureTemplateCmsSeed();
    const doc = await TemplatePost.findOne({ slug, status: 'published' }).lean();
    return doc ? serializePost(doc) : null;
  }, null as AdminTemplatePost | null);

  return items;
}

export async function createAdminPost(input: Omit<AdminTemplatePost, 'id' | 'published_at'> & { published_at?: string | null }) {
  await ensureTemplateCmsSeed();
  const templateId = Date.now();
  const created = await TemplatePost.create({
    templateId,
    title: input.title,
    slug: input.slug,
    category: input.category,
    excerpt: input.excerpt,
    description: input.description,
    authorName: input.author_name,
    status: input.status,
    publishedAt: input.published_at ? new Date(input.published_at) : null,
    featured: input.featured,
    placement: input.placement,
    keywords: input.keywords,
    metaTitle: input.meta_title,
    metaDescription: input.meta_description,
    canonical: input.canonical,
    index: input.index,
    follow: input.follow,
  });

  return serializePost(created.toObject());
}

export async function updateAdminPost(templateId: number, input: Omit<AdminTemplatePost, 'id' | 'published_at'> & { published_at?: string | null }) {
  await ensureTemplateCmsSeed();
  const updated = await TemplatePost.findOneAndUpdate(
    { templateId },
    {
      title: input.title,
      slug: input.slug,
      category: input.category,
      excerpt: input.excerpt,
      description: input.description,
      authorName: input.author_name,
      status: input.status,
      publishedAt: input.published_at ? new Date(input.published_at) : null,
      featured: input.featured,
      placement: input.placement,
      keywords: input.keywords,
      metaTitle: input.meta_title,
      metaDescription: input.meta_description,
      canonical: input.canonical,
      index: input.index,
      follow: input.follow,
    },
    { new: true },
  ).lean();

  return updated ? serializePost(updated) : null;
}

export async function deleteAdminPost(templateId: number) {
  await ensureTemplateCmsSeed();
  const deleted = await TemplatePost.findOneAndDelete({ templateId }).lean();
  return deleted ? serializePost(deleted) : null;
}

export async function getAdminStoreItemsFromStore() {
  return withFallback(async () => {
    await ensureTemplateCmsSeed();
    const docs = await TemplateStoreItem.find().sort({ featured: -1, updatedAt: -1 }).lean();
    return docs.map(serializeStoreItem);
  }, [] as AdminTemplateStoreItem[]);
}

export async function getPublicStoreItemsFromStore(limit?: number): Promise<IPublicStoreItem[]> {
  const items = await withFallback(async () => {
    await ensureTemplateCmsSeed();
    const docs = await TemplateStoreItem.find({ status: 'active' }).sort({ featured: -1, updatedAt: -1 }).lean();
    return docs.map((doc) => ({
      id: doc.templateId,
      organization_id: doc.templateId,
      organization_name: doc.organizationName || null,
      name: doc.name,
      type: doc.type,
      category: doc.category,
      price: doc.price,
      unit: doc.unit,
      description: doc.description || null,
      sport_type: null,
      field_format: null,
      is_addon: doc.type !== 'package',
      stock_quantity: doc.stockQuantity ?? null,
    })) as IPublicStoreItem[];
  }, [] as IPublicStoreItem[]);

  return items.slice(0, limit && limit > 0 ? limit : items.length);
}

export async function createAdminStoreItem(input: Omit<AdminTemplateStoreItem, 'id'> & { description?: string | null }) {
  await ensureTemplateCmsSeed();
  const templateId = Date.now();
  const created = await TemplateStoreItem.create({
    templateId,
    name: input.name,
    sku: input.sku,
    category: input.category,
    type: input.type,
    organizationName: input.organization_name || null,
    description: input.description || null,
    price: input.price,
    unit: input.unit,
    stockQuantity: input.stock_quantity ?? null,
    status: input.status,
    featured: input.featured,
  });

  return serializeStoreItem(created.toObject());
}

export async function updateAdminStoreItem(templateId: number, input: Omit<AdminTemplateStoreItem, 'id'> & { description?: string | null }) {
  await ensureTemplateCmsSeed();
  const updated = await TemplateStoreItem.findOneAndUpdate(
    { templateId },
    {
      name: input.name,
      sku: input.sku,
      category: input.category,
      type: input.type,
      organizationName: input.organization_name || null,
      description: input.description || null,
      price: input.price,
      unit: input.unit,
      stockQuantity: input.stock_quantity ?? null,
      status: input.status,
      featured: input.featured,
    },
    { new: true },
  ).lean();

  return updated ? serializeStoreItem(updated) : null;
}

export async function deleteAdminStoreItem(templateId: number) {
  await ensureTemplateCmsSeed();
  const deleted = await TemplateStoreItem.findOneAndDelete({ templateId }).lean();
  return deleted ? serializeStoreItem(deleted) : null;
}

export async function getAdminMenuBundleFromStore() {
  return withFallback(async () => {
    await ensureTemplateCmsSeed();
    const menuDocs = await TemplateMenuItem.find().sort({ location: 1, sortOrder: 1 }).lean();
    const sectionDocs = await TemplateSection.find().sort({ page: 1, displayOrder: 1 }).lean();
    const pageDocs = await TemplateCmsPage.find().sort({ updatedAt: -1, title: 1 }).lean();
    return {
      menus: menuDocs.map(serializeMenuItem),
      sections: sectionDocs.map(serializeSection),
      pages: pageDocs.map(serializeCmsPage),
    };
  }, { menus: [] as AdminTemplateMenuItem[], sections: [] as AdminTemplateSection[], pages: [] as AdminTemplatePage[] });
}

export async function getPublicMenusFromStore(location?: AdminTemplateMenuItem['location']): Promise<Menu[]> {
  const bundle = await getAdminMenuBundleFromStore();
  const flat = bundle.menus.filter((item) => !location || item.location === location).sort((a, b) => a.sort_order - b.sort_order);

  const toTree = (parentId: number | null): Menu[] => flat
    .filter((item) => (item.parent_id ?? null) === parentId)
    .map((item) => ({
      key: item.id,
      title: item.title,
      url_to: item.path,
      slug: item.path,
      page_type: item.page_type,
      page_ref: item.page_ref,
      custom_page: item.custom_page || null,
      children: toTree(item.id),
    }));

  return toTree(null);
}

export async function createAdminMenuItem(input: Omit<AdminTemplateMenuItem, 'id' | 'parent_id'> & { parent_id?: number | null }) {
  await ensureTemplateCmsSeed();
  const templateId = Date.now();
  const created = await TemplateMenuItem.create({
    templateId,
    title: input.title,
    path: normalizeMenuPath(input.path),
    location: input.location,
    parentId: input.parent_id ?? null,
    sortOrder: input.sort_order,
    badge: input.badge || null,
    pageType: input.page_type || 'custom',
    pageRef: input.page_ref ?? null,
    customPage: (input.page_type || 'custom') === 'custom' ? {
      eyebrow: normalizeCustomPage(input.custom_page, input.title, input.path).eyebrow,
      summary: normalizeCustomPage(input.custom_page, input.title, input.path).summary,
      content: normalizeCustomPage(input.custom_page, input.title, input.path).content,
      sections: normalizeCustomPage(input.custom_page, input.title, input.path).sections.map((item) => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        content: item.content,
        ctaLabel: item.cta_label,
        ctaHref: item.cta_href,
        sortOrder: item.sort_order,
      })),
      relatedPostIds: normalizeCustomPage(input.custom_page, input.title, input.path).related_post_ids,
      keywords: normalizeCustomPage(input.custom_page, input.title, input.path).keywords,
      metaTitle: normalizeCustomPage(input.custom_page, input.title, input.path).meta_title,
      metaDescription: normalizeCustomPage(input.custom_page, input.title, input.path).meta_description,
    } : null,
  });

  return serializeMenuItem(created.toObject());
}

export async function updateAdminMenuItem(templateId: number, input: Omit<AdminTemplateMenuItem, 'id' | 'parent_id'> & { parent_id?: number | null }) {
  await ensureTemplateCmsSeed();
  const normalizedCustomPage = (input.page_type || 'custom') === 'custom' ? normalizeCustomPage(input.custom_page, input.title, input.path) : null;
  const updated = await TemplateMenuItem.findOneAndUpdate(
    { templateId },
    {
      title: input.title,
      path: normalizeMenuPath(input.path),
      location: input.location,
      parentId: input.parent_id ?? null,
      sortOrder: input.sort_order,
      badge: input.badge || null,
      pageType: input.page_type || 'custom',
      pageRef: input.page_ref ?? null,
      customPage: normalizedCustomPage ? {
        eyebrow: normalizedCustomPage.eyebrow,
        summary: normalizedCustomPage.summary,
        content: normalizedCustomPage.content,
        sections: normalizedCustomPage.sections.map((item) => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          content: item.content,
          ctaLabel: item.cta_label,
          ctaHref: item.cta_href,
          sortOrder: item.sort_order,
        })),
        relatedPostIds: normalizedCustomPage.related_post_ids,
        keywords: normalizedCustomPage.keywords,
        metaTitle: normalizedCustomPage.meta_title,
        metaDescription: normalizedCustomPage.meta_description,
      } : null,
    },
    { new: true },
  ).lean();

  return updated ? serializeMenuItem(updated) : null;
}

export async function deleteAdminMenuItem(templateId: number) {
  await ensureTemplateCmsSeed();
  const deleted = await TemplateMenuItem.findOneAndDelete({ templateId }).lean();
  return deleted ? serializeMenuItem(deleted) : null;
}

export async function getAdminMenuTargetOptionsFromStore(): Promise<{ post_options: IAdminMenuTargetOption[]; page_options: IAdminMenuTargetOption[] }> {
  const [posts, pages] = await Promise.all([
    getAdminPostsFromStore(),
    withFallback(async () => {
      await ensureTemplateCmsSeed();
      const docs = await TemplateCmsPage.find().sort({ updatedAt: -1, title: 1 }).lean();
      return docs.map(serializeCmsPage);
    }, [] as AdminTemplatePage[]),
  ]);

  return {
    post_options: posts.map((item) => ({
      id: item.id,
      title: item.title,
      path: item.canonical || getDefaultCanonical(item.slug),
      type: 'post',
      status: item.status,
    })),
    page_options: pages.map((item) => ({
      id: item.id,
      title: item.title,
      path: item.canonical || getDefaultPageCanonical(item.slug),
      type: 'cms_page',
      status: item.status,
    })),
  };
}

export async function getPublicPostByIdFromStore(templateId: number) {
  return withFallback(async () => {
    await ensureTemplateCmsSeed();
    const doc = await TemplatePost.findOne({ templateId, status: 'published' }).lean();
    return doc ? serializePost(doc) : null;
  }, null as AdminTemplatePost | null);
}

export async function getPublicPostsByIdsFromStore(templateIds: number[]) {
  const ids = Array.from(new Set(templateIds.map((item) => Number(item)).filter((item) => Number.isFinite(item) && item > 0)));
  if (!ids.length) {
    return [];
  }

  return withFallback(async () => {
    await ensureTemplateCmsSeed();
    const docs = await TemplatePost.find({ templateId: { $in: ids }, status: 'published' }).lean();
    const mapped = docs.map(serializePost);
    return ids.map((id) => mapped.find((item) => item.id === id)).filter(Boolean) as AdminTemplatePost[];
  }, [] as AdminTemplatePost[]);
}

export async function getPublicCmsPageByIdFromStore(templateId: number) {
  return withFallback(async () => {
    await ensureTemplateCmsSeed();
    const doc = await TemplateCmsPage.findOne({ templateId, status: 'published' }).lean();
    return doc ? serializeCmsPage(doc) : null;
  }, null as AdminTemplatePage | null);
}

export async function resolvePublicMenuRouteByPathFromStore(path: string) {
  const normalizedPath = normalizeMenuPath(path);
  const bundle = await getAdminMenuBundleFromStore();
  const matchedMenu = bundle.menus.find((item) => normalizeMenuPath(item.path) === normalizedPath);

  if (!matchedMenu) {
    return null;
  }

  if (matchedMenu.page_type === 'custom') {
    return { type: 'custom' as const, menu: matchedMenu };
  }

  if (!matchedMenu.page_ref) {
    return null;
  }

  if (matchedMenu.page_type === 'post') {
    const post = await getPublicPostByIdFromStore(matchedMenu.page_ref);
    return post ? { type: 'post' as const, menu: matchedMenu, post } : null;
  }

  if (matchedMenu.page_type === 'cms_page') {
    const page = await getPublicCmsPageByIdFromStore(matchedMenu.page_ref);
    return page ? { type: 'cms_page' as const, menu: matchedMenu, page } : null;
  }

  return null;
}

export async function getPublicSectionsFromStore(page?: AdminTemplateSection['page']) {
  const bundle = await getAdminMenuBundleFromStore();
  return bundle.sections
    .filter((item) => item.status === 'active')
    .filter((item) => !page || item.page === page)
    .sort((a, b) => a.display_order - b.display_order);
}

export async function createAdminSection(input: Omit<AdminTemplateSection, 'id'>) {
  await ensureTemplateCmsSeed();
  const templateId = Date.now();
  const created = await TemplateSection.create({
    templateId,
    page: input.page,
    name: input.name,
    type: input.type,
    status: input.status,
    displayOrder: input.display_order,
    summary: input.summary,
  });

  return serializeSection(created.toObject());
}

export async function updateAdminSection(templateId: number, input: Omit<AdminTemplateSection, 'id'>) {
  await ensureTemplateCmsSeed();
  const updated = await TemplateSection.findOneAndUpdate(
    { templateId },
    {
      page: input.page,
      name: input.name,
      type: input.type,
      status: input.status,
      displayOrder: input.display_order,
      summary: input.summary,
    },
    { new: true },
  ).lean();

  return updated ? serializeSection(updated) : null;
}

export async function deleteAdminSection(templateId: number) {
  await ensureTemplateCmsSeed();
  const deleted = await TemplateSection.findOneAndDelete({ templateId }).lean();
  return deleted ? serializeSection(deleted) : null;
}
