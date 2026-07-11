'use client';
import React, { useEffect } from "react";
import { Button, Checkbox, Form, Input, Modal } from "antd";
import { SlugPrefixSelect } from "@/components/admin/atoms/SlugPrefixSelect";
import { validateMessages } from "@/utils/validateRule";


const EditImageModal = ({ openEditModal, closeEditModal, currentItem, slugs, setColumns, setBannerImage }: any) => {
    const [form] = Form.useForm();
    const isExternal = Form.useWatch('is_external', form);
    const submit = (value: any) => {
        if (currentItem?.image_type === 'banner') {
            setBannerImage((prev: any) => {
                return {
                    ...prev,
                    slug_id: value.parent_id,
                    external_link: value.external_link,
                };
            });
        } else {
            setColumns((prevColumns: any) => {
                let updatedColumns = { ...prevColumns };

                Object.keys(updatedColumns).forEach((columnKey) => {
                    const column = updatedColumns[columnKey];
                    const itemIndex = column.items.findIndex((item: any) => item.id === currentItem.id);

                    if (itemIndex !== -1) {
                        column.items[itemIndex] = {
                            ...column.items[itemIndex],
                            slug_id: value.parent_id,
                            external_link: value.external_link,
                        };
                    }
                });
                return updatedColumns;
            });
        }
        closeEditModal();
    };


    useEffect(() => {
        form.setFieldsValue({
            is_external: !!currentItem?.external_link,
            external_link: currentItem?.external_link,
            parent_id: currentItem?.slug_id,
        })
    }, [currentItem, form]);

    return (
        <>
            <Modal
                centered
                open={openEditModal}
                onOk={closeEditModal}
                onCancel={closeEditModal}
                width={500}
                cancelButtonProps={{ className: "!hidden" }}
                okButtonProps={{ className: "!hidden" }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(value) => submit(value)}
                    validateMessages={validateMessages}
                >
                    <div className="pt-3 flex flex-col">
                        <Form.Item
                            name="is_external"
                            valuePropName="checked"
                            getValueFromEvent={(e: React.ChangeEvent<HTMLInputElement>) => e.target.checked ? 1 : 0}
                        >
                            <Checkbox>Link ngoài</Checkbox>
                        </Form.Item>
                        {
                            !isExternal ?
                                <SlugPrefixSelect slugs={slugs} />
                                :
                                <Form.Item name="external_link" label="Đường dẫn" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                        }
                        <Button className="self-end" type="primary" htmlType="submit" >
                            Xác nhận
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    );
}

export default EditImageModal;
