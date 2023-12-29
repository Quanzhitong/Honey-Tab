import { DeleteFilled } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

import type { TabTitleProps } from '@/popup/type';

import './style.scss';

const TabTitle = (props: TabTitleProps) => {
    const { title, tabId, callBack } = props;
    const handleClick = async () => {
        if (tabId) {
            await chrome.tabs.remove(tabId);
        }
        callBack((v) => v + 1);
    };
    const [showDelete, setShowDelete] = useState(false);
    const tabTitleRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const handleMouseEnter = () => {
            setShowDelete(true);
        };

        const handleMouseLeave = () => {
            setShowDelete(false);
        };

        const tabTitleNode = tabTitleRef.current;

        if (tabTitleNode) {
            const grandparentNode = tabTitleNode.parentElement?.parentElement;
            if (grandparentNode) {
                grandparentNode.addEventListener('mouseenter', handleMouseEnter);
                grandparentNode.addEventListener('mouseleave', handleMouseLeave);
                return () => {
                    grandparentNode.removeEventListener('mouseenter', handleMouseEnter);
                    grandparentNode.removeEventListener('mouseleave', handleMouseLeave);
                };
            }
        }
        return () => {};
    }, [tabTitleRef]);

    return (
        <div ref={tabTitleRef} title={title} className={'tab-title'}>
            <span className={'title-text'}>{title}</span>
            <span className={'right-operator'}>
                {showDelete ? (
                    <DeleteFilled
                        rev={undefined}
                        style={{
                            color: '#4784ff',
                        }}
                        onClick={handleClick}
                    />
                ) : null}
            </span>
        </div>
    );
};

export default TabTitle;
