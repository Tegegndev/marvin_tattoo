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
  phoneNumber?: string;
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
  status: "processing" | "completed" | "failed" | "cancelled" | "pending";
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
    signal: AbortSignal.timeout(15000),
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

  if (!isConfigured) {
    console.info(
      `[MarzPay DEV MOCK] Initiating Mobile Money collection for ${formattedPhone}, amount: ${params.amount} UGX, ref: ${params.reference}`
    );
    return {
      success: true,
      uuid: `mock-${params.reference}`,
      reference: params.reference,
      status: "processing",
      provider: formattedPhone.startsWith("+25675") || formattedPhone.startsWith("+25670") ? "airtel" : "mtn",
      message: "Collection initiated successfully. Check handset for PIN prompt.",
      isSandbox: true,
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
    status: "processing", // Collections always start as processing awaiting customer PIN
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
      `[MarzPay DEV MOCK] Initiating Card collection for amount: ${params.amount} UGX, ref: ${params.reference}`
    );
    return {
      success: true,
      uuid: `mock-${params.reference}`,
      reference: params.reference,
      status: "pending",
      redirectUrl: undefined,
      message: "Card collection initiated in Sandbox Mode.",
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
    phone_number: params.phoneNumber ? formatPhoneNumber(params.phoneNumber) : "+256705748774",
  };

  if (params.metadata && Array.isArray(params.metadata)) {
    payload.metadata = params.metadata;
  }

  let apiRes: any = null;
  let redirectUrl: string | undefined = undefined;

  try {
    apiRes = await callMarzPayApi("/collect-money", "POST", payload);
    if (apiRes?.data?.redirect_url) {
      redirectUrl = apiRes.data.redirect_url;
    }
  } catch (err: any) {
    console.warn("[MarzPay Card Initiation Warning]:", err.message);
  }

  const tx = apiRes?.data?.transaction || {};
  const isSandbox = env.MARZPAY_MODE === "sandbox" || apiRes?.data?.metadata?.sandbox_mode === true;

  return {
    success: true,
    uuid: tx.uuid || params.reference,
    reference: tx.reference || params.reference,
    status: "pending", // Card payments STRICTLY start as pending until 3D-Secure completion
    redirectUrl, // ONLY present if real MarzPay returns a verified redirect URL
    message: "Card payment initialized. Please complete authorization via the 3D-Secure gateway.",
    isSandbox,
    raw: apiRes,
  };
}

/**
 * Check collection status by MarzPay transaction UUID or merchant reference.
 * STRICT: Only marks completed if the MATCHING transaction is confirmed successful.
 */
export async function getCollectionStatus(
  referenceOrUuid: string,
  phoneNumber?: string | null
): Promise<{
  status: "completed" | "processing" | "failed" | "cancelled" | "pending";
  providerTxId?: string;
  provider?: string;
  amount?: number;
  currency?: string;
  reason?: string;
  raw?: any;
}> {
  const isConfigured = Boolean(env.MARZPAY_API_KEY && env.MARZPAY_API_SECRET);

  // If credentials are NOT configured, run mock evaluation based on test numbers
  if (!isConfigured || referenceOrUuid.startsWith("mock-")) {
    const cleanPhone = (phoneNumber || "").replace(/[\s\+\-()]/g, "");

    // Numbers ending with '0000' simulate a DECLINED/FAILED payment
    if (cleanPhone.endsWith("0000")) {
      return {
        status: "failed",
        provider: "mtn",
        reason: "Declined by subscriber (wrong PIN or insufficient balance)",
        raw: { sandbox: true },
      };
    }

    // Numbers ending with '9999' simulate a CANCELLED/TIMED-OUT payment
    if (cleanPhone.endsWith("9999")) {
      return {
        status: "cancelled",
        provider: "airtel",
        reason: "PIN prompt cancelled by customer or timed out",
        raw: { sandbox: true },
      };
    }

    // Default mock: Strictly remains processing until confirmed
    return {
      status: "processing",
      provider: "mtn",
      reason: "Awaiting customer authorization on handset",
    };
  }

  // Real MarzPay API check
  try {
    let apiRes: any = null;
    try {
      apiRes = await callMarzPayApi(`/collect-money/${referenceOrUuid}`, "GET");
    } catch {
      apiRes = await callMarzPayApi(`/transactions?reference=${encodeURIComponent(referenceOrUuid)}`, "GET");
    }

    let tx: any = null;
    let coll: any = null;

    if (apiRes.data?.transaction) {
      tx = apiRes.data.transaction;
      coll = apiRes.data.collection || {};
    } else if (Array.isArray(apiRes.data?.transactions)) {
      // STRICT FILTER: Match ONLY the transaction matching our referenceOrUuid
      tx = apiRes.data.transactions.find(
        (t: any) => t.reference === referenceOrUuid || t.uuid === referenceOrUuid
      );
      coll = tx || {};
    } else if (apiRes.transaction) {
      tx = apiRes.transaction;
      coll = apiRes.collection || {};
    }

    if (!tx || !tx.status) {
      return {
        status: "processing",
        reason: "Payment is still processing with gateway network",
      };
    }

    // STRICT CHECK: ONLY use tx.status, NEVER outer API envelope status
    const txStatus = String(tx.status).toLowerCase();
    let normalizedStatus: "completed" | "processing" | "failed" | "cancelled" | "pending" = "processing";

    if (txStatus === "completed" || txStatus === "successful") {
      normalizedStatus = "completed";
    } else if (txStatus === "failed" || txStatus === "error" || txStatus === "declined") {
      normalizedStatus = "failed";
    } else if (txStatus === "cancelled") {
      normalizedStatus = "cancelled";
    } else if (txStatus === "pending") {
      normalizedStatus = "pending";
    } else {
      normalizedStatus = "processing";
    }

    return {
      status: normalizedStatus,
      providerTxId: coll.provider_transaction_id || tx.provider_transaction_id || undefined,
      provider: coll.provider || tx.provider || undefined,
      amount: coll.amount?.raw || tx.amount?.raw || undefined,
      currency: coll.amount?.currency || tx.amount?.currency || "UGX",
      raw: apiRes,
    };
  } catch (error: any) {
    console.warn(`[MarzPay Status Check] Polling ${referenceOrUuid}: ${error.message}`);
    return {
      status: "processing",
      reason: "Payment is still processing with gateway network",
    };
  }
}

/**
 * Verify incoming webhook HMAC signature
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader?: string,
  timestampHeader?: string
): boolean {
  if (!env.MARZPAY_WEBHOOK_SECRET) {
    return true;
  }

  if (!signatureHeader) {
    return false;
  }

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
