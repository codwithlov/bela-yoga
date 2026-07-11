'use client';
import React, { useState, useCallback, useRef, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Column from "./Column";
import EditImageModal from "./EditImageModal";
import { SliderBannerImage } from "@/interfaces/image";

type ColumnsType = {
    [key: string]: {
        name: string;
        items: SliderBannerImage[];
    };
};

const initialColumns: ColumnsType = {
    active: { name: "Hiển thị", items: [] },
    inactive: { name: "Không hiển thị", items: [] },
    delete: { name: "Xóa", items: [] },
    upload: { name: "Tải ảnh", items: [] },
};

type Props = {
    sliderImages: SliderBannerImage[];
    slugs: any;
    columns: ColumnsType;
    setColumns: any;
    title: string;
    itemHeight: number;
};


const Slider = ({ sliderImages, slugs, columns, setColumns, title, itemHeight }: Props) => {
    const [openEditModal, setOpenEditModal] = useState(false);

    const currentItem = useRef<any>(null);

    const editImage = (id: SliderBannerImage) => {
        currentItem.current = Object.values(columns)
            .flatMap((column) => column.items)
            .find((item: any) => item.id === id);

        setOpenEditModal(true);
    };

    const getImages = useCallback((data: SliderBannerImage[], isActive: number): any => {
        return (data || [])
            .filter((i) => i.is_active === isActive)
            .map((i) => ({
                id: i.id.toString(),
                url: i.url,
                external_link: i.external_link,
                slug_id: i.slug_id,
            }));
    }, []);

    useEffect(() => {
        if (sliderImages) {
            setColumns({
                ...initialColumns,
                active: { name: "Hiển thị", items: getImages(sliderImages, 1) },
                inactive: { name: "Không hiển thị", items: getImages(sliderImages, 0) },
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getImages, sliderImages]);

    return (
        <>
            <p className="font-medium text-lg mt-3">{title}</p>
            <div className="flex gap-2 mt-2">
                <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
                    {Object.entries(columns).map(([columnId, column]) => (
                        <Column
                            key={columnId + title}
                            colKey={columnId + title}
                            columnId={columnId}
                            column={column}
                            setColumns={setColumns}
                            editImage={editImage}
                            itemHeight={itemHeight}
                        />
                    ))}
                </DragDropContext>
            </div>
            <EditImageModal
                openEditModal={openEditModal}
                closeEditModal={() => { setOpenEditModal(false); currentItem.current = null }}
                currentItem={currentItem.current}
                slugs={slugs}
                setColumns={setColumns}
                setBannerImage={() => { }}
            />
        </>
    );
}

const onDragEnd = (
    result: DropResult,
    columns: ColumnsType,
    setColumns: React.Dispatch<React.SetStateAction<ColumnsType>>
): void => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);

        destItems.splice(destination.index, 0, removed);

        setColumns({
            ...columns,
            [source.droppableId]: { ...sourceColumn, items: sourceItems },
            [destination.droppableId]: { ...destColumn, items: destItems },
        });
    } else {
        const column = columns[source.droppableId];
        const copiedItems = [...column.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);

        setColumns({
            ...columns,
            [source.droppableId]: { ...column, items: copiedItems },
        });
    }
};

export default Slider;