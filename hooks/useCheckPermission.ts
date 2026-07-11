import useGetUserInfo from './useGetUserInfo';

const useCheckPermission = () => {
    const userInfo = useGetUserInfo();

    const checkPermission = (name: string) => {
        return (userInfo?.permissionCodes || []).includes(name);
    }

    return checkPermission;
};

export default useCheckPermission;