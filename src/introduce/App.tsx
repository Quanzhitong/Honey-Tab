import step1 from '@/imgs/step1.png';
import step2 from '@/imgs/step2.png';

import './App.scss';

const App = () => (
    <div className="app">
        <div className="title">Honey Tab 首次使用说明</div>
        <div className="section">功能：</div>
        <div className="feature">1、列表展示所有标签页，支持拖动、删除。</div>
        <div className="feature">2、标签页可配置分组规则：</div>
        <div className="sub-feature">2.1 支持设置标签页生效范围</div>
        <div className="sub-feature">2.2 支持设定分组标签页的最低数量</div>
        <div className="sub-feature">2.3 支持设定域名匹配等级</div>
        <div className="sub-feature">2.4 支持设置是否展开全部分组</div>
        <div className="sub-feature">2.5 支持自定义分组名</div>
        <div className="feature">3、支持多个chrome浏览器窗口一键合并</div>
        <div className="section">Tips：</div>
        <div className="tips">1、首次使用可按下面步骤，将插件“钉”在插件栏</div>
        <div className="sub-tips">1.1 点击 chrome 标签栏的“扩展程序”</div>
        <div className="img-step1">
            <img alt="" src={step1} width={100} />
        </div>
        <div className="sub-tips">1.2 找到 Honey Tab，点选后面的 “钉”</div>
        <div className="img-step2">
            <img alt="" src={step2} width={400} />
        </div>
        <div className="tips">2、在插件上右击，可查看帮助文档</div>
        <div className="tips">
            3、在配置管理中，设置好配置之后，日常使用只需三个快捷键，即可轻松管理纷繁复杂的 tab 标签
        </div>
        <div className="tips">4、在浏览器的分组上可以右击更改颜色和标题</div>
    </div>
);

export default App;
