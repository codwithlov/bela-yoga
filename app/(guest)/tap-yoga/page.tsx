import Link from 'next/link';
import Image from 'next/image';
import MainPageTemplate from '@/components/guest/MainPageTemplate';
import { getPublicPosts } from '@/services/api/discovery';
import { getFirstImageUrl, getTextOnly } from '@/utils/htmlUtils';
import { DEFAULT_THUMBNAIL } from '@/constants/ui';
import { GUEST_ACTION } from '@/constants/route';

const tapYogaInfoCards = [
    {
        label: 'Mục tiêu tập luyện',
        value: 'Khỏe thân · An tâm · Bền sức',
        description: 'Mỗi buổi tập hướng đến sự cân bằng thân - tâm - trí, phù hợp cho cả người mới và học viên đã có nền tảng.',
    },
    {
        label: 'Nội dung chính',
        value: 'Thở · Giãn cơ · Sức mạnh lõi',
        description: 'Chuỗi bài được thiết kế khoa học để cải thiện linh hoạt, tăng kiểm soát cơ thể và giảm căng thẳng hàng ngày.',
    },
    {
        label: 'Lộ trình gợi ý',
        value: '2-4 buổi/tuần',
        description: 'Duy trì lịch tập đều giúp bạn thấy rõ cải thiện về giấc ngủ, năng lượng và trạng thái tinh thần sau 4-8 tuần.',
    },
];

export default async function PublicPostsPage() {
    const posts = await getPublicPosts(24);

    return (
        <div>
            <MainPageTemplate
                eyebrow="Tập Yoga"
                title="Lịch buổi tập Yoga tại BelaYoga"
                description="Mỗi buổi tập đều có nội dung riêng theo mục tiêu: thở sâu, giãn cơ, tăng sức mạnh lõi và thư giãn tinh thần. Chọn buổi phù hợp để xem chi tiết."
                infoCards={tapYogaInfoCards}
                highlights={[
                    'Mỗi buổi tập là một hành trình quay về với chính mình.',
                    'Hướng dẫn chi tiết từ huấn luyện viên giàu kinh nghiệm.',
                    'Các buổi tập được thiết kế khoa học, phù hợp cho mọi trình độ.',
                    'Để bạn tìm lại sự cân bằng thân - tâm - trí sau một ngày dài bận rộn.',
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
