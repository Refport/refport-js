import {
  RefportAuthError,
  RefportError,
  RefportNotFoundError,
  RefportRateLimitError,
  RefportValidationError,
} from "../errors";
import type {
  Result,
  TrackLeadParams,
  TrackLeadResponse,
  TrackSaleParams,
  TrackSaleResponse,
} from "../types";

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

  async sale(params: TrackSaleParams): Promise<Result<TrackSaleResponse>> {
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
      return { data: null, error: this.errorForStatus(body, res.status) };
    }

    return { data: body as TrackSaleResponse, error: null };
  }

  async lead(
    params: TrackLeadParams,
  ): Promise<Result<TrackLeadResponse | null>> {
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
      return { data: null, error: this.errorForStatus(body, res.status) };
    }

    return { data: (body as TrackLeadResponse | null) ?? null, error: null };
  }

  private errorForStatus(body: unknown, status: number): RefportError {
    const errorBody = body as ApiErrorBody;
    const code = errorBody.error?.code ?? "UNKNOWN";
    const message = errorBody.error?.message ?? "Unknown error";

    switch (status) {
      case 400:
        return new RefportValidationError(message);
      case 401:
        return new RefportAuthError(message);
      case 404:
        return new RefportNotFoundError(message);
      case 429:
        return new RefportRateLimitError(message);
      default:
        return new RefportError(status, code, message);
    }
  }
}
