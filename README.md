# 郭梓轩 AI 影像作品集

React、Vite 与 TypeScript 构建的个人 AI 视频作品集。

## 本地开发

```bash
pnpm install
pnpm dev
```

## Cloudflare 自动部署

- GitHub `main` 分支保存网站源码、封面与部署配置。
- Cloudflare Workers Builds 连接 GitHub；每次推送 `main` 后自动执行 `pnpm build` 与 `pnpm deploy`。
- 原始视频保存在 Cloudflare R2 的 `guo-zixuan-ai-film-media` 存储桶中，不进入 GitHub 仓库，也不会被重新编码或压缩。
- Worker 通过 `/media/*` 提供原视频并支持 HTTP Range，网站可正常拖动播放进度。

Cloudflare 构建设置：

| 设置 | 值 |
| --- | --- |
| Production branch | `main` |
| Build command | `pnpm build` |
| Deploy command | `pnpm deploy` |
| Root directory | `/` |

首次部署后，通过本机运行视频上传脚本，将 `work/video-library-local.json` 中记录的 20 个原始视频上传到 R2。该本地清单已被 `.gitignore` 排除，不会公开电脑路径。
