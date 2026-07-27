import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublicPostBySlug } from '@/services/api/discovery';
import { getTextOnly } from '@/utils/htmlUtils';
import PublicContentPage from '../../components/PublicContentPage';
import { GUEST_ACTION } from '@/constants/route';

type PageProps = { params: Promise<{ slug: string }> };

const getKeywordBadges = (keywords?: string | null) => (keywords || '')
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPublicPostBySlug(slug);

    if (!post) {
        return {};
    }

    return {
        title: post.meta_title || post.title,
        description: post.meta_description || post.excerpt,
        keywords: post.keywords,
        alternates: {
            canonical: post.canonical || `${GUEST_ACTION}/${post.slug}`,
        },
        robots: {
            index: post.index,
            follow: post.follow,
        },
        openGraph: {
            title: post.meta_title || post.title,
            description: post.meta_description || post.excerpt,
            type: 'article',
        },
    };
}

export default async function PublicPostDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPublicPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <PublicContentPage
            eyebrow={post.category}
            title={post.title}
            summary={post.excerpt}
            metaDescription={post.meta_description || getTextOnly(post.description).slice(0, 180)}
            content={post.description}
            badges={getKeywordBadges(post.keywords)}
            extraMeta={[
                post.author_name,
                post.placement,
                post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN') : 'Draft',
            ].filter(Boolean)}
            backHref={GUEST_ACTION}
            backLabel='Quay về danh sách buổi tập Yoga'
        />
    );
}
