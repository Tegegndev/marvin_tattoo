import React, { useState, useEffect } from 'react';
import { PageView, PortfolioPiece, ServiceItem, BookingServiceType, BookingRecord } from '../types';
import { SERVICES_DATA, WHATSAPP_NUMBER } from '../data/atelierData';
import { fetchServices } from '../services/apiClient';
import { Icons8 } from '../components/Icons8';
import { bookingApi } from '../services/bookingApi';
import { getSavedUserProfile, saveUserProfile } from '../utils/userProfile';
import confetti from 'canvas-confetti';

interface BookingPageProps {
  initialPiece?: PortfolioPiece | null;
  initialService?: ServiceItem | null;
  initialTier?: string | null;
  onNavigate: (page: PageView) => void;
  onOpenWhatsApp: () => void;
}

function mapServiceToBookingId(serviceIdOrCat?: string): string {
  if (!serviceIdOrCat) return 'realism-portraits';
  const s = serviceIdOrCat.toLowerCase();
  if (s.includes('realism') || s.includes('portrait')) return 'realism-portraits';
  if (s.includes('minimalist') || s.includes('fine-line') || s.includes('fineline')) return 'minimalist-fineline';
  if (s.includes('lettering') || s.includes('script')) return 'lettering-script';
  if (s.includes('tribal') || s.includes('traditional')) return 'traditional-tribal';
  if (s.includes('coverup') || s.includes('cover_up') || s.includes('cover-up') || s.includes('restoration')) return 'coverups-restorations';
  if (s.includes('pmu') || s.includes('makeup') || s.includes('semi-permanent')) return 'semi-permanent-makeup';
  if (s.includes('piercing')) return 'body-piercing';
  if (s.includes('keloid') || s.includes('laser') || s.includes('removal')) return 'laser-keloids-removal';
  return 'custom_tattoo';
}

const CUSTOM_SERVICE_ITEM = {
  id: 'custom_tattoo',
  disciplineNumber: '09',
  title: 'Custom Tattoo Project',
  subtitle: 'Bespoke Inking & Freehand Design',
  description: 'Discuss your unique concept, multi-element tattoo, or custom collaboration with Marvin.',
  category: 'CUSTOM' as const,
  image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1000&q=80',
};

