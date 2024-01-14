import type { tabsDataType } from '@/background/type';
import { extractDomain, groupBy } from '@/utils';

export async function moveTabs(w: chrome.windows.Window[], targetWin: chrome.windows.Window) {
    const numWindows = w.length;
    const tabs = await chrome.tabs.query({ currentWindow: true });
    let tabPosition = tabs.length;
    for (let i = 0; i < numWindows; i++) {
        const win = w[i];
        if (targetWin.id !== win.id) {
            const numTabs = win.tabs?.length || 0;
            for (let j = 0; j < numTabs; j++) {
                const tab = win.tabs && win.tabs[j];
                if (tab && tab.id) {
                    chrome.tabs.move(tab.id, { windowId: targetWin.id, index: tabPosition });
                    tabPosition++;
                }
            }
        }
    }
}

export async function mergeWinHandle() {
    const targetWin = await chrome.windows.getCurrent();
    chrome.windows.getAll({ populate: true }, (win) => moveTabs(win, targetWin));
}

export async function getUnGroupsIds(queryInfo: object) {
    const currentTabs = await chrome.tabs.query(queryInfo);
    return currentTabs
        .filter((t) => t.groupId !== -1)
        .map((t) => {
            if (t.id) {
                return t.id;
            }
            return -1;
        });
}

export function groupTabsByDomainLevel(tabsData: tabsDataType[], level: number) {
    const groupTabsByWindowId: Map<string, tabsDataType[]> = groupBy(tabsData, 'windowId');
    return [...groupTabsByWindowId].map(([winId, tabs]) => {
        if (level === 1) {
            return { [winId]: groupBy(tabs, 'domain') };
        }
        const groupByMatchLevel = groupBy(tabs, (t) => {
            if (!t.domain) {
                return 'domain';
            }
            const domainElements: string[] = [];
            const domainSplit = t.domain.split('.');
            let y = 0;
            for (let i = domainSplit.length - 1; i >= 0; i--) {
                if (y === level) {
                    return domainElements.reverse().join('.');
                } else {
                    domainElements.push(domainSplit[i]);
                    y++;
                }
            }
            return domainElements.reverse().join('.');
        });
        return { [winId]: groupByMatchLevel };
    });
}

export function filterTabsByLeastNumber(
    data: {
        [x: string]: Map<unknown, tabsDataType[]>;
    }[],
    leastNumber: number,
) {
    return data.map((item) => {
        const currentKey = Object.keys(item)[0];
        return { [currentKey]: [...item[currentKey]].filter(([_, v]) => v.length >= leastNumber) };
    });
}

export async function createGroupTabs(
    selectedRange: string,
    matchLevel: number,
    leastNumber: number,
) {
    // 获取所有 tab，可以是多窗口
    const currentTabs = await chrome.tabs.query({});
    // 划定分组范围
    const targetTabs =
        selectedRange === 'all' ? currentTabs : currentTabs.filter((t) => t.groupId === -1);
    // 准备数据
    const tabsData: tabsDataType[] = targetTabs.map((t) => {
        return {
            domain: extractDomain(t.url),
            url: t.url,
            title: t.title,
            tabId: t.id,
            windowId: t.windowId,
        };
    });
    // 根据匹配等级分group
    const groupByDomainLevel = groupTabsByDomainLevel(tabsData, matchLevel);
    // 根据 leastNumber 再过滤分组
    return filterTabsByLeastNumber(groupByDomainLevel, leastNumber);
}

export function updateGroupTabs(
    groupTabs: {
        [x: string]: [unknown, tabsDataType[]][];
    }[],
    openAllGroup: boolean,
) {
    groupTabs.forEach((item) => {
        const windowId = Number(Object.keys(item)[0]);
        const tabsWithDomain = item[Object.keys(item)[0]] as [string, tabsDataType[]][];
        tabsWithDomain.forEach(([domain, tabsInfo]) => {
            const tabIds = tabsInfo.map((t) => t.tabId) as number[];
            chrome.tabs.group({ createProperties: { windowId }, tabIds }, (groupId) => {
                chrome.tabGroups.update(groupId, { title: domain, collapsed: !openAllGroup });
            });
        });
    });
}

export async function mergeGroups({
    open,
    selectedRange,
    matchLevel,
    leastNumber,
    openAllGroup,
}: {
    open: boolean;
    selectedRange: string;
    matchLevel: number;
    leastNumber: number;
    openAllGroup: boolean;
}) {
    if (!open) {
        return;
    }
    const groupTabs = await createGroupTabs(selectedRange, matchLevel, leastNumber);
    if (selectedRange === 'all') {
        const unGroupIds = await getUnGroupsIds({});
        if (unGroupIds.length > 0) {
            chrome.tabs.ungroup(unGroupIds);
        }
    }
    updateGroupTabs(groupTabs, openAllGroup);
}
