import { useEffect, useState } from 'react';
import { getAccessToken } from '@/utils/authenticate';

const useIsLogin = () => {
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsLogin(!!getAccessToken());
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return [isLogin, setIsLogin] as const;
};

export default useIsLogin;