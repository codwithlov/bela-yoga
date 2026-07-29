import Link from 'next/link';
import MainPageTemplate from '@/components/guest/MainPageTemplate';
import { GUEST_ACTION, GUEST_STORE } from '@/constants/route';
import { getPublicPosts, getPublicSections, getPublicStoreItems } from '@/services/api/discovery';
import Image from 'next/image';
import { getFirstImageUrl, getTextOnly } from '@/utils/htmlUtils';
import { DEFAULT_THUMBNAIL } from '@/constants/ui';

const khoaHocInfoCards = [
    {
        label: 'Kết quả đạt được',
        value: 'Nắm kỹ thuật · Tăng sức bền · Cải thiện giấc ngủ',
        description: 'Mỗi khóa học tập trung vào kết quả thực tế, giúp học viên cải thiện thể chất và tinh thần sau từng giai đoạn học.',
    },
    {
        label: 'Hình thức học',
        value: 'Theo cấp độ · Theo sát kỹ thuật · Lớp quy mô vừa',
        description: 'Học viên được hướng dẫn theo trình độ phù hợp, chỉnh tư thế trực tiếp để bảo đảm an toàn và tiến bộ ổn định.',
    },
    {
        label: 'Lộ trình phát triển',
        value: 'Cơ bản → Trung cấp → Nâng cao',
        description: 'Bạn có thể bắt đầu từ nền tảng rồi nâng dần độ khó, duy trì nhịp học 2-4 buổi/tuần để tối ưu hiệu quả dài hạn.',
    },
];

export default async function ProductsPage() {
    // const [products, sections] = await Promise.all([
    //     getPublicStoreItems(24),
    //     getPublicSections('store'),
    // ]);
    const posts = await getPublicPosts(24);

    return (
        <div>
            <MainPageTemplate
                eyebrow="Khóa học"
                title="Khóa học Yoga tại BelaYoga"
                description="Danh sách khóa học được thiết kế theo từng cấp độ: từ cơ bản đến nâng cao, giúp bạn lựa chọn lộ trình tập phù hợp với mục tiêu cá nhân."
                infoCards={khoaHocInfoCards}
                highlights={[
                    'Mỗi khóa học có mục tiêu và cấp độ rõ ràng để dễ bắt đầu.',
                    'Lộ trình học linh hoạt theo lịch cá nhân và thể trạng.',
                    'Nội dung được cập nhật thường xuyên từ hệ thống giáo trình chuẩn quốc tế.',
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
                            Chưa có Khóa học Yoga nào được xuất bản.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
