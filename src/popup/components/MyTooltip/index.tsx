import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import type { TooltipPlacement } from 'antd/es/tooltip';
import React from 'react';

interface MyTooltipProps {
    title: React.ReactNode;
    style?: React.CSSProperties;
    placement?: TooltipPlacement;
}
export default function MyTooltip(props: MyTooltipProps) {
    const { title, style, placement } = props;
    return (
        <Tooltip title={title} overlayInnerStyle={style} placement={placement}>
            <QuestionCircleOutlined
                rev={undefined}
                style={{ color: '#666666', paddingRight: '5px' }}
            />
        </Tooltip>
    );
}
