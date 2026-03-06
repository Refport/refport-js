import {
  RefportAuthError,
  RefportError,
  RefportNotFoundError,
  RefportRateLimitError,
  RefportValidationError,
} from "../errors";
import type { CreateEmbedTokenParams, EmbedTokenResponse, Result } from "../types";

export class EmbedTokens {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async create(
    params: CreateEmbedTokenParams,
  ): Promise<Result<EmbedTokenResponse>> {
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
          return { data: null, error: new RefportAuthError(message) };
        case 404:
          return { data: null, error: new RefportNotFoundError(message) };
        case 422:
          return { data: null, error: new RefportValidationError(message) };
        case 429:
          return { data: null, error: new RefportRateLimitError(message) };
        default:
          return {
            data: null,
            error: new RefportError(res.status, code, message),
          };
      }
    }

    if (!body.publicToken || !body.expires) {
      return {
        data: null,
        error: new RefportError(
          res.status,
          "INVALID_RESPONSE",
          "Missing token or expiry in response",
        ),
      };
    }

    return {
      data: {
        publicToken: body.publicToken,
        expires: new Date(body.expires),
      },
      error: null,
    };
  }
}
