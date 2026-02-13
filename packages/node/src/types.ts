export interface RefportConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface CreateEmbedTokenParams {
  programId: string;
  tenantId?: string;
  referralId?: string;
  partner?: {
    email: string;
    name?: string;
  };
}

export interface EmbedTokenResponse {
  publicToken: string;
  expires: Date;
}

export interface TrackSaleParams {
  clickId: string;
  customerExternalId: string;
  amount: number;
  currency?: string;
  eventName?: string;
  invoiceId?: string;
  paymentProcessor?:
    | "stripe"
    | "shopify"
    | "polar"
    | "paddle"
    | "revenuecat"
    | "custom";
  customerEmail?: string;
  customerName?: string;
  customerAvatar?: string;
  metadata?: Record<string, unknown>;
}

export interface TrackSaleResponse {
  eventName: string;
  customer: {
    externalId: string;
    email: string;
    name: string | null;
  };
  sale: {
    id: string;
    amount: number;
    currency: string;
    commissionAmount: number;
    status: string;
    invoiceId: string | null;
    paymentProcessor: string;
  };
}

export interface TrackLeadParams {
  clickId: string;
  eventName: string;
  customerExternalId: string;
  customerEmail?: string;
  customerName?: string;
  customerAvatar?: string;
  metadata?: Record<string, unknown>;
}

export interface TrackLeadResponse {
  eventName: string;
  click: { id: string };
  link: {
    id: string;
    domain: string;
    key: string;
    url: string;
    programId: string | null;
  };
  customer: {
    externalId: string;
    email: string;
    name: string | null;
  };
}
