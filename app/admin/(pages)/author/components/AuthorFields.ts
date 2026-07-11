import { Select } from 'antd';


const { Option } = Select;

type FieldType = 'text-area' | 'select' | 'file' | undefined;

interface Option {
  value: string | number;
  label: string;
}

interface Field {
  name: string;
  label: string;
  maxLength: number;
  require: boolean;
  type?: FieldType;
  options?: Option[];
  accept?: string;
}

interface Part {
  item: string;
  itemName: string;
  part: Field[];
}

export const authorRoleOptionsArray: Option[] = [
  { value: 'author', label: 'Tác giả' },
  { value: 'editor', label: 'Biên tập viên' },
  { value: 'contributor', label: 'Cộng tác viên' },
  { value: 'seo_editor', label: 'SEO Editor' },
  { value: 'seo_manager', label: 'SEO Manager' },
];

export const activeOptionsArray: Option[] = [
  { value: 1, label: 'Kích hoạt' },
  { value: 0, label: 'Không kích hoạt' },
];

export const authorRoles = {
  author: 'Tác giả',
  editor: 'Biên tập viên',
  contributor: 'Cộng tác viên',
  seo_editor: 'SEO Editor',
  seo_manager: 'SEO Manager',
};

export const activeOptions = {
  1: 'Kích hoạt',
  0: 'Không kích hoạt',
}

export const authorFields: Part[] = [
  {
  item: 'personal',
  itemName: 'Thông tin cá nhân',
  part: [
    {
    name: 'display_name',
    label: 'Tên hiển thị công khai',
    maxLength: 20,
    require: true,
    },
    {
    name: 'nickname',
    label: 'Nick name',
    maxLength: 20,
    require: true,
    },
    {
    name: 'author_slug',
    label: 'Author Slug',
    maxLength: 20,
    require: true,
    },
    {
    name: 'biography',
    label: 'Thông tin tiểu sử',
    type: 'text-area',
    maxLength: 255,
    require: false,
    },
    {
    name: 'role_author',
    label: 'Vai trò',
    type: 'select',
    maxLength: 20,
    require: false,
    options: authorRoleOptionsArray
    },
    {
    name: 'is_active',
    label: 'Trạng thái',
    type: 'select',
    maxLength: 20,
    require: true,
    options: activeOptionsArray
    },
    {
    name: 'image',
    label: 'Ảnh hiển thị',
    type: 'file',
    maxLength: 255,
    require: false,
    accept: 'image/*',
    },
  ],
  },
  {
    item: 'social',
    itemName: 'Thông tin liên hệ',
    part: [
      {
      name: 'facebook', // Sửa tên thành facebook
      label: 'URL hồ sơ Facebook',
      maxLength: 200,
      require: false,
      },
      {
      name: 'instagram', // Sửa tên thành instagram
      label: 'URL hồ sơ Instagram',
      maxLength: 200,
      require: false,
      },
      {
      name: 'linkedin', // Sửa tên thành linkedin
      label: 'URL hồ sơ LinkedIn',
      maxLength: 200,
      require: false,
      },
      {
      name: 'pinterest', // Sửa tên thành pinterest
      label: 'URL hồ sơ Pinterest',
      maxLength: 200,
      require: false,
      },
      {
      name: 'website',
      label: 'Trang web',
      maxLength: 50,
      require: false,
      },
      {
      name: 'myspace', // Sửa tên thành myspace
      label: 'URL hồ sơ MySpace',
      maxLength: 200,
      require: false,
      },

      {
      name: 'soundcloud', // Sửa tên thành soundcloud
      label: 'URL hồ sơ SoundCloud',
      maxLength: 200,
      require: false,
      },
      {
      name: 'tumblr', // Sửa tên thành tumblr
      label: 'URL hồ sơ Tumblr',
      maxLength: 200,
      require: false,
      },
      {
      name: 'wikipedia', // Sửa tên thành wikipedia
      label: 'URL hồ sơ Wikipedia',
      maxLength: 200,
      require: false,
      },
      {
      name: 'youtube', // Sửa tên thành youtube
      label: 'URL hồ sơ YouTube',
      maxLength: 200,
      require: false,
      }
      ]
  }
];