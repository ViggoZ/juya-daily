const REPO_API = "https://api.github.com/repos/imjuya/juya-ai-daily";
const RAW_BASE =
  "https://raw.githubusercontent.com/imjuya/juya-ai-daily/master/BACKUP";

export interface DailyEntry {
  id: number;
  date: string;
  filename: string;
}

export async function fetchDailyList(): Promise<DailyEntry[]> {
  const res = await fetch(`${REPO_API}/contents/BACKUP`);
  if (!res.ok) throw new Error("Failed to fetch daily list");
  const files: { name: string }[] = await res.json();

  const entries: DailyEntry[] = files
    .filter((f) => /^\d+_\d{4}-\d{2}-\d{2}\.md$/.test(f.name))
    .map((f) => {
      const match = f.name.match(/^(\d+)_(\d{4}-\d{2}-\d{2})\.md$/);
      return {
        id: parseInt(match![1], 10),
        date: match![2],
        filename: f.name,
      };
    })
    .sort((a, b) => b.id - a.id);

  return entries;
}

export async function fetchDailyContent(filename: string): Promise<string> {
  const res = await fetch(`${RAW_BASE}/${filename}`);
  if (!res.ok) throw new Error("Failed to fetch content");
  return res.text();
}

/** Parse overview section into categories */
export interface OverviewItem {
  text: string;
  link?: string;
  tag?: string;
}

export interface OverviewCategory {
  name: string;
  items: OverviewItem[];
}

export interface ParsedDaily {
  date: string;
  coverImage?: string;
  title: string;
  videoLinks: { name: string; url: string }[];
  overview: OverviewCategory[];
  contentAfterOverview: string;
}

export function parseMarkdown(md: string): ParsedDaily {
  const lines = md.split("\n");
  let date = "";
  let coverImage: string | undefined;
  let title = "";
  const videoLinks: { name: string; url: string }[] = [];
  const overview: OverviewCategory[] = [];
  let contentStart = 0;

  // Extract date from first line
  const dateMatch = lines[0]?.match(/\[(\d{4}-\d{2}-\d{2})\]/);
  if (dateMatch) date = dateMatch[1];

  // Find cover image
  for (let i = 1; i < Math.min(lines.length, 8); i++) {
    const imgMatch = lines[i].match(/^!\[\]\((.+)\)$/);
    if (imgMatch) {
      coverImage = imgMatch[1];
      break;
    }
  }

  // Find title
  for (let i = 1; i < Math.min(lines.length, 10); i++) {
    const titleMatch = lines[i].match(/^# (.+)/);
    if (titleMatch && !titleMatch[1].startsWith("[")) {
      title = titleMatch[1];
      break;
    }
  }

  // Find video links
  for (let i = 0; i < Math.min(lines.length, 12); i++) {
    const videoMatch = lines[i].match(/\*\*视频版\*\*[：:]\s*(.*)/);
    if (videoMatch) {
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let m;
      while ((m = linkRegex.exec(videoMatch[1])) !== null) {
        videoLinks.push({ name: m[1], url: m[2] });
      }
      break;
    }
  }

  // Parse overview section
  let inOverview = false;
  let currentCategory: OverviewCategory | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("## 概览")) {
      inOverview = true;
      continue;
    }
    if (inOverview && line.startsWith("---")) {
      contentStart = i;
      inOverview = false;
      break;
    }
    if (inOverview && line.startsWith("### ")) {
      if (currentCategory) overview.push(currentCategory);
      currentCategory = { name: line.replace("### ", ""), items: [] };
      continue;
    }
    if (inOverview && currentCategory && line.startsWith("- ")) {
      const itemText = line.replace(/^- /, "");
      const linkMatch = itemText.match(/\[↗\]\(([^)]+)\)/);
      const tagMatch = itemText.match(/`(#\d+)`/);
      currentCategory.items.push({
        text: itemText
          .replace(/\s*\[↗\]\([^)]+\)/, "")
          .replace(/\s*`#\d+`/, ""),
        link: linkMatch?.[1],
        tag: tagMatch?.[1],
      });
    }
  }
  if (currentCategory) overview.push(currentCategory);

  // Get the content after overview (the detailed articles)
  const contentAfterOverview = lines.slice(contentStart).join("\n");

  return { date, coverImage, title, videoLinks, overview, contentAfterOverview };
}
