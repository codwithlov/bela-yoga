import { TreeDataNode } from "antd";

export const onDropMultiLayer = (info: any, gData: any, setGData: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
        data: TreeDataNode[],
        key: React.Key,
        callback: (node: TreeDataNode, i: number, data: TreeDataNode[]) => void,
    ) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].key === key) {
                return callback(data[i], i, data);
            }
            if (data[i].children) {
                loop(data[i].children!, key, callback);
            }
        }
    };

    const data = [...gData];
    let dragObj: TreeDataNode;
    loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
    });

    if (!info.dropToGap) {
        loop(data, dropKey, (item) => {
            item.children = item.children || [];
            item.children.unshift(dragObj);
        });
    } else {
        let ar: TreeDataNode[] = [];
        let i: number;
        loop(data, dropKey, (_item, index, arr) => {
            ar = arr;
            i = index;
        });
        if (dropPosition === -1) {
            ar.splice(i!, 0, dragObj!);
        } else {
            ar.splice(i! + 1, 0, dragObj!);
        }
    }
    setGData(data);
};

export const onDropSingleLayer = (info: any, gData: any, setGData: any) => {
    const dragKey = info.dragNode.key;
    const dropKey = info.node.key;
    const data = [...gData];
    let dragObj;

    // Remove the dragged item from its original position
    const index = data.findIndex((item) => item.key === dragKey);
    dragObj = data.splice(index, 1)[0];

    let dropIndex = data.findIndex((item) => item.key === dropKey);

    if (info.node.dragOverGapTop && dropIndex === 0) {
        dropIndex = -1;
    }

    // Insert the dragged item at the new position
    data.splice(dropIndex + 1, 0, dragObj);
    setGData(data);
};