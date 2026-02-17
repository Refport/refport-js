export function getUrlParam(name: string): string | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

export function removeUrlParam(name: string): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.delete(name);
  window.history.replaceState(window.history.state, "", url.toString());
}
