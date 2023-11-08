
export interface TabListType{
    title: React.ReactNode  | undefined;
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
    data: TabDataType
}

export interface TabTitleProps {
    title: string | undefined;
}