
import { Role } from "./role";

export interface IUser {
    id: number;
    name: string;
    phone: string;
    full_name: string;
    email: string;
    is_active: number;
    permissionCodes: string[];
    avatar: string;
    role: string;
    roles: Role[];
}

export interface Tour {
    id: number;
    name: string;
    price: number;
}

export interface ILogin {
    access_token: string,
    refresh_token: string,
    expires_at: any,
    user_info: IUser,
}

export interface IAuthor {
    id?: number;
    gallery_id?: string;
    role_author?: string;
    image?: string;
    nickname?: string;
    author_slug?: string;
    biography?: string;
    education?: string;
    experience?: string;
    display_name?: string,
    is_active?: boolean,
    social?: ISocial
  };

  export interface ISocial {
      id?: string;
      facebook?: string;
      twitter?: string;
      phone?: string;
      sub_mail?: string;
      zalo?: string;
      linkedin?: string;
      pinterest?: string;
      website?: string,
      instagram?: string,
      myspace?: string,
      soundcloud?: string,
      tumblr?: string,
      wikipedia?: string,
      youtube?: string
  };

  
