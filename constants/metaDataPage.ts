import { HOST_NAME } from '@/constants/api';
import { Metadata } from 'next';

// Định nghĩa thông tin metadata cho từng trang
export const metaOptions = {
  home: {
    page: '/',
    title: "SPORTVERSE | Đặt sân và khám phá cộng đồng bóng đá",
    description: "SPORTVERSE giúp người chơi đặt sân nhanh, theo dõi bài đăng trận đấu và khám phá hệ thống sân bóng nổi bật.",
    canonical: `${HOST_NAME}`,
    images: [
      '/assets/images/logo/merge-logo.png',
    ],
  },
  event: {
    page: 'su-kien',
    title: 'Sự kiện cộng đồng | SPORTVERSE',
    canonical: `${HOST_NAME}su-kien`,
    description:
      'Cập nhật giải đấu, sự kiện cộng đồng và các hoạt động kết nối người chơi trên SPORTVERSE.',
    images: [
      '/assets/images/visa/service_1.jpg',
    ],
  },
  contact: {
    page: 'lien-he',
    title: 'Liên hệ | SPORTVERSE',
    canonical: `${HOST_NAME}lien-he`,
    description:
      'Liên hệ SPORTVERSE để được hỗ trợ booking sân, hợp tác vận hành và truyền thông cộng đồng thể thao.',
    images: [
      '/assets/images/visa/service_1.jpg',
    ],
  },
  aboutUs: {
    page: 've-chung-toi',
    title: 'Về chúng tôi | SPORTVERSE',
    canonical: `${HOST_NAME}ve-chung-toi`,
    description:
      'SPORTVERSE là nền tảng kết nối người chơi, chủ sân và cộng đồng bóng đá bằng trải nghiệm booking hiện đại.',
    images: [
      '/assets/images/about-us/banner.webp',
    ],
  },
  notFound: {
    page: 'notfound',
    title: 'Không tìm thấy trang | SPORTVERSE',
    canonical: `${HOST_NAME}not-found`,
    description:
      'Trang bạn đang tìm kiếm không tồn tại. Hãy quay lại SPORTVERSE để tiếp tục đặt sân và khám phá cộng đồng bóng đá.',
    images: [
      '/assets/images/404/404.png',
    ],
  },
  serverError: {
    page: 'server-error',
    title: 'Lỗi kết nối | SPORTVERSE',
    canonical: `${HOST_NAME}server-error`,
    description:
      'Lỗi kết nối. Vui lòng thử lại sau!',
    images: [
      '/assets/images/500/500.png',
    ],
  },
  author: {
    page: 'author',
    title: 'Tác giả cộng đồng | SPORTVERSE',
    canonical: `${HOST_NAME}author/thaoyoko`,
    description: 'Những chia sẻ chuyên môn, kinh nghiệm vận hành trận đấu và góc nhìn cộng đồng dành cho người chơi thể thao hiện đại.',
    images: [
      '/storage/images/retail/author/2025/01/1736158058_thao-yoko-saigontimestravel_26.jpg',
    ],
  }
};

// Cấu hình mặc định cho robots
const indexRobotsDefault = {
  index: true,
  follow: true,
  'max-video-preview': -1,
  'max-image-preview': 'large' as 'large',
  'max-snippet': -1,
};

// Hàm tạo metadata cho trang dựa trên lựa chọn
export const createMetadata = (options: typeof metaOptions[keyof typeof metaOptions]): Metadata => {
  return {
    metadataBase: new URL(`${HOST_NAME}`),
    robots: indexRobotsDefault,
    alternates: {
      canonical: options.canonical,
    },
    title: options.title,
    description: options.description,
    openGraph: {
      images: options.images,
    },
  };
};
