import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';

interface MyTooltipProps {
    title: React.ReactNode;
    style?: React.CSSProperties;
}
export default function MyTooltip(props: MyTooltipProps) {
    const { title, style } = props;
    return (
        <Tooltip title={title}>
            <QuestionCircleOutlined
                rev={undefined}
                style={{ color: '#666666', paddingRight: '5px', ...style }}
            />
        </Tooltip>
    );
}
