export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.split("=");
    if (key?.trim() === name) {
      return decodeURIComponent(rest.join("="));
    }
  }

  return null;
}

export function setCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number;
    path?: string;
    domain?: string;
    sameSite?: "Strict" | "Lax" | "None";
    secure?: boolean;
  } = {},
): void {
  if (typeof document === "undefined") return;

  const parts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
  ];

  if (options.maxAge != null) parts.push(`max-age=${options.maxAge}`);
  if (options.path) parts.push(`path=${options.path}`);
  if (options.domain) parts.push(`domain=${options.domain}`);
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.secure) parts.push("Secure");

  document.cookie = parts.join("; ");
}

export function deleteCookie(
  name: string,
  options: { path?: string; domain?: string } = {},
): void {
  if (typeof document === "undefined") return;

  const parts = [`${encodeURIComponent(name)}=`, "max-age=0"];

  if (options.path) parts.push(`path=${options.path}`);
  if (options.domain) parts.push(`domain=${options.domain}`);

  document.cookie = parts.join("; ");
}
