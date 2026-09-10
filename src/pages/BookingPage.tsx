import React, { useState, useEffect } from 'react';
import { PageView, PortfolioPiece, ServiceItem, BookingServiceType, BookingSize, BookingTimeSlot, BookingRecord, ArtistProfile } from '../types';
import { ARTISTS_DATA, MARVIN_DIRECT_PHONE, WHATSAPP_NUMBER } from '../data/atelierData';
import { Icons8 } from '../components/Icons8';
import { bookingApi } from '../services/bookingApi';
import { fetchMembers, fetchServices } from '../services/apiClient';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

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
  if (s.includes('keloid')) return 'keloid_removal';
  if (s.includes('laser') || s.includes('removal')) return 'laser_removal';
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
    initialPiece?.zone || (initialService?.id?.includes('piercing') ? 'Ear (Lobe, Helix, Tragus, Conch, Industrial)' : 'Forearm / Wrist')
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
      return `Booking for: ${initialService.title}${initialTier ? ` (${initialTier})` : ''}.\n\n• Project Concept: `;
    }
    if (initialPiece) {
      return `Project inspired by artwork: "${initialPiece.title}" (Ref #${initialPiece.flashId || initialPiece.id}).\n\n• Project Details: `;
    }
    return '';
  });

  const [artistId, setArtistId] = useState<string>(
    initialPiece?.artist ? (initialPiece.artist.toLowerCase().includes('marvin') ? 'marvin' : 'any') : 'marvin'
  );
  
  // Set default preferred date to 2 days from now
  const getDefaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const [preferredDate, setPreferredDate] = useState<string>(getDefaultDate());
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<BookingTimeSlot>('afternoon');

  // Client Info
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // File Reference
  const [referenceFileName, setReferenceFileName] = useState<string>('');
  const [referenceFilePreview, setReferenceFilePreview] = useState<string>('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Dynamic Team Members / Artists
  const [artists, setArtists] = useState<ArtistProfile[]>(ARTISTS_DATA);

  useEffect(() => {
    fetchMembers(true)
      .then((data) => {
        if (data && data.length > 0) {
          setArtists(data);
        }
      })
      .catch((err) => {
        console.warn('Could not load dynamic members in BookingPage:', err);
      });
  }, []);

  // Sync state when props change
  useEffect(() => {
    if (initialService) {
      const bType = mapServiceToBookingType(initialService.id || initialService.category);
      setServiceType(bType);
      setSelectedServiceObj(initialService);
      setSelectedTierName(initialTier || null);

      if (bType === 'body_piercing') {
        setPlacement('Ear (Lobe, Helix, Tragus, Conch, Industrial)');
        setApproximateSize('piercing_std');
      } else if (bType === 'pmu_makeup') {
        setPlacement('Eyebrows (Microblading / Ombré PMU)');
        setApproximateSize('piercing_std');
      } else if (bType === 'cover_up') {
        setPlacement('Forearm / Wrist');
        setApproximateSize('medium');
      }

      if (initialTier) {
        if (initialTier.toLowerCase().includes('full day')) setApproximateSize('full_day');
        else if (initialTier.toLowerCase().includes('half day') || initialTier.toLowerCase().includes('sleeve')) setApproximateSize('large');
        else if (initialTier.toLowerCase().includes('flash') || initialTier.toLowerCase().includes('minimal')) setApproximateSize('small');
        setDescription(`Booking for: ${initialService.title} (${initialTier}).\n\n• Project Concept: `);
      } else {
        setDescription(`Booking for: ${initialService.title} (${initialService.subtitle || ''}).\n\n• Project Concept: `);
      }
    } else if (initialPiece) {
      const bType = mapServiceToBookingType(initialPiece.serviceId || initialPiece.category);
      setServiceType(bType);
      if (initialPiece.zone) {
        setPlacement(initialPiece.zone);
      }
      if (initialPiece.category === 'piercing') {
        setApproximateSize('piercing_std');
      }
      setDescription(`Project inspired by artwork: "${initialPiece.title}" (Ref #${initialPiece.flashId || initialPiece.id}).\n\n• Project Details: `);
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
        description,
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
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#991b1b', '#d4af37', '#f8fafc']
        });
      } else {
        setErrorMessage(response.message || 'Unable to submit booking request. Please check your inputs.');
      }
    } catch {
      setErrorMessage('Network error while reaching booking service. Please retry or contact us via WhatsApp.');
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
    const artistName = artists.find(a => a.id === record.artistId || a.slug === record.artistId)?.name || 'First Available Artist';
    const message = `Hello Marvin Tattoos Atelier! 
I just submitted a booking request through your website.

• Reference Code: ${record.referenceCode}
• Service: ${record.serviceType.replace('_', ' ').toUpperCase()}
• Placement: ${record.placement} (${record.approximateSize})
• Preferred Date: ${record.preferredDate} (${record.preferredTimeSlot})
• Artist: ${artistName}
• Client: ${record.fullName} (${record.phone})

Description: ${record.description}

Looking forward to hearing from you!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  };

  const serviceOptions: { id: BookingServiceType; label: string; sub: string; icon: string }[] = [
    {
      id: 'realism_portrait',
      label: 'Realism & Portraits',
      sub: 'High-detail black & grey photo-realism',
      icon: 'skull'
    },
    {
      id: 'fine_line',
      label: 'Minimalist & Fine-Line',
      sub: 'Delicate geometric lines and micro-tattoos',
      icon: 'pen-fancy'
    },
    {
      id: 'lettering_script',
      label: 'Lettering & Script',
      sub: 'Custom calligraphy, gothic lettering & quotes',
      icon: 'edit_note'
    },
    {
      id: 'tribal_traditional',
      label: 'Traditional & Tribal',
      sub: 'Bold blackwork, Polynesian & tribal armor',
      icon: 'layers'
    },
    {
      id: 'cover_up',
      label: 'Cover-Up & Restorations',
      sub: 'Concealing, blending, or restoring old ink',
      icon: 'shield-alt'
    },
    {
      id: 'pmu_makeup',
      label: 'Semi-Permanent Makeup',
      sub: 'Microblading, Ombré brows, Pink lips & camo',
      icon: 'edit_note'
    },
    {
      id: 'body_piercing',
      label: 'Precision Body Piercing',
      sub: 'Ear, facial, dermals, navel & titanium mods',
      icon: 'syringe'
    },
    {
      id: 'laser_removal',
      label: 'Laser & Keloids Removal',
      sub: 'Safe pigment fading & keloid clearance',
      icon: 'magic'
    }
  ];

  const sizeOptions: { id: BookingSize; label: string; detail: string }[] = [
    { id: 'small', label: 'Small (2–3")', detail: 'Fine-line, micro script, simple symbols' },
    { id: 'medium', label: 'Medium (4–6")', detail: 'Forearm, calf, shoulder, palm-sized pieces' },
    { id: 'large', label: 'Large (7–10")', detail: 'Half-sleeve, thigh, chest, ribcage' },
    { id: 'full_day', label: 'Full Day / Multi-Session', detail: 'Full sleeve, backpiece, large dark realism' },
    { id: 'piercing_std', label: 'Standard Procedure', detail: 'Single/multi piercing or PMU/laser session' }
  ];

  const placementOptions = [
    'Forearm / Wrist',
    'Upper Arm / Bicep / Shoulder',
    'Full Sleeve / Half Sleeve',
    'Chest / Sternum / Ribcage',
    'Back / Spine / Back Dermals',
    'Collarbone / Neck / Throat',
    'Thigh / Leg / Calf / Ankle',
    'Hands / Fingers',
    'Eyebrows (Microblading / Ombré PMU)',
    'Lips (Pink Lips Blush / Neutralization)',
    'Stretch Marks Area (Camouflage)',
    'Ear (Lobe, Helix, Tragus, Conch, Industrial)',
    'Facial / Oral (Nose, Septum, Eyebrow, Lip, Tongue, Smiley)',
    'Body Piercing (Navel, Surface Dermals, Nipple, Christina)',
    'Other / Custom Placement'
  ];

  // Dynamic Prompt Guidance based on active service
  const getServiceGuidance = (type: BookingServiceType) => {
    switch (type) {
      case 'cover_up':
        return {
          title: 'Cover-Up & Rework Specifics',
          icon: 'shield-alt',
          tips: [
            'Describe the existing tattoo (how old it is, and if it is very dark black or faded).',
            'Mention your target replacement idea (dark realism, floral, or heavy blackwork work best).',
            'Please upload a well-lit photo of your current tattoo below for the artists to assess coverage.'
          ]
        };
      case 'body_piercing':
        return {
          title: 'Body Piercing Anatomy Specifics',
          icon: 'syringe',
          tips: [
            'Specify the exact anatomical location (e.g. Septum, Conch, Tragus, Navel, Surface Dermal, Nipple).',
            'All initial piercings use mirror-polished implant-grade titanium (ASTM F-136).',
            'Mention if you have had a previous piercing in this spot or any scar tissue.'
          ]
        };
      case 'pmu_makeup':
        return {
          title: 'Semi-Permanent Cosmetic Specifics',
          icon: 'edit_note',
          tips: [
            'Specify your preferred treatment: Powder Ombré Brows, Lip Blush Neutralization, or Stretch Mark Camouflage.',
            'Mention if you have prior microblading or permanent makeup pigment in the target area.',
            'Describe your desired intensity (natural soft tint vs defined density).'
          ]
        };
      case 'laser_removal':
      case 'keloid_removal':
        return {
          title: 'Laser / Skin Clearance Specifics',
          icon: 'magic',
          tips: [
            'Detail the keloid location and approximate size in centimeters, or the tattoo ink colors to be faded.',
            'Mention any prior treatments (steroid injections, cryo, or previous laser sessions).',
            'Upload a clear close-up image of the target area below.'
          ]
        };
      case 'lettering_script':
        return {
          title: 'Lettering & Script Specifics',
          icon: 'edit_note',
          tips: [
            'Type out the exact wording, names, quotes, or numbers with correct spelling/capitalization.',
            'Specify preferred script aesthetic (Old English Gothic, Chicano script, or delicate cursive).'
          ]
        };
      case 'fine_line':
        return {
          title: 'Minimalist & Fine-Line Specifics',
          icon: 'pen-fancy',
          tips: [
            'Mention the desired dimensions in centimeters or inches.',
            'Single needle work requires flat, stable placement areas (forearm, bicep, collarbone, ankle).'
          ]
        };
      default:
        return {
          title: 'Custom Project Specifics',
          icon: 'skull',
          tips: [
            'Describe your core concept, mood, and key symbolic visual elements.',
            'Specify if you want high-contrast dark realism, atmospheric backgrounds, or custom filigree.',
            'Upload reference photos or moodboards below to assist our artists in composing your stencil.'
          ]
        };
    }
  };

  const activeGuidance = getServiceGuidance(serviceType);

  return (
    <div className="w-full pt-20 bg-noir-950 min-h-screen text-bone">
      {/* Header Banner */}
      <section className="w-full bg-noir-900 py-12 md:py-16 px-4 md:px-8 lg:px-12 border-b border-noir-700/40">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
              <span className="font-label-caps text-xs uppercase text-crimson-light tracking-[0.25em] font-bold">
                STUDIO APPOINTMENT DESK
              </span>
            </div>
            <span className="font-label-data text-xs text-bone-dim">KAMPALA · LEVEL 5 PIONEER MALL</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-bone uppercase font-bold tracking-tight">
                Book a Session
              </h1>
              <p className="font-body-md text-sm text-bone-muted max-w-2xl mt-2 leading-relaxed">
                Submit your project specifications below. Our resident artists review placement, sizing, and design complexity to confirm your booking and preparation guidance.
              </p>
            </div>

            {/* Fast WhatsApp Contact Box */}
            <div className="p-4 bg-noir-850 border border-noir-700 flex items-center justify-between gap-4 shrink-0 rounded-sm">
              <div className="space-y-0.5">
                <span className="font-label-caps text-[11px] text-bone uppercase tracking-wider block font-bold flex items-center gap-1.5">
                  <Icons8 name="whatsapp" size={14} className="text-emerald-400" />
                  Direct WhatsApp Desk
                </span>
                <span className="font-body-sm text-xs text-bone-dim block">
                  Quick questions &amp; immediate consultation
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenWhatsApp}
                className="px-4 py-2 bg-noir-800 hover:bg-noir-750 text-bone border border-noir-700 hover:border-slate-400 font-label-caps text-xs uppercase font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Chat</span>
                <Icons8 name="external-link-alt" size={12} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-12 md:py-16 bg-noir-950">
        <div className="max-w-6xl mx-auto">
          {/* CONFIRMATION / SUCCESS VIEW */}
          {confirmedBooking ? (
            <div className="max-w-2xl mx-auto bg-noir-900 border border-emerald-500/40 p-8 sm:p-10 space-y-8 rounded-sm shadow-2xl">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
                  <Icons8 name="check-circle" size={32} />
                </div>
                <span className="font-label-caps text-xs text-emerald-400 uppercase tracking-[0.2em] font-bold block">
                  Booking Request Received
                </span>
                <h2 className="font-headline-xl text-2xl sm:text-3xl text-bone uppercase font-bold">
                  Reference #{confirmedBooking.referenceCode}
                </h2>
                <p className="font-body-md text-sm text-bone-muted max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-bone">{confirmedBooking.fullName}</strong>. Your request has been logged in our studio booking registry.
                </p>
              </div>

              {/* Booking Summary Table */}
              <div className="p-5 bg-noir-850 border border-noir-700 space-y-3 font-label-data text-xs">
                <div className="flex justify-between py-1.5 border-b border-noir-700/60">
                  <span className="text-bone-dim">Service Category</span>
                  <span className="text-bone font-bold uppercase">{confirmedBooking.serviceType.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-noir-700/60">
                  <span className="text-bone-dim">Placement &amp; Scale</span>
                  <span className="text-bone font-bold">{confirmedBooking.placement} ({confirmedBooking.approximateSize})</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-noir-700/60">
                  <span className="text-bone-dim">Preferred Date &amp; Time</span>
                  <span className="text-bone font-bold">{confirmedBooking.preferredDate} · {confirmedBooking.preferredTimeSlot.toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-noir-700/60">
                  <span className="text-bone-dim">Artist</span>
                  <span className="text-bone font-bold">
                    {artists.find(a => a.id === confirmedBooking.artistId || a.slug === confirmedBooking.artistId)?.name || 'First Available Artist'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-bone-dim">Contact</span>
                  <span className="text-bone font-bold">{confirmedBooking.phone} · {confirmedBooking.email}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => sendWhatsAppBookingSummary(confirmedBooking)}
                  className="w-full sm:w-1/2 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-bone font-label-caps text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2 border border-emerald-600 cursor-pointer"
                >
                  <Icons8 name="whatsapp" size={16} />
                  <span>Send to WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-1/2 py-3.5 bg-noir-850 hover:bg-noir-800 text-bone border border-noir-700 font-label-caps text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book Another Session</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => onNavigate('home')}
                  className="font-label-caps text-[11px] text-bone-dim hover:text-bone uppercase tracking-wider transition-colors cursor-pointer"
                >
                  ← Return to Home Atelier
                </button>
              </div>
            </div>
          ) : (
            /* INTAKE FORM VIEW */
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Error Alert */}
              {errorMessage && (
                <div className="p-4 bg-crimson/20 border border-crimson text-crimson-light text-sm font-body-md rounded-sm flex items-center gap-3">
                  <Icons8 name="shield-alt" size={20} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* DYNAMIC SERVICE PRE-SELECTED BANNER */}
              {selectedServiceObj && (
                <div className="p-5 bg-gradient-to-r from-noir-900 via-noir-850 to-noir-900 border-2 border-crimson/40 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-crimson/10">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedServiceObj.image}
                      alt={selectedServiceObj.title}
                      className="w-14 h-14 object-cover rounded bg-noir-950 border border-noir-700 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <span className="font-label-caps text-[10px] text-crimson-light uppercase tracking-widest block font-bold">
                        Pre-selected Atelier Discipline {selectedServiceObj.disciplineNumber ? `0${selectedServiceObj.disciplineNumber}` : ''}
                      </span>
                      <h3 className="font-title-editorial text-base sm:text-lg text-bone uppercase font-bold">
                        {selectedServiceObj.title}
                      </h3>
                      {selectedTierName && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gold/15 border border-gold/40 rounded text-gold text-[11px] font-label-data">
                          <Icons8 name="tag" size={11} />
                          <span>Option: {selectedTierName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedServiceObj(null);
                      setSelectedTierName(null);
                    }}
                    className="text-xs font-label-caps uppercase text-bone-muted hover:text-bone underline self-start sm:self-center cursor-pointer"
                  >
                    Change Discipline
                  </button>
                </div>
              )}

              {/* 01. SERVICE & PLACEMENT */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-noir-700/80">
                  <span className="font-label-caps text-xs text-crimson-light px-2.5 py-0.5 bg-noir-850 border border-crimson/40 font-bold">
                    STEP 01
                  </span>
                  <h2 className="font-headline-sm text-xl text-bone uppercase font-bold">
                    Service &amp; Body Placement
                  </h2>
                </div>

                {/* Service Type 8-Card Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {serviceOptions.map((opt) => {
                    const isSelected = serviceType === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setServiceType(opt.id);
                          if (opt.id === 'body_piercing') {
                            setApproximateSize('piercing_std');
                            setPlacement('Ear (Lobe, Helix, Tragus, Conch, Industrial)');
                          } else if (opt.id === 'pmu_makeup') {
                            setApproximateSize('piercing_std');
                            setPlacement('Eyebrows (Microblading / Ombré PMU)');
                          } else if (opt.id === 'laser_removal') {
                            setApproximateSize('medium');
                            setPlacement('Forearm / Wrist');
                          } else if (approximateSize === 'piercing_std') {
                            setApproximateSize('medium');
                            setPlacement('Forearm / Wrist');
                          }
                        }}
                        className={`p-5 text-left border rounded-sm transition-all duration-200 flex flex-col justify-between h-full cursor-pointer ${
                          isSelected
                            ? 'bg-noir-800 border-crimson ring-1 ring-crimson shadow-md shadow-crimson/10'
                            : 'bg-noir-900 border-noir-700 hover:border-slate-500'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="p-2 bg-noir-950 border border-noir-700">
                              <Icons8 name={opt.icon} size={18} className={isSelected ? 'text-crimson-light' : 'text-bone-muted'} />
                            </div>
                            {isSelected && (
                              <span className="font-label-caps text-[9px] uppercase px-1.5 py-0.5 bg-crimson text-bone font-bold">
                                Selected
                              </span>
                            )}
                          </div>
                          <span className="font-title-editorial text-sm sm:text-base text-bone font-bold block pt-1">
                            {opt.label}
                          </span>
                          <p className="font-body-sm text-xs text-bone-muted leading-relaxed">
                            {opt.sub}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Placement and Size Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-noir-900 border border-noir-700 rounded-sm">
                  {/* Body Area */}
                  <div className="space-y-2">
                    <label htmlFor="placement-select" className="font-label-caps text-xs text-bone-dim uppercase tracking-wider block font-bold">
                      Target Body Placement *
                    </label>
                    <select
                      id="placement-select"
                      value={placement}
                      onChange={(e) => setPlacement(e.target.value)}
                      className="w-full px-4 py-3 bg-noir-950 border border-noir-700 text-bone font-body-md text-sm focus:outline-none focus:border-crimson transition-colors rounded-sm"
                    >
                      {placementOptions.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Approximate Size */}
                  <div className="space-y-2">
                    <label htmlFor="size-select" className="font-label-caps text-xs text-bone-dim uppercase tracking-wider block font-bold">
                      Approximate Size &amp; Session Scale *
                    </label>
                    <select
                      id="size-select"
                      value={approximateSize}
                      onChange={(e) => setApproximateSize(e.target.value as BookingSize)}
                      className="w-full px-4 py-3 bg-noir-950 border border-noir-700 text-bone font-body-md text-sm focus:outline-none focus:border-crimson transition-colors rounded-sm"
                    >
                      {sizeOptions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label} — {s.detail}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 02. PROJECT CONCEPT & ADAPTIVE DETAILS */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-noir-700/80">
                  <span className="font-label-caps text-xs text-crimson-light px-2.5 py-0.5 bg-noir-850 border border-crimson/40 font-bold">
                    STEP 02
                  </span>
                  <h2 className="font-headline-sm text-xl text-bone uppercase font-bold">
                    Project Details &amp; Reference Upload
                  </h2>
                </div>

                <div className="p-6 bg-noir-900 border border-noir-700 rounded-sm space-y-6">
                  {/* Dynamic Adaptive Guidance Box */}
                  <div className="p-4 bg-noir-850 border-l-2 border-gold rounded-r space-y-2">
                    <div className="flex items-center gap-2 text-gold font-label-caps text-xs uppercase font-bold tracking-wider">
                      <Icons8 name={activeGuidance.icon} size={15} />
                      <span>{activeGuidance.title}</span>
                    </div>
                    <ul className="space-y-1 text-xs text-bone-muted list-disc list-inside font-body-sm leading-relaxed">
                      {activeGuidance.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Concept Description */}
                  <div className="space-y-2">
                    <label htmlFor="project-description" className="font-label-caps text-xs text-bone-dim uppercase tracking-wider block font-bold">
                      Describe Your Project / Subject Specifications *
                    </label>
                    <textarea
                      id="project-description"
                      required
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="E.g. Full dark realism portrait of a lion with baroque filigree, black & grey shading, approximately 6 inches on outer forearm..."
                      className="w-full p-4 bg-noir-950 border border-noir-700 text-bone placeholder:text-bone-dim font-body-md text-sm focus:outline-none focus:border-crimson transition-colors rounded-sm resize-y min-h-[120px]"
                    />
                  </div>

                  {/* Reference Image Upload with Preview */}
                  <div>
                    <label className="font-label-caps text-xs text-bone-dim uppercase tracking-wider block font-bold mb-2">
                      Reference Photo / Existing Ink Photo (Optional)
                    </label>
                    
                    {referenceFileName ? (
                      <div className="p-4 bg-noir-950 border border-noir-700 rounded-sm flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {referenceFilePreview ? (
                            <img
                              src={referenceFilePreview}
                              alt="Reference preview"
                              className="w-12 h-12 object-cover border border-noir-700 rounded-sm shrink-0"
                            />
                          ) : (
                            <div className="p-2.5 bg-noir-900 border border-noir-700 shrink-0">
                              <Icons8 name="file-invoice" size={20} className="text-emerald-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-body-sm text-sm text-bone font-semibold block truncate">
                              {referenceFileName}
                            </span>
                            <span className="font-label-data text-xs text-emerald-400 block">
                              Attached for artist review
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={removeUploadedFile}
                          className="px-3 py-1.5 bg-noir-850 hover:bg-crimson text-bone font-label-caps text-xs uppercase border border-noir-700 transition-colors shrink-0 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="reference-file-upload"
                        className="p-6 bg-noir-950 border-dashed border border-noir-700 hover:border-slate-400 rounded-sm block text-center transition-colors cursor-pointer group"
                      >
                        <input
                          id="reference-file-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          onChange={handleFileUpload}
                          className="sr-only"
                        />
                        <Icons8 name="cloud-upload-alt" size={28} className="text-bone-dim group-hover:text-crimson-light transition-colors mx-auto mb-2" />
                        <span className="font-title-editorial text-sm text-bone block mb-1">
                          Click to upload reference image or existing tattoo photo
                        </span>
                        <span className="font-body-sm text-xs text-bone-dim block">
                          PNG, JPG, WEBP or PDF up to 25MB. Visual references help our artists gauge scale, coverage, and placement.
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* 03. ARTIST & DATE SCHEDULE */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-noir-700/80">
                  <span className="font-label-caps text-xs text-crimson-light px-2.5 py-0.5 bg-noir-850 border border-crimson/40 font-bold">
                    STEP 03
                  </span>
                  <h2 className="font-headline-sm text-xl text-bone uppercase font-bold">
                    Artist &amp; Schedule Preference
                  </h2>
                </div>

                {/* Artist Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* First Available Artist */}
                  <button
                    type="button"
                    onClick={() => setArtistId('any')}
                    className={`p-4 border rounded-sm text-left transition-all flex flex-col justify-between cursor-pointer ${
                      artistId === 'any'
                        ? 'bg-noir-800 border-crimson ring-1 ring-crimson'
                        : 'bg-noir-900 border-noir-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-noir-950 border border-noir-700 flex items-center justify-center text-gold">
                        <Icons8 name="magic" size={18} />
                      </div>
                      <span className="font-title-editorial text-sm text-bone font-bold block">
                        First Available Artist
                      </span>
                      <p className="font-body-sm text-xs text-bone-dim">
                        Best match for your chosen discipline &amp; date
                      </p>
                    </div>
                  </button>

                  {/* Studio Resident Artists */}
                  {artists.map((art) => {
                    const isSelected = artistId === (art.slug || art.id);
                    return (
                      <button
                        key={art.id}
                        type="button"
                        onClick={() => setArtistId(art.slug || art.id)}
                        className={`p-4 border rounded-sm text-left transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-noir-800 border-crimson ring-1 ring-crimson'
                            : 'bg-noir-900 border-noir-700 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <img
                            src={art.avatar}
                            alt={art.name}
                            className="w-10 h-10 rounded-full object-cover border border-noir-700 shrink-0"
                          />
                          <div>
                            <span className="font-title-editorial text-sm text-bone font-bold block truncate">
                              {art.name}
                            </span>
                            <span className="font-label-caps text-[10px] text-crimson-light block truncate uppercase">
                              {art.role}
                            </span>
                          </div>
                        </div>
                        <p className="font-body-sm text-xs text-bone-dim line-clamp-2">
                          {art.specialty}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Date and Time Slot */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-noir-900 border border-noir-700 rounded-sm">
                  <div className="space-y-2">
                    <label htmlFor="preferred-date" className="font-label-caps text-xs text-bone-dim uppercase tracking-wider block font-bold">
                      Preferred Date *
                    </label>
                    <input
                      id="preferred-date"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-4 py-3 bg-noir-950 border border-noir-700 text-bone font-body-md text-sm focus:outline-none focus:border-crimson transition-colors rounded-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="time-slot" className="font-label-caps text-xs text-bone-dim uppercase tracking-wider block font-bold">
                      Preferred Session Slot *
                    </label>
                    <select
                      id="time-slot"
                      value={preferredTimeSlot}
                      onChange={(e) => setPreferredTimeSlot(e.target.value as BookingTimeSlot)}
                      className="w-full px-4 py-3 bg-noir-950 border border-noir-700 text-bone font-body-md text-sm focus:outline-none focus:border-crimson transition-colors rounded-sm"
                    >
                      <option value="morning">Morning (10:00 AM – 1:00 PM)</option>
                      <option value="afternoon">Afternoon (1:30 PM – 5:00 PM)</option>
                      <option value="evening">Evening (5:30 PM – 8:00 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 04. CLIENT CONTACT DETAILS */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-noir-700/80">
                  <span className="font-label-caps text-xs text-crimson-light px-2.5 py-0.5 bg-noir-850 border border-crimson/40 font-bold">
                    STEP 04
                  </span>
                  <h2 className="font-headline-sm text-xl text-bone uppercase font-bold">
                    Client Contact Information
                  </h2>
                </div>

                <div className="p-6 bg-noir-900 border border-noir-700 rounded-sm space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="client-name" className="font-label-caps text-xs text-bone-dim uppercase tracking-wider block font-bold">
                        Full Name *
                      </label>
                      <input
                        id="client-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Samuel Mukasa"
                        className="w-full px-4 py-2.5 bg-noir-950 border border-noir-700 text-bone font-body-md text-sm focus:outline-none focus:border-crimson transition-colors rounded-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="client-phone" className="font-label-caps text-xs text-bone-dim uppercase tracking-wider block font-bold">
                        Phone Number (WhatsApp) *
                      </label>
                      <input
                        id="client-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+256 700 000000"
                        className="w-full px-4 py-2.5 bg-noir-950 border border-noir-700 text-bone font-body-md text-sm focus:outline-none focus:border-crimson transition-colors rounded-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="client-email" className="font-label-caps text-xs text-bone-dim uppercase tracking-wider block font-bold">
                        Email Address *
                      </label>
                      <input
                        id="client-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="client@example.com"
                        className="w-full px-4 py-2.5 bg-noir-950 border border-noir-700 text-bone font-body-md text-sm focus:outline-none focus:border-crimson transition-colors rounded-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label htmlFor="client-notes" className="font-label-caps text-xs text-bone-dim uppercase tracking-wider block font-bold">
                      Medical / Skin Notes (Optional)
                    </label>
                    <input
                      id="client-notes"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Skin sensitivity, allergy to specific numbing creams, first tattoo session..."
                      className="w-full px-4 py-2.5 bg-noir-950 border border-noir-700 text-bone font-body-md text-xs focus:outline-none focus:border-crimson transition-colors rounded-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Action */}
              <div className="space-y-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-crimson hover:bg-crimson-hover disabled:opacity-50 text-bone font-label-caps text-sm uppercase tracking-[0.2em] font-bold transition-all btn-gothic-glow border border-crimson/40 rounded-sm flex items-center justify-center gap-3 shadow-xl cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Icons8 name="spinner" size={18} className="animate-spin" />
                      <span>Logging Booking Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Appointment Request</span>
                      <Icons8 name="arrow-right" size={16} />
                    </>
                  )}
                </button>
                <p className="text-center font-label-data text-xs text-bone-dim">
                  No payment is charged now. Our studio concierge reviews each booking to verify sizing, placement, and time requirements.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
