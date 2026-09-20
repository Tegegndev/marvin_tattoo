import { prisma } from "../config/database.js";
import { env } from "../config/env.js";

export interface ResolvedPaymentConfig {
  momoEnabled: boolean;
  cardEnabled: boolean;
  cashEnabled: boolean;
  marzpay: {
    apiKey: string;
    apiSecret: string;
    webhookSecret: string;
    apiBase: string;
    mode: "live" | "sandbox" | string;
    isConfigured: boolean;
    apiKeySource: "db" | "env" | "missing";
    apiSecretSource: "db" | "env" | "missing";
  };
  flw: {
    publicKey: string;
    secretKey: string;
    isConfigured: boolean;
    source: "db" | "env" | "missing";
  };
  paystack: {
    secretKey: string;
    isConfigured: boolean;
    source: "db" | "env" | "missing";
  };
}

let cachedConfig: { config: ResolvedPaymentConfig; timestamp: number } | null = null;
const CACHE_TTL_MS = 5000; // 5 seconds in-memory cache

export function invalidatePaymentConfigCache(): void {
  cachedConfig = null;
}

/**
 * Returns the fully resolved payment configuration, prioritizing DB settings with fallback to .env
 */
export async function getResolvedPaymentConfig(): Promise<ResolvedPaymentConfig> {
  const now = Date.now();
  if (cachedConfig && now - cachedConfig.timestamp < CACHE_TTL_MS) {
    return cachedConfig.config;
  }

  const settings = await prisma.siteSetting.findUnique({
    where: { id: "studio_config" },
  });

  // 1. Toggles (default to true if not set)
  const momoEnabled = settings?.momoEnabled ?? true;
  const cardEnabled = settings?.cardEnabled ?? true;
  const cashEnabled = settings?.cashEnabled ?? true;

  // 2. MarzPay API Key
  let marzpayApiKey = "";
  let apiKeySource: "db" | "env" | "missing" = "missing";
  if (settings?.marzpayApiKey && settings.marzpayApiKey.trim().length > 0) {
    marzpayApiKey = settings.marzpayApiKey.trim();
    apiKeySource = "db";
  } else if (env.MARZPAY_API_KEY && env.MARZPAY_API_KEY.trim().length > 0) {
    marzpayApiKey = env.MARZPAY_API_KEY.trim();
    apiKeySource = "env";
  }

  // 3. MarzPay API Secret
  let marzpayApiSecret = "";
  let apiSecretSource: "db" | "env" | "missing" = "missing";
  if (settings?.marzpayApiSecret && settings.marzpayApiSecret.trim().length > 0) {
    marzpayApiSecret = settings.marzpayApiSecret.trim();
    apiSecretSource = "db";
  } else if (env.MARZPAY_API_SECRET && env.MARZPAY_API_SECRET.trim().length > 0) {
    marzpayApiSecret = env.MARZPAY_API_SECRET.trim();
    apiSecretSource = "env";
  }

  // 4. MarzPay Webhook Secret
  const marzpayWebhookSecret =
    settings?.marzpayWebhookSecret?.trim() || env.MARZPAY_WEBHOOK_SECRET || "";

  // 5. MarzPay Mode & Base URL
  const marzpayMode = settings?.marzpayMode?.trim() || env.MARZPAY_MODE || "live";
  const marzpayApiBase =
    settings?.marzpayApiBase?.trim() ||
    env.MARZPAY_API_BASE ||
    "https://wallet.wearemarz.com/api/v1";

  const isMarzpayConfigured = Boolean(marzpayApiKey && marzpayApiSecret);

  // 6. Flutterwave keys
  let flwPublicKey = "";
  let flwSecretKey = "";
  let flwSource: "db" | "env" | "missing" = "missing";
  if (settings?.flwPublicKey && settings.flwPublicKey.trim().length > 0) {
    flwPublicKey = settings.flwPublicKey.trim();
    flwSecretKey = settings?.flwSecretKey?.trim() || "";
    flwSource = "db";
  } else if (env.FLW_PUBLIC_KEY && env.FLW_PUBLIC_KEY.trim().length > 0) {
    flwPublicKey = env.FLW_PUBLIC_KEY.trim();
    flwSecretKey = env.FLW_SECRET_KEY.trim();
    flwSource = "env";
  }

  // 7. Paystack key
  let paystackSecretKey = "";
  let paystackSource: "db" | "env" | "missing" = "missing";
  if (settings?.paystackSecretKey && settings.paystackSecretKey.trim().length > 0) {
    paystackSecretKey = settings.paystackSecretKey.trim();
    paystackSource = "db";
  } else if (env.PAYSTACK_SECRET_KEY && env.PAYSTACK_SECRET_KEY.trim().length > 0) {
    paystackSecretKey = env.PAYSTACK_SECRET_KEY.trim();
    paystackSource = "env";
  }

  const resolved: ResolvedPaymentConfig = {
    momoEnabled,
    cardEnabled,
    cashEnabled,
    marzpay: {
      apiKey: marzpayApiKey,
      apiSecret: marzpayApiSecret,
      webhookSecret: marzpayWebhookSecret,
      apiBase: marzpayApiBase,
      mode: marzpayMode,
      isConfigured: isMarzpayConfigured,
      apiKeySource,
      apiSecretSource,
    },
    flw: {
      publicKey: flwPublicKey,
      secretKey: flwSecretKey,
      isConfigured: Boolean(flwPublicKey && flwSecretKey),
      source: flwSource,
    },
    paystack: {
      secretKey: paystackSecretKey,
      isConfigured: Boolean(paystackSecretKey),
      source: paystackSource,
    },
  };

  cachedConfig = { config: resolved, timestamp: now };
  return resolved;
}

