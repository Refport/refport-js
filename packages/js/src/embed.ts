import type { RefportEmbedInstance, RefportEmbedOptions } from "./types";

const DEFAULT_BASE_URL = "https://app.refport.co";

export function createEmbed(
  target: HTMLElement,
  options: RefportEmbedOptions,
): RefportEmbedInstance {
  const { token, theme, cssVars, onError, baseUrl = DEFAULT_BASE_URL } = options;

  const params = new URLSearchParams();
  params.set("token", token);
  params.set("dynamicHeight", "true");
  if (theme) params.set("theme", theme);
  if (cssVars) params.set("cssVars", JSON.stringify(cssVars));

  const container = document.createElement("div");
  container.style.width = "100%";

  const iframe = document.createElement("iframe");
  iframe.src = `${baseUrl}/embed/referrals?${params.toString()}`;
  iframe.style.width = "100%";
  iframe.style.height = "400px";
  iframe.style.border = "none";
  iframe.allow = "clipboard-write";
  iframe.title = "Refport Referral Portal";

  container.appendChild(iframe);
  target.appendChild(container);

  function handleMessage(event: MessageEvent) {
    if (typeof event.data !== "object" || !event.data) return;

    const { event: eventType, data } = event.data as {
      event?: string;
      data?: { height?: number; code?: string; message?: string };
    };

    if (eventType === "PAGE_HEIGHT" && typeof data?.height === "number") {
      iframe.style.height = `${data.height}px`;
    }

    if (eventType === "ERROR" && data?.code && data.message) {
      onError?.({ code: data.code, message: data.message });
    }
  }

  window.addEventListener("message", handleMessage);

  function destroy() {
    window.removeEventListener("message", handleMessage);
    container.remove();
  }

  return { container, iframe, destroy };
}
