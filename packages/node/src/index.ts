import type { RefportConfig } from "./types";
import { EmbedTokens } from "./resources/embed-tokens";
import { Track } from "./resources/track";

const DEFAULT_BASE_URL = "https://app.refport.co";

export class Refport {
  readonly embedTokens: EmbedTokens;
  readonly track: Track;

  constructor(config: RefportConfig) {
    if (!config.apiKey) {
      throw new Error("Refport API key is required");
    }

    const baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
    this.embedTokens = new EmbedTokens(config.apiKey, baseUrl);
    this.track = new Track(config.apiKey, baseUrl);
  }
}

export type {
  RefportConfig,
  CreateEmbedTokenParams,
  EmbedTokenResponse,
  TrackSaleParams,
  TrackSaleResponse,
  TrackLeadParams,
  TrackLeadResponse,
} from "./types";

export {
  RefportError,
  RefportAuthError,
  RefportNotFoundError,
  RefportValidationError,
  RefportRateLimitError,
} from "./errors";

export {
  getClickIdFromCookie,
  getClickIdFromRequest,
} from "./helpers/cookie";
