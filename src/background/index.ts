import { onMessage } from 'webext-bridge';

import type { DomainConfigType } from '@/popup/components/ConfigManage/type';

import type { tabsDataType } from './type';

// todo 合并公共方法
async function moveTabs(w: chrome.windows.Window[], targetWin: chrome.windows.Window) {
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

function extractDomain(url: string | undefined) {
    if (!url) return;
    const urlObject = new URL(url);
    return urlObject.hostname;
}

function groupBy<T, K>(array: T[], callback: ((e: T, i: number) => K) | keyof T): Map<K, T[]> {
    return array.reduce((newMap, e, i) => {
        const keyData = typeof callback === 'function' ? callback(e, i) : e[callback];
        const key = keyData as K;
        const value = newMap.get(key);

        if (value === undefined) {
            newMap.set(key, [e]);
        } else {
            value.push(e);
        }
        return newMap;
    }, new Map<K, T[]>());
}

function groupTabsByDomainLevel(tabsData: tabsDataType[], level: number) {
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

function filterTabsByLeastNumber(
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

async function createGroupTabs(selectedRange: string, matchLevel: number, leastNumber: number) {
    // selectedRange ---> matchLevel---> groupBy-->leastNumber--> 按域名分组
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

let domainConfigMsg: DomainConfigType = {
    open: false,
    selectedRange: 'all',
    leastNumber: 2,
    matchLevel: 3,
    openAllGroup: false,
};

function updateGroupTabs(
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
onMessage('domain-config', async (msg) => {
    const { data } = msg ?? {};
    const objData = JSON.parse(JSON.stringify(data));
    domainConfigMsg = objData;
    const { open, selectedRange, leastNumber, matchLevel, openAllGroup } = objData;
    if (!open) {
        return;
    }
    const groupTabs = await createGroupTabs(selectedRange, matchLevel, leastNumber);
    updateGroupTabs(groupTabs, openAllGroup);
});

const shortcutCommand = async (cmd: string) => {
    if (cmd === 'merge-windows') {
        const targetWin = await chrome.windows.getCurrent();
        chrome.windows.getAll({ populate: true }, (win) => moveTabs(win, targetWin));
    }
    if (cmd === 'create-group') {
        const { selectedRange, leastNumber, matchLevel, openAllGroup } = domainConfigMsg;
        const groupTabs = await createGroupTabs(selectedRange, matchLevel, leastNumber);
        updateGroupTabs(groupTabs, openAllGroup);
        return;
    }
    if (cmd === 'un-group') {
        const currentTabs = await chrome.tabs.query({});
        const unGroupIds = currentTabs
            .filter((t) => t.groupId !== -1)
            .map((t) => {
                if (t.id) {
                    return t.id;
                }
                return -1;
            });
        if (unGroupIds.length > 0) {
            chrome.tabs.ungroup(unGroupIds);
        }
    }
};

chrome.commands.onCommand.addListener(shortcutCommand);

// onInstalled 事件，该事件在首次安装扩展程序（而不是 Service Worker）、扩展程序更新到新版本以及 Chrome 更新到新版本时触发
chrome.runtime.onInstalled.addListener(() => {
    // if(details.reason !== "install" && details.reason !== "update") {
    //      return null;
    // }
    // chrome.contextMenus.create({
    //   "id": "sampleContextMenu",
    //   "title": "Sample Context Menu",
    //   "contexts": ["selection"]
    // });
});
