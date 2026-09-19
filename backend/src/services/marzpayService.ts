import crypto from "crypto";
import { env } from "../config/env.js";

/**
 * Format any phone number into E.164 standard for Uganda / East Africa.
 * e.g., "0705748774" -> "+256705748774"
 *       "256705748774" -> "+256705748774"
 *       "+256705748774" -> "+256705748774"
 */
export function formatPhoneNumber(phone: string, defaultCountryCode: string = "256"): string {
  if (!phone) return "";
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");

  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  if (cleaned.startsWith("0")) {
    return `+${defaultCountryCode}${cleaned.substring(1)}`;
  }

  if (cleaned.startsWith(defaultCountryCode)) {
    return `+${cleaned}`;
  }

  return `+${defaultCountryCode}${cleaned}`;
}

export interface MarzPayCollectionRequest {
  amount: number;
  phoneNumber: string;
  reference: string; // UUID v4
  country?: string; // Default 'UG'
  currency?: string; // Default 'UGX'
  description?: string;
  callbackUrl?: string;
  metadata?: Array<Record<string, any>>;
}

export interface MarzPayCardRequest {
  amount: number;
  reference: string; // UUID v4
  country?: string; // Default 'UG'
  currency?: string; // Default 'UGX'
  description?: string;
  callbackUrl?: string;
  metadata?: Array<Record<string, any>>;
}

export interface MarzPayCollectionResult {
  success: boolean;
  uuid: string;
  reference: string;
  status: "processing" | "completed" | "failed" | "cancelled" | "pending" | "sandbox";
  provider?: string;
  providerTransactionId?: string;
  redirectUrl?: string;
  message?: string;
  isSandbox?: boolean;
  raw?: any;
}

/**
 * Helper to make authenticated requests to MarzPay Merchant API
 */
