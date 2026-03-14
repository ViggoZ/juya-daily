"use client";

import { useRef, useEffect } from "react";
import { DailyEntry } from "@/lib/github";

interface Props {
  entries: DailyEntry[];
  currentDate?: string;
  onSelect: (entry: DailyEntry) => void;
  open: boolean;
  onClose: () => void;
}

export function DatePicker({
  entries,
  currentDate,
  onSelect,
  open,
  onClose,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  // Scroll active item into view when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const active = panelRef.current?.querySelector(".date-item-active");
        active?.scrollIntoView({ block: "center" });
      }, 50);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="fixed top-12 right-4 z-[60] w-48 max-h-[70vh] overflow-y-auto"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--theme-radius)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        animation: "fadeInUp 0.15s ease-out",
      }}
    >
      <div className="p-1">
        {entries.map((entry) => {
          const isActive = entry.date === currentDate;
          const d = new Date(entry.date + "T00:00:00");
          const weekday = ["日","一","二","三","四","五","六"][d.getDay()];
          const month = d.getMonth() + 1;
          const day = d.getDate();
          return (
            <button
              key={entry.id}
              onClick={() => onSelect(entry)}
              className={`date-item ${isActive ? "date-item-active" : ""}`}
            >
              <span className="date-item-num">
                {month}.{String(day).padStart(2, "0")}
              </span>
              <span className="date-item-wd">周{weekday}</span>
              <span className="date-item-id">#{entry.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
