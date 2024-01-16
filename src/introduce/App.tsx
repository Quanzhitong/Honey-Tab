import step1 from '@/imgs/step1.png';
import step2 from '@/imgs/step2.png';

import './App.scss'; // 引入外部 CSS 文件

const App = () => (
    <div className="app">
        <div className="title">Honey Tab 首次使用说明</div>
        <div className="section">基础功能：</div>
        <div className="feature">1、列表展示所有标签，支持拖动，删除。</div>
        <div className="feature">2、分组规则：</div>
        <div className="sub-feature">2.1 支持设定分组标签页的最低数量</div>
        <div className="sub-feature">2.2 支持按域名分组等级分组</div>
        <div className="sub-feature">2.3 支持设置是否展开全部分组</div>
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
            2、在配置管理中，设置好配置之后，日常使用只需三个快捷键，即可轻松管理纷繁复杂的 tab 标签
        </div>
    </div>
);

export default App;