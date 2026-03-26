# obsolete-rspack-plugin

[![npm](https://img.shields.io/npm/v/obsolete-rspack-plugin.svg)](https://npmjs.com/package/obsolete-rspack-plugin) [![node](https://img.shields.io/node/v/obsolete-rspack-plugin.svg)](https://nodejs.org) [![licenses](https://img.shields.io/npm/l/obsolete-rspack-plugin.svg)](./LICENSE)

> 本项目基于 [ElemeFE/obsolete-webpack-plugin](https://github.com/ElemeFE/obsolete-webpack-plugin) 的核心功能改造而来，专为 Rspack 1.x 适配。

## 简介

一个 Rspack 插件，在构建时生成一段浏览器端独立脚本，基于 [Browserslist](https://github.com/browserslist/browserslist) 检测浏览器兼容性，并在用户浏览器不满足目标配置时提示升级。

## 环境要求

- Node.js >= 18.0.0
- Rspack ^1.0.0

## 安装

```sh
npm i -D obsolete-rspack-plugin
```

## 基本用法

在 `rspack.config.js` 中引入插件，配合内置的 `HtmlRspackPlugin` 使用：

```js
const { HtmlRspackPlugin } = require('@rspack/core');
const ObsoleteRspackPlugin = require('obsolete-rspack-plugin');

module.exports = {
  // ...
  plugins: [
    new HtmlRspackPlugin(),
    new ObsoleteRspackPlugin()
  ]
};
```

## 配置项

| 名称 | 类型 | 默认值 | 说明 |
| :-: | :-: | :-: | :-- |
| name | string | `'obsolete'` | 生成的 chunk 名称 |
| template | string | `'<div>Your browser is not supported. <button id="obsoleteClose">&times;</button></div>'` | 提示框的 HTML 模板，支持任意文档片段。点击带有 `id="obsoleteClose"` 的节点时提示框会被移除 |
| position | string | `'afterbegin'` | `'afterbegin'` 将模板注入到 `<body>` 开头；`'beforeend'` 注入到 `<body>` 结尾 |
| browsers | string[] | — | 覆盖全局 browserslist 配置，指定目标浏览器列表 |
| promptOnNonTargetBrowser | boolean | `false` | 若为 `true`，当前浏览器不在目标列表中时也会显示提示 |
| promptOnUnknownBrowser | boolean | `true` | 若为 `true`，无法识别的浏览器 UA 会显示提示 |

## 示例

```js
const { HtmlRspackPlugin } = require('@rspack/core');
const ObsoleteRspackPlugin = require('obsolete-rspack-plugin');

module.exports = {
  plugins: [
    new HtmlRspackPlugin(),
    new ObsoleteRspackPlugin({
      name: 'obsolete',
      position: 'afterbegin',
      browsers: ['chrome > 80', 'firefox > 70'],
      promptOnNonTargetBrowser: false,
      promptOnUnknownBrowser: true,
    })
  ]
};
```

## 浏览器支持

支持所有 Browserslist 查询语法所涵盖的浏览器。

### 桌面端

IE | Edge | Chrome | Safari | Firefox | Opera | Electron
:-: | :-: | :-: | :-: | :-: | :-: | :-:
✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓

### 移动端

ChromeAndroid | Android WebView (5+) | iOS Safari
:-: | :-: | :-:
✓ | ✓ | ✓

## 常见问题

**Q: 支持 Yandex、UC、QQ 等浏览器吗？**

A: 支持。对于基于主流内核的浏览器（如基于 Chromium 的 Yandex、基于 WebKit 的 UC），插件会将其映射到对应的内核版本进行判断。

**Q: 插件能在 IE 6 上运行吗？**

A: 支持。`obsolete-web` 库会被编译并 shim 到支持完整 ES3 规范的目标环境。

## License

MIT
