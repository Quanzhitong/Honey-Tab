import { onMessage, sendMessage } from 'webext-bridge';

import type { DomainConfigType } from '@/popup/components/ConfigManage/type';
import { getBadge, getUnGroupsIds, mergeGroups, mergeWinHandle } from '@/service';

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
        chrome.storage.local.get(async (res) => {
            const { open, selectedRange, leastNumber, matchLevel, openAllGroup } =
                res?.domain_config ?? domainConfigMsg;
            await mergeGroups({ open, selectedRange, leastNumber, matchLevel, openAllGroup });
            const currentTab = await getCurrentTab();
            if (currentTab && currentTab.id) {
                sendMessage(
                    'trigger-update',
                    { update: true },
                    { context: 'popup', tabId: currentTab.id },
                );
            }
        });
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

chrome.runtime.onInstalled.addListener(async (details) => {
    chrome.contextMenus.create({
        id: 'helpBook',
        title: '帮助文档',
        contexts: ['all'],
    });
    chrome.storage.local.get(async (res) => {
        const { open } = res.domain_config ?? domainConfigMsg;
        await getBadge(open);
    });
    if (details.reason === 'install') {
        chrome.tabs.create({
            url: 'introduce.html',
            active: true,
        });
    }
});

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === 'helpBook') {
        chrome.tabs.create({
            url: 'help.html',
            active: true,
        });
    }
});

chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.domain_config && changes.domain_config.newValue) {
        const newDomainConfig = changes.domain_config.newValue;
        getBadge(newDomainConfig.open);
    }
});
