import { IUser } from '@/interfaces/user';
import { getUserInfo } from '@/utils/authenticate';
import { useEffect, useState } from 'react';

const useGetUserInfo = (loop = false) => {
    const [userInfo, setUserInfo] = useState<any>(null);
    useEffect(() => {
        let delay = 100;

        const executeWithDelay = () => {
            const user = getUserInfo();
            setUserInfo(user);
            if (delay < 3000 || loop) {
                if (delay < 3000) {
                    delay += 1000;
                }
                setTimeout(executeWithDelay, delay);
            }
        };

        const timeout = setTimeout(executeWithDelay, delay);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return userInfo as IUser;
};

export default useGetUserInfo;