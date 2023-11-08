import { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { Button, Tabs, Tooltip, Tree } from 'antd';
import {
    QuestionCircleOutlined,
  } from '@ant-design/icons';
import { TabDataType, TabListType } from './type';
import GroupTitle from './components/GroupTitle';
import TabTitle from './components/TabTitle';

async function moveTabs(w: chrome.windows.Window[], targetWin: chrome.windows.Window) {
    const numWindows = w.length;
    const tabs = await chrome.tabs.query({currentWindow: true});
    let tabPosition = tabs.length;
    for (let i = 0; i < numWindows; i++) {
        let win = w[i];
        if (targetWin.id != win.id) {
            let numTabs = win.tabs?.length || 0;
            for (let j = 0; j < numTabs; j++) {
                let tab = win.tabs && win.tabs[j];
                if(tab && tab.id) {
                    chrome.tabs.move(tab.id, { windowId: targetWin.id, index: tabPosition });
                    tabPosition++;
                }
            }
        }
    }
}

const initData = {
    title: '',
    key: '',
    children: [{
        title: '',
        key: '1000'
    }]
}

const App = () => {

    const [tabList, setTabList] = useState<TabListType[]>([initData]);


    // const onDropHandle=({node: EventDataNode<TabListType>, dragNode: EventDataNode<TabListType>, dragNodesKeys:[]}) => {
    //     console.log(node, 'target-node==');
    //     console.log(dragNode, 'dragNode');
    //     console.log(dragNodesKeys, 'dragNodesKeys');
    //     console.log(tabList, 'tabList');
    // }

    const tabItems = useMemo(() => {
        return [
            {
                key: 'tab列表',
                label: 'tab列表',
                children: <Tree
                        className="draggable-tree"
                        defaultExpandedKeys={[]}
                        blockNode
                        showIcon
                        draggable
                        showLine
                        height={450}
                        // onDrop={onDropHandle}
                        treeData={tabList}
                    />,
            },
            {
                key: '配置管理',
                label: '配置管理',
                children: 'Content of Tab Pane 2',
            }
        ]
    },[tabList]) 

    const buildTreeData = (data: TabDataType[]) => {
        return data.map((r) => {
            const children = r.children.map((c,index) => {
                return {
                    icon: <img width={14} height={14} style={{position: 'relative', top: '2px'}} src={c.favIconUrl} />,
                    title: <TabTitle title={c.title} />,
                    key: c.windowId + r.id + index + '' + c.id
                }
            })
            return {
                title: <GroupTitle data={r}/>,
                key: r.id + r.windowId + '',
                children: children
            }
        })
    }

    const buildTabList = async () => {
        const currentTabs = await chrome.tabs.query({currentWindow: true})
        const currentGroups = await chrome.tabGroups.query({windowId: undefined});
        const groupList = currentGroups.map((g) => {
            return {
                ...g,
                children: currentTabs.filter((t) => t.groupId === g.id)
            }
        });
        const relativeIds = new Set(currentGroups.map((x) => x.id));
        const restTabList = currentTabs.filter((t) => !relativeIds.has(t.groupId));
        const emptyGroup ={
            title: '无分组',
            collapsed: false,
            color: 'grey' as chrome.tabGroups.ColorEnum,
            id: -100,
            windowId: currentTabs[0].windowId,
        }
        const data = currentGroups.length ? groupList.concat([{...emptyGroup, children: restTabList}]) :[{...emptyGroup, children: currentTabs}];
        console.log(data, 'groupData');
        const treeData = buildTreeData(data);
        setTabList(treeData);
    }

    const mergeWinHandle  = async () => {
        // 当前窗口
        const targetWin = await chrome.windows.getCurrent();
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

    useEffect(() => {
        buildTabList();
    }, []);

    return (
        <div className="app">
        <Tabs tabBarExtraContent={mergeWindowBtn} items={tabItems} />
    </div>
    )
};

export default App;
