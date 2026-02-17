const DEFAULT_COOKIE_NAME = "refp_id";

export function getClickIdFromCookie(
  cookieHeader: string | null | undefined,
  cookieName = DEFAULT_COOKIE_NAME,
): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.split("=");
    if (key?.trim() === cookieName) {
      const value = rest.join("=").trim();
      return value || null;
    }
  }

  return null;
}

export function getClickIdFromRequest(
  req: {
    headers?: Headers | Record<string, string | string[] | undefined>;
    cookies?: Record<string, string>;
  },
  cookieName = DEFAULT_COOKIE_NAME,
): string | null {
  if (req.cookies && cookieName in req.cookies) {
    return req.cookies[cookieName] ?? null;
  }

  if (!req.headers) return null;

  let cookieHeader: string | null = null;

  if (req.headers instanceof Headers) {
    cookieHeader = req.headers.get("cookie");
  } else {
    const raw = req.headers.cookie ?? req.headers.Cookie;
    cookieHeader = typeof raw === "string" ? raw : null;
  }

  return getClickIdFromCookie(cookieHeader, cookieName);
}
