import { SlugPermalink } from "./slugPermalink";

export interface IVoucher {
    id: number;
    name: string;
    code: string;
    image: any;
    values: any[];
}

export interface ICustomer {
    id: number;
    name: string;
    phone: string;
}