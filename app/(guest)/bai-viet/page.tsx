import Link from 'next/link';
import MainPageTemplate from '@/components/guest/MainPageTemplate';
import { getPublicPosts } from '@/services/api/discovery';

export default async function PublicPostsPage() {
    const posts = await getPublicPosts(24);

    return (
        <div>
            <MainPageTemplate
                eyebrow="Bài viết"
                title="Thư viện bài viết public cho template CMS SPORTVERSE"
                description="Trang này đọc trực tiếp dữ liệu từ template API để mỗi dự án có thể bật blog/news/content hub mà không cần backend riêng."
                highlights={[
                    'Nguồn dữ liệu lấy từ `GET /api/public/v1/posts`.',
                    'Phù hợp cho news feed, SEO landing và bài kể chuyện cộng đồng.',
                    'Khi dự án thật cần sâu hơn chỉ cần mở rộng schema, không cần thay lại cấu trúc trang.',
                ]}
            />

            <section className="width-primary mx-auto px-4 pb-12">
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {posts.length > 0 ? posts.map((post) => (
                        <Link key={post.id} href={`/bai-viet/${post.slug}`} className="rounded-[1.5rem] border border-sgt-gray-2 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-sgt-primary-2 hover:shadow-lg">
                            <div className="flex items-center justify-between gap-2 text-xs text-sgt-primary-1">
                                <span className="font-semibold uppercase tracking-[0.18em]">{post.category}</span>
                                <span>{post.featured ? 'Featured' : post.status}</span>
                            </div>
                            <h2 className="mt-3 text-xl font-bold text-sgt-secondary-2">{post.title}</h2>
                            <p className="mt-3 text-sm leading-6 text-sgt-neutral-3">{post.excerpt}</p>
                            <div className="mt-4 text-xs text-sgt-neutral-2">
                                {post.author_name} · {post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN') : 'Bản nháp'}
                            </div>
                        </Link>
                    )) : (
                        <div className="rounded-[1.5rem] border border-dashed border-sgt-gray-2 bg-white p-5 text-sm text-sgt-neutral-3 xl:col-span-3">
                            Chưa có bài viết public từ template API.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