async function callMarzPayApi(endpoint: string, method: string = "GET", body?: any): Promise<any> {
  const base = env.MARZPAY_API_BASE.replace(/\/+$/, "");
  const url = `${base}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const authString = Buffer.from(`${env.MARZPAY_API_KEY}:${env.MARZPAY_API_SECRET}`).toString("base64");

  const headers: Record<string, string> = {
    Authorization: `Basic ${authString}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = (await response.json().catch(() => null)) as any;

  if (!response.ok) {
    const errorMsg = data?.message || `MarzPay API request failed with status ${response.status}`;
    console.error(`[MarzPay API Error] ${method} ${url}:`, errorMsg, data);
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Initiate a Mobile Money Collection (push PIN prompt to MTN or Airtel customer handset)
 */
export async function collectMobileMoney(
  params: MarzPayCollectionRequest
): Promise<MarzPayCollectionResult> {
  const formattedPhone = formatPhoneNumber(params.phoneNumber);
  const isConfigured = Boolean(env.MARZPAY_API_KEY && env.MARZPAY_API_SECRET);

  // If no API keys or in Sandbox test mode without credentials, gracefully simulate
  if (!isConfigured) {
    console.info(
      `[MarzPay SANDBOX Mock] Initiating Mobile Money collection for ${formattedPhone}, amount: ${params.amount} UGX, ref: ${params.reference}`
    );
    return {
      success: true,
      uuid: `mock-uuid-${params.reference}`,
      reference: params.reference,
      status: "processing",
      provider: formattedPhone.startsWith("+25675") || formattedPhone.startsWith("+25670") ? "airtel" : "mtn",
      message: "Collection initiated successfully (Sandbox Mode). Check handset for PIN prompt.",
      isSandbox: true,
      raw: {
        sandbox: true,
        notice: "Mock response generated because MarzPay credentials are not configured in .env",
      },
    };
  }

  const payload: Record<string, any> = {
    amount: Math.round(params.amount),
    phone_number: formattedPhone,
    reference: params.reference,
    country: params.country || "UG",
    description: params.description || `Order payment`,
    callback_url: params.callbackUrl || env.MARZPAY_CALLBACK_URL || undefined,
  };

  if (params.currency && params.country === "CD") {
    payload.currency = params.currency;
  }

  if (params.metadata && Array.isArray(params.metadata)) {
    payload.metadata = params.metadata;
  }

  const apiRes = await callMarzPayApi("/collect-money", "POST", payload);

  const tx = apiRes.data?.transaction || {};
  const coll = apiRes.data?.collection || {};
  const isSandbox = env.MARZPAY_MODE === "sandbox" || apiRes.data?.metadata?.sandbox_mode === true;

  return {
    success: true,
    uuid: tx.uuid || params.reference,
    reference: tx.reference || params.reference,
    status: (tx.status as any) || "processing",
    provider: coll.provider,
    providerTransactionId: coll.provider_transaction_id || undefined,
    message: apiRes.message || "Collection initiated successfully.",
    isSandbox,
    raw: apiRes,
  };
}

/**
 * Initiate a Card Payment Collection (returns redirect URL for 3D-Secure web checkout)
 */
export async function collectCard(
  params: MarzPayCardRequest
): Promise<MarzPayCollectionResult> {
  const isConfigured = Boolean(env.MARZPAY_API_KEY && env.MARZPAY_API_SECRET);

  if (!isConfigured) {
    console.info(
      `[MarzPay SANDBOX Mock] Initiating Card collection for amount: ${params.amount} UGX, ref: ${params.reference}`
    );
    return {
      success: true,
      uuid: `mock-uuid-${params.reference}`,
      reference: params.reference,
      status: "pending",
      redirectUrl: `https://wallet.wearemarz.com/pay/card-gateway?reference=${params.reference}&sandbox=true`,
      message: "Card collection initiated. Redirect the customer to redirect_url (Sandbox Mode).",
      isSandbox: true,
    };
  }

  const payload: Record<string, any> = {
    amount: Math.round(params.amount),
    method: "card",
    reference: params.reference,
    country: params.country || "UG",
    description: params.description || `Card order payment`,
    callback_url: params.callbackUrl || env.MARZPAY_CALLBACK_URL || undefined,
  };

  if (params.metadata && Array.isArray(params.metadata)) {
    payload.metadata = params.metadata;
  }

  const apiRes = await callMarzPayApi("/collect-money", "POST", payload);

  const tx = apiRes.data?.transaction || {};
  const redirectUrl = apiRes.data?.redirect_url;
  const isSandbox = env.MARZPAY_MODE === "sandbox" || apiRes.data?.metadata?.sandbox_mode === true;

  return {
    success: true,
    uuid: tx.uuid || params.reference,
    reference: tx.reference || params.reference,
    status: (tx.status as any) || "pending",
    redirectUrl,
    message: apiRes.message || "Card collection initiated.",
    isSandbox,
    raw: apiRes,
  };
}

/**
 * Check collection status by MarzPay transaction UUID
 */
export async function getCollectionStatus(uuid: string): Promise<{
  status: "completed" | "processing" | "failed" | "cancelled" | "pending";
  providerTxId?: string;
  provider?: string;
  amount?: number;
  currency?: string;
  raw?: any;
}> {
  const isConfigured = Boolean(env.MARZPAY_API_KEY && env.MARZPAY_API_SECRET);

  if (!isConfigured || uuid.startsWith("mock-uuid-")) {
    // In local development mock sandbox mode, transactions auto-approve on polling check
    return {
      status: "completed",
      providerTxId: `MOCK-TX-${Date.now()}`,
      provider: "mtn",
      raw: { sandbox: true },
    };
  }

  try {
    const apiRes = await callMarzPayApi(`/collect-money/${uuid}`, "GET");
    
    // Status can be in data.transaction or root of callback shape
    const tx = apiRes.data?.transaction || apiRes.transaction || {};
    const coll = apiRes.data?.collection || apiRes.collection || {};
    const rawStatus = (tx.status || apiRes.status || "").toLowerCase();

    let normalizedStatus: "completed" | "processing" | "failed" | "cancelled" | "pending" = "processing";
    if (rawStatus === "completed" || rawStatus === "success" || rawStatus === "successful") {
      normalizedStatus = "completed";
    } else if (rawStatus === "failed" || rawStatus === "error") {
      normalizedStatus = "failed";
    } else if (rawStatus === "cancelled") {
      normalizedStatus = "cancelled";
    } else if (rawStatus === "pending") {
      normalizedStatus = "pending";
    }

    return {
      status: normalizedStatus,
      providerTxId: coll.provider_transaction_id || undefined,
      provider: coll.provider || undefined,
      amount: coll.amount?.raw || tx.amount?.raw || undefined,
      currency: coll.amount?.currency || tx.amount?.currency || "UGX",
      raw: apiRes,
    };
  } catch (error) {
    console.error(`Error querying MarzPay status for ${uuid}:`, error);
    throw error;
  }
}

/**
 * Verify incoming webhook HMAC signature (if configured)
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader?: string,
  timestampHeader?: string
): boolean {
  if (!env.MARZPAY_WEBHOOK_SECRET) {
    // If no webhook secret is set in environment, allow callback through
    return true;
  }

  if (!signatureHeader) {
    return false;
  }

  // Format can be "t={timestamp},v1={hash}" or direct HMAC hex string
  let signatureToCompare = signatureHeader;
  let timestamp = timestampHeader || "";

  if (signatureHeader.includes("t=") && signatureHeader.includes("v1=")) {
    const parts = signatureHeader.split(",");
    for (const part of parts) {
      if (part.startsWith("t=")) {
        timestamp = part.substring(2);
      } else if (part.startsWith("v1=")) {
        signatureToCompare = part.substring(3);
      }
    }
  }

  const payloadToSign = timestamp ? `${timestamp}.${rawBody}` : rawBody;
  const computed = crypto
    .createHmac("sha256", env.MARZPAY_WEBHOOK_SECRET)
    .update(payloadToSign)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signatureToCompare, "utf8"),
      Buffer.from(computed, "utf8")
    );
  } catch {
    return false;
  }
}
