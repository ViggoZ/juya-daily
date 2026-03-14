export interface ThemeConfig {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  previewColors: {
    bg: string;
    fg: string;
    accent: string;
    card: string;
  };
}

export const themes: ThemeConfig[] = [
  {
    id: "editorial",
    name: "经典",
    nameEn: "Editorial",
    description: "温暖纸张色调，经典杂志阅读",
    previewColors: { bg: "#faf8f5", fg: "#1a1a1a", accent: "#c44b2b", card: "#ffffff" },
  },
  {
    id: "mono",
    name: "极简",
    nameEn: "Mono",
    description: "纯黑白，系统字体，零装饰",
    previewColors: { bg: "#ffffff", fg: "#111111", accent: "#111111", card: "#ffffff" },
  },
  {
    id: "dune",
    name: "沙丘",
    nameEn: "Dune",
    description: "沙漠金棕，温暖几何现代风",
    previewColors: { bg: "#faf6f0", fg: "#3d2e1e", accent: "#c07a28", card: "#ffffff" },
  },
  {
    id: "blueprint",
    name: "蓝图",
    nameEn: "Blueprint",
    description: "工程蓝白，技术文档风格",
    previewColors: { bg: "#f8faff", fg: "#1e293b", accent: "#2563eb", card: "#ffffff" },
  },
  {
    id: "ink",
    name: "墨夜",
    nameEn: "Ink",
    description: "深邃暗色，沉浸夜读体验",
    previewColors: { bg: "#141210", fg: "#e8e4df", accent: "#e8653f", card: "#222019" },
  },
  {
    id: "cyber",
    name: "霓虹",
    nameEn: "Cyber",
    description: "赛博终端，等宽字体高密度",
    previewColors: { bg: "#07080c", fg: "#d0f0ff", accent: "#00e5ff", card: "#10131c" },
  },
];
