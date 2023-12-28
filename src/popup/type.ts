import type { DataNode, EventDataNode } from 'antd/es/tree';
import type { Dispatch, SetStateAction } from 'react';

export interface TabListType {
    title: React.ReactNode | undefined;
    key: string;
    children: {
        title: React.ReactNode | undefined;
        key: string;
    }[];
}

export interface TabDataType {
    children: chrome.tabs.Tab[];
    collapsed: boolean;
    color: chrome.tabGroups.ColorEnum;
    id: number;
    title?: string | undefined;
    windowId: number;
}

export interface GroupTitleProps {
    data: TabDataType;
}

export interface TabTitleProps {
    title: string | undefined;
    tabId?: number | undefined;
    callBack: Dispatch<SetStateAction<number>>;
}

export interface NodeDragEventParams<TreeDataType extends DataNode, T = HTMLDivElement> {
    event: React.DragEvent<T>;
    node: EventDataNode<TreeDataType>;
}
export type OnDropProps = NodeDragEventParams<DataNode> & {
    node: EventDataNode<TabDataType>;
    dragNode: EventDataNode<TabDataType>;
    dragNodesKeys: React.Key[];
    dropPosition: number;
    dropToGap: boolean;
};