/**
 * Publicly exposed status of payment methods (safe for checkout page, no secret keys exposed)
 */
export async function getPublicPaymentMethods() {
  const config = await getResolvedPaymentConfig();
  return {
    momo: {
      enabled: config.momoEnabled,
      configured: config.marzpay.isConfigured,
    },
    card: {
      enabled: config.cardEnabled,
      configured: config.marzpay.isConfigured,
    },
    cash: {
      enabled: config.cashEnabled,
      configured: true,
    },
    mode: config.marzpay.mode,
  };
}

/**
 * Admin view of payment settings (includes configured keys, source info, and masked secrets)
 */
export async function getAdminPaymentConfig() {
  const config = await getResolvedPaymentConfig();
  const settings = await prisma.siteSetting.findUnique({
    where: { id: "studio_config" },
  });

  const mask = (str: string) => {
    if (!str || str.length < 8) return str ? "••••••••" : "";
    return `${str.substring(0, 4)}••••${str.substring(str.length - 4)}`;
  };

  return {
    momoEnabled: config.momoEnabled,
    cardEnabled: config.cardEnabled,
    cashEnabled: config.cashEnabled,
    marzpay: {
      apiKey: settings?.marzpayApiKey || "", // raw DB override if any
      effectiveApiKey: config.marzpay.apiKey, // in-use key (DB or ENV)
      apiKeyMasked: mask(config.marzpay.apiKey),
      apiKeySource: config.marzpay.apiKeySource,

      apiSecret: settings?.marzpayApiSecret || "", // raw DB override if any
      effectiveApiSecret: config.marzpay.apiSecret, // in-use secret (DB or ENV)
      apiSecretMasked: mask(config.marzpay.apiSecret),
      apiSecretSource: config.marzpay.apiSecretSource,

      webhookSecret: settings?.marzpayWebhookSecret || "",
      effectiveWebhookSecret: config.marzpay.webhookSecret,
      webhookSecretMasked: mask(config.marzpay.webhookSecret),

      mode: config.marzpay.mode,
      apiBase: config.marzpay.apiBase,
      isConfigured: config.marzpay.isConfigured,
    },
    flw: {
      publicKey: settings?.flwPublicKey || "",
      effectivePublicKey: config.flw.publicKey,
      publicKeyMasked: mask(config.flw.publicKey),
      secretKey: settings?.flwSecretKey || "",
      effectiveSecretKey: config.flw.secretKey,
      secretKeyMasked: mask(config.flw.secretKey),
      source: config.flw.source,
      isConfigured: config.flw.isConfigured,
    },
    paystack: {
      secretKey: settings?.paystackSecretKey || "",
      effectiveSecretKey: config.paystack.secretKey,
      secretKeyMasked: mask(config.paystack.secretKey),
      source: config.paystack.source,
      isConfigured: config.paystack.isConfigured,
    },
    hasEnvDefaults: {
      marzpayApiKey: Boolean(env.MARZPAY_API_KEY),
      marzpayApiSecret: Boolean(env.MARZPAY_API_SECRET),
      marzpayMode: env.MARZPAY_MODE,
    },
  };
}
