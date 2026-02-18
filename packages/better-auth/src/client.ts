import type { BetterAuthClientPlugin } from "better-auth/client";
import type { refportPlugin } from "./index";

export const refportPluginClient = () => {
  return {
    id: "refport",
    $InferServerPlugin: {} as ReturnType<typeof refportPlugin>,
  } satisfies BetterAuthClientPlugin;
};
