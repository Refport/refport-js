import {
  RefportAuthError,
  RefportError,
  RefportNotFoundError,
  RefportRateLimitError,
  RefportValidationError,
} from "../errors";
import type { CreateEmbedTokenParams, EmbedTokenResponse } from "../types";

export class EmbedTokens {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async create(params: CreateEmbedTokenParams): Promise<EmbedTokenResponse> {
    const url = `${this.baseUrl}/api/embed/token`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const body = (await res.json()) as {
      publicToken?: string;
      expires?: string;
      error?: { code?: string; message?: string };
    };

    if (!res.ok) {
      const code = body.error?.code ?? "UNKNOWN";
      const message = body.error?.message ?? "Unknown error";

      switch (res.status) {
        case 401:
          throw new RefportAuthError(message);
        case 404:
          throw new RefportNotFoundError(message);
        case 422:
          throw new RefportValidationError(message);
        case 429:
          throw new RefportRateLimitError(message);
        default:
          throw new RefportError(res.status, code, message);
      }
    }

    if (!body.publicToken || !body.expires) {
      throw new RefportError(
        res.status,
        "INVALID_RESPONSE",
        "Missing token or expiry in response",
      );
    }

    return {
      publicToken: body.publicToken,
      expires: new Date(body.expires),
    };
  }
}
