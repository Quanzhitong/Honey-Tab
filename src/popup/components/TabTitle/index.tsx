import { DeleteFilled } from '@ant-design/icons';

import type { TabTitleProps } from '@/popup/type';

import './style.scss';

const TabTitle = (props: TabTitleProps) => {
    const { title, tabId, callBack } = props;
    const handleClick = () => {
        if (tabId) {
            chrome.tabs.remove(tabId);
        }
        callBack((v) => v + 1);
    };
    return (
        <div title={title} className={'tab-title'}>
            <span className={'title-text'}>{title}</span>
            <span className={'right-operator'}>
                <DeleteFilled
                    rev={undefined}
                    style={{
                        color: '#4784ff',
                    }}
                    onClick={handleClick}
                />
            </span>
        </div>
    );
};

export default TabTitle;
