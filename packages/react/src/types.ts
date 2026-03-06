import type { HTMLAttributes } from "react";

export interface RefportEmbedProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onError"> {
  token: string;
  theme?: "light" | "dark" | "system";
  cssVars?: Record<string, string>;
  baseUrl?: string;
  onError?: (error: { code: string; message: string }) => void;
}
