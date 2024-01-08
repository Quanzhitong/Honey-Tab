import { Button, InputNumber, message, Select, Switch } from 'antd';
import { useState } from 'react';
import { sendMessage } from 'webext-bridge';

import type {
    ConfigKeyType,
    DomainConfigType,
    DomainLevelType,
    TabLeastNumberProps,
    TabMatchLevelProps,
    TabSelectRangeProps,
    TabType,
} from './type';

import './style.scss';

const tabSelectOptions: { label: string; value: TabType }[] = [
    {
        label: '对所有标签页使用域名匹配',
        value: 'all',
    },
    {
        label: '仅对未加入分组的标签页使用域名匹配',
        value: 'noGroup',
    },
];

const domainLevelOptions: { label: string; value: DomainLevelType }[] = [
    {
        label: '完整域名',
        value: 1,
    },
    {
        label: '二级',
        value: 2,
    },
    {
        label: '三级',
        value: 3,
    },
];

const TabSelectRange = (props: TabSelectRangeProps) => {
    const { value, onChange } = props;
    return <Select size="small" options={tabSelectOptions} value={value} onChange={onChange} />;
};

const TabLeastNumber = (props: TabLeastNumberProps) => {
    const { value, onChange } = props;
    return <InputNumber size="small" min={2} max={10} value={value} onChange={onChange} />;
};

const TabMatchLevel = (props: TabMatchLevelProps) => {
    const { value, onChange } = props;
    return <Select size="small" options={domainLevelOptions} value={value} onChange={onChange} />;
};

const initData: DomainConfigType = {
    open: false,
    selectedRange: 'all',
    leastNumber: 2,
    matchLevel: 3,
    openAllGroup: false,
};

function getInitData() {
    const data = localStorage.getItem('domain_config');
    if (data) {
        return JSON.parse(data) as DomainConfigType;
    }
    return initData;
}

export function ConfigManage() {
    const [domainConfig, setDomainConfig] = useState<DomainConfigType>(getInitData());
    const onChangeConfigItem = async (
        keyType: ConfigKeyType,
        value: string | number | null | boolean,
    ) => {
        setDomainConfig({ ...domainConfig, [keyType]: value });
        localStorage.setItem(
            'domain_config',
            JSON.stringify({ ...domainConfig, [keyType]: value }),
        );
        await sendMessage('domain-config', { ...domainConfig, [keyType]: value }, 'background');
    };
    const showConfig = localStorage.getItem('domain_config')
        ? JSON.parse(localStorage.getItem('domain_config') as string).open
        : false;
    const extraHandle = async () => {
        if (showConfig) {
            await sendMessage('domain-config', { ...domainConfig }, 'background');
            return;
        }
        const currentTabs = await chrome.tabs.query({ currentWindow: true });
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
        } else {
            message.error('没有需要取消分组的标签页');
        }
    };
    return (
        <div className="config-wrapper">
            <div className="rule">
                <h4>合并规则：</h4>
                <div className="rule-content">
                    <div className="enable-rule">
                        <div>
                            <Switch
                                size="small"
                                checkedChildren="开启"
                                unCheckedChildren="关闭"
                                checked={domainConfig.open}
                                onChange={(checked) => onChangeConfigItem('open', checked)}
                                className="switch"
                            />{' '}
                            <span>域名匹配</span>
                        </div>
                        <div className="extra-btn">
                            <Button
                                type="primary"
                                className={domainConfig.open ? '' : 'warning-btn'}
                                size="small"
                                onClick={extraHandle}
                            >
                                一键{domainConfig.open ? '整理' : '解散'}分组
                            </Button>
                        </div>
                    </div>
                    {showConfig ? (
                        <div className="rule-item-wrapper">
                            <div className="rule-item">
                                <div className="label">默认匹配范围：</div>
                                <TabSelectRange
                                    value={domainConfig.selectedRange}
                                    onChange={(v) => onChangeConfigItem('selectedRange', v)}
                                />
                            </div>
                            <div className="rule-item">
                                <div className="label">分组标签页的最低数量：</div>
                                <TabLeastNumber
                                    value={domainConfig.leastNumber}
                                    onChange={(v) => onChangeConfigItem('leastNumber', v)}
                                />
                            </div>
                            <div className="rule-item">
                                <div className="label">域名匹配等级：</div>
                                <TabMatchLevel
                                    value={domainConfig.matchLevel}
                                    onChange={(v) => onChangeConfigItem('matchLevel', v)}
                                />
                            </div>
                            <div className="rule-item">
                                <div className="label">是否展开全部分组：</div>
                                <Switch
                                    size="small"
                                    checkedChildren="是"
                                    unCheckedChildren="否"
                                    checked={domainConfig.openAllGroup}
                                    onChange={(checked) =>
                                        onChangeConfigItem('openAllGroup', checked)
                                    }
                                    className="switch"
                                />
                            </div>
                            {/* <div className='rule-item'>
                            <div className='label'>排除域名：</div>
                            <div className='item'>col-62</div>
                        </div> */}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
