import { onMessage } from 'webext-bridge';
// todo 合并公共方法
async function moveTabs(w: chrome.windows.Window[], targetWin: chrome.windows.Window) {
    const numWindows = w.length;
    const tabs = await chrome.tabs.query({currentWindow: true});
    let tabPosition = tabs.length;
    for (var i = 0; i < numWindows; i++) {
        var win = w[i];
        if (targetWin.id != win.id) {
            var numTabs = win.tabs?.length || 0;
            for (var j = 0; j < numTabs; j++) {
                var tab = win.tabs && win.tabs[j];
                if(tab && tab.id) {
                    chrome.tabs.move(tab.id, { windowId: targetWin.id, index: tabPosition });
                    tabPosition++;
                }
            }
        }
    }
}

onMessage('mergeWin', (msg) => {
    console.log(msg, 'onMessage==');
});

const mergeWinCommand = async (cmd: string) => {
    console.log(cmd, '==cmd');
    if(cmd === 'merge-windows') {
        const targetWin = await chrome.windows.getCurrent();
        chrome.windows.getAll({"populate" : true}, (win) => moveTabs(win, targetWin));
    }
}

chrome.commands.onCommand.addListener(mergeWinCommand);