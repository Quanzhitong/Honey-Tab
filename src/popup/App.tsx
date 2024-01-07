import { Button, Tabs, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { useEffect, useMemo, useState } from 'react';

import { ConfigManage } from './components/ConfigManage';
import GroupTitle from './components/GroupTitle';
import MyTooltip from './components/MyTooltip';
import TabTitle from './components/TabTitle';
import type { TabDataType, TabListType } from './type';

import './App.scss';

const EMPTY_GROUP_ID = -100;

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

const initData = {
    title: '',
    key: '',
    children: [
        {
            title: '',
            key: '1000',
        },
    ],
};

const mergeWinHandle = async () => {
    const targetWin = await chrome.windows.getCurrent();
    chrome.windows.getAll({ populate: true }, (win) => moveTabs(win, targetWin));
};

const App = () => {
    const [tabList, setTabList] = useState<TabListType[]>([initData]);
    const [version, setVersion] = useState(0);
    const onDropHandle = async (info: any) => {
        const dropKey = info.node.key;
        const dragNode = info.dragNode;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        // 组不允许拖动
        if (dragNode.children && dragNode.children.length > 0) {
            return;
        }
        const loop = (
            data: DataNode[],
            key: React.Key,
            callback: (node: DataNode, i: number, data: DataNode[]) => void,
        ) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    return callback(data[i], i, data);
                }
                if (data[i].children) {
                    loop(data[i].children!, key, callback);
                }
            }
        };
        const data = [...tabList];
        // Find dragObject
        let dragObj: DataNode;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });
        if (!info.dropToGap) {
            // Drop on the content
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                item.children.unshift(dragObj);
            });
        } else if (
            ((info.node as any).props.children || []).length > 0 && // Has children
            (info.node as any).props.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                item.children.unshift(dragObj);
            });
        } else {
            let ar: DataNode[] = [];
            let i: number;
            loop(data, dropKey, (_item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i!, 0, dragObj!);
            } else {
                ar.splice(i! + 1, 0, dragObj!);
            }
        }
        const currentTabs = await chrome.tabs.query({ currentWindow: true });
        const resetTabIds = currentTabs
            .filter((tab) => tab.groupId === dragNode.groupId)
            .map((tab) => tab.id);
        const preTabIds = resetTabIds.filter((f) => f !== dragNode.tabId) as number[];
        const targetNodeIsGroup = info.node.children && info.node.children.length > 0;
        // info.node.children[1] 是未移动之前的第一个元素
        const targetNodeId = targetNodeIsGroup ? info.node.children[1].tabId : info.node.tabId;
        const insertIndex = currentTabs.findIndex((tab) => tab.id === targetNodeId);
        await (info.node.groupId === EMPTY_GROUP_ID
            ? chrome.tabs.ungroup(dragNode.tabId)
            : chrome.tabs.group({ groupId: info.node.groupId, tabIds: dragNode.tabId }));
        await chrome.tabs.move(dragNode.tabId, {
            index: targetNodeIsGroup ? insertIndex : insertIndex + 1,
        });
        if (preTabIds.length > 0) {
            await chrome.tabs.group({
                groupId: dragNode.groupId,
                tabIds: preTabIds,
            });
        }
        setVersion((v) => v + 1);
        setTabList(data);
    };
    const tabItems = useMemo(() => {
        return [
            {
                key: 'tab列表',
                label: (
                    <span className="tab-title">
                        tab列表{' '}
                        <MyTooltip
                            title={'插件打开时会自动整理tab标签页顺序，未分组的排在最右边'}
                        />
                    </span>
                ),
                children: (
                    <Tree
                        className="draggable-tree"
                        defaultExpandedKeys={[]}
                        blockNode
                        showIcon
                        draggable={(d: any) => !!d.tabId}
                        showLine
                        height={450}
                        onDrop={onDropHandle}
                        treeData={tabList}
                    />
                ),
            },
            {
                key: '配置管理',
                label: <span className="tab-title">配置管理</span>,
                children: <ConfigManage />,
            },
        ];
    }, [tabList]);

    const buildTreeData = useMemo(() => {
        return (data: TabDataType[]) => {
            return data.map((r) => {
                const children = r.children.map((c, index) => {
                    return {
                        icon: (
                            <img
                                alt=""
                                width={14}
                                height={14}
                                style={{ position: 'relative', top: '2px' }}
                                src={c.favIconUrl}
                            />
                        ),
                        title: <TabTitle title={c.title} tabId={c.id} callBack={setVersion} />,
                        key: `${c.windowId + r.id + index}${c.id}`,
                        tabId: c.id,
                        groupId: r.id,
                    };
                });
                return {
                    title: <GroupTitle data={r} />,
                    key: `${r.id + r.windowId}`,
                    children,
                    groupId: r.id,
                };
            });
        };
    }, []);

    const buildTabList = async () => {
        const currentTabs = await chrome.tabs.query({ currentWindow: true });
        const targetWin = await chrome.windows.getCurrent();
        const currentGroups = await chrome.tabGroups.query({ windowId: targetWin.id });
        const groupList = currentGroups.map((g) => {
            const _children = currentTabs.filter((t) => t.groupId === g.id);
            return {
                ...g,
                children: _children,
            };
        });
        const relativeIds = new Set(currentGroups.map((x) => x.id));
        const restTabList = currentTabs.filter((t) => !relativeIds.has(t.groupId));
        const emptyGroup = {
            title: '无分组',
            collapsed: false,
            color: 'grey' as chrome.tabGroups.ColorEnum,
            id: EMPTY_GROUP_ID,
            windowId: currentTabs[0].windowId,
        };
        const data =
            currentGroups.length > 0
                ? restTabList.length > 0
                    ? [...groupList, { ...emptyGroup, children: restTabList }]
                    : groupList
                : [{ ...emptyGroup, children: currentTabs }];
        const treeData = buildTreeData(data);
        setTabList(treeData);
    };

    const mergeWindowBtn = useMemo(() => {
        return (
            <>
                <MyTooltip
                    title={
                        <>
                            快捷键: <br />
                            Command/Ctrl + Shift + 键盘右键
                        </>
                    }
                />
                <Button id={'mm'} type="primary" size="small" onClick={mergeWinHandle}>
                    一键合并窗口
                </Button>
            </>
        );
    }, []);

    useEffect(() => {
        const fetchCurrentTabs = async () => {
            const currentTabs = await chrome.tabs.query({ currentWindow: true });
            const unGroupTabs = currentTabs.filter((tab) => tab.groupId === -1);
            if (unGroupTabs.length > 0) {
                await chrome.tabs.move(unGroupTabs.map((tab) => tab.id) as number[], { index: -1 });
            }
            return currentTabs;
        };
        fetchCurrentTabs();
        buildTabList();
    }, [version]);

    return (
        <div className="app">
            <Tabs tabBarExtraContent={mergeWindowBtn} items={tabItems} />
        </div>
    );
};

export default App;
