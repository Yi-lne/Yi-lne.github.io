# Yi-lne 的个人网站

个人项目作品集，部署于 GitHub Pages：

**https://yi-lne.github.io/**

## 内容

- 四个嵌入式项目：红外遥控小车、MT3608 升压板、DCDC 升降压电源板、两轮自平衡小车
- 每个项目包含原理图 / PCB / 系统示意与关键指标
- 其他非嵌入式项目以列表形式呈现，不展开
- 图片可点击放大，支持键盘左右切换与查看原图

## 本地预览

直接双击 `index.html`，或在项目目录启动一个静态服务器：

```bash
python -m http.server 8000
```

然后访问 `http://localhost:8000/`。

## 文件结构

```text
.
├─ index.html          # 单页作品集
├─ assets/
│  ├─ style.css        # 样式
│  ├─ script.js        # 图片切换 / 灯箱 / 滚动动效
│  ├─ favicon.svg
│  └─ img/             # 原理图、PCB、系统示意、社交预览图
└─ .nojekyll           # GitHub Pages 跳过 Jekyll
```

## 说明

- 使用原生 HTML / CSS / JavaScript，无构建步骤、无外部依赖。
- 图片来自各项目仓库的 PCB / 原理图导出文件；Balance Car 的原理图由 PDF 渲染为图片。
- 页面按移动端、平板与桌面端做了响应式适配。
