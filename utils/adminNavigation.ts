import { ADMIN_LOGIN, ADMIN_OVERVIEW, ADMIN_ROLE, ADMIN_SECTION, ADMIN_USER } from '@/constants/route';

const ADMIN_ROUTE_BY_PERMISSION_PREFIX: Record<string, string> = {
    overview: ADMIN_OVERVIEW,
    dashboard: ADMIN_OVERVIEW,
    post: '/admin/post',
    market: '/admin/market',
    user: ADMIN_USER,
    role: ADMIN_ROLE,
    menu: '/admin/menu',
    section: ADMIN_SECTION,
};

export const normalizePermissionCode = (code: string) => code.trim().toUpperCase();

export const getAdminPathFromPermissions = (permissionCodes?: string[] | null) => {
    const normalizedCodes = (permissionCodes || []).map(normalizePermissionCode);
    const firstViewCode = normalizedCodes.find((code) => code.endsWith('_VIEW'));

    if (!firstViewCode) {
        return ADMIN_LOGIN;
    }

    const prefix = firstViewCode.split('_')[0].toLowerCase();

    return ADMIN_ROUTE_BY_PERMISSION_PREFIX[prefix] || ADMIN_OVERVIEW;
};
