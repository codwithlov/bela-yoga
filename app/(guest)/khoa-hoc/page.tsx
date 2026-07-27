import Link from 'next/link';
import MainPageTemplate from '@/components/guest/MainPageTemplate';
import { GUEST_STORE } from '@/constants/route';
import { getPublicSections, getPublicStoreItems } from '@/services/api/discovery';

export default async function ProductsPage() {
    const [products, sections] = await Promise.all([
        getPublicStoreItems(24),
        getPublicSections('store'),
    ]);

    return (
        <div>
            <MainPageTemplate
                eyebrow="Sản phẩm"
                title="Danh sách sản phẩm mẫu cho site CMS/LDP"
                description="Trang sản phẩm là một trong các route cố định của site mẫu. Dữ liệu được lấy từ CMS store item và có route chi tiết riêng cho từng sản phẩm."
                highlights={[
                    'Nguồn dữ liệu lấy từ `GET /api/public/v1/store-items`.',
                    'Mỗi sản phẩm có trang chi tiết tại `/san-pham/[id]`.',
                    'Các nhóm sản phẩm khác có thể được thêm động qua CMS sau này.',
                ]}
            />

            <section className="width-primary mx-auto px-4 pb-12">
                <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {sections.length > 0 ? sections.map((section) => (
                        <div key={section.id} className="rounded-[1.5rem] border border-bela-gray-2 bg-white p-5 shadow-sm">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-bela-primary-1">{section.type}</div>
                            <h2 className="mt-2 text-lg font-bold text-bela-secondary-2">{section.name}</h2>
                            <p className="mt-2 text-sm leading-6 text-bela-neutral-3">{section.summary}</p>
                        </div>
                    )) : null}
                </div>

                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {products.length > 0 ? products.map((item) => (
                        <Link key={item.id} href={`${GUEST_STORE}/${item.id}`} className="rounded-[1.5rem] border border-bela-gray-2 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-bela-primary-2 hover:shadow-lg">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-bela-primary-1">{item.type}</div>
                                    <h2 className="mt-2 text-xl font-bold text-bela-secondary-2">{item.name}</h2>
                                </div>
                                <div className="rounded-full bg-bela-bg-primary px-3 py-1 text-xs font-medium text-bela-neutral-2">
                                    {item.price ? `${Number(item.price).toLocaleString('vi-VN')}đ${item.unit ? ` / ${item.unit}` : ''}` : 'Liên hệ'}
                                </div>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-bela-neutral-3">
                                {item.description || 'Sản phẩm mẫu dùng để nối trước storefront của LDP với CMS.'}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-3 text-xs text-bela-neutral-2">
                                {item.category ? <span className="rounded-full bg-bela-bg-primary px-3 py-2">{item.category}</span> : null}
                                {item.organization_name ? <span className="rounded-full bg-bela-bg-primary px-3 py-2">{item.organization_name}</span> : null}
                            </div>
                        </Link>
                    )) : (
                        <div className="rounded-[1.5rem] border border-dashed border-bela-gray-2 bg-white p-5 text-sm text-bela-neutral-3 xl:col-span-3">
                            Chưa có sản phẩm public từ CMS.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
