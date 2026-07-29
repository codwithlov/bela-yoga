import { GUEST_ABOUT_US, GUEST_HOME, GUEST_ACTION, GUEST_COURSES } from '@/constants/route';

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
    favicon: '/assets/icons/favicon.png',
    appleTouchIcon: '/assets/images/logo/logo-icon.png',
  },
  contact: {
    phone: '0377 964 426',
    email: 'hello@belayoga.vn',
    hotlineLabel: 'Hotline tư vấn',
    footerHotlineTitle: 'Hỗ trợ 24/7',
  },
  social: {
    facebook: 'https://facebook.com/deim_hagn',
    youtube: 'https://example.com',
    tiktok: 'https://example.com',
    zalo: 'https://example.com',
    messenger: 'https://example.com',
    bct: 'https://example.com',
  },
  routes: {
    home: GUEST_HOME,
    action: GUEST_ACTION,
    courses: GUEST_COURSES,
    about: GUEST_ABOUT_US,
  },
  navigation: {
    primary: [
      { key: 1, title: 'Trang chủ', url_to: GUEST_HOME, slug: GUEST_HOME },
      { key: 2, title: 'Tập Yoga', url_to: GUEST_ACTION, slug: GUEST_ACTION },
      { key: 3, title: 'Khóa học', url_to: GUEST_COURSES, slug: GUEST_COURSES },
      { key: 4, title: 'Giới thiệu', url_to: GUEST_ABOUT_US, slug: GUEST_ABOUT_US },
    ] satisfies TemplateMenuItem[],
    footer: [
      { key: 1, title: 'Trang chủ', url_to: GUEST_HOME },
      { key: 2, title: 'Tập Yoga', url_to: GUEST_ACTION },
      { key: 3, title: 'Khóa học', url_to: GUEST_COURSES },
      { key: 4, title: 'Giới thiệu', url_to: GUEST_ABOUT_US },
    ] satisfies TemplateMenuItem[],
    account: [
      { key: 5, title: 'Tập Yoga', url_to: GUEST_ACTION },
      { key: 6, title: 'Khóa học', url_to: GUEST_COURSES },
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
    scopeTitle: 'Cơ sở dạy, tập yoga uy tín hàng đầu',
    quickLinks: [
      'Huấn luyện viên tận tâm, giàu kinh nghiệm',
      'Lớp học đa dạng cho mọi trình độ',
      'Không gian thư giãn, sạch đẹp, chuẩn chỉnh',
      'Lịch học linh hoạt, dễ dàng sắp xếp',
    ],
    actionSection: {
      eyebrow: 'Tập luyện cùng Bela Yoga',
      title: 'Đồng hành cùng bạn trên hành trình sống khỏe, an yên',
      description: 'Bela Yoga cùng bạn xây dựng lối sống cân bằng, cải thiện sức khỏe thể chất và tinh thần thông qua các buổi tập yoga chất lượng cao, phù hợp cho mọi trình độ.',
      cta: 'Xem toàn bộ →',
      empty: 'Chưa có gói tập công khai.',
    },
    courseSection: {
      eyebrow: 'Các Khóa học nổi bật',
      title: 'Khám phá các khóa học tại Bela Yoga',
      description: 'Hãy để Bela Yoga đồng hành cùng bạn nâng tầm sức khỏe thể chất, đẩy lùi stress và khơi dậy sức sống dồi dào qua các khóa học Yoga từ cơ bản đến nâng cao chuyên sâu.',
      fullDescription: 'Hành trình vạn dặm khởi đầu từ một bước chân, và hành trình thấu hiểu cơ thể chính là món quà tuyệt vời nhất bạn dành tặng bản thân. Khám phá các khóa học Yoga nổi bật tại Bela Yoga – nơi mở ra không gian tập luyện bình yên để bạn tạm gác lại những âu lo phố thị. Tại đây, chúng tôi thiết kế đa dạng các loại hình lớp học từ cơ bản, trị liệu phục hồi cho đến nâng cao chuyên sâu, đáp ứng thể trạng của từng học viên. Không chỉ là những động tác kéo giãn thông thường, mỗi buổi tập tại Bela Yoga là sự kết hợp hài hòa giữa hơi thở và chuyển động, giúp giải phóng các khối năng lượng tắc nghẽn, đẩy lùi stress và khơi dậy nguồn sức sống mới dồi dào. Hãy để Bela Yoga đồng hành cùng bạn trên con đường nâng tầm sức khỏe thể chất và chạm tay vào sự an yên, tĩnh lặng của tâm hồn.',
      cta: 'Xem toàn bộ →',
      empty: 'Chưa có Khóa học công khai.',
    },
    cmsSection: {
      eyebrow: 'Trải nghiệm tại Bela Yoga Studio',
      title: 'Mỗi buổi tập là một hành trình quay về với chính mình',
      description: 'Bela Yoga Studio với không gian ấm cúng, sạch đẹp và riêng tư, được thiết kế để bạn thả lỏng, tập trung vào hơi thở và chuyển động trong từng buổi tập. Mỗi lớp học đều được hướng dẫn chi tiết từ huấn luyện viên giàu kinh nghiệm, giúp bạn tiến bộ bền vững và an toàn.',
      empty: 'Chưa có bài viết công khai.',
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
