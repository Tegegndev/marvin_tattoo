export type CarrierType = 'MTN' | 'AIRTEL' | 'UNKNOWN';

/**
 * Automatically detect telecom network (MTN or Airtel) from Ugandan phone number prefixes.
 *
 * Uganda prefixes:
 * - MTN: 077, 078, 076, 039, 031 (+25677..., +25678..., +25676...)
 * - Airtel: 070, 075, 074, 020 (+25670..., +25675..., +25674...)
 */
export function detectCarrier(phone: string): CarrierType {
  if (!phone) return 'UNKNOWN';
  const digits = phone.replace(/\D/g, '');

  let local = digits;
  if (local.startsWith('256')) {
    local = local.slice(3);
  } else if (local.startsWith('0')) {
    local = local.slice(1);
  }

  const p2 = local.slice(0, 2);
  if (['77', '78', '76', '39', '31'].includes(p2)) {
    return 'MTN';
  }
  if (['70', '75', '74', '20'].includes(p2)) {
    return 'AIRTEL';
  }
  return 'UNKNOWN';
}

export function carrierToPaymentMethod(carrier: CarrierType): 'MTN_MOMO' | 'AIRTEL_MONEY' {
  return carrier === 'AIRTEL' ? 'AIRTEL_MONEY' : 'MTN_MOMO';
}

export function getCarrierName(carrier: CarrierType): string {
  switch (carrier) {
    case 'MTN':
      return 'MTN Mobile Money';
    case 'AIRTEL':
      return 'Airtel Money';
    default:
      return 'MTN / Airtel MoMo';
  }
}
