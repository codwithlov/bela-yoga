import ActionTable from "@/components/admin/molecules/ActionTable";
import useGetUserInfo from './useGetUserInfo';
import { ACTION_DELETE, ACTION_DELETE_DRAFT, ACTION_RESTORE, ACTION_UPDATE } from "@/constants/action";

const useGetActionColumn = () => {
    const userInfo = useGetUserInfo();

    const getActionColumn = (types: string[], onChange: any, from: string, fixed?: any, isMarket?: boolean) => {
        if (!userInfo) {
            return [];
        }

        const column = [{
            title: 'Actions',
            key: 'action',
            render: (_: any, record: any) => {
                let filteredTypes = [];
                if (record.deleted === 1) {
                    filteredTypes = ['', ACTION_RESTORE]
                } else {
                    filteredTypes = (isMarket && (record.parent_id === 0 || record.parent_id === null))
                        ? types.filter((type: string) => type !== ACTION_DELETE)
                        : types;
                }
                if (record.status === 'draft') {
                    filteredTypes = ['', ACTION_UPDATE, ACTION_DELETE_DRAFT];
                }
                if (from === 'TOUR' && record.type === 'sgt') {
                    filteredTypes = [...types, ACTION_DELETE];
                }
                return (
                    <ActionTable
                        types={filteredTypes}
                        handleOnChangeSelect={(selectValue: any) => onChange(selectValue, record)}
                        from={from}
                    />
                );
            },
            align: 'center' as 'center',
            width: 125,
            fixed,
        }];

        const hasPermission = types.some(item =>
            (userInfo?.permissionCodes || []).includes(`${from}_${item}`)
        );
        return hasPermission ? column : [];
    }

    return getActionColumn;
};

export default useGetActionColumn;
