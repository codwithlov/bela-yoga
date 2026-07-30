import { ADMIN_LOGIN } from '@/constants/route';
import { redirect } from 'next/navigation';

export default function InternalUserLoginPage() {
  redirect(ADMIN_LOGIN);
}
