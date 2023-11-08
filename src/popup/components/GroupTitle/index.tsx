import { GroupTitleProps } from '@/popup/type';
import './style.scss';

export default function GroupTitle(props: GroupTitleProps) {

    const { data } = props;

    return (
        <div>
            <div className={'groupTitle'} style={{backgroundColor: data.color}}>{data.title}</div>
        </div>
    )
}