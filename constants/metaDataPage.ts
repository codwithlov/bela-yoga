import { HOST_NAME } from '@/constants/api';
import { Metadata } from 'next';

// Định nghĩa thông tin metadata cho từng trang
export const metaOptions = {
  home: {
    page: '/',
    title: "BelaYoga | Lớp Yoga & Hành trình sống khỏe mỗi ngày",
    description: "BelaYoga giúp bạn tìm lớp tập phù hợp, theo dõi lịch buổi tập và xây dựng lối sống cân bằng thân - tâm - trí.",
    canonical: `${HOST_NAME}`,
    images: [
      '/assets/images/logo/merge-logo.png',
    ],
  },
  event: {
    page: 'su-kien',
    title: 'Sự kiện Yoga cộng đồng | BelaYoga',
    canonical: `${HOST_NAME}su-kien`,
    description:
      'Cập nhật workshop, retreat và các sự kiện kết nối cộng đồng yêu Yoga tại BelaYoga.',
    images: [
      '/assets/images/visa/service_1.jpg',
    ],
  },
  contact: {
    page: 'lien-he',
    title: 'Liên hệ | BelaYoga',
    canonical: `${HOST_NAME}lien-he`,
    description:
      'Liên hệ BelaYoga để được tư vấn lớp học, lịch tập, chương trình cá nhân hóa và hợp tác cộng đồng.',
    images: [
      '/assets/images/visa/service_1.jpg',
    ],
  },
  aboutUs: {
    page: 've-chung-toi',
    title: 'Về chúng tôi | BelaYoga',
    canonical: `${HOST_NAME}ve-chung-toi`,
    description:
      'BelaYoga là không gian luyện tập và chữa lành, nơi bạn phát triển sức khỏe thể chất và sự an yên nội tâm bền vững.',
    images: [
      '/assets/images/about-us/banner.webp',
    ],
  },
  notFound: {
    page: 'notfound',
    title: 'Không tìm thấy trang | BelaYoga',
    canonical: `${HOST_NAME}not-found`,
    description:
      'Trang bạn đang tìm kiếm không tồn tại. Hãy quay lại BelaYoga để tiếp tục hành trình tập luyện và chăm sóc bản thân.',
    images: [
      '/assets/images/404/404.png',
    ],
  },
  serverError: {
    page: 'server-error',
    title: 'Lỗi kết nối | BelaYoga',
    canonical: `${HOST_NAME}server-error`,
    description:
      'Kết nối đang tạm gián đoạn. Vui lòng thử lại sau để tiếp tục trải nghiệm tại BelaYoga.',
    images: [
      '/assets/images/500/500.png',
    ],
  },
  author: {
    page: 'author',
    title: 'Huấn luyện viên & Chuyên gia | BelaYoga',
    canonical: `${HOST_NAME}author/belayoga-team`,
    description: 'Góc chia sẻ từ đội ngũ huấn luyện viên BelaYoga về kỹ thuật tập, hơi thở, phục hồi và lối sống lành mạnh.',
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
