import { redirect } from 'next/navigation';
import { ADMIN_OVERVIEW } from '@/constants/route';

export default function AdminDashboardRedirectPage() {
    redirect(ADMIN_OVERVIEW);
}
