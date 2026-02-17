import { getCookie, setCookie, deleteCookie } from "./cookie";
import { getUrlParam, removeUrlParam } from "./url";

import type { RefportTrackingOptions, RefportTrackingResult } from "./types";

const DEFAULTS = {
  cookieName: "refp_id",
  paramName: "refp_id",
  maxAge: 7_776_000, // 90 days
  path: "/",
  sameSite: "Lax" as const,
  cleanUrl: true,
};

export function init(
  options: RefportTrackingOptions = {},
): RefportTrackingResult {
  const config = { ...DEFAULTS, ...options };
  const secure =
    config.secure ??
    (typeof location !== "undefined" && location.protocol === "https:");

  const paramValue = getUrlParam(config.paramName);

  if (paramValue) {
    setCookie(config.cookieName, paramValue, {
      maxAge: config.maxAge,
      path: config.path,
      domain: config.domain,
      sameSite: config.sameSite,
      secure,
    });

    if (config.cleanUrl) {
      removeUrlParam(config.paramName);
    }

    return { tracked: true, clickId: paramValue, source: "url" };
  }

  const cookieValue = getCookie(config.cookieName);
  if (cookieValue) {
    return { tracked: false, clickId: cookieValue, source: "cookie" };
  }

  return { tracked: false, clickId: null, source: null };
}

export function getClickId(cookieName?: string): string | null {
  return getCookie(cookieName ?? DEFAULTS.cookieName);
}

export function reset(
  options: Pick<RefportTrackingOptions, "cookieName" | "path" | "domain"> = {},
): void {
  deleteCookie(options.cookieName ?? DEFAULTS.cookieName, {
    path: options.path ?? DEFAULTS.path,
    domain: options.domain,
  });
}

export type { RefportTrackingOptions, RefportTrackingResult } from "./types";
