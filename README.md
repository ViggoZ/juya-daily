# Juya AI Daily Reader

[橘鸦 AI 日报](https://github.com/imjuya/juya-ai-daily) 的多主题阅读前端，提供更舒适的日报阅读体验。

**在线地址：** https://viggoz.github.io/juya-daily/

## 功能

- **实时内容** — 通过 GitHub API 直接读取原仓库的 Markdown 文件，无需同步，原仓库更新后刷新即可看到
- **6 套主题** — 经典 / 极简 / 沙丘 / 蓝图 / 墨夜 / 霓虹，每套主题有独立的排版风格
- **日历选择** — 弹窗日历切换往期日报
- **文章目录** — 浮动按钮快速跳转到任意文章
- **阅读进度** — 顶部进度条实时显示阅读位置
- **标题追踪** — 滚动时顶部显示当前阅读的文章标题
- **移动端适配** — 响应式布局，移动端完整可用

## 主题

| 主题 | 风格 |
|------|------|
| 经典 Editorial | 温暖纸张色调，Playfair Display 衬线标题 |
| 极简 Mono | 纯黑白，系统字体，零装饰 |
| 沙丘 Dune | 沙漠金棕，DM Sans 几何无衬线 |
| 蓝图 Blueprint | 工程蓝白，IBM Plex 等宽标题 |
| 墨夜 Ink | 深色模式，大字号宽行距 |
| 霓虹 Cyber | 赛博终端，等宽字体，霓虹色 |

## 技术栈

- Next.js 16 (静态导出)
- React 19
- Tailwind CSS 4
- react-markdown + remark-gfm
- next-themes
- GitHub Pages 部署

## 本地开发

```bash
npm install
npm run dev
# 打开 http://localhost:3000/juya-daily
```

## 构建部署

```bash
npm run build
# 静态文件输出到 out/ 目录
```

推送到 GitHub 后，GitHub Actions 自动构建部署到 Pages。

## 数据来源

所有日报内容来自 [imjuya/juya-ai-daily](https://github.com/imjuya/juya-ai-daily)，通过 GitHub API 实时获取，本项目不存储任何内容数据。

## License

ISC
