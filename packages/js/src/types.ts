export interface RefportTrackingOptions {
  cookieName?: string;
  paramName?: string;
  maxAge?: number;
  path?: string;
  domain?: string;
  sameSite?: "Strict" | "Lax" | "None";
  secure?: boolean;
  cleanUrl?: boolean;
}

export interface RefportTrackingResult {
  tracked: boolean;
  clickId: string | null;
  source: "url" | "cookie" | null;
}

export interface RefportEmbedOptions {
  token: string;
  theme?: "light" | "dark" | "system";
  cssVars?: Record<string, string>;
  baseUrl?: string;
  onError?: (error: { code: string; message: string }) => void;
}

export interface RefportEmbedInstance {
  container: HTMLDivElement;
  iframe: HTMLIFrameElement;
  destroy: () => void;
}
