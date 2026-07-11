import { Menu } from '@/interfaces/menu';
import { templateSiteConfig } from '@/config/template/site';

export const guestMenu: Menu[] = [...templateSiteConfig.navigation.primary];

export const bookingQuickLinks = [...templateSiteConfig.home.quickLinks];
