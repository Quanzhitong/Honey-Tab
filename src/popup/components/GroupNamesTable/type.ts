type ItemType = 'add' | 'normal';

export interface Item {
    key: string;
    domain: string;
    newGroupName: string;
    type?: ItemType;
}

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'text';
    record: Item;
    index: number;
    children: React.ReactNode;
}

export interface GroupNamesTableProps {
    groupNames: Record<string, string>;
    handleSave: (d: Record<string, string>) => void;
}
