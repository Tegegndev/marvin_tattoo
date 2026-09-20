export interface UserFriendlyError {
  title: string;
  description: string;
  suggestion?: string;
  suggestMoMo?: boolean;
}

/**
 * Translates raw gateway or network error messages into plain, helpful notices.
 */
export function formatPaymentError(
  rawError: any,
  currentMethod?: 'MTN_MOMO' | 'AIRTEL_MONEY' | 'MOMO' | 'CARD' | string
): UserFriendlyError {
  const msg =
    typeof rawError === 'string'
      ? rawError
      : rawError?.message || rawError?.error || '';

  const lower = msg.toLowerCase();

  // 1. Gateway Security / IP Whitelist or maintenance
  if (
    lower.includes('ip_not_whitelisted') ||
    lower.includes('not whitelisted') ||
    lower.includes('access denied') ||
    lower.includes('security network')
  ) {
    return {
      title: 'Card Payment Temporarily Unavailable',
      description:
        'Online card processing is currently unavailable on our payment provider. Please use Mobile Money (MTN / Airtel) to complete your order instantly.',
      suggestion: 'Mobile Money push prompts arrive directly on your phone within seconds.',
      suggestMoMo: true,
    };
  }

  // 2. Network / Server connection errors
  if (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('econnrefused') ||
    lower.includes('connection refused') ||
    lower.includes('offline')
  ) {
    return {
      title: 'Connection Issue',
      description:
        'Could not connect to the payment server. Your order details are safe.',
      suggestion:
        'Please check your internet connection and try again, or choose Cash on Pickup.',
    };
  }

  // 3. Card 3D-Secure or missing redirect URL
  if (
    currentMethod === 'CARD' &&
    (lower.includes('redirect') || lower.includes('3d-secure') || lower.includes('checkout link') || lower.includes('authurl'))
  ) {
    return {
      title: 'Card Portal Unavailable',
      description:
        'The card checkout window could not open. Please use Mobile Money (MTN or Airtel) instead.',
      suggestion: 'Mobile Money is the fastest payment option in Uganda.',
      suggestMoMo: true,
    };
  }

  // 4. Insufficient balance or telco decline
  if (
    lower.includes('insufficient') ||
    lower.includes('balance') ||
    lower.includes('declined') ||
    lower.includes('failed on handset') ||
    lower.includes('cancelled by user')
  ) {
    return {
      title: 'Payment Declined',
      description:
        'The payment was cancelled or declined on your phone.',
      suggestion:
        'Please make sure your mobile money or card balance is sufficient, then try again.',
    };
  }

  // 5. Timeout
  if (lower.includes('timeout') || lower.includes('timed out') || lower.includes('no response')) {
    return {
      title: 'Payment Timed Out',
      description:
        'We did not get approval from your phone before the session ended.',
      suggestion:
        'Keep your phone unlocked and click Try Again to get a fresh PIN prompt.',
    };
  }

  // 6. Invalid phone number
  if (lower.includes('phone') && (lower.includes('invalid') || lower.includes('required') || lower.includes('short'))) {
    return {
      title: 'Invalid Phone Number',
      description:
        'Please enter a valid Ugandan phone number (e.g. 0772 123 456 or 0705 123 456).',
    };
  }

  // 7. General Fallback
  return {
    title: 'Payment Failed',
    description:
      msg && msg.length < 160
        ? msg
        : 'Payment could not be completed at this time.',
    suggestion: 'Please try again or select another payment method.',
    suggestMoMo: currentMethod === 'CARD',
  };
}
