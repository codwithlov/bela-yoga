
"use client"

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { checkToken } from '@/utils/authenticate';
import { ADMIN_ROUTE, LOGIN_ROUTE } from "@/constants/route";

const isAuth = (Component: any) => {
    const AuthenticatedComponent = (props: any) => {
        // const { isAuth: auth } = checkToken();
        const auth = true;
        const loginRoute = `/${ADMIN_ROUTE}/${LOGIN_ROUTE}`;

        useEffect(() => {
            if (!auth) {
                return redirect(loginRoute);
            }
        }, [auth, loginRoute]);

        return !auth ? <Component {...props} /> : <Component />;
    };

    return AuthenticatedComponent;
};
export default isAuth;