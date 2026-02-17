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
