import { onMessage, sendMessage } from 'webext-bridge';

import type { DomainConfigType } from '@/popup/components/ConfigManage/type';
import { getUnGroupsIds, mergeGroups, mergeWinHandle } from '@/service';

let domainConfigMsg: DomainConfigType = {
    open: false,
    selectedRange: 'all',
    leastNumber: 2,
    matchLevel: 3,
    openAllGroup: false,
};

async function getCurrentTab() {
    const currentTabs = await chrome.tabs.query({});
    return currentTabs.find((t) => t.active);
}

onMessage('domain-config', async (msg) => {
    const { data } = msg ?? {};
    const objData = JSON.parse(JSON.stringify(data));
    domainConfigMsg = objData;
    const { open, selectedRange, leastNumber, matchLevel, openAllGroup } = objData;
    await mergeGroups({ open, selectedRange, leastNumber, matchLevel, openAllGroup });
});

const shortcutCommand = async (cmd: string) => {
    if (cmd === 'merge-windows') {
        mergeWinHandle();
    }
    if (cmd === 'create-group') {
        const { open, selectedRange, leastNumber, matchLevel, openAllGroup } = domainConfigMsg;
        await mergeGroups({ open, selectedRange, leastNumber, matchLevel, openAllGroup });
        const currentTab = await getCurrentTab();
        if (currentTab && currentTab.id) {
            sendMessage(
                'trigger-update',
                { update: true },
                { context: 'popup', tabId: currentTab.id },
            );
            return;
        }
    }
    if (cmd === 'un-group') {
        const unGroupIds = await getUnGroupsIds({});
        if (unGroupIds.length > 0) {
            await chrome.tabs.ungroup(unGroupIds);
        }
        const currentTab = await getCurrentTab();
        if (currentTab && currentTab.id) {
            sendMessage(
                'trigger-update',
                { update: true },
                { context: 'popup', tabId: currentTab.id },
            );
            return;
        }
        sendMessage('trigger-update', { update: true }, 'popup');
    }
};

chrome.commands.onCommand.addListener(shortcutCommand);

chrome.runtime.onSuspend.addListener(() => {
    // 在插件卸载时清除 localStorage 数据
    console.log('Extension uninstalled. LocalStorage cleared.');
    localStorage.removeItem('domain_config');
});
