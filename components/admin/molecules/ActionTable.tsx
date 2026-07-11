'use client';
import { DROPDOWN_PLACEHOLDER, TEXT_BTN_COMMENT, TEXT_BTN_DELETE, TEXT_BTN_DELETE_DRAFT, TEXT_BTN_HISTORY, TEXT_BTN_INFO, TEXT_BTN_PICTURE, TEXT_BTN_POST, TEXT_BTN_RESTORE, TEXT_BTN_UPDATE, TEXT_MANNAGE_MARKET_TOUR, TEXT_MANNAGE_TAG_SLUG } from "@/constants/ui";
import { Select } from "antd";
import { EditOutlined, HistoryOutlined, PictureOutlined, DeleteOutlined, InfoCircleOutlined, CommentOutlined, AuditOutlined, LinkOutlined } from '@ant-design/icons';
import { getUserInfo } from "@/utils/authenticate";
import { useRef } from "react";
import { ACTION_DELETE, ACTION_DELETE_DRAFT, ACTION_HISTORY, ACTION_IMAGE, ACTION_MARKET, ACTION_POST, ACTION_RESTORE, ACTION_REVIEW, ACTION_SLUG, ACTION_UPDATE } from "@/constants/action";

interface ActionProps {
    handleOnChangeSelect: any;
    options?: any;
    types?: any;
    from?: string;
}

const ActionTable = (props: ActionProps) => {
    const userInfo = useRef(getUserInfo());
    const options = [
        {
            value: '',
            label: DROPDOWN_PLACEHOLDER,
        },
        {
            value: ACTION_POST,
            label: (<><AuditOutlined className="mr-2" />{TEXT_BTN_POST}</>),
        },
        {
            value: ACTION_MARKET,
            label: (<><InfoCircleOutlined className="mr-2" /> {TEXT_MANNAGE_MARKET_TOUR}</>),
        },
        {
            value: ACTION_SLUG,
            label: (<><LinkOutlined className="mr-2" /> {TEXT_MANNAGE_TAG_SLUG}</>),
        },
        {
            value: ACTION_HISTORY,
            label: (<><HistoryOutlined className="mr-2" />{TEXT_BTN_HISTORY}</>),
        },
        {
            value: ACTION_REVIEW,
            label: (<><CommentOutlined className="mr-2" />{TEXT_BTN_COMMENT}</>),
        },
        {
            value: ACTION_IMAGE,
            label: (<><PictureOutlined className="mr-2" />{TEXT_BTN_PICTURE}</>),
        },
        {
            value: ACTION_UPDATE,
            label: (<><EditOutlined className="mr-2" />{TEXT_BTN_UPDATE}</>),
        },
        {
            value: ACTION_DELETE,
            label: (<><DeleteOutlined className="mr-2" />{TEXT_BTN_DELETE}</>),
        },
        {
            value: ACTION_DELETE_DRAFT,
            label: (<><DeleteOutlined className="mr-2" />{TEXT_BTN_DELETE_DRAFT}</>),
        },
        {
            value: ACTION_RESTORE,
            label: (<>{TEXT_BTN_RESTORE}</>),
        },
    ].filter((item: any) => (
        (props.types || '').includes(item.value) &&
        (
            (!props.from || !item.value || (userInfo.current?.permissionCodes || []).includes(`${props.from}_${item.value}`))
            ||
            !!item.noCheck
        )
    ));

    return (
        <div className="rt_table_option space-x-2 items-center">
            <Select
                className="w-full"
                onChange={(value) => props.handleOnChangeSelect(value)}
                placeholder="select action"
                defaultValue={''}
                value={''}
                options={props.options || options}
                popupMatchSelectWidth={false}
            >
            </Select>
        </div>
    );
}

export default ActionTable