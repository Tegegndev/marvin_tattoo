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
      : rawError?.message || rawError?.error || rawError?.gatewayError || '';

  const lower = msg.toLowerCase();
  const isCard = currentMethod === 'CARD';

  // 1. Gateway Security / IP Whitelist or maintenance
  if (
    lower.includes('ip_not_whitelisted') ||
    lower.includes('not whitelisted') ||
    lower.includes('access denied') ||
    lower.includes('security network') ||
    lower.includes('unauthorized ip')
  ) {
    if (isCard) {
      return {
        title: 'Card Gateway Unavailable',
        description:
          'Card processing is temporarily unavailable on our gateway. You can switch to Mobile Money (MTN / Airtel) for instant authorization.',
        suggestion: 'Mobile Money push prompts arrive directly on your phone within seconds.',
        suggestMoMo: true,
      };
    }

    return {
      title: 'Mobile Money Gateway Notice',
      description:
        rawError?.gatewayError ||
        rawError?.message ||
        'The mobile money gateway is currently updating its security connection. Please try again in a moment or choose Cash on Pickup.',
      suggestion: 'If this continues, you can contact our studio directly on WhatsApp or select Cash on Pickup.',
      suggestMoMo: false,
    };
  }

  // 2. Network / Server connection errors
  if (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('econnrefused') ||
    lower.includes('connection refused') ||
    lower.includes('gateway_unreachable') ||
    lower.includes('offline')
  ) {
    return {
      title: 'Connection Issue',
      description:
        'Could not reach the payment gateway. Your order items and information remain intact.',
      suggestion:
        'Please check your internet connection and try again, or select Cash on Pickup.',
      suggestMoMo: false,
    };
  }

  // 3. Card 3D-Secure or missing redirect URL
  if (
    isCard &&
    (lower.includes('redirect') || lower.includes('3d-secure') || lower.includes('checkout link') || lower.includes('authurl'))
  ) {
    return {
      title: 'Card Portal Unavailable',
      description:
        'The card payment window could not open. Please use Mobile Money (MTN or Airtel) instead.',
      suggestion: 'Mobile Money is the fastest and most reliable payment method in Uganda.',
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
      title: isCard ? 'Card Declined' : 'Payment Declined',
      description: isCard
        ? 'Your card was declined or the 3D-Secure approval was cancelled.'
        : 'The payment prompt was cancelled or declined on your phone.',
      suggestion: isCard
        ? 'Please check your available card balance or switch to Mobile Money.'
        : 'Please ensure your mobile money balance is sufficient and try again.',
      suggestMoMo: isCard,
    };
  }

  // 5. Timeout
  if (lower.includes('timeout') || lower.includes('timed out') || lower.includes('no response')) {
    return {
      title: isCard ? 'Card Session Timed Out' : 'Approval Timed Out',
      description: isCard
        ? 'The card authorization session expired before completion.'
        : 'We did not receive confirmation from your phone before the session ended.',
      suggestion: isCard
        ? 'Please open the payment link again or switch to Mobile Money.'
        : 'Keep your phone unlocked and click Verify again to check for approval.',
      suggestMoMo: isCard,
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
    title: isCard ? 'Card Payment Failed' : 'Payment Failed',
    description:
      msg && msg.length < 180
        ? msg
        : (isCard
            ? 'Card payment could not be completed at this time.'
            : 'Mobile Money payment could not be completed at this time.'),
    suggestion: isCard
      ? 'Please retry or switch to Mobile Money (MTN / Airtel).'
      : 'Please verify your phone number and try again, or choose Cash on Pickup.',
    suggestMoMo: isCard,
  };
}
