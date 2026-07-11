import React from 'react';
import SocialLinkPart from './SocialLinkPart';
import { IAuthor, ISocial } from '@/interfaces/user';
import Image from 'next/image';
import { DEFAULT_THUMBNAIL } from '@/constants/ui';

type ProfileCardProps = {
  author: IAuthor;
};

const AuthorCard: React.FC<ProfileCardProps> = ({ author }) => {
  if (!author || !author.id) {
    return <></>;
  }
  const social = author?.social || {};

  return (
    <div className=''>
      <div className="bg-gradient-to-r from-red-200 via-black-300 to-yellow-100 p-8 text-sgt-secondary-1 rounded-lg width-primary mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <ImageSection author_slug={author?.author_slug || ''} avatar={author?.image} />
          <TextSection
            biography={author?.biography}
            experience={author?.experience}
            display_name={author?.display_name}
            social={social}
          />
        </div>
      </div>
    </div>

  );
};

const ImageSection: React.FC<{ author_slug: string; avatar?: string }> = ({
  author_slug,
  avatar,
}) => (
  <div className="w-full md:w-1/2 mb-6 md:mb-0 text-center">
    {/* <h3 className="text-h3">{fullName}</h3> */}
    <div className="w-full flex justify-center">
      <Image
        src={avatar || DEFAULT_THUMBNAIL} // Fallback avatar
        alt={author_slug}
        className="rounded-lg object-cover w-full max-w-xs h-auto"
        width={400}
        height={400}
      />
    </div>
    {/* <h4 className="text-h4">NHÀ SÁNG TẠO NỘI DUNG</h4> */}
  </div>
);

const TextSection: React.FC<{
  biography?: string;
  experience?: string;
  display_name?: string;
  social?: ISocial;
}> = ({ biography, experience, display_name, social }) => (
  <div className="w-full md:w-1/2 px-8 ck-content">
    <Section title={`TÁC GIẢ: ${display_name ?? ''}`}>
      <></>
      {/* <h3 className="text-h3">Thảo Yoko</h3> */}
    </Section>

    <Section title="GIỚI THIỆU TÁC GIẢ">
      <p className="text-sm leading-relaxed text-justify">{biography || 'Chưa có thông tin.'}</p>
    </Section>

    <Section title="KINH NGHIỆM">
      <p className="text-sm">{experience || 'Đã gắn bó vơi ngành du lịch 5 năm!'}</p>
      <p className="text-sm">Công ty Sài Gòn Times Travel</p>
    </Section>
    <Section title="LIÊN KẾT MẠNG XÃ HỘI">
      <SocialLinkPart
        facebookLink={social?.facebook}
        twitterLink={social?.twitter}
        sub_mail={social?.sub_mail}
        pinterestLink={social?.pinterest}
        linkedinLink={social?.linkedin}
      />
    </Section>

    {/* <div className="text-center md:text-right font-bold">
      <a href={`/author/${author_slug}`} className="text-sgt-secondary-1 flex justify-center items-center px-7 py-2.5 rounded-md bg-gradient-to-t from-sgt-primary-1 to-sgt-primary-2 transition-all duration-300 hover:shadow-lg">
        Tất cả bài viết
      </a>
    </div> */}
  </div>
);

// Reusable Section Component
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="mb-5">
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    {children}
  </div>
);

export default AuthorCard;
