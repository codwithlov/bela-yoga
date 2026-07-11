import { createMetadata, metaOptions } from '@/constants/metaDataPage';
import SVPageFrame from '@/components/guest/SVPageFrame';
import { GUEST_HOME, GUEST_POSTS, GUEST_STORE } from '@/constants/route';
import { MAIL, PHONE } from '@/constants/link';

export async function generateMetadata() {
    return createMetadata(metaOptions.aboutUs);
}

export default async function AboutPage() {
    return (
        <SVPageFrame
            eyebrow="Giới thiệu"
            title="Site mẫu gọn cho CMS/LDP: trang chủ, sản phẩm, chi tiết sản phẩm, bài viết và giới thiệu."
            description="Mục tiêu của template là giữ phần public thật tinh gọn. Những trang phát sinh sau này sẽ được thêm động qua CMS thay vì mở thêm route tĩnh không cần thiết."
            highlights={[
                'Chỉ giữ các route cốt lõi cho một website mẫu.',
                'Sản phẩm, bài viết và page động đều lấy dữ liệu qua CMS layer.',
                'Các UI dùng chung, 404, redirect và server error vẫn được giữ nguyên để tái sử dụng.',
            ]}
            actions={[
                {
                    href: GUEST_STORE,
                    label: 'Xem sản phẩm',
                    variant: 'primary',
                },
                {
                    href: GUEST_POSTS,
                    label: 'Đọc bài viết',
                    variant: 'secondary',
                },
            ]}
            infoCards={[
                {
                    label: 'Scope',
                    value: '5 public page',
                    description: 'Trang chủ, sản phẩm, chi tiết sản phẩm, bài viết và giới thiệu.',
                },
                {
                    label: 'CMS',
                    value: 'Dynamic-first',
                    description: 'Page phát sinh thêm sẽ được gắn qua CMS/menu thay vì hard-code route.',
                },
                {
                    label: 'Liên hệ',
                    value: `${PHONE} · ${MAIL}`,
                    description: 'Thông tin chung có thể thay bằng cấu hình CMS ở bước tiếp theo.',
                },
            ]}
        >
            <div className="grid gap-4 lg:grid-cols-3">
                {[
                    {
                        title: 'Gọn để bàn giao',
                        description: 'Site mẫu không còn các trang booking, trận đấu, sân bóng hay highlight mặc định. Các phần đó chỉ thêm lại khi CMS cần.',
                    },
                    {
                        title: 'Dễ mở rộng',
                        description: 'Menu custom page và page manager vẫn cho phép tạo landing/page mới mà không sinh route vật lý.',
                    },
                    {
                        title: 'Giữ hạ tầng dùng chung',
                        description: 'Layout, navbar, footer, editor, API, 404/500 và các component dùng chung vẫn được giữ để tái sử dụng.',
                    },
                ].map((item) => (
                    <div key={item.title} className="rounded-[1.5rem] border border-sgt-gray-2 bg-white p-6 shadow-sm">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sgt-primary-1">CMS/LDP</div>
                        <h2 className="mt-3 text-xl font-bold text-sgt-secondary-2">{item.title}</h2>
                        <p className="mt-3 text-sm leading-6 text-sgt-neutral-3">{item.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 rounded-[2rem] border border-sgt-gray-2 bg-white p-6 shadow-sm md:p-8">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sgt-primary-1">Nguyên tắc site mẫu</div>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                    {[
                        'Route tĩnh chỉ dùng cho các trang nền tảng thật sự cần thiết.',
                        'Nội dung marketing, landing page và page phụ sẽ đi qua CMS/menu.',
                        'Sản phẩm có list và detail riêng để làm mẫu cho entity detail page.',
                        'Bài viết giữ đủ list/detail để kiểm thử content hub và SEO.',
                    ].map((item) => (
                        <div key={item} className="rounded-2xl border border-sgt-gray-2 bg-sgt-bg-primary px-4 py-4 text-sm leading-6 text-sgt-neutral-2">
                            {item}
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                    <a href={GUEST_HOME} className="rounded-xl border border-sgt-gray-2 px-5 py-3 text-sm font-semibold text-sgt-secondary-2 transition hover:bg-sgt-bg-primary">
                        Về trang chủ
                    </a>
                    <a href={GUEST_STORE} className="rounded-xl bg-gradient-to-r from-sgt-primary-1 to-sgt-primary-2 px-5 py-3 text-sm font-semibold text-white shadow-sgt-primary transition hover:-translate-y-0.5">
                        Xem sản phẩm
                    </a>
                </div>
            </div>
        </SVPageFrame>
    );
}
