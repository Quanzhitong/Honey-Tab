import { useMemo } from 'react';
import './App.scss';
import { Button, Tabs, Tooltip } from 'antd';
import {
    QuestionCircleOutlined,
  } from '@ant-design/icons';

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


const App = () => {

    const tabItems = useMemo(() => {
        return [
            {
                key: '标签列表',
                label: '标签列表',
                children:  <div>第一个 content</div>,
            },
            {
                key: '配置管理',
                label: '配置管理',
                children: 'Content of Tab Pane 2',
            }
        ]
    },[]) 

    const mergeWinHandle  = async () => {
        // 当前窗口
        const targetWin = await chrome.windows.getCurrent();
        
        // 从当前 tab 找到当前窗口所有 tabs
        const tabs = await chrome.tabs.query({currentWindow: true});
        console.log(tabs, '==tabs==');
        
        chrome.windows.getAll({"populate" : true}, (win) => moveTabs(win, targetWin));
    }

    const mergeWindowBtn = (
        <>
            <Tooltip
                title={
                    <>
                        快捷键: <br />
                        Command/Ctrl + Shift + 键盘右键
                    </>
                }
            >
                <QuestionCircleOutlined
                    rev={undefined}
                    style={{ color: '#666666', paddingRight: '5px' }}
                />
            </Tooltip>
            <Button id={'mm'} type="primary" size="small" onClick={mergeWinHandle}>
                一键合并窗口
            </Button>
        </>
    );

    return (
        <div className="app">
        <Tabs tabBarExtraContent={mergeWindowBtn} items={tabItems} />
    </div>
    )
};

export default App;
