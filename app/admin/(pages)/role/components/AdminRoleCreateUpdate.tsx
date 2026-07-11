'use client';
import React, { useEffect, useRef, useState } from 'react'
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { ROLE } from '@/constants/route';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr'
import { validateMessages } from '@/utils/validateRule'
import { Button, Col, Divider, Form, Input, Row } from 'antd'
import DrawerFormBtn from '@/components/admin/molecules/DrawerFormBtn';
import { DrawerLoading } from '@/components/admin/atoms/DrawerLoading';
import { useGetDataQuery, usePostDataMutation } from '@/services/api/common';
import { Tree } from 'antd';
import { TreeProps } from 'antd/lib';
import { handleApiResponse } from '@/utils/helper';
import { Permission } from '@/interfaces/role';

interface TreeNode {
    title: string;
    key: number;
    children?: TreeNode[];
}

type Params = {
    role_id?: string,
    reloadDataList?: any,
    closeModal?: any,
}

const AdminRoleCreateUpdate: React.FC<Params> = ({
    role_id,
    closeModal,
    reloadDataList
}) => {
    const isEdit = !!role_id;
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState<boolean>(false);
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<React.Key[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

    const divRef = useRef<HTMLDivElement>(null);
    const [storeUpdateApi] = usePostDataMutation();

    const getUrl = `${ROLE}/${(isEdit ? role_id + '/edit' : 'create')}`;
    const { data: initData, isFetching } = useGetDataQuery(getUrl, {
        refetchOnMountOrArgChange: !!isEdit,
    });

    const handleOnSubmit = async (values: any) => {
        if (selectedPermissions.length === 0) {
            showErrorToastr("Vui lòng chọn ít nhất một quyền");
            return;
        }

        const postData = {
            url: ROLE + (!isEdit ? '' : `/${role_id}?_method=PUT`),
            data: { name: values.name, permissions: selectedPermissions },
        };
        await handleApiResponse(
            storeUpdateApi(postData),
            (payload: any) => {
                showSuccessToastr(payload?.message);
                reloadDataList();
                setSelectedPermissions([]);
                setCheckedKeys([]);
                form.resetFields();
                closeModal();
            },
            setSpinning,
        );
    }

    const onCheck: TreeProps['onCheck'] = (checkedKeysValue, { halfCheckedKeys }) => {
        setSelectedPermissions([...halfCheckedKeys as React.Key[], ...checkedKeysValue as React.Key[]]);
        setCheckedKeys(checkedKeysValue as React.Key[]);
    };

    const onExpand = (expandedKeys: React.Key[]) => {
        setExpandedKeys(expandedKeys);
    };

    const onExpandClick = () => {
        setExpandedKeys(expandedKeys.length > 0 ? [] : (initData.permissions || []).map((item: any) => item.id));
    }

    useEffect(() => {
        if (initData) {
            if (initData.error) {
                showErrorToastr(initData?.message);
                reloadDataList();
                closeModal();
            } else {
                const structuredData = buildTree(initData?.permissions || []);
                setTreeData(structuredData);
                if (isEdit) {
                    const checkEmptyParent = (id: number) => {
                        return !initData?.permissions?.some((p: Permission) => p.parent_id === id);
                    };
                    const role = initData?.role;
                    const permissions = (role?.permissions || []) as Permission[]
                    form.setFieldsValue({ name: role?.name });
                    setSelectedPermissions(permissions.map(perm => perm?.id));
                    setCheckedKeys(permissions.filter(perm => checkEmptyParent(perm?.id)).map(perm => perm.id));
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initData]);

    const buildTree = (data: Permission[]): TreeNode[] => {
        const map: { [key: number]: TreeNode } = {};
        const tree: TreeNode[] = [];

        data.forEach(item => {
            map[item.id] = { title: item.name, key: item.id, children: [] }; // Initialize with empty children array
        });

        data.forEach(item => {
            if (item.parent_id === 0) {
                tree.push(map[item.id]); // If parent_id is 0, push to the root
            } else {
                if (map[item.parent_id]) {
                    map[item.parent_id].children?.push(map[item.id]); // Add to parent's children
                }
            }
        });

        return tree;
    };

    return (
        <>
            {spinning && <AdminLoading isLoading={true} />}
            <div className='pb-5'>
                <DrawerLoading isLoading={isFetching} />
                <Form
                    key={'formSubmit'}
                    form={form}
                    layout="vertical"
                    onFinish={handleOnSubmit}
                    validateMessages={validateMessages}
                    className={`${isFetching ? 'hidden' : 'block'}`}
                >
                    <div ref={divRef}>
                        <Row>
                            <Col span={12}>
                                <Form.Item name="name" label="Tên vai trò" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider className='!my-2' />
                        <div className='flex gap-5 items-center mb-3'>
                            <h3>Chọn quyền</h3>
                            <Button onClick={onExpandClick}>{expandedKeys.length > 0 ? 'Thu gọn' : 'Mở rộng'}</Button>
                        </div>
                        <Tree
                            checkable
                            treeData={treeData}
                            onCheck={onCheck}
                            blockNode
                            checkedKeys={checkedKeys}
                            selectable={false}
                            expandedKeys={expandedKeys}
                            onExpand={onExpand}
                        />
                    </div>
                    <DrawerFormBtn divRef={divRef} isEdit={isEdit} />
                </Form>
            </div >
        </>
    )
}

export default AdminRoleCreateUpdate

