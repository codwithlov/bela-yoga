import { Draggable, Droppable } from "@hello-pangea/dnd";
import React, { useCallback, useState } from "react";
import Item from "./Item";
import PreviewImage from "@/components/admin/organisms/PreviewImage";

const Column = React.memo(({ columnId, column, setColumns, editImage, colKey, itemHeight }: any) => {
    const [openPreview, setOpenPreview] = useState(false);
    const [currentImage, setCurrentImage] = useState(-1);
    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const files = Array.from(e.target.files).filter(file => file.size <= 2 * 1024 * 1024);
        if (files.length !== e.target.files.length) {
            alert('Tồn tại file lớn hơn 2MB');
        }
        const newImages = files.map((file) => ({
            id: `image-${Date.now()}-${file.name}`,
            url: URL.createObjectURL(file),
            file: file,
        }));

        setColumns((prev: any) => ({
            ...prev,
            upload: {
                ...prev.upload,
                items: [...prev.upload.items, ...newImages],
            },
        }));

        e.target.value = "";
    }, [setColumns]);

    const viewGallery = useCallback((current: number) => {
        setCurrentImage(current)
        setOpenPreview(true);
    }, []);
    return (
        <div className="w-1/4">
            <h2 className="text-sm font-semibold mb-2 text-center">{column.name}</h2>
            <div className="flex-1 bg-gray-100 rounded-md p-3 pb-1 min-h-[390px]">
                {columnId === "upload" && (
                    <div className="flex items-center justify-center cursor-pointer mb-4">
                        <label
                            htmlFor={"upload-file" + colKey}
                            className="bg-sgt-primary-2 rounded-lg w-full text-center cursor-pointer"
                        >
                            <p className="text-sx justify-center p-2">
                                <span className="font-semibold">Tải ảnh mới {'(2MB)'}</span>
                            </p>
                            <input
                                id={"upload-file" + colKey}
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                )}
                <Droppable droppableId={columnId}>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="min-h-[300px] rounded-md"
                        >
                            {column.items.map((item: any, index: number) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="mb-2"
                                        >
                                            <Item
                                                item={item}
                                                viewGallery={() => viewGallery(index)}
                                                editImage={() => editImage(item.id)}
                                                height={itemHeight}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
            <PreviewImage
                openPreview={openPreview}
                currentImage={currentImage}
                setCurrentImage={setCurrentImage}
                setOpenPreview={setOpenPreview}
                galleryList={column?.items}
            />
        </div>
    );
});
Column.displayName = 'Column';
export default Column;
