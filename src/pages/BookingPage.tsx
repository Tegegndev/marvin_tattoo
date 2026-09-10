import React, { useState, useEffect } from 'react';
import { PageView, PortfolioPiece, ServiceItem, BookingServiceType, BookingSize, BookingTimeSlot, BookingRecord, ArtistProfile } from '../types';
import { ARTISTS_DATA, WHATSAPP_NUMBER } from '../data/atelierData';
import { Icons8 } from '../components/Icons8';
import { bookingApi } from '../services/bookingApi';
import { fetchMembers } from '../services/apiClient';
import confetti from 'canvas-confetti';

interface BookingPageProps {
  initialPiece?: PortfolioPiece | null;
  initialService?: ServiceItem | null;
  initialTier?: string | null;
  onNavigate: (page: PageView) => void;
  onOpenWhatsApp: () => void;
}

function mapServiceToBookingType(serviceIdOrCat?: string): BookingServiceType {
  if (!serviceIdOrCat) return 'custom_tattoo';
  const s = serviceIdOrCat.toLowerCase();
  if (s.includes('realism') || s.includes('portrait')) return 'realism_portrait';
  if (s.includes('minimalist') || s.includes('fine-line') || s.includes('fineline')) return 'fine_line';
  if (s.includes('lettering') || s.includes('script')) return 'lettering_script';
  if (s.includes('tribal') || s.includes('traditional')) return 'tribal_traditional';
  if (s.includes('coverup') || s.includes('cover_up') || s.includes('cover-up') || s.includes('restoration')) return 'cover_up';
  if (s.includes('pmu') || s.includes('makeup') || s.includes('semi-permanent')) return 'pmu_makeup';
  if (s.includes('piercing')) return 'body_piercing';
  if (s.includes('keloid') || s.includes('laser') || s.includes('removal')) return 'laser_removal';
  return 'custom_tattoo';
}

