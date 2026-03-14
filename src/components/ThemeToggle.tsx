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

  if (!mounted) return <div className="w-9 h-9" />;

  const current = themes.find((t) => t.id === theme) || themes[0];

  const handleSelect = (t: ThemeConfig) => {
    setTheme(t.id);
    setOpen(false);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:scale-110"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-strong)",
        }}
        aria-label="切换主题"
      >
        {/* 3-dot color swatch */}
        <div className="flex gap-0.5">
          <div className="w-2 h-2 rounded-full" style={{ background: current.previewColors.accent }} />
          <div className="w-2 h-2 rounded-full" style={{ background: current.previewColors.fg, opacity: 0.5 }} />
          <div className="w-2 h-2 rounded-full" style={{ background: current.previewColors.accent, opacity: 0.3 }} />
        </div>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-50 w-72 overflow-hidden shadow-2xl theme-panel"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--theme-radius)",
            animation: "fadeInUp 0.2s ease-out",
          }}
        >
          <div
            className="px-4 py-3 text-xs font-semibold uppercase tracking-widest border-b"
            style={{
              color: "var(--fg-muted)",
              borderColor: "var(--border)",
              fontFamily: "var(--theme-font-display)",
            }}
          >
            选择主题
          </div>
          <div className="p-2 grid grid-cols-2 gap-1.5">
            {themes.map((t) => {
              const isActive = t.id === current.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t)}
                  className="text-left p-2.5 rounded-lg overflow-hidden group"
                  style={{
                    background: isActive ? "var(--accent-soft)" : "transparent",
                    border: isActive ? "1.5px solid var(--accent)" : "1.5px solid transparent",
                  }}
                >
                  {/* Mini preview */}
                  <div
                    className="w-full h-10 rounded-md mb-2 flex items-end p-1.5 gap-1"
                    style={{
                      background: t.previewColors.bg,
                      border: `1px solid ${t.previewColors.accent}20`,
                    }}
                  >
                    <div className="w-full flex flex-col gap-0.5">
                      <div className="h-1 rounded-full" style={{ background: t.previewColors.accent, width: "60%" }} />
                      <div className="h-0.5 rounded-full" style={{ background: t.previewColors.fg, opacity: 0.2, width: "80%" }} />
                      <div className="h-0.5 rounded-full" style={{ background: t.previewColors.fg, opacity: 0.15, width: "50%" }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: isActive ? "var(--accent)" : "var(--fg)" }}
                    >
                      {t.name}
                    </span>
                    <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
                      {t.nameEn}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
