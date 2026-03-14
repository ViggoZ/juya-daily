"use client";

import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ParsedDaily } from "@/lib/github";
import { useState, ReactNode } from "react";

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

/** Extract text content from React children recursively */
function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in node) {
    return extractText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

/** Extract #N tag from heading text */
function extractTag(text: string): { tag: string; clean: string } | null {
  const m = text.match(/`#(\d+)`/);
  if (m) return { tag: m[1], clean: text.replace(/\s*`#\d+`\s*/, "").trim() };
  return null;
}

/** Heading component that auto-generates anchor IDs from #N tags */
function ArticleH2({ children }: { children?: ReactNode }) {
  const text = extractText(children);
  const parsed = extractTag(text);
  const id = parsed ? `article-${parsed.tag}` : undefined;

  return (
    <h2 id={id} className="scroll-mt-20">
      {children}
    </h2>
  );
}

const mdComponents: Components = {
  h2: ({ children }) => <ArticleH2>{children}</ArticleH2>,
};

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/** Collect all overview items with tags for the floating TOC */
function collectTocItems(data: ParsedDaily) {
  const items: { tag: string; text: string }[] = [];
  for (const cat of data.overview) {
    for (const item of cat.items) {
      if (item.tag) {
        items.push({ tag: item.tag.replace("#", ""), text: item.text });
      }
    }
  }
  return items;
}

export function ArticleView({ data, issueId }: Props) {
  const [tocOpen, setTocOpen] = useState(false);
  const d = new Date(data.date + "T00:00:00");
  const weekday = ["日", "一", "二", "三", "四", "五", "六"][d.getDay()];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const tocItems = collectTocItems(data);

  return (
    <article className="max-w-3xl mx-auto px-5 py-8 md:py-12">
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
          <span className="h-px flex-1 divider-line" />
          <span className="text-xs font-medium px-2 py-0.5 issue-tag">
            第 {issueId} 期
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-3 hero-title">
          {d.getDate()}
          <span
            className="text-lg md:text-xl font-normal ml-2"
            style={{ color: "var(--fg-muted)" }}
          >
            周{weekday}
          </span>
        </h1>
        <p className="text-base mb-6 hero-subtitle">{data.title}</p>

        {data.videoLinks.length > 0 && (
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-medium" style={{ color: "var(--fg-muted)" }}>
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
          <img src={data.coverImage} alt={data.title} className="w-full cover-image" />
        </div>
      )}

      {/* Overview / TOC — tags are now clickable anchors */}
      {data.overview.length > 0 && (
        <div className="animate-fade-in-up stagger-3 overview-card p-5 md:p-6 mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-4 overview-title">
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
                  <span className="ml-1 text-xs font-normal px-1.5 py-px category-count">
                    {cat.items.length}
                  </span>
                </h3>
                <ul className="space-y-1.5">
                  {cat.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      {item.tag && (
                        <button
                          onClick={() => scrollToId(`article-${item.tag!.replace("#", "")}`)}
                          className="shrink-0 text-xs font-mono font-medium mt-0.5 px-1.5 py-px item-tag cursor-pointer hover:opacity-80 active:scale-95"
                          title="跳转到此条目"
                        >
                          {item.tag}
                        </button>
                      )}
                      <button
                        onClick={() =>
                          item.tag
                            ? scrollToId(`article-${item.tag.replace("#", "")}`)
                            : undefined
                        }
                        className="text-left cursor-pointer hover:opacity-80"
                        style={{ color: "var(--fg-light)" }}
                      >
                        {item.text}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 inline-flex"
                            style={{ color: "var(--accent)" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            ↗
                          </a>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Article content with anchor-generating h2 */}
      <div className="animate-fade-in-up stagger-4 article-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
          {data.contentAfterOverview}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <footer
        className="mt-16 pt-6 border-t text-center text-xs"
        style={{ borderColor: "var(--border)", color: "var(--fg-muted)" }}
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

      {/* ── Floating TOC button (mobile + desktop) ── */}
      {tocItems.length > 0 && (
        <>
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="toc-fab fixed bottom-6 right-6 z-30 w-12 h-12 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95"
            aria-label="文章目录"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="15" y2="12" />
              <line x1="3" y1="18" x2="18" y2="18" />
            </svg>
          </button>

          {/* TOC panel */}
          {tocOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setTocOpen(false)}
              />
              <div
                className="toc-panel fixed bottom-20 right-6 z-50 w-72 max-h-[60vh] overflow-y-auto shadow-2xl"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--theme-radius)",
                  animation: "fadeInUp 0.2s ease-out",
                }}
              >
                <div
                  className="sticky top-0 px-4 py-3 text-xs font-semibold uppercase tracking-widest border-b"
                  style={{
                    color: "var(--fg-muted)",
                    borderColor: "var(--border)",
                    background: "var(--bg-card)",
                  }}
                >
                  文章目录 · {tocItems.length} 条
                </div>
                <div className="p-2">
                  {tocItems.map((item) => (
                    <button
                      key={item.tag}
                      onClick={() => {
                        scrollToId(`article-${item.tag}`);
                        setTocOpen(false);
                      }}
                      className="toc-item w-full text-left flex items-start gap-2 px-3 py-2 rounded-lg text-sm"
                    >
                      <span
                        className="shrink-0 text-xs font-mono font-medium mt-0.5 px-1.5 py-px item-tag"
                      >
                        #{item.tag}
                      </span>
                      <span
                        className="line-clamp-2"
                        style={{ color: "var(--fg-light)" }}
                      >
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </article>
  );
}
