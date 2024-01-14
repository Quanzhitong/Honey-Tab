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

        <div className="subsection-title">2.2标签页生效范围：</div>
        <div className="paragraph">是指使用一键整理功能时，标签页的生效范围。</div>

        <div className="subsection-title">3、分组标签页的最低数量：</div>
        <div className="paragraph">
            是指符合匹配条件的标签页的最低数量，如果少于这个数量，则不会被合并。
        </div>

        <div className="subsection-title">
            4、域名匹配等级：
            <DomainExplain />
        </div>
        <div className="paragraph">是指执行域名分组时，所匹配的域名等级。</div>

        <div className="subsection-title">5、是否展开全部分组：</div>
        <div className="paragraph">是指当用户打开插件时，是否展开所有分组。</div>

        <div className="subsection-title">6、最多展开的分组个数</div>
        <div className="subsubsection-title">
            6.1 是指当用户打开插件时，同时最多展开的分组个数。
        </div>
        <div className="subsubsection-title">
            6.2、设置保持展开的分组个数，初次设置时，会从左到右，按设置数展开。
        </div>
        <div className="section-title">三、FAQ</div>
        <div className="contact">
            <div className="subsection-title">有问题请联系微信</div>
            <div className="subsection-title">
                或者邮箱 <a href="mailto:emqzt111@163.com">emqzt111@163.com</a>
            </div>
        </div>
        <img src={Qr} alt="" width={150} style={{ paddingLeft: 150 }} />
    </div>
);

export default App;
