export type AdminTemplatePost = {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    description: string;
    author_name: string;
    status: 'draft' | 'review' | 'published';
    published_at: string | null;
    featured: boolean;
    placement: 'home_hero' | 'news_feed' | 'seo_landing' | 'organization_story';
    keywords: string;
    meta_title: string;
    meta_description: string;
    canonical: string;
    index: boolean;
    follow: boolean;
};

export type AdminTemplateStoreItem = {
    id: number;
    name: string;
    sku: string;
    category: string;
    type: 'product' | 'service' | 'package';
    organization_name: string | null;
    price: number;
    unit: string;
    stock_quantity: number | null;
    status: 'active' | 'draft' | 'hidden';
    featured: boolean;
};

export type AdminTemplateMenuItem = {
    id: number;
    title: string;
    path: string;
    location: 'header' | 'footer' | 'account';
    parent_id: number | null;
    sort_order: number;
    badge: string | null;
    page_type: 'custom' | 'post' | 'cms_page';
    page_ref: number | null;
    custom_page?: AdminTemplateCustomPage | null;
};

export type AdminTemplateCustomPageSection = {
    id: number;
    title: string;
    summary: string;
    content: string;
    cta_label: string | null;
    cta_href: string | null;
    sort_order: number;
};

export type AdminTemplateCustomPage = {
    eyebrow: string;
    summary: string;
    content: string;
    sections: AdminTemplateCustomPageSection[];
    related_post_ids: number[];
    keywords: string;
    meta_title: string;
    meta_description: string;
};

export type AdminTemplatePage = {
    id: number;
    title: string;
    slug: string;
    summary: string;
    content: string;
    status: 'draft' | 'published';
    keywords: string;
    meta_title: string;
    meta_description: string;
    canonical: string;
    index: boolean;
    follow: boolean;
};

export type AdminTemplateSection = {
    id: number;
    page: 'home' | 'venue_detail' | 'match_listing' | 'store';
    name: string;
    type: 'hero' | 'listing' | 'cta' | 'feature_grid' | 'faq';
    status: 'active' | 'draft';
    display_order: number;
    summary: string;
};