export const BookingPage: React.FC<BookingPageProps> = ({
  initialPiece,
  initialService,
  initialTier,
  onNavigate,
  onOpenWhatsApp
}) => {
  const [serviceType, setServiceType] = useState<string>(() => {
    if (initialService?.id) return initialService.id;
    if (initialPiece) return mapServiceToBookingId(initialPiece.serviceId || initialPiece.category);
    return 'realism-portraits';
  });

  const [notes, setNotes] = useState<string>(() => {
    if (initialTier) return `Preferred Option: ${initialTier}`;
    if (initialPiece) return `Design Reference: ${initialPiece.title} (#${initialPiece.flashId || initialPiece.id})`;
    return '';
  });

  const getDefaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const [preferredDate, setPreferredDate] = useState<string>(getDefaultDate());
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('afternoon');

  // Contact Info (Auto-Filled from previous visits)
  const [fullName, setFullName] = useState<string>(() => getSavedUserProfile()?.fullName || '');
  const [phone, setPhone] = useState<string>(() => getSavedUserProfile()?.phone || '');
  const [email, setEmail] = useState<string>(() => getSavedUserProfile()?.email || '');
  const [hasAutoFilled] = useState(() => Boolean(getSavedUserProfile()?.phone));

  // Image Upload
  const [referenceFileName, setReferenceFileName] = useState<string>('');
  const [referenceFilePreview, setReferenceFilePreview] = useState<string>('');

  // State
  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES_DATA);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    fetchServices().then((data) => {
      if (mounted && data && data.length > 0) {
        setServicesList(data);
      }
    }).catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const currentService =
    servicesList.find(
      (s) =>
        s.id === serviceType ||
        s.id === serviceType.replace(/_/g, '-') ||
        s.id.replace(/-/g, '_') === serviceType
    ) ||
    (serviceType === 'custom_tattoo' ? CUSTOM_SERVICE_ITEM : servicesList[0] || SERVICES_DATA[0]);

  useEffect(() => {
    if (initialService) {
      setServiceType(initialService.id);
      if (initialTier) setNotes(`Preferred Option: ${initialTier}`);
    } else if (initialPiece) {
      setServiceType(mapServiceToBookingId(initialPiece.serviceId || initialPiece.category));
      setNotes(`Design Reference: ${initialPiece.title} (#${initialPiece.flashId || initialPiece.id})`);
    }
  }, [initialService, initialPiece, initialTier]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReferenceFileName(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setReferenceFilePreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const selectedServiceLabel = currentService.title;

    try {
      const response = await bookingApi.createBooking({
        serviceType: currentService.id as any,
        placement: 'Discussed on WhatsApp',
        approximateSize: 'medium',
        description: notes ? `Service: ${selectedServiceLabel}. Notes: ${notes}` : `Service: ${selectedServiceLabel}`,
        artistId: 'marvin',
        preferredDate,
        preferredTimeSlot,
        fullName,
        phone,
        email,
        notes: notes || undefined,
        referenceFileName: referenceFileName || undefined,
        referenceFilePreview: referenceFilePreview || undefined,
      });

      if (response.success && response.booking) {
        // Save user profile for seamless return visits
        saveUserProfile({
          fullName,
          phone,
          email,
        });

        setConfirmedBooking(response.booking);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#991b1b', '#d4af37', '#f8fafc'],
        });
      } else {
        setErrorMessage(response.message || 'Unable to submit booking. Please verify your details.');
      }
    } catch {
      setErrorMessage('Network error. Please try again or reach out directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendWhatsAppBookingSummary = (record: BookingRecord) => {
    const matched = SERVICES_DATA.find((s) => s.id === record.serviceType || s.id.replace(/-/g, '_') === record.serviceType);
    const selectedServiceLabel = matched ? matched.title : currentService.title;
    const message = `Hello Marvin Tattoos Atelier! 
I just submitted a booking request online.

• Reference Code: ${record.referenceCode}
• Service: ${selectedServiceLabel}
• Preferred Date: ${record.preferredDate} (${record.preferredTimeSlot.toUpperCase()})
• Client: ${record.fullName} (${record.phone})
${notes ? `• Notes: ${notes}` : ''}

Looking forward to discussing the design and finalizing my appointment slot.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="w-full pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto min-h-[85vh] text-bone">
      {/* Header */}
      <div className="mb-8 border-b border-noir-800 pb-6 flex items-end justify-between gap-4">
        <div>
          <button
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-2 text-xs font-label-caps uppercase text-bone-muted hover:text-crimson-light transition-colors mb-2 cursor-pointer"
          >
            <Icons8 name="arrow-left" size={13} />
            <span>View Services</span>
          </button>
          <h1 className="font-title-editorial text-2xl sm:text-3xl text-bone uppercase tracking-tight">
            Book Appointment
          </h1>
          <p className="font-body-sm text-xs text-bone-dim mt-1">
            Choose your service and contact details. Our artist will discuss all design details and confirm your slot on WhatsApp.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenWhatsApp}
          className="px-3.5 py-2 bg-noir-900 hover:bg-noir-850 border border-noir-700 text-bone text-xs font-label-caps uppercase rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Icons8 name="whatsapp" size={15} className="text-emerald-400" />
          <span>WhatsApp</span>
        </button>
      </div>

      {/* Confirmation View */}
      {confirmedBooking ? (
        <div className="bg-noir-900 border border-emerald-500/40 p-8 sm:p-10 text-center space-y-6 rounded-xl shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
            <Icons8 name="check-circle" size={36} />
          </div>

          <div className="space-y-1">
            <span className="font-label-caps text-xs text-emerald-400 uppercase tracking-widest font-bold block">
              Booking Request Received
            </span>
            <h2 className="font-title-editorial text-2xl text-bone uppercase">
              Ref #{confirmedBooking.referenceCode}
            </h2>
            <p className="font-body-sm text-sm text-bone-dim max-w-md mx-auto">
              Thank you, <strong className="text-bone">{confirmedBooking.fullName}</strong>. Our artist will contact you at <strong className="text-gold">{confirmedBooking.phone}</strong> on WhatsApp.
            </p>
          </div>

          <div className="p-4 bg-noir-850 border border-noir-750 rounded-lg text-left font-label-data text-xs space-y-2">
            <div className="flex justify-between text-bone-dim">
              <span>Service:</span>
              <span className="text-bone font-medium">
                {SERVICES_DATA.find((s) => s.id === confirmedBooking.serviceType || s.id.replace(/-/g, '_') === confirmedBooking.serviceType)?.title || confirmedBooking.serviceType}
              </span>
            </div>
            <div className="flex justify-between text-bone-dim">
              <span>Preferred Date:</span>
              <span className="text-bone">{confirmedBooking.preferredDate} ({confirmedBooking.preferredTimeSlot.toUpperCase()})</span>
            </div>
            <div className="flex justify-between text-bone-dim">
              <span>Client:</span>
              <span className="text-bone">{confirmedBooking.fullName} ({confirmedBooking.phone})</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => sendWhatsAppBookingSummary(confirmedBooking)}
              className="flex-1 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-label-caps text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/40"
            >
              <Icons8 name="whatsapp" size={16} />
              <span>Chat with Artist on WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmedBooking(null);
                setNotes('');
                setReferenceFileName('');
                setReferenceFilePreview('');
              }}
              className="flex-1 py-3.5 bg-noir-800 hover:bg-noir-750 text-bone font-label-caps text-xs uppercase tracking-widest border border-noir-700 rounded-lg cursor-pointer"
            >
              Book Another Session
            </button>
          </div>
        </div>
      ) : (
        /* Clean 1-Card Booking Form */
        <form onSubmit={handleSubmit} className="bg-noir-900 border border-noir-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          {errorMessage && (
            <div className="p-3.5 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-lg flex items-center gap-2">
              <Icons8 name="exclamation-circle" size={16} className="shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Service Discipline & Visual Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-label-caps text-xs uppercase text-bone tracking-wider font-bold">
                Service Discipline *
              </label>
              {currentService && (
                <span className="text-[11px] font-label-data text-gold uppercase tracking-wider font-semibold">
                  Discipline {currentService.disciplineNumber || '01'}
                </span>
              )}
            </div>

            {/* Active Service Visual Preview Card */}
            {currentService && (
              <div className="flex items-center gap-3.5 p-3.5 bg-noir-850 border border-noir-750/90 rounded-xl overflow-hidden shadow-inner">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 border border-noir-700 bg-noir-950">
                  <img
                    src={
                      initialPiece?.image &&
                      serviceType === mapServiceToBookingId(initialPiece.serviceId || initialPiece.category)
                        ? initialPiece.image
                        : currentService.image
                    }
                    alt={currentService.title}
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-950/60 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-1 right-1 text-[9px] font-label-caps font-bold px-1.5 py-0.5 rounded bg-noir-950/90 text-gold border border-gold/30">
                    #{currentService.disciplineNumber}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.5 text-[10px] font-label-caps uppercase bg-crimson/15 text-crimson-light border border-crimson/30 rounded font-semibold tracking-wider">
                      {currentService.category || 'TATTOO'}
                    </span>
                    {initialTier && (
                      <span className="px-2 py-0.5 text-[10px] font-label-data text-gold bg-gold/10 border border-gold/20 rounded truncate max-w-[140px]">
                        {initialTier}
                      </span>
                    )}
                  </div>
                  <h3 className="font-title-editorial text-base sm:text-lg text-bone truncate">
                    {currentService.title}
                  </h3>
                  <p className="font-body-sm text-xs text-bone-dim truncate">
                    {currentService.subtitle || currentService.description}
                  </p>
                </div>
              </div>
            )}

            {/* Dropdown Selector */}
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-4 py-3 bg-noir-850 border border-noir-750 text-bone text-sm font-body-sm rounded-lg focus:outline-none focus:border-crimson transition-colors cursor-pointer"
            >
              {servicesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.disciplineNumber ? `${s.disciplineNumber}. ` : ''}{s.title} — {s.subtitle}
                </option>
              ))}
              <option value="custom_tattoo">09. Other Custom Project / Collaboration</option>
            </select>
          </div>

          {/* 2. Client Details */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between border-b border-noir-800 pb-2">
              <span className="font-label-caps text-xs uppercase text-bone tracking-wider font-bold">
                Client Contact Details *
              </span>
              {hasAutoFilled && (
                <span className="font-label-caps text-[10px] text-emerald-400 uppercase flex items-center gap-1 font-semibold bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded">
                  <Icons8 name="check-circle" size={12} />
                  <span>Auto-Filled · Returning Client</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1">
                  Full Name *
                </label>
              <input
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Samuel Mukasa"
                className="w-full px-4 py-2.5 bg-noir-850 border border-noir-750 text-bone text-sm font-body-sm rounded-lg focus:outline-none focus:border-crimson"
              />
            </div>

            <div>
              <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1">
                Phone Number (WhatsApp) *
              </label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+256 700 000000"
                className="w-full px-4 py-2.5 bg-noir-850 border border-noir-750 text-bone text-sm font-body-sm rounded-lg focus:outline-none focus:border-crimson"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1">
                Email Address *
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full px-4 py-2.5 bg-noir-850 border border-noir-750 text-bone text-sm font-body-sm rounded-lg focus:outline-none focus:border-crimson"
              />
            </div>
          </div>
        </div>

          {/* 3. Schedule Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1">
                Preferred Date *
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-noir-850 border border-noir-750 text-bone text-sm font-body-sm rounded-lg focus:outline-none focus:border-crimson"
              />
            </div>

            <div>
              <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1">
                Preferred Time *
              </label>
              <select
                value={preferredTimeSlot}
                onChange={(e) => setPreferredTimeSlot(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-noir-850 border border-noir-750 text-bone text-sm font-body-sm rounded-lg focus:outline-none focus:border-crimson"
              >
                <option value="morning">Morning (10:00 AM – 1:00 PM)</option>
                <option value="afternoon">Afternoon (1:30 PM – 5:00 PM)</option>
                <option value="evening">Evening (5:30 PM – 8:00 PM)</option>
              </select>
            </div>
          </div>

          {/* 4. Notes & Reference Photo */}
          <div className="space-y-4 pt-1">
            <div>
              <label className="block font-label-caps text-xs uppercase text-bone-dim mb-1">
                Project Idea / Placement Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Briefly describe what you want (placement, style, or size)..."
                className="w-full p-3 bg-noir-850 border border-noir-750 text-bone text-xs font-body-sm rounded-lg focus:outline-none focus:border-crimson resize-y"
              />
            </div>

            {/* Reference Upload */}
            <div>
              {referenceFileName ? (
                <div className="p-3 bg-noir-850 border border-noir-700 rounded-lg flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {referenceFilePreview ? (
                      <img src={referenceFilePreview} alt="Preview" className="w-10 h-10 object-cover rounded border border-noir-700 shrink-0" />
                    ) : (
                      <Icons8 name="file-invoice" size={18} className="text-emerald-400" />
                    )}
                    <span className="text-xs text-bone font-medium truncate">{referenceFileName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReferenceFileName('');
                      setReferenceFilePreview('');
                    }}
                    className="text-xs text-red-400 hover:text-red-300 font-label-caps uppercase cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="p-3.5 bg-noir-850 border border-dashed border-noir-700 hover:border-slate-500 rounded-lg block text-center transition-colors cursor-pointer">
                  <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="sr-only" />
                  <span className="text-xs text-bone-dim flex items-center justify-center gap-1.5">
                    <Icons8 name="cloud-upload-alt" size={16} className="text-bone-muted" />
                    <span>Upload reference image / photo (optional)</span>
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-crimson hover:bg-crimson-hover disabled:opacity-50 text-bone font-label-caps text-xs uppercase tracking-[0.2em] font-bold transition-all btn-gothic-glow border border-crimson/40 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-crimson/20"
            >
              {isSubmitting ? (
                <>
                  <Icons8 name="spinner" size={16} className="animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <span>Request Appointment</span>
                  <Icons8 name="arrow-right" size={14} />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-bone-dim">
              No deposit charged right now. Our artist will discuss all details and confirm your slot on WhatsApp.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
