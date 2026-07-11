'use client';

import { TEXT_BTN_ADD, TEXT_BTN_UPDATE } from "@/constants/ui";
import { Button, Form } from "antd";
import { useEffect, useState, RefObject } from "react";
import { SnippetsOutlined } from '@ant-design/icons';

interface ActionProps {
    divRef: RefObject<HTMLDivElement>;
    isEdit?: boolean;
    text?: string;
    disabled?: boolean;
    onClick?: any;
    zIndex?: any;
    isDraft?: any;
    onSaveDraftClicked?: any;
}

const DrawerFormBtn: React.FC<ActionProps> = ({
    divRef,
    isEdit,
    text,
    disabled,
    onClick,
    zIndex = 1111,
    isDraft,
    onSaveDraftClicked
}) => {
    const [fixedBtn, setFixedBtn] = useState(false);

    useEffect(() => {
        const currentDivRef = divRef.current;

        if (currentDivRef) {
            const resizeObserver = new ResizeObserver(() => {
                setFixedBtn(currentDivRef.offsetHeight >= (window.innerHeight - 160));
            });
            resizeObserver.observe(currentDivRef);
            return () => {
                resizeObserver.unobserve(currentDivRef);
            };
        }
    }, [divRef]);

    return (
        <div className={fixedBtn ? `fixed bottom-4 right-7 z-[${zIndex}]` : 'flex justify-end'}>
            <div className="flex flex-col items-end gap-2">
                {isDraft &&
                    <Button onClick={onSaveDraftClicked} icon={<SnippetsOutlined />} />
                }
                <Form.Item className="!mb-0">
                    <Button key="btnFormSubmit" type="primary" htmlType="submit" disabled={disabled} onClick={onClick}>
                        {text || (isEdit ? TEXT_BTN_UPDATE : TEXT_BTN_ADD)}
                    </Button>
                </Form.Item>
            </div>
        </div>
    );
}

export default DrawerFormBtn;
