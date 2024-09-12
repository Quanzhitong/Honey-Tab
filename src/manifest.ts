import type { Manifest } from 'webextension-polyfill';

import pkg from '../package.json';
import { __DEV__ } from '../server/utils/constants';

const manifest: Manifest.WebExtensionManifest = {
    name: pkg.displayName,
    version: pkg.version,
    description: pkg.description,
    manifest_version: 3,
    minimum_chrome_version: pkg.browserslist.split(' ')[2],
    permissions: ['tabs', 'tabGroups', 'contextMenus', 'storage', 'videoCapture'],
    content_security_policy: {
        extension_pages: "script-src 'self' http://localhost; object-src 'self';",
    },
    default_locale: 'zh_CN',
    web_accessible_resources: [
        {
            matches: ['<all_urls>'],
            resources: ['icons/*', 'images/*', 'fonts/*'],
        },
    ],
    background: {
        service_worker: 'js/background.js',
    },
    content_scripts: [
        {
            matches: ['https://github.com/*'],
            css: ['css/all.css'],
            js: ['js/all.js', ...(__DEV__ ? [] : ['js/all.js'])],
        },
        {
            matches: ['*://www.baidu.com/track*'],
            css: ['css/track.css'],
            js: ['js/track.js'],
        },
    ],
    action: {
        default_popup: 'popup.html',
        default_icon: {
            '16': 'icons/honey-tab-x16.png',
            '32': 'icons/honey-tab-x32.png',
            '48': 'icons/honey-tab-x48.png',
            '128': 'icons/honey-tab-x128.png',
        },
    },
    // options_ui: {
    //     page: 'options.html',
    //     open_in_tab: true,
    // },
    icons: {
        '16': 'icons/honey-tab-x16.png',
        '32': 'icons/honey-tab-x32.png',
        '48': 'icons/honey-tab-x48.png',
        '128': 'icons/honey-tab-x128.png',
    },
    commands: {
        'merge-windows': {
            suggested_key: {
                windows: 'Ctrl+Shift+Right',
                mac: 'Command+Shift+Right',
            },
            description: '合并多个窗口',
        },
        'create-group': {
            suggested_key: {
                windows: 'Ctrl+Shift+Up',
                mac: 'Command+Shift+Up',
            },
            description: '根据配置创建分组',
        },
        'un-group': {
            suggested_key: {
                windows: 'Ctrl+Shift+Down',
                mac: 'Command+Shift+Down',
            },
            description: '解散所有分组',
        },
    },
};

if (!__DEV__) {
    manifest.content_scripts?.unshift({
        matches: ['<all_urls>'],
        js: ['js/vendor.js'],
    });
}

export default manifest;
