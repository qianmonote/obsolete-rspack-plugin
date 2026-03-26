# obsolete-rspack-plugin

一个 Rspack 构建插件，基于 [Browserslist](https://github.com/browserslist/browserslist) 在浏览器端检测兼容性，当用户使用的浏览器不满足目标配置时，自动在页面中展示升级提示条。

> 基于 [ElemeFE/obsolete-webpack-plugin](https://github.com/ElemeFE/obsolete-webpack-plugin) 改造，适配 Rspack 1.x。

## 目录

- [环境要求](#环境要求)
- [安装](#安装)
- [快速开始](#快速开始)
- [配置项](#配置项)
- [用法示例](#用法示例)
  - [1. 零配置（默认）](#1-零配置默认)
  - [2. 指定浏览器检测目标](#2-指定浏览器检测目标)
  - [3. 设置提示条层级 (zIndex)](#3-设置提示条层级-zindex)
  - [4. 通过容器选项控制样式](#4-通过容器选项控制样式)
  - [5. 自动消失](#5-自动消失)
  - [6. 允许手动关闭](#6-允许手动关闭)
  - [7. 手动关闭 + 自动消失组合](#7-手动关闭--自动消失组合)
  - [8. 提示条放在页面底部](#8-提示条放在页面底部)
  - [9. 完全自定义 HTML 模板](#9-完全自定义-html-模板)
  - [10. 非目标浏览器也提示](#10-非目标浏览器也提示)
- [运行 Demo](#运行-demo)
- [工作原理](#工作原理)
- [常见问题](#常见问题)
- [浏览器支持](#浏览器支持)
- [License](#license)

## 环境要求

- Node.js >= 18.0.0
- @rspack/core ^1.0.0

## 安装

```sh
npm i -D obsolete-rspack-plugin
```

## 快速开始

在 `rspack.config.js` 中引入插件，配合内置的 `HtmlRspackPlugin` 使用：

```js
const { HtmlRspackPlugin } = require('@rspack/core');
const ObsoleteRspackPlugin = require('obsolete-rspack-plugin');

module.exports = {
  plugins: [
    new HtmlRspackPlugin(),
    new ObsoleteRspackPlugin(),
  ],
};
```

当用户浏览器不满足项目 `browserslist` 配置时，页面顶部会自动出现一条提示。

## 配置项

| 名称 | 类型 | 默认值 | 说明 |
| :-- | :-: | :-: | :-- |
| `name` | `string` | `'obsolete'` | 生成的资源文件名中的 `[name]` 占位符 |
| `template` | `string` | 见下方 | 提示条的 HTML 模板，支持任意文档片段（`<style>` + `<div>` + `<script>` 均可）。点击 `id="obsoleteClose"` 的节点时提示条会被移除 |
| `position` | `string` | `'afterbegin'` | 提示条在 `<body>` 中的插入位置：`'afterbegin'` 插到开头，`'beforeend'` 插到末尾 |
| `browsers` | `string[]` | — | 覆盖项目根目录的 browserslist 配置，指定目标浏览器，如 `['chrome >= 90', 'firefox >= 80']` |
| `promptOnNonTargetBrowser` | `boolean` | `false` | 当前浏览器不在目标列表中时是否也显示提示（如目标只有 `ie > 8`，Chrome 默认不提示） |
| `promptOnUnknownBrowser` | `boolean` | `true` | 无法识别的浏览器 UA 是否显示提示 |
| `zIndex` | `number` | — | 提示条容器的 `z-index` 值，设置后自动添加 `position:relative` |
| `containerStyle` | `string` | — | 容器的自定义内联 CSS，如 `'background:#fff3cd;padding:12px'`。与 `zIndex` 自动合并 |
| `containerClass` | `string` | — | 容器的 CSS 类名，支持多个空格分隔，便于外部样式表控制 |
| `autoHide` | `number` | — | 自动关闭延迟（毫秒），到时间后提示条从 DOM 中移除 |
| `closable` | `boolean` | `false` | 默认模板是否显示关闭按钮（`×`）。仅在未自定义 `template` 时生效 |

> **默认 template**（`closable: false` 时）：
> ```html
> <div>Your browser is not supported.</div>
> ```
>
> **默认 template**（`closable: true` 时）：
> ```html
> <div>Your browser is not supported. <button id="obsoleteClose">&times;</button></div>
> ```

## 用法示例

### 1. 零配置（默认）

使用项目 `browserslist` 配置，提示条插入 `<body>` 开头，不可关闭。

```js
new ObsoleteRspackPlugin()
```

### 2. 指定浏览器检测目标

覆盖项目 `browserslist`，只检测指定浏览器版本：

```js
new ObsoleteRspackPlugin({
  browsers: ['chrome >= 120', 'firefox >= 120', 'safari >= 17', 'edge >= 120'],
})
```

### 3. 设置提示条层级 (zIndex)

避免提示条被页面其他高层级元素遮挡：

```js
new ObsoleteRspackPlugin({
  zIndex: 99999,
})
```

生成的容器：

```html
<div id="obsoleteContainer" style="position:relative;z-index:99999">
  <div>Your browser is not supported.</div>
</div>
```

### 4. 通过容器选项控制样式

使用 `containerStyle` 设置背景色、字号等，使用 `containerClass` 挂载 CSS 类名：

```js
new ObsoleteRspackPlugin({
  zIndex: 99999,
  containerStyle: 'background:#fff3cd;color:#856404;padding:12px 20px;font-size:14px;text-align:center;border-bottom:1px solid #ffc107',
  containerClass: 'browser-upgrade-bar',
})
```

生成的容器：

```html
<div id="obsoleteContainer"
     style="position:relative;z-index:99999;background:#fff3cd;color:#856404;padding:12px 20px;font-size:14px;text-align:center;border-bottom:1px solid #ffc107"
     class="browser-upgrade-bar">
  <div>Your browser is not supported.</div>
</div>
```

> `zIndex` 与 `containerStyle` 会自动合并，`zIndex` 的样式在前。

### 5. 自动消失

提示条展示一段时间后自动从 DOM 中移除：

```js
new ObsoleteRspackPlugin({
  autoHide: 8000, // 8 秒后消失
  zIndex: 99999,
  containerStyle: 'background:#d4edda;color:#155724;padding:12px 20px;text-align:center',
})
```

### 6. 允许手动关闭

默认 `closable: false`，不显示关闭按钮。显式设为 `true` 后，默认模板会包含 `×` 按钮：

```js
new ObsoleteRspackPlugin({
  closable: true,
  zIndex: 99999,
})
```

### 7. 手动关闭 + 自动消失组合

用户可以随时点关闭，如果不操作也会在指定时间后自动消失：

```js
new ObsoleteRspackPlugin({
  closable: true,
  autoHide: 10000, // 10 秒后自动消失
  zIndex: 99999,
  containerStyle: 'background:#fff3cd;color:#856404;padding:12px 20px;text-align:center',
})
```

### 8. 提示条放在页面底部

```js
new ObsoleteRspackPlugin({
  position: 'beforeend', // 插入到 <body> 末尾
  containerStyle: 'background:#f8d7da;color:#721c24;padding:16px;text-align:center;position:fixed;bottom:0;left:0;right:0',
  zIndex: 99999,
})
```

### 9. 完全自定义 HTML 模板

传入自定义 `template` 时，`closable` 选项不再生效，关闭按钮需自行在模板中添加 `id="obsoleteClose"`：

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
  .obsolete-banner button:hover { background: rgba(255,255,255,0.3); }
</style>
<div class="obsolete-banner">
  <span>Your browser is outdated. Please upgrade for the best experience.</span>
  <button id="obsoleteClose">Dismiss</button>
</div>
`.replace(/\\n/g, '');

new ObsoleteRspackPlugin({
  template: customTemplate,
  promptOnNonTargetBrowser: true,
})
```

> 自定义 `template` 支持 `<style>`、`<div>`、`<script>` 等任意文档片段。

### 10. 非目标浏览器也提示

默认行为：`browserslist` 设为 `ie > 8` 时，Chrome 等不在列表中的浏览器不会弹提示。设置 `promptOnNonTargetBrowser: true` 后，这些浏览器也会提示：

```js
new ObsoleteRspackPlugin({
  browsers: ['ie >= 11'],
  promptOnNonTargetBrowser: true,  // Chrome、Safari 等也会看到提示
  promptOnUnknownBrowser: true,    // 未知 UA 也提示
})
```

## 运行 Demo

项目内置了 5 个可运行的 demo，分别演示不同配置场景：

```sh
cd packages/obsolete-rspack-plugin
npm install

npm run dev:basic             # 端口 3001 — 零配置，默认行为
npm run dev:custom-template   # 端口 3002 — 完全自定义 HTML 模板
npm run dev:custom-browsers   # 端口 3003 — 指定浏览器版本检测
npm run dev:styled-container  # 端口 3004 — containerStyle + containerClass + zIndex + closable
npm run dev:auto-hide         # 端口 3005 — autoHide 自动消失 + closable: false
```

每个 demo 页面顶部有导航链接，可在各场景间快速切换。

## 工作原理

```
rspack.config.js
  │
  └─ new ObsoleteRspackPlugin(options)
       │
       ├─ compiler.hooks.compilation
       │    │
       │    ├─ processAssets (PROCESS_ASSETS_STAGE_ADDITIONAL)
       │    │    │
       │    │    ├─ 1. buildTemplate()
       │    │    │      根据 closable / zIndex / containerStyle / containerClass / autoHide
       │    │    │      组装最终 HTML 模板，必要时包裹 <div id="obsoleteContainer">
       │    │    │
       │    │    ├─ 2. WebAsset.populate()
       │    │    │      读取 obsolete-web 库源码，拼接 browserslist 检测 + 自调用函数
       │    │    │      如果 autoHide > 0，生成 setTimeout 自动移除逻辑
       │    │    │
       │    │    ├─ 3. WebAsset.hash()
       │    │    │      处理文件名中的 [name] [hash] [chunkhash] 占位符
       │    │    │
       │    │    └─ 4. compilation.emitAsset()
       │    │           输出 obsolete.js 到构建产物
       │    │
       │    └─ HtmlRspackPlugin.beforeEmit
       │         将 <script src="[publicPath]/obsolete.js"> 注入到 HTML 的
       │         <body> 开头或末尾（根据 position 配置）
       │         内置去重：同一 HTML 不会重复注入
       │
       └─ 浏览器运行时
            │
            ├─ 去重守卫：window.__obsolete_prompted__ 防止多次执行
            ├─ new Obsolete(options).test(browsers) 检测浏览器兼容性
            ├─ 不兼容 → 在 <body> 中插入提示条 DOM
            ├─ autoHide → setTimeout 后自动 removeChild
            └─ closable → 点击 #obsoleteClose 移除提示条
```

### 生成的运行时代码结构

```js
// obsolete-web 库代码（检测引擎 + DOM 操作）
// ...

(function() {
  'use strict';
  if (window.__obsolete_prompted__) return;  // 防重复
  window.__obsolete_prompted__ = true;

  // 无 autoHide 时：
  new Obsolete({ /* options */ }).test([ /* browsers */ ]);

  // 有 autoHide 时：
  new Obsolete({ /* options */ }).test([ /* browsers */ ], function() {
    setTimeout(function() {
      var c = document.getElementById('obsoleteContainer');
      if (c) c.parentNode.removeChild(c);
    }, 8000);
  });
})();
```

## 常见问题

**Q: `zIndex` 和 `containerStyle` 同时设置会冲突吗？**

A: 不会。两者自动合并为一个 `style` 属性，`zIndex` 转换的 `position:relative;z-index:N` 在前，`containerStyle` 的值追加在后。如果 `containerStyle` 中也写了 `z-index`，后者会覆盖前者（CSS 特性）。

**Q: `autoHide` 和 `closable` 可以同时用吗？**

A: 可以。用户既可以手动点 `×` 关闭，也会在 `autoHide` 毫秒后自动消失，两者互不影响。

**Q: 自定义 `template` 后 `closable` 还有效吗？**

A: 无效。`closable` 只控制**默认模板**是否带关闭按钮。使用自定义 `template` 时需自行在 HTML 中添加 `id="obsoleteClose"` 的按钮来实现关闭功能。

**Q: 自定义 `template` 后 `containerStyle` / `containerClass` / `zIndex` 还有效吗？**

A: 有效。这些选项控制的是**外层包裹容器**，与 `template` 内容无关。最终结构为 `<div id="obsoleteContainer" style="..." class="...">` 包裹你的 `template`。

**Q: 为什么设了 `autoHide` 但提示条不消失？**

A: `autoHide` 依赖容器 `id="obsoleteContainer"`。如果同时使用了自定义 `template` 但没有设置 `zIndex` / `containerStyle` / `containerClass` 中的任何一个，插件不会生成外层容器，`autoHide` 的 `getElementById` 就找不到目标节点。解决方案：给 `zIndex` 或 `containerStyle` 设一个值即可，或者在自定义 `template` 的根元素上手动添加 `id="obsoleteContainer"`。

**Q: 支持 Yandex、UC、QQ 等浏览器吗？**

A: 支持。基于主流内核的浏览器（如基于 Chromium 的 Yandex、基于 WebKit 的 UC）会被映射到对应内核版本进行判断。例如 `chrome >= 80` 同样适用于 Yandex 浏览器。

**Q: 插件能在 IE 6 上运行吗？**

A: 支持。底层 `obsolete-web` 库编译后兼容完整 ES3 规范的运行环境。

**Q: 页面上出现两条重复提示怎么办？**

A: 插件已内置双重去重保护：构建时检查 HTML 中是否已注入脚本标签，运行时通过 `window.__obsolete_prompted__` 防止重复执行。如果仍然重复，请检查 Rspack 配置中是否有多个 `HtmlRspackPlugin` 实例。

## 浏览器支持

支持所有 Browserslist 查询语法所涵盖的浏览器：

### 桌面端

| IE | Edge | Chrome | Safari | Firefox | Opera | Electron |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### 移动端

| ChromeAndroid | Android WebView (5+) | iOS Safari |
| :-: | :-: | :-: |
| ✓ | ✓ | ✓ |

## License

MIT
