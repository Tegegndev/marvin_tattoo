import React, { useState, useEffect } from 'react';
import { PageView, PortfolioPiece, BookingServiceType, BookingSize, BookingTimeSlot, BookingRecord, ArtistProfile } from '../types';
import { ARTISTS_DATA, MARVIN_DIRECT_PHONE, WHATSAPP_NUMBER } from '../data/atelierData';
import { Icons8 } from '../components/Icons8';
import { bookingApi } from '../services/bookingApi';
import { fetchMembers } from '../services/apiClient';
import confetti from 'canvas-confetti';


interface BookingPageProps {
  initialPiece?: PortfolioPiece | null;
  onNavigate: (page: PageView) => void;
  onOpenWhatsApp: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  initialPiece,
  onNavigate,
  onOpenWhatsApp
}) => {
  // Form State
  const [serviceType, setServiceType] = useState<BookingServiceType>(
    initialPiece?.category === 'piercing' ? 'body_piercing' : 'custom_tattoo'
  );
  const [placement, setPlacement] = useState<string>(initialPiece?.zone || 'Forearm');
  const [approximateSize, setApproximateSize] = useState<BookingSize>(
    initialPiece?.category === 'piercing' ? 'piercing_std' : 'medium'
  );
  const [description, setDescription] = useState<string>(
    initialPiece ? `Project inspired by piece: "${initialPiece.title}" (Ref #${initialPiece.flashId || initialPiece.id}).` : ''
  );
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
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#991b1b', '#94a3b8', '#f8fafc']
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
      id: 'custom_tattoo',
      label: 'Custom Tattoo',
      sub: 'Bespoke design drawn for your body and anatomy',
      icon: 'pen-fancy'
    },
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
      label: 'Cover-Up & Rework',
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
      sub: 'Ear, facial, dermals, navel, nipple & body mods',
      icon: 'syringe'
    },
    {
      id: 'laser_removal',
      label: 'Laser Tattoo Removal',
      sub: 'Safe pigment fading & complete ink removal',
      icon: 'colorize'
    },
    {
      id: 'keloid_removal',
      label: 'Keloids Removal',
      sub: 'Certified skin treatment and safe removal',
      icon: 'magic'
    }
  ];

  const sizeOptions: { id: BookingSize; label: string; detail: string }[] = [
    { id: 'small', label: 'Small (2–3")', detail: 'Fine-line, micro script, simple symbols' },
    { id: 'medium', label: 'Medium (4–6")', detail: 'Forearm, calf, shoulder, palm-sized pieces' },
    { id: 'large', label: 'Large (7–10")', detail: 'Half-sleeve, thigh, chest, ribcage' },
    { id: 'full_day', label: 'Full Day / Multi-Session', detail: 'Full sleeve, backpiece, large dark realism' },
    { id: 'piercing_std', label: 'Standard Treatment / Piercing', detail: 'Single/multi piercing or PMU/laser treatment' }
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

  return (
    <div className="w-full pt-20 bg-noir-950 min-h-screen text-bone">
      {/* Header Banner */}
      <section className="w-full bg-noir-900 py-12 md:py-16 px-4 md:px-8 lg:px-12 border-b border-noir-700/40">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-crimson" />
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
                className="px-4 py-2 bg-noir-800 hover:bg-noir-750 text-bone border border-noir-700 hover:border-slate-400 font-label-caps text-xs uppercase font-bold transition-all shrink-0 flex items-center gap-1.5"
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
                  className="w-full sm:w-1/2 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-bone font-label-caps text-xs uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2 border border-emerald-600"
                >
                  <Icons8 name="whatsapp" size={16} />
                  <span>Send to WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-1/2 py-3.5 bg-noir-850 hover:bg-noir-800 text-bone border border-noir-700 font-label-caps text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Book Another Session</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => onNavigate('home')}
                  className="font-label-caps text-[11px] text-bone-dim hover:text-bone uppercase tracking-wider transition-colors"
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

                {/* Service Type 4-Card Selector */}
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
                          } else if (opt.id === 'laser_removal' || opt.id === 'keloid_removal') {
                            setApproximateSize('medium');
                            setPlacement('Forearm / Wrist');
                          } else if (approximateSize === 'piercing_std') {
                            setApproximateSize('medium');
                            setPlacement('Forearm / Wrist');
                          }
                        }}
                        className={`p-5 text-left border rounded-sm transition-all duration-200 flex flex-col justify-between h-full ${
                          isSelected
                            ? 'bg-noir-800 border-crimson ring-1 ring-crimson'
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
                          <span className="font-title-editorial text-base text-bone font-bold block pt-1">
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
                      Body Placement Area *
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
                      Approximate Size Scale *
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

              {/* 02. PROJECT CONCEPT & REFERENCE PHOTO */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-noir-700/80">
                  <span className="font-label-caps text-xs text-crimson-light px-2.5 py-0.5 bg-noir-850 border border-crimson/40 font-bold">
                    STEP 02
                  </span>
                  <h2 className="font-headline-sm text-xl text-bone uppercase font-bold">
                    Project Concept &amp; References
                  </h2>
                </div>

                <div className="p-6 bg-noir-900 border border-noir-700 rounded-sm space-y-6">
                  {/* Concept Description */}
                  <div className="space-y-2">
                    <label htmlFor="project-description" className="font-label-caps text-xs text-bone-dim uppercase tracking-wider block font-bold">
                      Describe Your Idea / Subject Details *
                    </label>
                    <textarea
                      id="project-description"
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="E.g. Dark realism lion portrait on forearm with gothic filigree accents, black & grey shading, approximately 6 inches..."
                      className="w-full p-4 bg-noir-950 border border-noir-700 text-bone placeholder:text-bone-dim font-body-md text-sm focus:outline-none focus:border-crimson transition-colors rounded-sm resize-y min-h-[100px]"
                    />
                  </div>

                  {/* Reference Image Upload with Preview */}
                  <div>
                    <label className="font-label-caps text-xs text-bone-dim uppercase tracking-wider block font-bold mb-2">
                      Reference Photo / Placement Photo (Optional)
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
                              Ready for upload with booking payload
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={removeUploadedFile}
                          className="px-3 py-1.5 bg-noir-850 hover:bg-crimson text-bone font-label-caps text-xs uppercase border border-noir-700 transition-colors shrink-0"
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
                          Click to upload reference image
                        </span>
                        <span className="font-body-sm text-xs text-bone-dim block">
                          PNG, JPG, WEBP or PDF up to 25MB. Visual references help our artists gauge scale and details.
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
                    className={`p-4 border rounded-sm text-left transition-all flex flex-col justify-between ${
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
                        Best match for your style &amp; date
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

                        className={`p-4 border rounded-sm text-left transition-all flex flex-col justify-between ${
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
                          <div className="min-w-0">
                            <span className="font-title-editorial text-sm text-bone font-bold block truncate">
                              {art.name}
                            </span>
                            <span className="font-label-caps text-[9px] text-crimson-light uppercase block truncate font-bold">
                              {art.specialty}
                            </span>
                          </div>
                        </div>
                        <span className="font-label-data text-[11px] text-bone-dim pt-2 border-t border-noir-700/70 block">
                          {art.experience} Craft
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Date & Time Slot Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-noir-900 border border-noir-700 rounded-sm">
                  <div className="space-y-2">
                    <label htmlFor="session-date" className="font-label-caps text-xs text-bone-dim uppercase tracking-wider block font-bold flex items-center gap-1.5">
                      <Icons8 name="calendar-alt" size={14} className="text-gold" />
                      Preferred Date *
                    </label>
                    <input
                      id="session-date"
                      type="date"
                      required
                      min={getDefaultDate()}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-4 py-3 bg-noir-950 border border-noir-700 text-bone font-label-data text-sm focus:outline-none focus:border-crimson rounded-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="session-time" className="font-label-caps text-xs text-bone-dim uppercase tracking-wider block font-bold flex items-center gap-1.5">
                      <Icons8 name="clock" size={14} className="text-gold" />
                      Preferred Time Slot *
                    </label>
                    <select
                      id="session-time"
                      value={preferredTimeSlot}
                      onChange={(e) => setPreferredTimeSlot(e.target.value as BookingTimeSlot)}
                      className="w-full px-4 py-3 bg-noir-950 border border-noir-700 text-bone font-body-md text-sm focus:outline-none focus:border-crimson rounded-sm"
                    >
                      <option value="morning">Morning Slot (11:00 AM)</option>
                      <option value="afternoon">Afternoon Slot (2:00 PM)</option>
                      <option value="evening">Evening Slot (5:00 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 04. CLIENT CONTACT & SUBMISSION */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-noir-700/80">
                  <span className="font-label-caps text-xs text-crimson-light px-2.5 py-0.5 bg-noir-850 border border-crimson/40 font-bold">
                    STEP 04
                  </span>
                  <h2 className="font-headline-sm text-xl text-bone uppercase font-bold">
                    Your Contact Details
                  </h2>
                </div>

                <div className="p-6 bg-noir-900 border border-noir-700 rounded-sm space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                        placeholder="e.g. Sandra Nabirye"
                        className="w-full px-3.5 py-2.5 bg-noir-950 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson rounded-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="client-phone" className="font-label-caps text-xs text-bone-dim uppercase tracking-wider block font-bold">
                        WhatsApp / Phone *
                      </label>
                      <input
                        id="client-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+256 705 748774"
                        className="w-full px-3.5 py-2.5 bg-noir-950 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson rounded-sm"
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
                        className="w-full px-3.5 py-2.5 bg-noir-950 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson rounded-sm"
                      />
                    </div>
                  </div>

                  {/* Special Notes */}
                  <div className="space-y-1.5 pt-2">
                    <label htmlFor="client-notes" className="font-label-caps text-xs text-bone-dim uppercase tracking-wider block font-bold">
                      Additional Notes / Inquiries (Optional)
                    </label>
                    <input
                      id="client-notes"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="E.g. First tattoo, skin allergies, or specific questions..."
                      className="w-full px-3.5 py-2.5 bg-noir-950 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson rounded-sm"
                    />
                  </div>
                </div>

                {/* Submit Button & Policies */}
                <div className="space-y-4 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-crimson hover:bg-crimson-hover disabled:opacity-50 text-bone font-label-caps text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-xl border border-crimson/40 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-bone border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting Request to Studio...</span>
                      </>
                    ) : (
                      <>
                        <Icons8 name="calendar-check" size={18} />
                        <span>Submit Booking Request</span>
                      </>
                    )}
                  </button>

                  <p className="font-body-sm text-xs text-bone-dim text-center leading-relaxed max-w-2xl mx-auto">
                    By submitting, our team will review your project specs and contact you via WhatsApp / Phone to confirm session timing and provide preparation instructions.
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
