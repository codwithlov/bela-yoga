'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
    BoldOutlined,
    ClockCircleOutlined,
    CodeOutlined,
    InsertRowBelowOutlined,
    ItalicOutlined,
    LinkOutlined,
    OrderedListOutlined,
    PictureOutlined,
    RedoOutlined,
    RollbackOutlined,
    StrikethroughOutlined,
    UndoOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons';
import { Button, Drawer, Input, Popover, Segmented, Space, Tooltip, message } from 'antd';
import { API_PATH, BASE_URL } from '@/constants/api';
import { PostHistory } from '@/interfaces/post';
import { formatDateTime } from '@/utils/formatDate';
import beautify from 'js-beautify';
import ReactDiffViewer from "react-diff-viewer-continued";
import Prism from "prismjs";
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

interface CustomEditorProps {
    data?: string;
    onChange?: (data: string) => void;
    histories?: PostHistory[];
    type?: string;
}

const buildUploadUrl = () => {
    const baseUrl = (BASE_URL || '').replace(/\/$/, '');
    const apiPath = (API_PATH || '').replace(/^\//, '');
    return `${baseUrl}/${apiPath}gallery/image/ckeditor-upload`.replace(/([^:]\/)\/+/g, '$1');
};

const getUploadedImageUrl = (payload: any): string | null => {
    return payload?.url
        || payload?.data?.url
        || payload?.data?.image
        || payload?.data?.file
        || payload?.data?.file_url
        || payload?.data?.location
        || payload?.location
        || payload?.file_url
        || payload?.image
        || payload?.urls?.[0]
        || payload?.data?.urls?.[0]
        || null;
};

type ToolbarButtonProps = {
    title: string;
    icon: React.ReactNode;
    active?: boolean;
    onClick: () => void;
    disabled?: boolean;
};

const ToolbarButton = ({ title, icon, active, onClick, disabled }: ToolbarButtonProps) => (
    <Tooltip title={title}>
        <Button
            type={active ? 'primary' : 'default'}
            icon={icon}
            onClick={onClick}
            disabled={disabled}
        />
    </Tooltip>
);

const CustomEditor: React.FC<CustomEditorProps> = (props) => {
    const {
        data,
        onChange = () => { },
        histories = [],
        type = '',
    } = props;

    const [selectedHistory, setSelectedHistory] = useState<number>(0);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [editorData, setEditorData] = useState(data);
    const [mode, setMode] = useState<'edit' | 'source' | 'preview'>('edit');
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                link: false,
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                HTMLAttributes: {
                    rel: 'noopener noreferrer',
                    target: '_blank',
                },
            }),
            Image.configure({
                inline: false,
                allowBase64: false,
            }),
        ],
        content: data || '',
        editorProps: {
            attributes: {
                class: 'tiptap min-h-[360px] focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setEditorData(html);
            onChange(html);
        },
    });

    let filteredHistories = (histories || []).filter((item, index) => {
        const currentContent = item.content?.[type];
        if (index === 0 && currentContent) return true;
        if (index === (histories || []).length - 1) return true;
        const nextContent = histories[index + 1]?.content?.[type];
        return (nextContent || '') !== (currentContent || '');
    }).filter((item, index) => {
        const currentContent = item.content?.[type];
        return !(index === 0 && !currentContent);
    }).reverse();

    if (editorData && editorData !== filteredHistories[0]?.content?.[type]) {
        filteredHistories = [
            {
                id: 0,
                content: { [type]: editorData },
            },
            ...filteredHistories,
        ]
    }

    const handleHistoryClick = (index: number) => {
        setSelectedHistory(index);
        setDrawerVisible(true);
    };

    const normalizeHtml = (html: string) => {
        html = (html || '').replace(/<p>&nbsp;<\/p>/g, '\n');
        html = (html || '').replace(/&nbsp;/g, '\n');

        return beautify.html(html, { indent_size: 2, preserve_newlines: true });
    };

    const highlightSyntax = (str: any) => (
        <pre
            style={{ display: "inline" }}
            dangerouslySetInnerHTML={{
                __html: Prism.highlight(str || '', Prism.languages.txt, 'html')
            }}
        />
    );

    const changeData = (content: string) => {
        setEditorData(content);
        onChange(content);
    };

    const insertImageIntoEditor = (imageUrl: string) => {
        if (!editor) {
            changeData(`${editorData || ''}<p><img src="${imageUrl}" alt="" /></p>`);
            return;
        }

        editor.chain().focus().setImage({ src: imageUrl, alt: '' }).run();
        changeData(editor.getHTML());
    };

    const handleImageUpload = async (file: File) => {
        setUploadingImage(true);

        try {
            const formData = new FormData();
            formData.append('upload', file);
            formData.append('file', file);
            formData.append('image', file);
            formData.append('file[]', file);

            const response = await fetch(buildUploadUrl(), {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const payload = await response.json().catch(() => null);
            const imageUrl = getUploadedImageUrl(payload);

            if (!response.ok || !imageUrl) {
                throw new Error(payload?.message || 'Không upload được hình ảnh');
            }

            insertImageIntoEditor(imageUrl);
            messageApi.success('Đã tải ảnh lên và chèn vào nội dung');
        } catch (error: any) {
            messageApi.error(error?.message || 'Upload ảnh thất bại');
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        await handleImageUpload(file);
    };

    useEffect(() => {
        setEditorData(data);
    }, [data]);

    useEffect(() => {
        if (!editor) return;
        const nextValue = data || '';
        if (nextValue !== editor.getHTML()) {
            editor.commands.setContent(nextValue, { emitUpdate: false });
            setEditorData(nextValue);
        }
    }, [data, editor]);

    useEffect(() => () => editor?.destroy(), [editor]);

    const setLink = () => {
        if (!editor) return;

        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Nhập URL liên kết', previousUrl || 'https://');

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="relative">
            {contextHolder}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelected}
            />

            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-xs text-sgt-neutral-3">
                    Biên tập trực quan, chèn ảnh thật và chuyển nhanh sang chế độ HTML source như CMS chuyên nghiệp.
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        icon={<PictureOutlined />}
                        loading={uploadingImage}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Tải ảnh
                    </Button>
                    <Segmented
                        size="small"
                        value={mode}
                        onChange={(value) => setMode(value as 'edit' | 'source' | 'preview')}
                        options={[
                            { label: 'Biên tập', value: 'edit' },
                            { label: 'HTML source', value: 'source' },
                            { label: 'Xem trước', value: 'preview' },
                        ]}
                    />
                </div>
            </div>

            {mode === 'edit' ? (
                <div className="tiptap-editor-wrapper rounded-xl border border-sgt-gray-2 bg-white overflow-hidden">
                    <div className="border-b border-sgt-gray-2 bg-slate-50 p-3">
                        <Space wrap>
                            <ToolbarButton title="Tiêu đề 1" icon={<span className="text-xs font-bold">H1</span>} active={editor?.isActive('heading', { level: 1 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} disabled={!editor} />
                            <ToolbarButton title="Tiêu đề 2" icon={<span className="text-xs font-bold">H2</span>} active={editor?.isActive('heading', { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} disabled={!editor} />
                            <ToolbarButton title="Tiêu đề 3" icon={<span className="text-xs font-bold">H3</span>} active={editor?.isActive('heading', { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} disabled={!editor} />
                            <ToolbarButton title="Đậm" icon={<BoldOutlined />} active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()} disabled={!editor} />
                            <ToolbarButton title="Nghiêng" icon={<ItalicOutlined />} active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()} disabled={!editor} />
                            <ToolbarButton title="Gạch ngang" icon={<StrikethroughOutlined />} active={editor?.isActive('strike')} onClick={() => editor?.chain().focus().toggleStrike().run()} disabled={!editor} />
                            <ToolbarButton title="Bullet list" icon={<UnorderedListOutlined />} active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()} disabled={!editor} />
                            <ToolbarButton title="Ordered list" icon={<OrderedListOutlined />} active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()} disabled={!editor} />
                            <ToolbarButton title="Blockquote" icon={<InsertRowBelowOutlined />} active={editor?.isActive('blockquote')} onClick={() => editor?.chain().focus().toggleBlockquote().run()} disabled={!editor} />
                            <ToolbarButton title="Liên kết" icon={<LinkOutlined />} active={editor?.isActive('link')} onClick={setLink} disabled={!editor} />
                            <ToolbarButton title="HTML source" icon={<CodeOutlined />} onClick={() => setMode('source')} disabled={!editor} />
                            <ToolbarButton title="Undo" icon={<UndoOutlined />} onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().chain().focus().undo().run()} />
                            <ToolbarButton title="Redo" icon={<RedoOutlined />} onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().chain().focus().redo().run()} />
                        </Space>
                    </div>
                    <div className="p-4">
                        <EditorContent editor={editor} />
                    </div>
                </div>
            ) : mode === 'source' ? (
                <div className="space-y-2">
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                        Chế độ này cho phép chỉnh trực tiếp HTML output của bài viết.
                    </div>
                    <Input.TextArea
                        value={editorData || ''}
                        onChange={(event) => changeData(event.target.value)}
                        autoSize={{ minRows: 18, maxRows: 30 }}
                        className="font-mono"
                        placeholder="<h2>Tiêu đề</h2><p>Nội dung...</p>"
                    />
                </div>
            ) : (
                <div className="min-h-[420px] rounded-lg border border-sgt-gray-2 bg-white p-4">
                    {editorData ? (
                        <div className="prose max-w-none prose-p:text-sgt-neutral-3 prose-headings:text-sgt-secondary-2" dangerouslySetInnerHTML={{ __html: editorData }} />
                    ) : (
                        <div className="text-sm text-sgt-neutral-3">Chưa có nội dung để xem trước.</div>
                    )}
                </div>
            )}

            {filteredHistories.length > 0 && (
                <>
                    <Popover
                        content={
                            <div className="max-h-64 overflow-y-auto">
                                <ul>
                                    {filteredHistories.map((item, index) => (
                                        <li
                                            key={item.id}
                                            className="py-1 px-2 cursor-pointer hover:bg-blue-100 rounded-md flex items-center justify-between gap-2"
                                            onClick={() => handleHistoryClick(index)}
                                        >
                                            {item.id === 0 ? 'Hiện tại' : `${item.user_name || ''} ${formatDateTime(item.created_at || '', 'HH:mm - DD/MM/YYYY')} ${item.status === 'draft' ? '(Nháp)' : '(Xuất bản)'}`}
                                            {item.id !== 0 && (
                                                <Button
                                                    icon={<RollbackOutlined />}
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        changeData(item.content?.[type] || '');
                                                    }}
                                                />
                                            )}

                                        </li>

                                    ))}
                                </ul>
                            </div>
                        }
                        trigger="hover"
                    >
                        <Button
                            type="text"
                            shape="circle"
                            icon={<ClockCircleOutlined />}
                            className="!absolute top-0.5 right-0.5 shadow hover:bg-gray-300"
                        />
                    </Popover>

                    <Drawer
                        title={`Thay đổi`}
                        width='90%'
                        onClose={() => setDrawerVisible(false)}
                        open={drawerVisible}
                    >
                        <ReactDiffViewer
                            oldValue={normalizeHtml(filteredHistories[selectedHistory + 1]?.content?.[type])}
                            newValue={normalizeHtml(filteredHistories[selectedHistory]?.content?.[type])}
                            splitView={true}
                            hideLineNumbers={false}
                            renderContent={highlightSyntax}
                        />
                    </Drawer>
                </>
            )}
        </div>
    );
};

export default CustomEditor;
