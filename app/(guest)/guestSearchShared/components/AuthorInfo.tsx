'use client';

import Avatar from "@/components/general/molecules/Avartar"
import { IAuthor } from "@/interfaces/user";

const defaulBio = `Với nhiều năm kinh nghiệm với vị trí content writer và sáng tạo nội dung, đặc biệt là mảng về du lịch, Yoko Thảo hiện đang là biên tập viên phụ trách chính về phần nội dung mảng Tour du lịch nước ngoài của Saigontimes Travel.`;

const AuthorInfo = ({ props }: { props: IAuthor }) => {
  return (
    <div className='bg-sgt-neutral-7 rounded-sgt-10 p-4 pr-10 flex gap-6 mt-12 max-lg:mb-12'>
      <Avatar src={props?.image} className='w-14 h-14 lg:w-[4.5rem] lg:h-[4.5rem]' />
      <div className='flex-1'>
        <a href={props?.author_slug ? `/author/${props?.author_slug}` : '/#'}>
          <p className='text-button'>{props?.display_name}</p>
        </a>
        <p className='mt-1.5 text-body-2 text-justify'>{props?.biography}</p>
      </div>
    </div>
  );
};

export default AuthorInfo;