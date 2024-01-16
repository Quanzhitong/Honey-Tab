import { sendMessage } from 'webext-bridge';

import './style.scss';

// 入参 msgId， data, 发送目的地
sendMessage('hello-from-content-script', 'hello!', 'background');
console.log(`Current page's url must be prefixed with https://github.com`);
