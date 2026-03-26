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
| :-- | :-: | :-: | :-- |
| name | `string` | `'obsolete'` | 生成的 chunk 名称 |
| template | `string` | 见下方 | 提示框的 HTML 模板，支持任意文档片段。点击带有 `id="obsoleteClose"` 的节点时提示框会被移除 |
| position | `string` | `'afterbegin'` | `'afterbegin'` 将模板注入到 `<body>` 开头；`'beforeend'` 注入到 `<body>` 结尾 |
| browsers | `string[]` | — | 覆盖全局 browserslist 配置，指定目标浏览器列表 |
| promptOnNonTargetBrowser | `boolean` | `false` | 若为 `true`，当前浏览器不在目标列表中时也会显示提示 |
| promptOnUnknownBrowser | `boolean` | `true` | 若为 `true`，无法识别的浏览器 UA 会显示提示 |
| zIndex | `number` | — | 提示条容器的 `z-index` 值，设置后自动添加 `position:relative` |
| containerStyle | `string` | — | 容器的自定义内联 CSS，如 `'background:#fff3cd;padding:12px'`，与 `zIndex` 自动合并 |
| containerClass | `string` | — | 容器的 CSS 类名，便于通过外部样式表控制，如 `'upgrade-bar warning'` |
| autoHide | `number` | — | 自动关闭延迟（毫秒），如 `5000` 表示 5 秒后提示条自动消失 |
| closable | `boolean` | `false` | 默认模板是否显示关闭按钮。仅在未自定义 `template` 时生效 |

> 默认 template：`<div>Your browser is not supported. <button id="obsoleteClose">&times;</button></div>`

## 示例

### 最简用法

```js
new ObsoleteRspackPlugin()
```

### 自定义检测目标

```js
new ObsoleteRspackPlugin({
  browsers: ['chrome >= 120', 'firefox >= 120', 'safari >= 17', 'edge >= 120'],
  promptOnNonTargetBrowser: true,
  promptOnUnknownBrowser: true,
  position: 'beforeend',
})
```

### 自定义样式（通过容器选项）+ 允许关闭

```js
new ObsoleteRspackPlugin({
  zIndex: 99999,
  containerStyle: 'background:#fff3cd;color:#856404;padding:12px 20px;font-size:14px;text-align:center',
  containerClass: 'browser-upgrade-bar',
  closable: true, // 默认 false，显式开启关闭按钮
})
```

### 自动消失

```js
new ObsoleteRspackPlugin({
  autoHide: 8000,  // 8 秒后自动消失
  zIndex: 99999,
  containerStyle: 'background:#d4edda;color:#155724;padding:12px 20px;text-align:center',
})
```

### 仅自动消失（默认不可关闭）

```js
new ObsoleteRspackPlugin({
  // closable 默认 false，无需设置
  autoHide: 10000,
  containerStyle: 'background:#f8d7da;color:#721c24;padding:16px;text-align:center;font-size:15px',
  zIndex: 100000,
})
```

### 完全自定义模板

```js
const customTemplate = `
<style>
  .obsolete-banner {
    position: fixed; top: 0; left: 0; right: 0; z-index: 99999;
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    color: #fff; padding: 16px 24px;
    font-size: 15px; display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  .obsolete-banner button {
    background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4);
    color: #fff; padding: 6px 16px; border-radius: 4px; cursor: pointer;
  }
</style>
<div class="obsolete-banner">
  <span>Your browser is outdated. Please upgrade for the best experience.</span>
  <button id="obsoleteClose">Dismiss</button>
</div>
`.replace(/\n/g, '');

new ObsoleteRspackPlugin({
  template: customTemplate,
  promptOnNonTargetBrowser: true,
})
```

## 运行 Demo

```sh
cd packages/obsolete-rspack-plugin

npm install

# 五个独立 demo，分别演示不同配置场景
npm run dev:basic             # 端口 3001 — 默认配置
npm run dev:custom-template   # 端口 3002 — 自定义 HTML 模板
npm run dev:custom-browsers   # 端口 3003 — 自定义浏览器列表
npm run dev:styled-container  # 端口 3004 — 容器样式 + 类名 + zIndex
npm run dev:auto-hide         # 端口 3005 — 自动消失 + 不可关闭
```

## 浏览器支持

支持所有 Browserslist 查询语法所涵盖的浏览器。

### 桌面端

| IE | Edge | Chrome | Safari | Firefox | Opera | Electron |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### 移动端

| ChromeAndroid | Android WebView (5+) | iOS Safari |
| :-: | :-: | :-: |
| ✓ | ✓ | ✓ |

## 常见问题

**Q: 支持 Yandex、UC、QQ 等浏览器吗？**

A: 支持。对于基于主流内核的浏览器（如基于 Chromium 的 Yandex、基于 WebKit 的 UC），插件会将其映射到对应的内核版本进行判断。

**Q: 插件能在 IE 6 上运行吗？**

A: 支持。`obsolete-web` 库会被编译并 shim 到支持完整 ES3 规范的目标环境。

**Q: `zIndex` 和 `containerStyle` 同时设置会怎样？**

A: 两者会自动合并。`zIndex` 转换为 `position:relative;z-index:N`，然后拼接 `containerStyle` 的值。

**Q: `autoHide` 和 `closable` 可以同时用吗？**

A: 可以。设置 `autoHide: 5000` + `closable: true` 表示用户既可以手动关闭，也会在 5 秒后自动消失。

## License

MIT
