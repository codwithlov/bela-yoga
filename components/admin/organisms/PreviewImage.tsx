'use client';

import { Image } from 'antd';

interface Props {
  galleryList: any[],
  openPreview: boolean,
  setOpenPreview: any,
  setCurrentImage: any,
  currentImage: number,
}

const PreviewImage = (props: Props) => {
  const { galleryList, currentImage, openPreview, setCurrentImage, setOpenPreview } = props;

  return (
    <Image.PreviewGroup
      preview={{
        current: currentImage,
        visible: openPreview,
        onChange: (current, prev) => {
          setCurrentImage(current);
        },
        countRender: (current: number, total: number) => {
          return `${current}/${total}`
        },
        onVisibleChange: (visible) => {
          setOpenPreview(visible)
        },
      }}
    >
      <div className="flex flex-row flex-wrap">
        {galleryList?.map((item, index) => {
          return (
            <div key={index} className="hidden">
              <Image
                alt={item.url}
                src={item.url || (item.preview as string)}
                className="object-cover rounded-lg"
              />
            </div>
          )
        })}
      </div>
    </Image.PreviewGroup>
  );
}

export default PreviewImage;