export const demoAdminPosts: AdminTemplatePost[] = [
    {
        id: 1101,
        title: 'SPORTVERSE khởi chạy template LDP CMS Next.js Full',
        slug: 'sportverse-khoi-chay-template-ldp-cms-nextjs-full',
        category: 'Platform Update',
        excerpt: 'Bài mẫu giới thiệu bộ template fullstack giúp triển khai landing, CMS và admin trên cùng một app Next.js.',
        description: '<p>SPORTVERSE khởi chạy bộ template LDP CMS Next.js Full để gom landing page, admin CMS và public API vào cùng một ứng dụng Next.js duy nhất.</p><h2>Tối ưu cho đội triển khai</h2><p>Đội dự án có thể nhanh chóng thêm trang public, quản trị nội dung, xuất bản bài SEO và tái sử dụng cấu trúc như một mini WordPress cho từng khách hàng.</p><h2>Sẵn sàng mở rộng</h2><p>Từ bộ khung này, mỗi dự án có thể nối thêm media, taxonomy, block nội dung và luồng editorial chuyên sâu mà không phải xây lại nền tảng.</p>',
        author_name: 'SV Super Admin',
        status: 'published',
        published_at: '2026-07-10T09:00:00.000Z',
        featured: true,
        placement: 'home_hero',
        keywords: 'sportverse, ldp cms, nextjs cms, template cms',
        meta_title: 'SPORTVERSE khởi chạy template LDP CMS Next.js Full',
        meta_description: 'Giới thiệu template fullstack cho landing page, CMS và public API trong cùng một ứng dụng Next.js.',
        canonical: '/bai-viet/sportverse-khoi-chay-template-ldp-cms-nextjs-full',
        index: true,
        follow: true,
    },
    {
        id: 1102,
        title: '5 cách setup landing page sân thể thao cho tổ chức mới',
        slug: '5-cach-setup-landing-page-san-the-thao',
        category: 'Template Guide',
        excerpt: 'Bài mẫu để đội triển khai có thể chỉnh sửa nội dung SEO, CTA, banner và khu vực booking nổi bật.',
        description: '<p>Bài viết này tổng hợp các cách setup landing page sân thể thao để vừa dễ dùng cho khách, vừa thuận tiện cho đội vận hành nội dung.</p><h2>Ưu tiên CTA đặt sân</h2><p>Khối CTA cần xuất hiện sớm, rõ và gắn với trạng thái trống sân, khuyến mãi hoặc gói dịch vụ.</p><h2>Tối ưu SEO địa phương</h2><p>Nội dung nên bám khu vực, loại sân và nhu cầu tìm kiếm thực tế để tăng khả năng xuất hiện trên Google.</p>',
        author_name: 'Org Account Manager',
        status: 'review',
        published_at: null,
        featured: false,
        placement: 'seo_landing',
        keywords: 'landing page sân thể thao, seo sân bóng, template guide',
        meta_title: '5 cách setup landing page sân thể thao cho tổ chức mới',
        meta_description: 'Gợi ý setup landing page sân thể thao với CTA rõ ràng, SEO tốt và trải nghiệm gần với website thương mại hiện đại.',
        canonical: '/bai-viet/5-cach-setup-landing-page-san-the-thao',
        index: true,
        follow: true,
    },
    {
        id: 1103,
        title: 'Case study: vận hành nội dung venue detail page bằng 1 admin duy nhất',
        slug: 'case-study-van-hanh-noi-dung-venue-detail-page',
        category: 'Case Study',
        excerpt: 'Mẫu bài viết dùng cho trang giới thiệu venue, review cộng đồng và CTA đặt sân trên SPORTVERSE.',
        description: '<p>Case study này mô tả cách một admin duy nhất vẫn có thể quản trị trang venue detail hiệu quả bằng cấu trúc dữ liệu gọn nhưng đủ sâu.</p><h2>Luồng cập nhật đơn giản</h2><p>Thông tin nổi bật, review cộng đồng, lịch khả dụng và CTA được gom về cùng hệ quản trị để giảm thao tác.</p><h2>Giữ trải nghiệm nhất quán</h2><p>Người đọc vẫn nhận được nội dung giàu ngữ cảnh, còn đội vận hành không bị phân mảnh giữa nhiều công cụ.</p>',
        author_name: 'Booking Operator',
        status: 'draft',
        published_at: null,
        featured: false,
        placement: 'organization_story',
        keywords: 'case study venue detail, quản trị nội dung venue, sportverse cms',
        meta_title: 'Case study vận hành nội dung venue detail page',
        meta_description: 'Mô hình quản trị venue detail page gọn, thân thiện và phù hợp cho đội vận hành nhỏ.',
        canonical: '/bai-viet/case-study-van-hanh-noi-dung-venue-detail-page',
        index: false,
        follow: true,
    },
    {
        id: 1104,
        title: 'Bản tin cộng đồng tuần này: trận đấu, highlight và deal cửa hàng',
        slug: 'ban-tin-cong-dong-tuan-nay',
        category: 'Community News',
        excerpt: 'Bài mẫu tổng hợp cho homepage news feed với match card, highlight card và store card.',
        description: '<p>Bản tin cộng đồng tuần này gom các trận đấu nổi bật, highlight đáng chú ý và ưu đãi tại cửa hàng để làm giàu news feed homepage.</p><h2>Tăng độ tươi cho trang chủ</h2><p>Nội dung dạng bản tin giúp homepage luôn có chuyển động, đồng thời hỗ trợ SEO và giữ chân người dùng quay lại.</p><h2>Kết nối nhiều module</h2><p>Bài viết có thể liên kết ngược sang match, store và venue để tạo luồng điều hướng tự nhiên hơn.</p>',
        author_name: 'SV Super Admin',
        status: 'published',
        published_at: '2026-07-08T18:30:00.000Z',
        featured: true,
        placement: 'news_feed',
        keywords: 'bản tin cộng đồng, highlight sportverse, deal cửa hàng',
        meta_title: 'Bản tin cộng đồng tuần này trên SPORTVERSE',
        meta_description: 'Tổng hợp trận đấu, highlight và deal cửa hàng cho homepage news feed của SPORTVERSE.',
        canonical: '/bai-viet/ban-tin-cong-dong-tuan-nay',
        index: true,
        follow: true,
    },
];

export const demoAdminStoreItems: AdminTemplateStoreItem[] = [
    {
        id: 2101,
        name: 'Combo nước + khăn lạnh đội bóng',
        sku: 'SV-ADDON-001',
        category: 'Addon',
        type: 'product',
        organization_name: 'SV Arena Quận 7',
        price: 120000,
        unit: 'combo',
        stock_quantity: 80,
        status: 'active',
        featured: true,
    },
    {
        id: 2102,
        name: 'Gói quay highlight 60 phút',
        sku: 'SV-MEDIA-060',
        category: 'Media',
        type: 'service',
        organization_name: 'Verse Field Thảo Điền',
        price: 350000,
        unit: 'trận',
        stock_quantity: null,
        status: 'active',
        featured: true,
    },
    {
        id: 2103,
        name: 'Voucher tập luyện low-peak 3 buổi',
        sku: 'SV-PKG-003',
        category: 'Voucher',
        type: 'package',
        organization_name: 'Northside Sport Complex',
        price: 990000,
        unit: 'gói',
        stock_quantity: 20,
        status: 'draft',
        featured: false,
    },
    {
        id: 2104,
        name: 'Thuê vợt pickleball',
        sku: 'SV-PKB-RENT-01',
        category: 'Equipment',
        type: 'service',
        organization_name: 'Pickle Hub Bình Thạnh',
        price: 50000,
        unit: 'vợt/giờ',
        stock_quantity: 24,
        status: 'active',
        featured: false,
    },
];

