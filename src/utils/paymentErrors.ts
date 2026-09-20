export interface UserFriendlyError {
  title: string;
  description: string;
  suggestion?: string;
  suggestMoMo?: boolean;
}

/**
 * Translates raw gateway or network error messages into polished, senior-level user notices.
 */
export function formatPaymentError(
  rawError: any,
  currentMethod?: 'MTN_MOMO' | 'AIRTEL_MONEY' | 'CARD' | string
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
      title: 'Payment Gateway Undergoing Verification',
      description:
        'The online card payment gateway is undergoing scheduled security updates.',
      suggestion:
        'Please complete your order using MTN Mobile Money or Airtel Money for immediate authorization, or chat with our studio concierge on WhatsApp.',
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
        'We could not reach the payment gateway server at this second. Your cart items and order remain safely preserved.',
      suggestion:
        'Please check your internet connection and try again, or select Cash on Studio Pickup.',
    };
  }

  // 3. Card 3D-Secure or missing redirect URL
  if (
    currentMethod === 'CARD' &&
    (lower.includes('redirect') || lower.includes('3d-secure') || lower.includes('checkout link') || lower.includes('authurl'))
  ) {
    return {
      title: 'Card Authorization Gateway Unavailable',
      description:
        'Your bank checkout portal could not be initialized at this moment.',
      suggestion:
        'We recommend selecting MTN Mobile Money or Airtel Money for instant one-touch checkout.',
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
      title: 'Payment Was Not Authorized',
      description:
        'The transaction was declined by your bank or mobile money provider.',
      suggestion:
        'Please verify that your wallet has enough balance to cover the total, then re-initiate payment.',
    };
  }

  // 5. Timeout
  if (lower.includes('timeout') || lower.includes('timed out') || lower.includes('no response')) {
    return {
      title: 'Authorization Timed Out',
      description:
        'We did not receive a confirmation from your device before the session expired.',
      suggestion:
        'Keep your phone unlocked and click "Pay Now" to prompt your handset again.',
    };
  }

  // 6. Invalid phone number
  if (lower.includes('phone') && (lower.includes('invalid') || lower.includes('required') || lower.includes('short'))) {
    return {
      title: 'Invalid Mobile Number',
      description:
        'Please enter a valid Ugandan mobile money number (e.g. 0705 123 456 or +256 772 123 456).',
    };
  }

  // 7. General Fallback
  return {
    title: 'Payment Notice',
    description:
      msg && msg.length < 160
        ? msg
        : 'We were unable to complete the payment authorization at this moment.',
    suggestion:
      'Please try again in a few moments, or select an alternative payment method.',
    suggestMoMo: currentMethod === 'CARD',
  };
}
