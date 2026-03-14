"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { themes, ThemeConfig } from "@/lib/themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!mounted) return <div className="w-8 h-8" />;

  const current = themes.find((t) => t.id === theme) || themes[0];

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 active:scale-95"
        style={{
          background: current.previewColors.accent,
          boxShadow: `0 0 0 2px var(--bg), 0 0 0 3px ${current.previewColors.accent}40`,
        }}
        aria-label="切换主题"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-50 w-56 overflow-hidden shadow-2xl"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            animation: "fadeInUp 0.15s ease-out",
          }}
        >
          <div className="p-1.5">
            {themes.map((t) => {
              const isActive = t.id === current.id;
              return (
                <button
                  key={t.id}
                  onClick={() => { setTheme(t.id); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left"
                  style={{
                    background: isActive ? "var(--accent-soft)" : "transparent",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full shrink-0"
                    style={{
                      background: t.previewColors.accent,
                      boxShadow: isActive ? `0 0 0 2px var(--bg-card), 0 0 0 3px ${t.previewColors.accent}` : "none",
                    }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: isActive ? "var(--accent)" : "var(--fg)" }}
                  >
                    {t.name}
                  </span>
                  <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
                    {t.nameEn}
                  </span>
                  {isActive && (
                    <svg className="ml-auto shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent)" }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
