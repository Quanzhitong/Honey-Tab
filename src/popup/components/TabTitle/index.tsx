import { TabTitleProps } from '@/popup/type';
import { memo } from 'react'
import './style.scss';

const TabTitle = memo((props: TabTitleProps) => {
    const { title } = props;
    return <div className={'tabTitle'}>{title}</div>
})

export default TabTitle