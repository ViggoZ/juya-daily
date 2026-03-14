"use client";

import { DailyEntry } from "@/lib/github";

interface Props {
  entries: DailyEntry[];
  currentDate?: string;
  onSelect: (entry: DailyEntry) => void;
  open: boolean;
  onClose: () => void;
}

function groupByMonth(entries: DailyEntry[]) {
  const groups: { label: string; entries: DailyEntry[] }[] = [];
  let current = "";
  for (const entry of entries) {
    const [y, m] = entry.date.split("-");
    const key = `${y}-${m}`;
    if (key !== current) {
      current = key;
      const monthNames = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
      groups.push({ label: `${y} ${monthNames[parseInt(m, 10) - 1]}`, entries: [] });
    }
    groups[groups.length - 1].entries.push(entry);
  }
  return groups;
}

export function DatePicker({
  entries,
  currentDate,
  onSelect,
  open,
  onClose,
}: Props) {
  if (!open) return null;

  const groups = groupByMonth(entries);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="date-picker-modal relative z-10 w-full max-w-xs overflow-hidden"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--theme-radius)",
          animation: "fadeInUp 0.2s ease-out",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--fg)" }}
          >
            选择日期
          </span>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:opacity-70"
            style={{ color: "var(--fg-muted)" }}
            aria-label="关闭"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Calendar body */}
        <div className="p-3 max-h-[60vh] overflow-y-auto">
          {groups.map((group) => (
            <div key={group.label} className="mb-4 last:mb-0">
              <div
                className="text-[0.65rem] font-semibold uppercase tracking-wider mb-2 px-0.5"
                style={{ color: "var(--fg-muted)" }}
              >
                {group.label}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {group.entries.map((entry) => {
                  const isActive = entry.date === currentDate;
                  const d = new Date(entry.date + "T00:00:00");
                  const day = d.getDate();
                  const weekday = ["日","一","二","三","四","五","六"][d.getDay()];
                  return (
                    <button
                      key={entry.id}
                      onClick={() => onSelect(entry)}
                      className={`date-cell ${isActive ? "date-cell-active" : ""}`}
                      title={`${entry.date} 周${weekday} 第${entry.id}期`}
                    >
                      <span className="date-cell-day">{day}</span>
                      <span className="date-cell-wd">{weekday}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
