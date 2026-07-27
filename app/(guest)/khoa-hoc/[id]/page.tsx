import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { GUEST_STORE } from '@/constants/route';
import { getPublicStoreItems } from '@/services/api/discovery';

type PageProps = { params: Promise<{ id: string }> };

async function getProduct(id: string) {
    const products = await getPublicStoreItems(100);
    return products.find((item) => String(item.id) === String(id)) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) return {};

    return {
        title: product.name,
        description: product.description || `${product.name} - sản phẩm mẫu trong CMS/LDP site.`,
        alternates: {
            canonical: `${GUEST_STORE}/${product.id}`,
        },
        openGraph: {
            title: product.name,
            description: product.description || `${product.name} - sản phẩm mẫu trong CMS/LDP site.`,
            type: 'website',
        },
    };
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="bg-[linear-gradient(180deg,#04121f_0%,#082033_30%,#f2fbff_30%,#f2fbff_100%)]">
            <section className="width-primary mx-auto px-4 pb-16 pt-12 text-white lg:pt-16">
                <div className="max-w-4xl space-y-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sgt-primary-3">Chi tiết sản phẩm</div>
                    <h1 className="text-4xl font-bold leading-tight md:text-5xl">{product.name}</h1>
                    <p className="max-w-3xl text-base leading-7 text-slate-200 md:text-lg">
                        {product.description || 'Trang chi tiết sản phẩm mẫu được render từ dữ liệu CMS store item.'}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-200">
                        <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">{product.type}</span>
                        {product.category ? <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">{product.category}</span> : null}
                        {product.organization_name ? <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">{product.organization_name}</span> : null}
                    </div>
                </div>
            </section>

            <section className="width-primary mx-auto px-4 pb-20">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="rounded-[2rem] border border-sgt-gray-2 bg-white p-6 shadow-sm md:p-8">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sgt-primary-1">Thông tin sản phẩm</div>
                        <h2 className="mt-3 text-2xl font-bold text-sgt-secondary-2">Mô tả</h2>
                        <p className="mt-3 text-sm leading-7 text-sgt-neutral-3">
                            {product.description || 'Nội dung chi tiết sẽ được quản trị từ CMS trong các bước mở rộng tiếp theo.'}
                        </p>
                        <div className="mt-6 grid gap-3 md:grid-cols-2">
                            <div className="rounded-2xl border border-sgt-gray-2 bg-sgt-bg-primary p-4">
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sgt-primary-1">Tồn kho</div>
                                <div className="mt-2 text-xl font-bold text-sgt-secondary-2">{product.stock_quantity ?? 'Không giới hạn'}</div>
                            </div>
                            <div className="rounded-2xl border border-sgt-gray-2 bg-sgt-bg-primary p-4">
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sgt-primary-1">Addon</div>
                                <div className="mt-2 text-xl font-bold text-sgt-secondary-2">{product.is_addon ? 'Có' : 'Không'}</div>
                            </div>
                        </div>
                    </div>

                    <aside className="rounded-[2rem] border border-sgt-gray-2 bg-white p-6 shadow-sm md:p-8">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sgt-primary-1">Giá</div>
                        <div className="mt-3 text-3xl font-bold text-sgt-secondary-2">
                            {product.price ? `${Number(product.price).toLocaleString('vi-VN')}đ` : 'Liên hệ'}
                        </div>
                        {product.unit ? <div className="mt-1 text-sm text-sgt-neutral-3">Đơn vị: {product.unit}</div> : null}
                        <Link href={GUEST_STORE} className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-sgt-primary-1 to-sgt-primary-2 px-5 py-3 text-sm font-semibold text-white shadow-sgt-primary transition hover:-translate-y-0.5">
                            ← Quay lại sản phẩm
                        </Link>
                    </aside>
                </div>
            </section>
        </div>
    );
}
