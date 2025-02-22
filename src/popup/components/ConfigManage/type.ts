import type { Dispatch, SetStateAction } from 'react';

export type TabType = 'all' | 'noGroup';

export type DomainLevelType = 1 | 2 | 3;

export interface TabSelectRangeProps {
    value: string;
    onChange: (value: string) => void;
}

export interface TabLeastNumberProps {
    value: number | null;
    onChange: (value: number | null) => void;
}

export interface TabMatchLevelProps {
    value: DomainLevelType;
    onChange: (value: DomainLevelType) => void;
}

export type ConfigKeyType =
    | 'selectedRange'
    | 'leastNumber'
    | 'matchLevel'
    | 'open'
    | 'openAllGroup'
    | 'showCustomGroupName'
    | 'groupNames';

export interface DomainConfigType {
    open: boolean; // 是否开启分组
    selectedRange: TabType;
    leastNumber: number;
    matchLevel: DomainLevelType;
    openAllGroup: boolean;
    showCustomGroupName: boolean;
    groupNames: Record<string, string>;
}

export interface ConfigManageProps {
    callBack: Dispatch<SetStateAction<number>>;
}
