import type {
  TrackSaleParams,
  TrackSaleResponse,
  TrackLeadParams,
  TrackLeadResponse,
} from "../types";
import {
  RefportAuthError,
  RefportError,
  RefportNotFoundError,
  RefportRateLimitError,
  RefportValidationError,
} from "../errors";

interface ApiErrorBody {
  error?: { code?: string; message?: string };
}

export class Track {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async sale(params: TrackSaleParams): Promise<TrackSaleResponse> {
    const url = `${this.baseUrl}/api/track/sale`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const body: unknown = await res.json();

    if (!res.ok) {
      const errorBody = body as ApiErrorBody;
      const code = errorBody.error?.code ?? "UNKNOWN";
      const message = errorBody.error?.message ?? "Unknown error";
      this.throwForStatus(res.status, code, message);
    }

    return body as TrackSaleResponse;
  }

  async lead(params: TrackLeadParams): Promise<TrackLeadResponse | null> {
    const url = `${this.baseUrl}/api/track/lead`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const body: unknown = await res.json();

    if (!res.ok) {
      const errorBody = body as ApiErrorBody;
      const code = errorBody.error?.code ?? "UNKNOWN";
      const message = errorBody.error?.message ?? "Unknown error";
      this.throwForStatus(res.status, code, message);
    }

    return body as TrackLeadResponse | null;
  }

  private throwForStatus(
    status: number,
    code: string,
    message: string,
  ): never {
    switch (status) {
      case 400:
        throw new RefportValidationError(message);
      case 401:
        throw new RefportAuthError(message);
      case 404:
        throw new RefportNotFoundError(message);
      case 429:
        throw new RefportRateLimitError(message);
      default:
        throw new RefportError(status, code, message);
    }
  }
}
