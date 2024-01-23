import { Table } from 'antd';

import Qr from '@/imgs/qr.png';
import MyTooltip from '@/popup/components/MyTooltip';

import './App.scss';

const DomainExplain = () => {
    return (
        <MyTooltip
            style={{ width: 340 }}
            title={
                <div>
                    <div>什么是域名？</div>
                    <div>简单说，就是由一串点分隔的表示网络资源的字符，比如：www.baidu.com</div>
                    <br />
                    <div>什么是域名等级？</div>
                    <div>
                        简单说，就是域名的层次结构，比如顶(一)级域名（com）、二级域名（baidu）和三级域名(www)
                    </div>
                </div>
            }
        />
    );
};

const Shortcut = () => {
    const tColumns = [
        {
            title: '功能',
            dataIndex: 'ability',
            key: 'ability',
        },
        {
            title: 'mac用户',
            dataIndex: 'mac',
            key: 'mac',
        },
        {
            title: 'windows用户',
            dataIndex: 'windows',
            key: 'windows',
        },
    ];
    const tData = [
        {
            ability: '一键合并窗口',
            mac: 'command + shift + 键盘右键',
            windows: 'ctrl + shift + 键盘右键',
        },
        {
            ability: '一键整理分组',
            mac: 'command + shift + 键盘上键',
            windows: 'ctrl + shift + 键盘上键',
        },
        {
            ability: '一键解散分组',
            mac: 'command + shift + 键盘下键',
            windows: 'ctrl + shift + 键盘下键',
        },
    ];
    return <Table columns={tColumns} pagination={false} dataSource={tData} />;
};
const App = () => (
    <div className="app">
        <div className="title">Honey Tab 使用说明</div>

        <div className="section-title">一、标签页列表</div>
        <div className="subsection-title">
            1.1、插件打开时会自动整理 tab 标签页顺序，未分组的排在最后边
        </div>
        <div className="subsection-title">
            1.2、新建分组是浏览器默认支持功能（右击标签页，选择’向群组中添加标签页‘）
        </div>
        <div className="section-title">二、配置管理</div>

        <div className="subsection-title">2.1 一键整理功能</div>
        <div className="subsubsection-title">
            1.1 一键整理功能会基于您的域名配置，重新整理所有标签页
        </div>
        <div className="subsubsection-title">
            1.2
            由于一个标签页只能加入一个分组，所以使用一键整理功能后，如果手动创建的分组里的标签满足自动合并的条件，该手动创建的分组会自动取消。
        </div>
        <div className="subsection-title">2.2 标签页生效范围：</div>
        <div className="paragraph">是指使用一键整理功能时，标签页的生效范围。</div>

        <div className="subsection-title">2.3 分组标签页的最低数量：</div>
        <div className="paragraph">
            是指符合匹配条件的标签页的最低数量，如果少于这个数量，则不会被合并。
        </div>
        <div className="subsection-title">
            2.4 域名匹配等级：
            <DomainExplain />
        </div>
        <div className="paragraph">是指执行域名分组时，所匹配的域名等级。</div>

        <div className="subsection-title">2.5 是否展开全部分组：</div>
        <div className="paragraph">是指当用户打开插件时，是否展开所有分组。</div>

        <div className="subsection-title">2.6 最多展开的分组个数</div>
        <div className="subsubsection-title">
            2.6.1 是指当用户打开插件时，同时最多展开的分组个数。
        </div>
        <div className="subsubsection-title">
            2.6.2、设置保持展开的分组个数，初次设置时，会从左到右，按设置数展开。
        </div>
        <div className="section-title">三、一键合并窗口</div>
        <div className="subsection-title">
            当打开多个 chrome 浏览器窗口，可通过此功能一键合并其他所有窗口到当前窗口
        </div>
        <div className="section-title">四、快捷键</div>
        <Shortcut />
        <div className="section-title">五、FAQ</div>
        <div className="subsection-title">
            1、使用键盘快捷键确实比鼠标方便了许多，能不能连键盘都不用？
        </div>
        <div className="answer">
            <span className="first-line">
                能提出这种要求，不得不说是真的懒，不过你可以尝试访问下{' '}
                <a href="http://www.baidu.com/track">www.baidu.com/track</a>，
            </span>
            <span>
                这个页面是不存在的，会请求摄像头权限，允许一下，然后打开控制台（右击空白页面处，点选检查），如果有幸看到
                `start-track`字样，
            </span>
            <span>
                在你的摄像头前2、30 厘米处 “攥拳” 或者 “张开手掌“，就可以隔空操作你的标签页了
            </span>
        </div>
        <div className="tip">温馨提示：</div>
        <div className="tip">
            1、此功能持续使用摄像头计算画面每一帧以捕捉手势，实现人机交互，比较耗内存，请慎用！
        </div>
        <div className="tip">
            2、安全关闭需要两步：首先用快捷键解散下分组，然后关闭当前www.baidu.com/track页面
        </div>
        <div className="tip">
            3、如果意外关闭导致进程没有终止，可查看活动监视器中的(Google Chrome Helper(plugin)),
            手动终止
        </div>

        <div className="section-title">六、其他</div>
        <div className="contact">
            <div className="subsection-title">使用问题或其他需求请联系微信</div>
            <div className="subsection-title">
                或者邮箱 <a href="mailto:emqzt111@163.com">emqzt111@163.com</a>
            </div>
        </div>
        <img src={Qr} alt="" width={150} style={{ paddingLeft: 150 }} />
    </div>
);

export default App;