export const demoAdminMenuItems: AdminTemplateMenuItem[] = [
    { id: 3101, title: 'Trang chủ', path: '/', location: 'header', parent_id: null, sort_order: 1, badge: null, page_type: 'custom', page_ref: null },
    { id: 3102, title: 'Sản phẩm', path: '/san-pham', location: 'header', parent_id: null, sort_order: 2, badge: null, page_type: 'custom', page_ref: null },
    { id: 3103, title: 'Bài viết', path: '/bai-viet', location: 'header', parent_id: null, sort_order: 3, badge: null, page_type: 'custom', page_ref: null },
    { id: 3104, title: 'Giới thiệu', path: '/gioi-thieu', location: 'header', parent_id: null, sort_order: 4, badge: null, page_type: 'custom', page_ref: null },
];

export const demoAdminPages: AdminTemplatePage[] = [
    {
        id: 5101,
        title: 'Năng lực SPORTVERSE CMS',
        slug: 'nang-luc-sportverse-cms',
        summary: 'Trang CMS page mẫu để chứng minh menu item có thể tự map tới 1 page động mà không cần tạo file route mới.',
        content: '<p>Đây là generic CMS page được render tự động từ cấu hình menu.</p><h2>Không cần sinh file page vật lý</h2><p>Đội quản trị chỉ cần tạo menu item, gắn <strong>page_type</strong> và <strong>page_ref</strong>, hệ thống sẽ tự resolve đúng nội dung khi người dùng truy cập.</p><h2>Phù hợp cho landing page tĩnh</h2><p>Các trang như năng lực, chính sách, hướng dẫn, tuyển dụng hoặc giới thiệu dịch vụ đều có thể đi theo mô hình này.</p>',
        status: 'published',
        keywords: 'sportverse cms, generic cms page, dynamic menu page',
        meta_title: 'Năng lực SPORTVERSE CMS',
        meta_description: 'Generic CMS page mẫu được resolve tự động từ menu item trong template Next.js.',
        canonical: '/nang-luc-sportverse-cms',
        index: true,
        follow: true,
    },
    {
        id: 5102,
        title: 'Chính sách cộng đồng SPORTVERSE',
        slug: 'chinh-sach-cong-dong-sportverse',
        summary: 'Trang nội dung tĩnh cho guideline vận hành cộng đồng và quản trị nội dung.',
        content: '<p>Trang này mô tả các nguyên tắc vận hành cộng đồng, tiêu chuẩn nội dung và cách xử lý phản hồi trong hệ sinh thái SPORTVERSE.</p><h2>Minh bạch</h2><p>Tất cả nội dung nên có nguồn, cấu trúc rõ và giữ thông điệp nhất quán giữa public site và admin CMS.</p>',
        status: 'published',
        keywords: 'chính sách cộng đồng, sportverse guideline, cms page',
        meta_title: 'Chính sách cộng đồng SPORTVERSE',
        meta_description: 'Trang policy mẫu cho hệ quản trị nội dung và cộng đồng SPORTVERSE.',
        canonical: '/chinh-sach-cong-dong-sportverse',
        index: true,
        follow: true,
    },
];

export const demoAdminSections: AdminTemplateSection[] = [
    {
        id: 4101,
        page: 'home',
        name: 'Hero booking spotlight',
        type: 'hero',
        status: 'active',
        display_order: 1,
        summary: 'Banner đầu trang với CTA đặt sân, danh sách sân nổi bật và quick search.',
    },
    {
        id: 4102,
        page: 'home',
        name: 'Featured organizations',
        type: 'listing',
        status: 'active',
        display_order: 2,
        summary: 'Khối list sân/tổ chức nổi bật lấy từ nội dung mẫu SPORTVERSE.',
    },
    {
        id: 4103,
        page: 'store',
        name: 'Store benefit strip',
        type: 'feature_grid',
        status: 'draft',
        display_order: 1,
        summary: 'Khối lợi ích của store như giao nhanh, add-on theo booking và media service.',
    },
    {
        id: 4104,
        page: 'venue_detail',
        name: 'Venue FAQ',
        type: 'faq',
        status: 'active',
        display_order: 4,
        summary: 'Khối FAQ cho giờ hoạt động, chính sách huỷ và dịch vụ cộng thêm.',
    },
];
