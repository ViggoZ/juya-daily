"use client";

import { useEffect, useState, RefObject } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface Props {
  mainRef?: RefObject<HTMLElement | null>;
  currentDate: string;
  onCalendarToggle: () => void;
  hasEntries?: boolean;
}

export function Header({ mainRef, currentDate, onCalendarToggle, hasEntries }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = mainRef?.current;
    if (!container) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const max = scrollHeight - clientHeight;
      setProgress(max > 0 ? scrollTop / max : 0);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [mainRef]);

  const hasDate = currentDate && currentDate.length > 0;
  const d = hasDate ? new Date(currentDate + "T00:00:00") : null;

  return (
    <header className="site-header sticky top-0 z-50 shrink-0">
      <div className="px-5 h-12 flex items-center">
        <a href="/juya-daily" className="flex items-center gap-2 no-underline">
          <span className="site-brand text-base font-bold tracking-tight">
            橘鸦 AI 日报
          </span>
        </a>
        <div className="flex items-center gap-2 ml-auto">
          {hasEntries && (
            <button
              onClick={onCalendarToggle}
              className="calendar-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:opacity-80 active:scale-95"
              style={{ background: "var(--tag-bg)", color: "var(--fg)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {d && <span>{d.getMonth() + 1}/{d.getDate()}</span>}
            </button>
          )}
          <a
            href="https://github.com/imjuya/juya-ai-daily"
            target="_blank"
            rel="noopener noreferrer"
            className="site-github-link hover:opacity-70 flex items-center justify-center w-8 h-8"
            aria-label="GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <ThemeToggle />
        </div>
      </div>
      <div className="reading-progress" style={{ transform: `scaleX(${progress})` }} />
    </header>
  );
}
