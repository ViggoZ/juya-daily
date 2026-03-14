# GitHub Issue 内容

> 提交到：https://github.com/imjuya/juya-ai-daily/issues/new

---

**标题：** 基于日报内容做了一个多主题阅读前端

**内容：**

---

Hi 橘鸦，

我很喜欢你的 AI 日报内容，每天都在看。觉得原来的阅读界面可以优化一下，就基于你仓库 BACKUP 目录下的 Markdown 文件做了一个阅读前端。

**在线地址：** https://viggoz.github.io/juya-daily/

**源码：** https://github.com/ViggoZ/juya-daily

做了这些：

- 直接通过 GitHub API 读取你每天更新的 MD 文件，不需要额外同步，你更新后读者刷新就能看到
- 6 套阅读主题可以切换（经典 / 极简 / 沙丘 / 蓝图 / 墨夜 / 霓虹）
- 日历弹窗选择往期日报
- 文章目录快速跳转
- 阅读进度条 + 滚动时顶部显示当前文章标题
- 移动端适配
- 纯静态部署在 GitHub Pages，不需要服务器

技术栈是 Next.js + Tailwind CSS + react-markdown，静态导出。

做这个主要是想提升一下日报的阅读体验，内容都是直接从你的仓库实时拉取的，没有任何复制或存储。

如果你觉得有用或者有什么建议，欢迎交流！
