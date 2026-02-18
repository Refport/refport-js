import type {
  BetterAuthPlugin,
  GenericEndpointContext,
  User,
} from "better-auth";
import { logger } from "better-auth";
import type { Refport } from "refport";

export interface RefportPluginConfig {
  /**
   * Refport SDK instance
   */
  refport: Refport;
  /**
   * Event name for sign-up leads
   *
   * @default "Sign Up"
   */
  eventName?: string;
  /**
   * Name of the cookie that stores the click ID
   *
   * @default "refp_id"
   */
  cookieName?: string;
  /**
   * Custom lead tracking function — overrides the default `refport.track.lead()` call
   */
  customLeadTrack?: (user: User, ctx: GenericEndpointContext) => Promise<void>;
}

export const refportPlugin = (
  config: RefportPluginConfig,
): BetterAuthPlugin => {
  const { refport, eventName = "Sign Up", cookieName = "refp_id" } = config;

  return {
    id: "refport",
    init: () => {
      return {
        options: {
          databaseHooks: {
            user: {
              create: {
                after: async (user, ctx) => {
                  const clickId = ctx?.getCookie(cookieName);
                  if (!clickId || !ctx) {
                    return;
                  }

                  try {
                    if (config.customLeadTrack) {
                      await config.customLeadTrack(user, ctx);
                    } else {
                      await refport.track.lead({
                        clickId,
                        eventName,
                        customerExternalId: user.id,
                        customerName: user.name,
                        customerEmail: user.email,
                        customerAvatar: user.image ?? undefined,
                      });
                    }
                  } catch (e) {
                    logger.error(
                      e instanceof Error ? e.message : "Failed to track lead",
                    );
                  } finally {
                    ctx.setCookie(cookieName, "", {
                      expires: new Date(0),
                      maxAge: 0,
                    });
                  }
                },
              },
            },
          },
        },
      };
    },
  };
};
