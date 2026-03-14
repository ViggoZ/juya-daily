"use client";

import { ThemeToggle } from "./ThemeToggle";

interface Props {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ sidebarOpen, onToggleSidebar }: Props) {
  return (
    <header className="site-header sticky top-0 z-50 shrink-0">
      <div className="px-5 h-14 flex items-center">
        {/* Left: sidebar toggle + brand */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="sidebar-toggle w-8 h-8 flex items-center justify-center rounded-lg hover:opacity-80 active:scale-95 shrink-0"
            style={{ color: "var(--fg-muted)" }}
            aria-label={sidebarOpen ? "收起侧栏" : "展开侧栏"}
          >
            {sidebarOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <polyline points="14 9 11 12 14 15" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <polyline points="13 9 16 12 13 15" />
              </svg>
            )}
          </button>
          <a href="/juya-daily" className="flex items-center gap-2 no-underline">
            <span className="site-brand text-lg font-bold tracking-tight">
              橘鸦 AI 日报
            </span>
            <span className="site-badge text-xs font-medium px-1.5 py-0.5">
              DAILY
            </span>
          </a>
        </div>
        {/* Right: github + theme */}
        <div className="flex items-center gap-3 ml-auto">
          <a
            href="https://github.com/imjuya/juya-ai-daily"
            target="_blank"
            rel="noopener noreferrer"
            className="site-github-link hover:opacity-70"
            aria-label="GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
