import { env } from '../config/env.js';

export interface MobileMoneyChargeParams {
  txRef: string;
  amount: number;
  currency: string;
  phoneNumber: string;
  email: string;
  fullName: string;
  network?: 'MTN' | 'AIRTEL';
  redirectUrl?: string;
}

export interface PaymentInitializationResult {
  success: boolean;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  txRef: string;
  gatewayRef?: string;
  authUrl?: string;
  instruction?: string;
  message: string;
  isMock?: boolean;
}

export async function initiateUgandaMobileMoney(
  params: MobileMoneyChargeParams
): Promise<PaymentInitializationResult> {
  const { txRef, amount, currency = 'UGX', phoneNumber, email, fullName, network = 'MTN', redirectUrl } = params;

  // Clean phone number (strip + or spaces)
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

  const isDummyKey =
    !env.FLW_SECRET_KEY ||
    env.FLW_SECRET_KEY.includes('dummy') ||
    env.FLW_SECRET_KEY.includes('xxxx') ||
    env.FLW_SECRET_KEY.includes('sandbox-secret');

  if (isDummyKey) {
    console.log(`[Flutterwave Sandbox Mock] Initializing Uganda MoMo (${network}) payment for ${amount} ${currency} to ${cleanPhone}`);
    return {
      success: true,
      status: 'PENDING',
      txRef,
      gatewayRef: `MOCK-FLW-${Date.now()}`,
      instruction: `A USSD push notification has been sent to your ${network} line (${phoneNumber}). Please enter your Mobile Money PIN on your handset to approve the transaction of ${currency} ${amount.toLocaleString()}.`,
      message: 'Mobile money prompt initiated (Sandbox Simulation)',
      isMock: true,
    };
  }

  try {
    const payload = {
      tx_ref: txRef,
      amount: amount.toString(),
      currency,
      email,
      phone_number: cleanPhone,
      fullname: fullName,
      network: network.toUpperCase(),
      redirect_url: redirectUrl || `${env.CLIENT_URL}/shop?payment=success&txRef=${txRef}`,
    };

    const response = await fetch('https://api.flutterwave.com/v3/charges?type=mobile_money_uganda', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.FLW_SECRET_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as any;

    if (response.ok && data?.status === 'success') {
      return {
        success: true,
        status: 'PENDING',
        txRef,
        gatewayRef: data.data?.id?.toString() || data.data?.flw_ref,
        authUrl: data.meta?.authorization?.redirect || undefined,
        instruction: data.meta?.authorization?.instruction || `Please approve the payment on your ${network} mobile handset.`,
        message: data.message || 'Payment initiated successfully',
        isMock: false,
      };
    } else {
      return {
        success: false,
        status: 'FAILED',
        txRef,
        message: data?.message || 'Flutterwave payment initialization failed',
        isMock: false,
      };
    }
  } catch (error: any) {
    console.error('Flutterwave API error:', error);
    return {
      success: false,
      status: 'FAILED',
      txRef,
      message: error.message || 'Network error connecting to payment gateway',
      isMock: false,
    };
  }
}

export async function verifyFlutterwaveTransaction(transactionId: string): Promise<{
  success: boolean;
  status: string;
  amount?: number;
  currency?: string;
  txRef?: string;
  raw?: any;
}> {
  if (!env.FLW_SECRET_KEY) {
    return {
      success: true,
      status: 'successful',
      amount: 50000,
      currency: 'UGX',
      txRef: transactionId,
    };
  }

  try {
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${env.FLW_SECRET_KEY}`,
      },
    });

    const data = (await response.json()) as any;
    if (response.ok && data?.status === 'success') {
      return {
        success: data.data?.status === 'successful',
        status: data.data?.status || 'successful',
        amount: data.data?.amount,
        currency: data.data?.currency,
        txRef: data.data?.tx_ref,
        raw: data.data,
      };
    }

    return {
      success: false,
      status: 'failed',
    };
  } catch (error) {
    console.error('verifyFlutterwaveTransaction error:', error);
    return {
      success: false,
      status: 'error',
    };
  }
}
