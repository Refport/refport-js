import { memo, useEffect, useRef, useState } from "react";

import type { RefportEmbedProps } from "./types";

const DEFAULT_BASE_URL = "https://app.refport.co";

export const RefportEmbed = memo(function RefportEmbed({
  token,
  theme,
  themeOptions,
  cssVars,
  baseUrl = DEFAULT_BASE_URL,
  onError,
  style,
  ...divProps
}: RefportEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(400);

  useEffect(() => {
    if (!token) return;

    function handleMessage(event: MessageEvent) {
      if (typeof event.data !== "object" || !event.data) return;

      const { event: eventType, data } = event.data as {
        event?: string;
        data?: { height?: number; code?: string; message?: string };
      };

      if (eventType === "PAGE_HEIGHT" && typeof data?.height === "number") {
        setHeight(data.height);
      }

      if (eventType === "ERROR" && data?.code && data.message) {
        onError?.({ code: data.code, message: data.message });
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [token, onError]);

  if (!token) return null;

  const params = new URLSearchParams();
  params.set("token", token);
  params.set("dynamicHeight", "true");
  if (theme) params.set("theme", theme);
  if (themeOptions) params.set("themeOptions", JSON.stringify(themeOptions));
  if (cssVars) params.set("cssVars", JSON.stringify(cssVars));

  const iframeSrc = `${baseUrl}/embed/referrals?${params.toString()}`;

  return (
    <div ref={containerRef} {...divProps} style={{ width: "100%", ...style }}>
      <iframe
        src={iframeSrc}
        style={{
          width: "100%",
          height: `${height}px`,
          border: "none",
        }}
        allow="clipboard-write"
        title="Refport Referral Portal"
      />
    </div>
  );
});