export const BookingPage: React.FC<BookingPageProps> = ({
  initialPiece,
  initialService,
  initialTier,
  onNavigate,
  onOpenWhatsApp
}) => {
  // Form State
  const [serviceType, setServiceType] = useState<BookingServiceType>(() => {
    if (initialService) return mapServiceToBookingType(initialService.id || initialService.category);
    if (initialPiece) return mapServiceToBookingType(initialPiece.serviceId || initialPiece.category);
    return 'custom_tattoo';
  });

  const [selectedServiceObj, setSelectedServiceObj] = useState<ServiceItem | null>(initialService || null);
  const [selectedTierName, setSelectedTierName] = useState<string | null>(initialTier || null);

  const [placement, setPlacement] = useState<string>(
    initialPiece?.zone || (initialService?.id?.includes('piercing') ? 'Ear (Lobe, Helix, Tragus, Conch)' : 'Forearm / Arm')
  );
  
  const [approximateSize, setApproximateSize] = useState<BookingSize>(() => {
    if (initialTier?.toLowerCase().includes('full day')) return 'full_day';
    if (initialTier?.toLowerCase().includes('half day') || initialTier?.toLowerCase().includes('sleeve')) return 'large';
    if (initialTier?.toLowerCase().includes('flash') || initialTier?.toLowerCase().includes('minimal')) return 'small';
    if (initialPiece?.category === 'piercing' || initialService?.id?.includes('piercing') || initialService?.id?.includes('pmu')) return 'piercing_std';
    return 'medium';
  });

  const [description, setDescription] = useState<string>(() => {
    if (initialService) {
      return `Service: ${initialService.title}${initialTier ? ` (${initialTier})` : ''}`;
    }
    if (initialPiece) {
      return `Design: ${initialPiece.title} (Ref #${initialPiece.flashId || initialPiece.id})`;
    }
    return '';
  });

  const [artistId, setArtistId] = useState<string>('marvin');
  
  const getDefaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const [preferredDate, setPreferredDate] = useState<string>(getDefaultDate());
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<BookingTimeSlot>('afternoon');

  // Client Details
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // File Reference
  const [referenceFileName, setReferenceFileName] = useState<string>('');
  const [referenceFilePreview, setReferenceFilePreview] = useState<string>('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [artists, setArtists] = useState<ArtistProfile[]>(ARTISTS_DATA);

  useEffect(() => {
    fetchMembers(true)
      .then((data) => {
        if (data && data.length > 0) setArtists(data);
      })
      .catch(() => {});
  }, []);

  // Sync with incoming props
  useEffect(() => {
    if (initialService) {
      const bType = mapServiceToBookingType(initialService.id || initialService.category);
      setServiceType(bType);
      setSelectedServiceObj(initialService);
      setSelectedTierName(initialTier || null);

      if (bType === 'body_piercing') {
        setPlacement('Ear (Lobe, Helix, Tragus, Conch)');
        setApproximateSize('piercing_std');
      } else if (bType === 'pmu_makeup') {
        setPlacement('Eyebrows (Microblading / Ombré)');
        setApproximateSize('piercing_std');
      }

      if (initialTier) {
        if (initialTier.toLowerCase().includes('full day')) setApproximateSize('full_day');
        else if (initialTier.toLowerCase().includes('half day') || initialTier.toLowerCase().includes('sleeve')) setApproximateSize('large');
        else if (initialTier.toLowerCase().includes('flash') || initialTier.toLowerCase().includes('minimal')) setApproximateSize('small');
        setDescription(`Service: ${initialService.title} (${initialTier})`);
      } else {
        setDescription(`Service: ${initialService.title}`);
      }
    } else if (initialPiece) {
      const bType = mapServiceToBookingType(initialPiece.serviceId || initialPiece.category);
      setServiceType(bType);
      if (initialPiece.zone) setPlacement(initialPiece.zone);
      if (initialPiece.category === 'piercing') setApproximateSize('piercing_std');
      setDescription(`Design: ${initialPiece.title} (Ref #${initialPiece.flashId || initialPiece.id})`);
    }
  }, [initialService, initialPiece, initialTier]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReferenceFileName(file.name);
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setReferenceFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setReferenceFilePreview('');
      }
    }
  };

  const removeUploadedFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReferenceFileName('');
    setReferenceFilePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await bookingApi.createBooking({
        serviceType,
        placement,
        approximateSize,
        description: description || `Service booking: ${serviceType.replace('_', ' ')}`,
        artistId,
        preferredDate,
        preferredTimeSlot,
        fullName,
        phone,
        email,
        notes: notes.trim() || undefined,
        referenceFileName: referenceFileName || undefined,
        referenceFilePreview: referenceFilePreview || undefined
      });

      if (response.success && response.booking) {
        setConfirmedBooking(response.booking);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#991b1b', '#d4af37', '#f8fafc']
        });
      } else {
        setErrorMessage(response.message || 'Unable to submit booking. Please verify your details.');
      }
    } catch {
      setErrorMessage('Network error. Please try again or reach out on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setConfirmedBooking(null);
    setDescription('');
    setFullName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setReferenceFileName('');
    setReferenceFilePreview('');
    setErrorMessage('');
  };

  const sendWhatsAppBookingSummary = (record: BookingRecord) => {
    const artistName = artists.find(a => a.id === record.artistId || a.slug === record.artistId)?.name || 'Studio Artist';
    const message = `Hello Marvin Tattoos Atelier! 
I just submitted an appointment request online.

• Reference Code: ${record.referenceCode}
• Service: ${record.serviceType.replace('_', ' ').toUpperCase()}
• Placement: ${record.placement} (${record.approximateSize})
• Preferred Date: ${record.preferredDate} (${record.preferredTimeSlot})
• Artist: ${artistName}
• Client: ${record.fullName} (${record.phone})

Note: ${record.description}

Looking forward to discussing the design and confirmation.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  };

  const serviceOptions: { id: BookingServiceType; label: string; icon: string }[] = [
    { id: 'realism_portrait', label: 'Realism & Portraits', icon: 'skull' },
    { id: 'fine_line', label: 'Minimalist & Fine-Line', icon: 'pen-fancy' },
    { id: 'lettering_script', label: 'Lettering & Script', icon: 'edit_note' },
    { id: 'tribal_traditional', label: 'Traditional & Tribal', icon: 'layers' },
    { id: 'cover_up', label: 'Cover-Up & Restorations', icon: 'shield-alt' },
    { id: 'pmu_makeup', label: 'Semi-Permanent Makeup', icon: 'edit_note' },
    { id: 'body_piercing', label: 'Body Piercing', icon: 'syringe' },
    { id: 'laser_removal', label: 'Laser & Keloid Clearance', icon: 'magic' },
  ];

  const placementOptions = [
    'Forearm / Arm',
    'Full Sleeve / Half Sleeve',
    'Chest / Ribs / Sternum',
    'Back / Shoulder',
    'Neck / Collarbone',
    'Thigh / Leg / Calf / Ankle',
    'Hands / Fingers',
    'Ear (Lobe, Helix, Tragus, Conch)',
    'Facial (Nose, Septum, Eyebrow, Lip)',
    'Eyebrows / Lips (PMU)',
    'Body Piercing (Navel, Dermal, Nipple)',
    'Other / Custom Placement'
  ];

  const sizeOptions: { id: BookingSize; label: string }[] = [
    { id: 'small', label: 'Small (2–3 inches)' },
    { id: 'medium', label: 'Medium (4–6 inches)' },
    { id: 'large', label: 'Large (Half-sleeve / Thigh / Chest)' },
    { id: 'full_day', label: 'Full Day / Multi-Session (Full sleeve / Back)' },
    { id: 'piercing_std', label: 'Single / Standard Procedure' },
  ];

  return (
    <div className="w-full pt-28 pb-24 px-4 sm:px-6 lg:px-12 max-w-4xl mx-auto min-h-[85vh] text-bone">
      {/* Top Header */}
      <div className="mb-8 border-b border-noir-800 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <button
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-2 text-xs font-label-caps uppercase text-bone-muted hover:text-crimson-light transition-colors mb-2 cursor-pointer"
          >
            <Icons8 name="arrow-left" size={13} />
            <span>View All Services</span>
          </button>
          <h1 className="font-title-editorial text-2xl sm:text-3xl lg:text-4xl text-bone uppercase tracking-tight">
            Book Appointment
          </h1>
          <p className="font-body-sm text-xs sm:text-sm text-bone-dim mt-1">
            Choose your service and fill in your details. Our artist will contact you on WhatsApp to discuss your design.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenWhatsApp}
          className="px-4 py-2 bg-noir-900 hover:bg-noir-850 border border-noir-700 text-bone text-xs font-label-caps uppercase tracking-wider rounded-lg flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Icons8 name="whatsapp" size={15} className="text-emerald-400" />
          <span>Quick WhatsApp</span>
        </button>
      </div>

      {/* CONFIRMED STATE */}
      {confirmedBooking ? (
        <div className="bg-noir-900 border border-emerald-500/40 p-8 sm:p-10 text-center space-y-6 rounded-xl shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
            <Icons8 name="check-circle" size={36} />
          </div>

          <div className="space-y-1">
            <span className="font-label-caps text-xs text-emerald-400 uppercase tracking-widest font-bold block">
              Appointment Request Logged
            </span>
            <h2 className="font-title-editorial text-2xl text-bone uppercase">
              Ref #{confirmedBooking.referenceCode}
            </h2>
            <p className="font-body-sm text-sm text-bone-dim max-w-md mx-auto">
              Thank you, <strong className="text-bone">{confirmedBooking.fullName}</strong>. Our artist will contact you at <strong className="text-gold">{confirmedBooking.phone}</strong> to confirm your slot and details.
            </p>
          </div>

          <div className="p-4 bg-noir-850 border border-noir-750 rounded-lg max-w-lg mx-auto text-left font-label-data text-xs space-y-2">
            <div className="flex justify-between text-bone-dim">
              <span>Service:</span>
              <span className="text-bone font-medium uppercase">{confirmedBooking.serviceType.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between text-bone-dim">
              <span>Placement:</span>
              <span className="text-bone">{confirmedBooking.placement}</span>
            </div>
            <div className="flex justify-between text-bone-dim">
              <span>Preferred Date:</span>
              <span className="text-bone">{confirmedBooking.preferredDate} ({confirmedBooking.preferredTimeSlot.toUpperCase()})</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto pt-2">
            <button
              type="button"
              onClick={() => sendWhatsAppBookingSummary(confirmedBooking)}
              className="flex-1 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-label-caps text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/40"
            >
              <Icons8 name="whatsapp" size={16} />
              <span>Message on WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-3.5 bg-noir-800 hover:bg-noir-750 text-bone font-label-caps text-xs uppercase tracking-widest border border-noir-700 rounded-lg cursor-pointer"
            >
              Book Another Session
            </button>
          </div>
        </div>
      ) : (
        /* SIMPLE INTAKE FORM */
        <form onSubmit={handleSubmit} className="space-y-8">
          {errorMessage && (
            <div className="p-4 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-lg flex items-center gap-2">
              <Icons8 name="exclamation-circle" size={16} className="shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Pre-selected Indicator */}
          {selectedServiceObj && (
            <div className="p-4 bg-noir-900 border border-crimson/50 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedServiceObj.image}
                  alt={selectedServiceObj.title}
                  className="w-12 h-12 object-cover rounded bg-noir-950 border border-noir-700 shrink-0"
                />
                <div>
                  <span className="font-label-caps text-[10px] text-crimson-light uppercase tracking-wider block font-bold">
                    Selected Service
                  </span>
                  <h3 className="font-title-editorial text-sm sm:text-base text-bone uppercase">
                    {selectedServiceObj.title}
                  </h3>
                  {selectedTierName && (
                    <span className="text-gold text-xs font-label-data">Option: {selectedTierName}</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedServiceObj(null);
                  setSelectedTierName(null);
                }}
                className="text-[11px] text-bone-muted hover:text-bone underline font-label-caps uppercase cursor-pointer"
              >
                Change
              </button>
            </div>
          )}

          {/* 1. Service Selection (Grid) */}
          <div className="bg-noir-900 border border-noir-800 rounded-xl p-6 space-y-4">
            <label className="block font-label-caps text-xs uppercase text-bone tracking-wider font-bold">
              1. Select Service Discipline *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {serviceOptions.map((opt) => {
                const isSelected = serviceType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setServiceType(opt.id);
                      if (opt.id === 'body_piercing') {
                        setPlacement('Ear (Lobe, Helix, Tragus, Conch)');
                        setApproximateSize('piercing_std');
                      } else if (opt.id === 'pmu_makeup') {
                        setPlacement('Eyebrows / Lips (PMU)');
                        setApproximateSize('piercing_std');
                      }
                    }}
                    className={`p-3 text-left border rounded-lg transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-crimson/20 border-crimson text-bone ring-1 ring-crimson/50'
                        : 'bg-noir-850 border-noir-750 text-bone-dim hover:text-bone hover:border-noir-600'
                    }`}
                  >
                    <Icons8 name={opt.icon} size={18} className={isSelected ? 'text-crimson-light mb-2' : 'text-bone-muted mb-2'} />
                    <span className="font-label-caps text-xs uppercase font-bold leading-tight">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Placement & Size Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-label-caps text-[11px] uppercase text-bone-dim mb-1">
                  Body Placement *
                </label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-noir-850 border border-noir-700 text-bone text-xs font-body-sm rounded-lg focus:outline-none focus:border-crimson"
                >
                  {placementOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-label-caps text-[11px] uppercase text-bone-dim mb-1">
                  Approximate Size *
                </label>
                <select
                  value={approximateSize}
                  onChange={(e) => setApproximateSize(e.target.value as BookingSize)}
                  className="w-full px-3.5 py-2.5 bg-noir-850 border border-noir-700 text-bone text-xs font-body-sm rounded-lg focus:outline-none focus:border-crimson"
                >
                  {sizeOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Client Contact Info */}
          <div className="bg-noir-900 border border-noir-800 rounded-xl p-6 space-y-4">
            <label className="block font-label-caps text-xs uppercase text-bone tracking-wider font-bold">
              2. Your Contact Information *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-label-caps text-[11px] uppercase text-bone-dim mb-1">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Samuel Mukasa"
                  className="w-full px-3.5 py-2.5 bg-noir-850 border border-noir-700 text-bone text-xs font-body-sm rounded-lg focus:outline-none focus:border-crimson"
                />
              </div>

              <div>
                <label className="block font-label-caps text-[11px] uppercase text-bone-dim mb-1">
                  Phone (WhatsApp) *
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+256 700 000000"
                  className="w-full px-3.5 py-2.5 bg-noir-850 border border-noir-700 text-bone text-xs font-body-sm rounded-lg focus:outline-none focus:border-crimson"
                />
              </div>

              <div>
                <label className="block font-label-caps text-[11px] uppercase text-bone-dim mb-1">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full px-3.5 py-2.5 bg-noir-850 border border-noir-700 text-bone text-xs font-body-sm rounded-lg focus:outline-none focus:border-crimson"
                />
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block font-label-caps text-[11px] uppercase text-bone-dim mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-noir-850 border border-noir-700 text-bone text-xs font-body-sm rounded-lg focus:outline-none focus:border-crimson"
                />
              </div>

              <div>
                <label className="block font-label-caps text-[11px] uppercase text-bone-dim mb-1">
                  Preferred Time *
                </label>
                <select
                  value={preferredTimeSlot}
                  onChange={(e) => setPreferredTimeSlot(e.target.value as BookingTimeSlot)}
                  className="w-full px-3.5 py-2.5 bg-noir-850 border border-noir-700 text-bone text-xs font-body-sm rounded-lg focus:outline-none focus:border-crimson"
                >
                  <option value="morning">Morning (10:00 AM – 1:00 PM)</option>
                  <option value="afternoon">Afternoon (1:30 PM – 5:00 PM)</option>
                  <option value="evening">Evening (5:30 PM – 8:00 PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Notes & Reference Photo (Optional) */}
          <div className="bg-noir-900 border border-noir-800 rounded-xl p-6 space-y-4">
            <label className="block font-label-caps text-xs uppercase text-bone tracking-wider font-bold">
              3. Idea &amp; Reference (Optional)
            </label>

            <div>
              <label className="block font-label-caps text-[11px] uppercase text-bone-dim mb-1">
                Brief Idea / Notes
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe your idea or custom request..."
                className="w-full p-3 bg-noir-850 border border-noir-700 text-bone text-xs font-body-sm rounded-lg focus:outline-none focus:border-crimson resize-y"
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
                    onClick={removeUploadedFile}
                    className="text-xs text-red-400 hover:text-red-300 font-label-caps uppercase cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="p-4 bg-noir-850 border border-dashed border-noir-700 hover:border-slate-500 rounded-lg block text-center transition-colors cursor-pointer">
                  <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="sr-only" />
                  <Icons8 name="cloud-upload-alt" size={20} className="text-bone-muted mx-auto mb-1" />
                  <span className="text-xs text-bone-dim block">Upload reference image (optional)</span>
                </label>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <div className="space-y-3 pt-2">
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
              No deposit charged right now. Our resident artist will review and contact you on WhatsApp to finalize sizing and confirm your slot.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
