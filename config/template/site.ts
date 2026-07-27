import { GUEST_ABOUT_US, GUEST_HOME, GUEST_POSTS, GUEST_STORE } from '@/constants/route';

export type TemplateMenuItem = {
  key: number;
  title: string;
  url_to: string;
  slug?: string;
};

export const templateSiteConfig = {
  locale: 'vi',
  name: 'BelaYoga',
  legalName: 'BelaYoga Studio',
  shortName: 'BelaYoga',
  tagline: 'Hít vào bình yên, thở ra cuộc sống.',
  description: 'BelaYoga là cơ sở dạy tập yoga uy tín hàng đầu, nơi bạn tái tạo năng lượng, cải thiện sức khỏe thể chất và nuôi dưỡng sự an yên nội tâm mỗi ngày.',
  copyrightYear: 2026,
  metadata: {
    title: 'BelaYoga | Trung tâm yoga uy tín hàng đầu - Hít vào bình yên, thở ra cuộc sống',
    description: 'BelaYoga mang đến các lớp yoga chất lượng cao cho người mới bắt đầu và học viên nâng cao. Không gian thư giãn, huấn luyện viên tận tâm, lịch học linh hoạt giúp bạn cân bằng thân - tâm - trí.',
  },
  assets: {
    logo: '/assets/images/logo/belayoga-logo-web.png',
    favicon: '/assets/images/logo/logo-icon.png',
    appleTouchIcon: '/assets/images/logo/logo-icon.png',
  },
  contact: {
    phone: '0900 000 000',
    email: 'hello@belayoga.vn',
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
    connectTitle: 'Kết nối cùng BelaYoga',
    newsletterTitle: 'Nhận kiến thức yoga & ưu đãi lớp học mỗi tuần',
    newsletterDescription: 'Đăng ký để nhận lịch khai giảng, mẹo luyện tập, dinh dưỡng lành mạnh và những chương trình ưu đãi mới nhất từ BelaYoga.',
    aboutTitle: 'Về BelaYoga',
    infoTitle: 'Thông tin',
    companyHeading: 'TRUNG TÂM YOGA BELAYOGA',
    paragraphs: [
      'BelaYoga là cơ sở dạy tập yoga uy tín hàng đầu, đồng hành cùng bạn trên hành trình chăm sóc sức khỏe toàn diện và cân bằng cuộc sống.',
      'Tại BelaYoga, bạn sẽ được trải nghiệm các lớp Hatha, Vinyasa, Flow, Stretching và thiền với lộ trình rõ ràng, phù hợp cho từng cấp độ.',
      'Đến với BelaYoga là đến với những giờ phút thư giãn, tìm lại chính mình sau một ngày dài làm việc và áp lực.',
    ],
    focusLabel: 'Tập trung trải nghiệm',
  },
  home: {
    badge: 'Yoga • Sức khỏe • Cân bằng',
    title: 'BelaYoga - Hít vào bình yên, thở ra cuộc sống.',
    description: 'BelaYoga là không gian luyện tập chuyên nghiệp, nơi bạn được hướng dẫn bài bản để cải thiện vóc dáng, tăng sức bền, giảm căng thẳng và nuôi dưỡng sự an nhiên từ bên trong.',
    primaryCta: 'Khám phá lớp học',
    secondaryCta: 'Nhận tư vấn lộ trình',
    scopeTitle: 'Cơ sở dạy tập yoga uy tín hàng đầu',
    quickLinks: [
      'Huấn luyện viên tận tâm, giàu kinh nghiệm',
      'Lớp học đa dạng cho mọi trình độ',
      'Không gian thư giãn, sạch đẹp, chuẩn chỉnh',
      'Lịch học linh hoạt, dễ dàng sắp xếp',
    ],
    productSection: {
      eyebrow: 'Gói tập nổi bật',
      title: 'Chọn gói tập phù hợp với mục tiêu của bạn',
      description: 'Từ gói cơ bản đến chuyên sâu, BelaYoga thiết kế lộ trình luyện tập tối ưu giúp bạn tiến bộ đều đặn và an toàn.',
      cta: 'Xem toàn bộ gói tập →',
      empty: 'Chưa có gói tập công khai.',
    },
    postSection: {
      eyebrow: 'Kiến thức yoga',
      title: 'Bí quyết luyện tập, phục hồi và sống khỏe mỗi ngày',
      description: 'Cập nhật bài viết chuyên sâu về yoga, hơi thở, thiền, dinh dưỡng và thói quen tích cực từ đội ngũ BelaYoga.',
      cta: 'Xem toàn bộ bài viết →',
      empty: 'Chưa có bài viết công khai.',
    },
    cmsSection: {
      eyebrow: 'Trải nghiệm tại studio',
      title: 'Mỗi buổi tập là một hành trình quay về với chính mình',
      description: 'BelaYoga kết hợp giáo trình khoa học, không gian ấm áp và cộng đồng tích cực để giúp bạn bền bỉ trên hành trình sống khỏe.',
      empty: 'Chưa có nội dung trang chủ được kích hoạt.',
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
