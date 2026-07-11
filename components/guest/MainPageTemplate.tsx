import SVPageFrame from '@/components/guest/SVPageFrame';
import { GUEST_ABOUT_US, GUEST_HOME, GUEST_POSTS, GUEST_STORE } from '@/constants/route';

type MainPageTemplateProps = {
    eyebrow: string;
    title: string;
    description: string;
    highlights: string[];
};

export default function MainPageTemplate({ eyebrow, title, description, highlights }: MainPageTemplateProps) {
    return (
        <SVPageFrame
            eyebrow={eyebrow}
            title={title}
            description={description}
            highlights={highlights}
            actions={[
                {
                    href: GUEST_HOME,
                    label: 'Về trang chủ',
                    variant: 'primary',
                },
                {
                    href: GUEST_STORE,
                    label: 'Xem sản phẩm',
                    variant: 'secondary',
                },
            ]}
            infoCards={[
                {
                    label: 'Mục tiêu',
                    value: 'CMS → LDP → Content',
                    description: 'Giữ site mẫu gọn, rõ và chỉ gồm các hạng mục cốt lõi có thể mở rộng bằng CMS.',
                },
                {
                    label: 'Điểm vào chính',
                    value: 'Sản phẩm và bài viết',
                    description: 'Hai nhóm nội dung chính để kiểm thử CMS, SEO và điều hướng public.',
                },
                {
                    label: 'Đi tiếp nhanh',
                    value: 'Home · Product · Blog · About',
                    description: 'Các route tĩnh tối thiểu, còn page khác sẽ được thêm động qua CMS.',
                },
            ]}
        >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[
                    {
                        href: GUEST_STORE,
                        title: 'Sản phẩm',
                        description: 'Danh sách sản phẩm/dịch vụ mẫu và chi tiết sản phẩm.',
                    },
                    {
                        href: GUEST_POSTS,
                        title: 'Bài viết',
                        description: 'Content hub mẫu cho blog, tin tức và SEO landing.',
                    },
                    {
                        href: GUEST_ABOUT_US,
                        title: 'Giới thiệu',
                        description: 'Trang giới thiệu thương hiệu/website mẫu.',
                    },
                ].map((item) => (
                    <a
                        key={item.title}
                        href={item.href}
                        className="rounded-[1.5rem] border border-sgt-gray-2 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sgt-primary-1">Quick path</div>
                        <h3 className="mt-2 text-xl font-bold text-sgt-secondary-2">{item.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-sgt-neutral-3">{item.description}</p>
                    </a>
                ))}
            </div>
        </SVPageFrame>
    );
}
