"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ParsedDaily } from "@/lib/github";

interface Props {
  data: ParsedDaily;
  issueId: number;
}

const categoryIcons: Record<string, string> = {
  要闻: "🔥",
  精选: "⭐",
  模型发布: "🧠",
  开发生态: "🛠",
  产品应用: "📱",
  技术与洞察: "🔬",
  行业动态: "📊",
  前瞻与传闻: "🔮",
  其他: "📌",
};

export function ArticleView({ data, issueId }: Props) {
  const d = new Date(data.date + "T00:00:00");
  const weekday = ["日", "一", "二", "三", "四", "五", "六"][d.getDay()];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <article className="max-w-3xl mx-auto px-5 py-8 md:py-12">
      {/* Cyber scanline — hidden by CSS unless data-theme="cyber" */}
      <div className="cyber-scanline" />

      {/* Date hero */}
      <div className="animate-fade-in-up stagger-1">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--fg-muted)" }}
          >
            {monthNames[d.getMonth()]} {d.getFullYear()}
          </span>
          <span
            className="h-px flex-1 divider-line"
          />
          <span
            className="text-xs font-medium px-2 py-0.5 issue-tag"
          >
            第 {issueId} 期
          </span>
        </div>
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-3 hero-title"
        >
          {d.getDate()}
          <span
            className="text-lg md:text-xl font-normal ml-2"
            style={{ color: "var(--fg-muted)" }}
          >
            周{weekday}
          </span>
        </h1>
        <p
          className="text-base mb-6 hero-subtitle"
        >
          {data.title}
        </p>

        {/* Video links */}
        {data.videoLinks.length > 0 && (
          <div className="flex items-center gap-3 mb-8">
            <span
              className="text-xs font-medium"
              style={{ color: "var(--fg-muted)" }}
            >
              视频版
            </span>
            {data.videoLinks.map((v) => (
              <a
                key={v.name}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 transition-all duration-200 hover:scale-105 video-link"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {v.name}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Cover image */}
      {data.coverImage && (
        <div className="animate-fade-in-up stagger-2 mb-10 -mx-5 md:mx-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.coverImage}
            alt={data.title}
            className="w-full cover-image"
          />
        </div>
      )}

      {/* Overview / TOC */}
      {data.overview.length > 0 && (
        <div className="animate-fade-in-up stagger-3 overview-card p-5 md:p-6 mb-10">
          <h2
            className="text-sm font-semibold uppercase tracking-widest mb-4 overview-title"
          >
            今日概览
          </h2>
          <div className="space-y-4">
            {data.overview.map((cat) => (
              <div key={cat.name}>
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                  style={{ color: "var(--accent)" }}
                >
                  <span>{categoryIcons[cat.name] || "📄"}</span>
                  {cat.name}
                  <span
                    className="ml-1 text-xs font-normal px-1.5 py-px category-count"
                  >
                    {cat.items.length}
                  </span>
                </h3>
                <ul className="space-y-1.5">
                  {cat.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      {item.tag && (
                        <span
                          className="shrink-0 text-xs font-mono font-medium mt-0.5 px-1.5 py-px item-tag"
                        >
                          {item.tag}
                        </span>
                      )}
                      <span style={{ color: "var(--fg-light)" }}>
                        {item.text}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 inline-flex"
                            style={{ color: "var(--accent)" }}
                          >
                            ↗
                          </a>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full article content */}
      <div className="animate-fade-in-up stagger-4 article-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {data.contentAfterOverview}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <footer
        className="mt-16 pt-6 border-t text-center text-xs"
        style={{
          borderColor: "var(--border)",
          color: "var(--fg-muted)",
        }}
      >
        <p>
          内容来源：
          <a
            href="https://github.com/imjuya/juya-ai-daily"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)" }}
          >
            橘鸦 AI 日报
          </a>
          {" · "}AI 辅助整理，内容仅供参考
        </p>
      </footer>
    </article>
  );
}
