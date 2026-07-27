import Link from 'next/link';
import Image from 'next/image';
import MainPageTemplate from '@/components/guest/MainPageTemplate';
import { getPublicPosts } from '@/services/api/discovery';
import { getFirstImageUrl, getTextOnly } from '@/utils/htmlUtils';
import { DEFAULT_THUMBNAIL } from '@/constants/ui';
import { GUEST_ACTION } from '@/constants/route';

export default async function PublicPostsPage() {
    const posts = await getPublicPosts(24);

    return (
        <div>
            <MainPageTemplate
                eyebrow="Tập Yoga"
                title="Lịch buổi tập Yoga tại BelaYoga"
                description="Mỗi buổi tập đều có nội dung riêng theo mục tiêu: thở sâu, giãn cơ, tăng sức mạnh lõi và thư giãn tinh thần. Chọn buổi phù hợp để xem chi tiết."
                highlights={[
                    'Card hiển thị hình ảnh, tiêu đề và mô tả ngắn của từng buổi tập.',
                    'Nhấn vào card để vào trang chi tiết buổi tập tương ứng.',
                    'Nội dung được đồng bộ tự động từ dữ liệu public posts.',
                ]}
            />

            <section className="width-primary mx-auto px-4 pb-12">
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {posts.length > 0 ? posts.map((post) => (
                        <Link key={post.id} href={`${GUEST_ACTION}/${post.slug}`} className="overflow-hidden rounded-[1.5rem] border border-bela-gray-2 bg-white shadow-sm transition hover:-translate-y-1 hover:border-bela-primary-2 hover:shadow-lg">
                            <div className="relative h-52 w-full">
                                <Image
                                    src={getFirstImageUrl(post.description) || DEFAULT_THUMBNAIL}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                            <div className="p-5">
                                <div className="flex items-center justify-between gap-2 text-xs text-bela-primary-1">
                                    <span className="font-semibold uppercase tracking-[0.18em]">{post.category || 'Yoga Session'}</span>
                                    <span>{post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN') : 'Sắp cập nhật'}</span>
                                </div>
                                <h2 className="mt-3 line-clamp-2 text-xl font-bold text-bela-secondary-2">{post.title}</h2>
                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-bela-neutral-3">{post.excerpt || getTextOnly(post.description).slice(0, 140)}</p>
                                <div className="mt-4 text-xs text-bela-neutral-2">
                                    Huấn luyện viên: {post.author_name || 'BelaYoga Team'}
                                </div>
                            </div>
                        </Link>
                    )) : (
                        <div className="rounded-[1.5rem] border border-dashed border-bela-gray-2 bg-white p-5 text-sm text-bela-neutral-3 xl:col-span-3">
                            Chưa có buổi tập Yoga nào được xuất bản.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
