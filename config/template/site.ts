import { GUEST_ABOUT_US, GUEST_HOME, GUEST_POSTS, GUEST_STORE } from '@/constants/route';

export type TemplateMenuItem = {
  key: number;
  title: string;
  url_to: string;
  slug?: string;
};

export const templateSiteConfig = {
  locale: 'vi',
  name: 'Template CMS',
  legalName: 'Template CMS/LDP Platform',
  shortName: 'CMS Template',
  tagline: 'Launch. Manage. Grow.',
  description: 'Reusable CMS/LDP starter for landing pages, product catalogs, content hubs, and dynamic menu-driven pages.',
  copyrightYear: 2026,
  metadata: {
    title: 'Template CMS | Landing page, product catalog and content hub',
    description: 'Reusable Next.js CMS/LDP template with home, products, posts, about page, dynamic CMS pages, and admin management.',
  },
  assets: {
    logo: '/assets/images/logo/merge-logo.png',
    favicon: '/assets/images/logo/merge-logo.png',
    appleTouchIcon: '/assets/images/logo/merge-logo.png',
  },
  contact: {
    phone: '0916 938 824',
    email: 'hello@example.com',
    hotlineLabel: 'Hotline tư vấn',
    footerHotlineTitle: 'Hỗ trợ 24/7',
  },
  social: {
    facebook: 'https://example.com',
    youtube: 'https://example.com',
    tiktok: 'https://example.com',
    zalo: 'https://example.com',
    messenger: 'https://example.com',
    bct: 'https://example.com',
  },
  routes: {
    home: GUEST_HOME,
    products: GUEST_STORE,
    posts: GUEST_POSTS,
    about: GUEST_ABOUT_US,
  },
  navigation: {
    primary: [
      { key: 1, title: 'Trang chủ', url_to: GUEST_HOME, slug: GUEST_HOME },
      { key: 2, title: 'Sản phẩm', url_to: GUEST_STORE, slug: GUEST_STORE },
      { key: 3, title: 'Bài viết', url_to: GUEST_POSTS, slug: GUEST_POSTS },
      { key: 4, title: 'Giới thiệu', url_to: GUEST_ABOUT_US, slug: GUEST_ABOUT_US },
    ] satisfies TemplateMenuItem[],
    footer: [
      { key: 1, title: 'Trang chủ', url_to: GUEST_HOME },
      { key: 2, title: 'Sản phẩm', url_to: GUEST_STORE },
      { key: 3, title: 'Bài viết', url_to: GUEST_POSTS },
      { key: 4, title: 'Giới thiệu', url_to: GUEST_ABOUT_US },
    ] satisfies TemplateMenuItem[],
    account: [
      { key: 5, title: 'Sản phẩm', url_to: GUEST_STORE },
      { key: 6, title: 'Bài viết', url_to: GUEST_POSTS },
      { key: 7, title: 'Giới thiệu', url_to: GUEST_ABOUT_US },
    ] satisfies TemplateMenuItem[],
  },
  footer: {
    connectTitle: 'Kết nối cùng Template CMS',
    newsletterTitle: 'Nhận tin mới và ưu đãi mỗi tuần',
    newsletterDescription: 'Đăng ký để nhận cập nhật sản phẩm, bài viết mới và nội dung nổi bật từ hệ thống.',
    aboutTitle: 'Về Template CMS',
    infoTitle: 'Thông tin',
    companyHeading: 'NỀN TẢNG CMS/LDP TEMPLATE',
    paragraphs: [
      'Template CMS giúp khởi tạo nhanh landing page, catalog sản phẩm, content hub và các page động từ CMS/menu.',
      'Giải pháp chính: quản trị nội dung, sản phẩm, bài viết, menu, section và page động có thể tái sử dụng cho nhiều ngành.',
      'Dành cho: agency, startup, SMB và đội nội bộ cần dựng site nhanh nhưng vẫn có CMS/admin đầy đủ.',
    ],
    focusLabel: 'Tập trung trải nghiệm',
  },
  home: {
    badge: 'CMS/LDP template',
    title: 'Một template gọn: Trang chủ, Sản phẩm, Chi tiết sản phẩm, Bài viết và Giới thiệu.',
    description: 'Các page phát sinh sau này đi qua CMS/menu dynamic thay vì tạo thêm route cố định. Template này dùng được cho nhiều site khác nhau chỉ bằng cách thay config, theme và dữ liệu CMS.',
    primaryCta: 'Xem sản phẩm',
    secondaryCta: 'Đọc bài viết',
    scopeTitle: 'Static route tối thiểu, CMS mở rộng động',
    quickLinks: [
      'Trang chủ landing page mẫu',
      'Sản phẩm và chi tiết sản phẩm',
      'Bài viết và giới thiệu thương hiệu',
      'Page khác thêm qua CMS/menu dynamic',
    ],
    productSection: {
      eyebrow: 'Sản phẩm nổi bật',
      title: 'Sản phẩm lấy trực tiếp từ CMS store items',
      description: 'Product list/detail là mẫu entity page chính của site.',
      cta: 'Xem toàn bộ sản phẩm →',
      empty: 'Chưa có sản phẩm public từ CMS.',
    },
    postSection: {
      eyebrow: 'Bài viết mới',
      title: 'Content hub mẫu cho CMS',
      description: 'Bài viết giữ đủ list/detail để kiểm thử SEO và rich content editor.',
      cta: 'Xem toàn bộ bài viết →',
      empty: 'Chưa có bài viết public từ CMS.',
    },
    cmsSection: {
      eyebrow: 'CMS sections',
      title: 'Home sections vẫn đọc từ CMS',
      description: 'Các block home dùng API public sections. Page phụ sẽ được thêm động qua CMS.',
      empty: 'Chưa có home section active từ CMS.',
    },
  },
  features: {
    showContactSupport: true,
    showGoogleAnalytics: true,
    showScrollToTop: true,
    showTrafficScript: true,
    showSocialLinks: true,
  },
} as const;

export type TemplateSiteConfig = typeof templateSiteConfig;
