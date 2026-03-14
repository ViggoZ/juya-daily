"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="data-theme"
      defaultTheme="editorial"
      themes={["editorial", "ink", "cyber", "botanical", "dune", "blueprint"]}
      enableSystem={false}
    >
      {children}
    </NextThemeProvider>
  );
}
