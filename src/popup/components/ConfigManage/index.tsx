import { Button, InputNumber, message, Select, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { sendMessage } from 'webext-bridge';

import { getGroupsIds } from '@/service';
import { getMessage } from '@/utils';

import GroupNamesTable from '../GroupNamesTable';
import type {
    ConfigKeyType,
    ConfigManageProps,
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
        label: getMessage('configManage_value_tab_range_all_tabs'),
        value: 'all',
    },
    {
        label: getMessage('configManage_value_tab_range_only_noGroup_tabs'),
        value: 'noGroup',
    },
];

const domainLevelOptions: { label: string; value: DomainLevelType }[] = [
    {
        label: getMessage('configManage_value_domain_level_all'),
        value: 1,
    },
    {
        label: getMessage('configManage_value_domain_level_two'),
        value: 2,
    },
    {
        label: getMessage('configManage_value_domain_level_three'),
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
    showCustomGroupName: false,
    groupNames: {},
};

export function ConfigManage(props: ConfigManageProps) {
    const { callBack } = props;
    const [domainConfig, setDomainConfig] = useState<DomainConfigType>(initData);
    const onChangeConfigItem = async (
        keyType: ConfigKeyType,
        value: string | number | null | boolean | Record<string, string>,
    ) => {
        const storeState = { ...domainConfig, [keyType]: value };
        setDomainConfig(storeState);
        chrome.storage.local.set({ domain_config: storeState });
        await sendMessage('domain-config', storeState, 'background');
        callBack((v) => v + 1);
    };
    const extraHandle = async () => {
        if (domainConfig.open) {
            await sendMessage('domain-config', { ...domainConfig }, 'background');
            callBack((v) => v + 1);
            return;
        }
        const unGroupIds = await getGroupsIds({ currentWindow: true });
        if (unGroupIds.length > 0) {
            await chrome.tabs.ungroup(unGroupIds);
            callBack((v) => v + 1);
        } else {
            message.error('没有需要取消分组的标签页');
        }
    };

    useEffect(() => {
        chrome.storage.local.get((res) => {
            if (res.domain_config) {
                setDomainConfig(res.domain_config as DomainConfigType);
                return;
            }
            setDomainConfig(initData);
        });
    }, []);

    return (
        <div className="config-wrapper">
            <div className="rule">
                <div className="merge-rule">{getMessage('configManage_title')}：</div>
                <div className="rule-content">
                    <div className="enable-rule">
                        <div>
                            <Switch
                                size="small"
                                checkedChildren={getMessage('configManage_open_btn_text')}
                                unCheckedChildren={getMessage('configManage_close_btn_text')}
                                checked={domainConfig.open}
                                onChange={(checked) => onChangeConfigItem('open', checked)}
                                className="switch"
                            />{' '}
                            <span className="domain-rule">{getMessage('configManage_rule1')}</span>
                        </div>
                        <div className="extra-btn">
                            <Button
                                type="primary"
                                className={domainConfig.open ? '' : 'warning-btn'}
                                size="small"
                                onClick={extraHandle}
                            >
                                {getMessage('configManage_extra_btn_prefix')}
                                {domainConfig.open
                                    ? getMessage('configManage_extra_btn_organize')
                                    : getMessage('configManage_extra_btn_dissolve')}
                                {getMessage('configManage_extra_btn_suffix')}
                            </Button>
                        </div>
                    </div>
                    {domainConfig.open ? (
                        <div className="rule-item-wrapper">
                            <div className="rule-item">
                                <div className="label">
                                    {getMessage('configManage_title_tab_range')}：
                                </div>
                                <TabSelectRange
                                    value={domainConfig.selectedRange}
                                    onChange={(v) => onChangeConfigItem('selectedRange', v)}
                                />
                            </div>
                            <div className="rule-item">
                                <div className="label">
                                    {getMessage('configManage_title_tab_min_num')}：
                                </div>
                                <TabLeastNumber
                                    value={domainConfig.leastNumber}
                                    onChange={(v) => onChangeConfigItem('leastNumber', v)}
                                />
                            </div>
                            <div className="rule-item">
                                <div className="label">
                                    {getMessage('configManage_title_domain_level')}：
                                </div>
                                <TabMatchLevel
                                    value={domainConfig.matchLevel}
                                    onChange={(v) => onChangeConfigItem('matchLevel', v)}
                                />
                            </div>
                            <div className="rule-item">
                                <div className="label">
                                    {getMessage('configManage_title_is_all_open')}：
                                </div>
                                <Switch
                                    size="small"
                                    checkedChildren={getMessage('configManage_value_btn_yes')}
                                    unCheckedChildren={getMessage('configManage_value_btn_no')}
                                    checked={domainConfig.openAllGroup}
                                    onChange={(checked) =>
                                        onChangeConfigItem('openAllGroup', checked)
                                    }
                                    className="switch"
                                />
                            </div>
                            <div className="rule-item">
                                <div className="label">
                                    {getMessage('configManage_title_is_custom_groupName')}：
                                </div>
                                <Switch
                                    size="small"
                                    checkedChildren={getMessage('configManage_value_btn_yes')}
                                    unCheckedChildren={getMessage('configManage_value_btn_no')}
                                    checked={domainConfig.showCustomGroupName}
                                    onChange={(checked) =>
                                        onChangeConfigItem('showCustomGroupName', checked)
                                    }
                                    className="switch"
                                />
                            </div>
                            {domainConfig.showCustomGroupName ? (
                                <GroupNamesTable
                                    groupNames={domainConfig.groupNames}
                                    handleSave={(v) => onChangeConfigItem('groupNames', v)}
                                />
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
