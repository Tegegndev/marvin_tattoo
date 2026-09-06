import React, { useState } from 'react';
import { PageView, PortfolioPiece } from '../types';
import { ARTISTS_DATA } from '../data/atelierData';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Upload, 
  ShieldCheck, 
  MessageCircle, 
  Layers, 
  Edit3, 
  Syringe, 
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileCheck
} from 'lucide-react';
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
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Form State
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>(
    initialPiece?.category === 'piercing' ? 'Piercing' : 'Custom Tattoo'
  );
  const [selectedZone, setSelectedZone] = useState<string>(initialPiece?.zone || 'Forearm');
  const [selectedDimension, setSelectedDimension] = useState<string>('Large (7-10")');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Dark Gothic', 'Black & Grey Realism']);
  const [conceptNarrative, setConceptNarrative] = useState<string>(
    initialPiece ? `Based on our piece "${initialPiece.title}" (ID: ${initialPiece.flashId}).` : ''
  );
  const [selectedVaultSample, setSelectedVaultSample] = useState<string>(initialPiece?.title || 'Baroque Memento Mori');
  const [selectedArtist, setSelectedArtist] = useState<string>(initialPiece?.artist || 'Marvin');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-18');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('2:00 PM');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [medicalCheck, setMedicalCheck] = useState<boolean>(true);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  const disciplines = [
    {
      id: 'Custom Tattoo',
      badge: 'Custom',
      icon: <Edit3 className="w-5 h-5 text-crimson-light" />,
      desc: 'One-of-a-kind custom design drawn from scratch, just for you.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbF0kjVhLkWWHDVZS3MXB0sFTeR4iCUYZg4PZUSC-y7hFLZrwH4NoOC8wQQ0hjpzsPVEhsM76SuYl4PSZkFcjxz7qtzn-CzlJ5hlOfMoCsUan-DkuIgrh3lVblkkZw7F4lQVXH5g6Efhls9C4TNPHTA3_UGebNk9jBmtbWXWR7Hbpfw6V0kVEdb87CN_ZiCPN1oTpmEgaCTJTpIscHTnqHfNhCWOBBjVWeu9UzEwtW9TzyeIc0R2CsRQ'
    },
    {
      id: 'Flash Designs',
      badge: 'Flash',
      icon: <Sparkles className="w-5 h-5 text-gold" />,
      desc: 'Ready-to-go designs from the flash wall, first come first served.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ8XqYldeN2RLQHWF5mM1iUwFoIEFi163iGeRSQb40gZPzBn-3RUjkhfB51oBBTPjA3uahQRjcq02m0In3-lZV7LDyQ5vI2GPGUxkaqkkM_1PQWYOjBvd9kXWznG22_1kx20Ucqd12cbl19WH01AJeWux7AMskIdhTR1oEmpbLdcdQ57gPiWa3W8_zh50nd8lR2xLldytTG1xAelB0jp5Y8_YyU4OEJQ0UkzLdNZUX35mpVg-kAKvsKg'
    },
    {
      id: 'Cover-Up',
      badge: 'Cover-Up',
      icon: <Layers className="w-5 h-5 text-crimson-light" />,
      desc: 'Cover-ups and redesigns for tattoos you no longer want.',
      img: 'https://lh3.googleusercontent.com/aida/AEtjO1XNohxnOuUyiuRH81bDZ-UO8NfUNRWjsUcNf17CRapKv9vqwRHRvs3ImL_JXOm2FvDj6HykULWGcCWZgYx9hVcVCLxqzHuv1hF1ialW4869cGWPNTHer5TvmOtY_nxwDKw6nQDMXi3mq1XDnV16QhONJg9c1lC6tE19Ss8zvWLgg3iC8edIVpUsZahYztL6uWO1QlydX2_bGpDx5xF0AII2u44j6IKQa1Bcw-3gRSQPd0R3M512GxMVb3KS'
    },
    {
      id: 'Piercing',
      badge: 'Piercing',
      icon: <Syringe className="w-5 h-5 text-gold" />,
      desc: 'Titanium and gold piercings, done in a sterile room.',
      img: 'https://lh3.googleusercontent.com/aida/AEtjO1UKxCrKf8AiwCBwkQ0y1UMs_JKbByxBZorm3NnTNxcM3ZUiLIEHKRttY1oxTIY8tXi2TfHbXHWEaxX8iCKE7Y9FA5upzEFzSwWIrWxnqAp6eUBMp5xJerdVTc2IyoTZfxksnLUQ3B73pCPmD5mGa1RK-1m3yRqf9WF7mvUATlR7wt3huzzGTWReAc75DBvmAszA-6D1iZXVAevDKv4cizXRfWRXlo0W4XMBRecGsmQe8cPXL1fmD1xw0hhv'
    }
  ];

  const zoneOptions = [
    'Forearm',
    'Full Sleeve',
    'Backpiece',
    'Chest',
    'Leg / Calf',
    'Neck / Throat',
    'Hand / Knuckle',
    'Ear'
  ];

  const dimensionOptions = [
    { id: 'dim-sm', title: 'Small', sub: '< 3 inches', val: 'Small (<3")' },
    { id: 'dim-md', title: 'Medium', sub: '4 to 6 inches', val: 'Medium (4-6")' },
    { id: 'dim-lg', title: 'Large', sub: '7 to 10 inches', val: 'Large (7-10")' },
    { id: 'dim-fullday', title: 'Full Day', sub: '6-8 hours', val: 'Full Day Master Session' }
  ];

  const vectorTags = [
    'Dark Gothic',
    'Black & Grey Realism',
    'Fine Line',
    'Surrealism',
    'Gothic Lettering',
    'Heavy Blackwork'
  ];

  const flashInspirations = [
    {
      title: 'Baroque Memento Mori',
      sub: 'Intricate filigree skull & stippled dagger',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ8XqYldeN2RLQHWF5mM1iUwFoIEFi163iGeRSQb40gZPzBn-3RUjkhfB51oBBTPjA3uahQRjcq02m0In3-lZV7LDyQ5vI2GPGUxkaqkkM_1PQWYOjBvd9kXWznG22_1kx20Ucqd12cbl19WH01AJeWux7AMskIdhTR1oEmpbLdcdQ57gPiWa3W8_zh50nd8lR2xLldytTG1xAelB0jp5Y8_YyU4OEJQ0UkzLdNZUX35mpVg-kAKvsKg'
    },
    {
      title: 'Onyx & Titanium Suite',
      sub: 'Curated constellation & tragus cluster',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJqb8b8q-7l9-Pbg3mG9jG88Xz4ikPRaIXBgW_3RjuIfowtA-EpkKbN2SUwg8sEEOH1c8AaT9BNmAaOEVKOtRD_tctl7YPK2LQOwheKAYKDIkpmH_oqt9S1QoIAbvBskgaFm3CFCt2BOwI3IFuVsRYB344IkymSQVgOqG8A1tOn9xnu4rN-HbGGuc4gEmpDWKmDRpke51vCWD80tJA3vs9uXcz_VIBFI-vDvwiIfoAw2uJfyZBJWrZXQ'
    },
    {
      title: 'Sacred Gothic Script',
      sub: 'Forearm calligraphy & dark void shading',
      img: 'https://lh3.googleusercontent.com/aida/AEtjO1WxJneVTTiW5FtUrPA-UR2MCffuWJAbObh5_9W0vlQKxC_piV154sBLGppN0_wQIIb2QAx1s4TtQItttuHFTtoKW_9vpl7OcIRzDT0xXw5czitVp0NkmhS7cZ-MzVz0skE9_yEGcoDFgvZQdsHHM1rv32xYstg6XDqLe5pD0LijkVhE9CY4QoesFaarKdffwvL8_6aJVdyy4-7wR0JXMwckNFfjtX61dr9yRUqlYQSOHZ-DHbaO_bE-a2E'
    }
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const calculateDeposit = () => {
    if (selectedDiscipline === 'Piercing') return 40;
    if (selectedDimension === 'Full Day Master Session') return 250;
    if (selectedDimension === 'Large (7-10")') return 150;
    return 100;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#8f131d', '#c5a059', '#f4f4f5', '#ff6b72']
    });
  };

  return (
    <div className="w-full pt-20 bg-noir-950 min-h-screen">
      <div className="relative w-full bg-noir-950 text-bone">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 lg:py-12">
          {/* Header Banner */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-noir-700">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 bg-crimson text-bone font-label-caps text-xs uppercase tracking-widest border border-crimson/30">
                  Direct Booking
                </span>
                <span className="text-bone-dim font-label-data text-xs uppercase tracking-widest flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                  Marvin Tattoos Kampala
                </span>
              </div>
              <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-bone tracking-tight leading-none font-bold">
                Book An Appointment
              </h1>
              <p className="font-body-md text-sm text-bone-muted max-w-2xl leading-relaxed">
                Custom tattoos, flash designs, cover-ups, and studio piercings. Fill out your details below to schedule your consultation and session.
              </p>
            </div>

            {/* WhatsApp Direct Link */}
            <button
              type="button"
              onClick={onOpenWhatsApp}
              className="inline-flex items-center justify-between gap-4 px-5 py-3.5 bg-noir-850 hover:bg-noir-800 text-bone transition-colors border border-noir-700"
              aria-label="Contact studio via WhatsApp"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-gold shrink-0" />
                <div className="text-left">
                  <span className="block font-label-caps text-[10px] uppercase text-gold">
                    Instant Consult
                  </span>
                  <span className="font-body-sm text-xs font-semibold text-bone">
                    Chat on WhatsApp
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-bone-dim" />
            </button>
          </header>

          {/* Booking Flow Layout */}
          {!isSubmitted ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-10">
              {/* Main Booking Form */}
              <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-10" noValidate={false}>
                {/* FIELDSET 01: Service Discipline */}
                <fieldset className="space-y-4">
                  <legend className="w-full flex items-baseline justify-between pb-3 border-b border-noir-700/60 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-label-caps text-xs text-crimson-light px-2 py-0.5 bg-noir-850 border border-crimson/30">
                        01
                      </span>
                      <span className="font-headline-sm text-lg sm:text-xl text-bone tracking-wide uppercase font-bold">
                        Service Type
                      </span>
                    </div>
                    <span className="font-label-data text-xs text-crimson-light font-semibold">
                      {selectedDiscipline}
                    </span>
                  </legend>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {disciplines.map((d) => {
                      const isSelected = selectedDiscipline === d.id;
                      const inputId = `service-${d.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                      return (
                        <div key={d.id} className="relative">
                          <input
                            type="radio"
                            id={inputId}
                            name="discipline"
                            value={d.id}
                            checked={isSelected}
                            onChange={() => setSelectedDiscipline(d.id)}
                            className="sr-only peer"
                          />
                          <label
                            htmlFor={inputId}
                            className={`cursor-pointer block relative flex flex-col justify-between p-5 bg-noir-850 transition-colors overflow-hidden border min-h-[140px] peer-focus-visible:ring-2 peer-focus-visible:ring-crimson ${
                              isSelected
                                ? 'border-crimson bg-noir-800 ring-1 ring-crimson'
                                : 'border-noir-700 hover:border-noir-600'
                            }`}
                          >
                            <div
                              className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
                              style={{ backgroundImage: `url('${d.img}')` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-noir-850/95 via-noir-850/80 to-noir-850/50 pointer-events-none" />

                            <div className="relative z-10 flex justify-between items-start mb-4">
                              <div className="flex items-center gap-2">
                                {d.icon}
                                <span className="px-2 py-0.5 bg-noir-950/90 text-bone font-label-caps text-[9px] uppercase tracking-wider border border-noir-700">
                                  {d.badge}
                                </span>
                              </div>
                              <div
                                aria-hidden="true"
                                className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                                  isSelected ? 'bg-crimson border-crimson' : 'border-noir-600 bg-noir-900'
                                }`}
                              >
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-noir-950" />}
                              </div>
                            </div>

                            <div className="relative z-10">
                              <span className="block font-title-editorial text-base text-bone font-bold">
                                {d.id}
                              </span>
                              <span className="block font-body-sm text-xs text-bone-muted mt-1 leading-snug">
                                {d.desc}
                              </span>
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>

                {/* FIELDSET 02: Placement & Scale */}
                <fieldset className="space-y-4">
                  <legend className="w-full flex items-baseline justify-between pb-3 border-b border-noir-700/60 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-label-caps text-xs text-crimson-light px-2 py-0.5 bg-noir-850 border border-crimson/30">
                        02
                      </span>
                      <span className="font-headline-sm text-lg sm:text-xl text-bone tracking-wide uppercase font-bold">
                        Placement &amp; Scale
                      </span>
                    </div>
                    <span className="font-label-data text-xs text-bone-dim">
                      {selectedZone} / {selectedDimension}
                    </span>
                  </legend>

                  <div className="p-6 bg-noir-850 border border-noir-700 space-y-6">
                    {/* Zone Radios */}
                    <div>
                      <span className="font-label-caps text-xs text-bone-dim block mb-3 uppercase tracking-wider">
                        Body Placement
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Body Placement">
                        {zoneOptions.map((z) => {
                          const isZoneActive = selectedZone === z;
                          const zoneId = `zone-${z.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                          return (
                            <div key={z}>
                              <input
                                type="radio"
                                id={zoneId}
                                name="placementZone"
                                value={z}
                                checked={isZoneActive}
                                onChange={() => setSelectedZone(z)}
                                className="sr-only peer"
                              />
                              <label
                                htmlFor={zoneId}
                                className={`block px-3 py-2.5 font-label-data text-xs uppercase tracking-wider text-center cursor-pointer transition-colors border peer-focus-visible:ring-2 peer-focus-visible:ring-crimson ${
                                  isZoneActive
                                    ? 'bg-noir-700 text-crimson-light border-crimson font-bold'
                                    : 'bg-noir-900 text-bone-dim hover:text-bone border-noir-700'
                                }`}
                              >
                                {z}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Scale Radios */}
                    <div>
                      <span className="font-label-caps text-xs text-bone-dim block mb-3 uppercase tracking-wider">
                        Approximate Size / Duration
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Approximate Size">
                        {dimensionOptions.map((dim) => {
                          const isDimActive = selectedDimension === dim.val;
                          return (
                            <div key={dim.id}>
                              <input
                                type="radio"
                                id={dim.id}
                                name="dimensionScale"
                                value={dim.val}
                                checked={isDimActive}
                                onChange={() => setSelectedDimension(dim.val)}
                                className="sr-only peer"
                              />
                              <label
                                htmlFor={dim.id}
                                className={`block p-3 text-center cursor-pointer transition-colors border peer-focus-visible:ring-2 peer-focus-visible:ring-crimson ${
                                  isDimActive
                                    ? 'bg-noir-700 border-crimson text-crimson-light font-bold'
                                    : 'bg-noir-900 border-noir-700 text-bone-dim hover:text-bone'
                                }`}
                              >
                                <span className="font-label-data text-xs block">
                                  {dim.title}
                                </span>
                                <span className="font-body-sm text-[11px] text-bone-dim block mt-0.5">
                                  {dim.sub}
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Placement Confirmation Bar */}
                    <div className="pt-4 border-t border-noir-700/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-bone-dim">
                        <MapPin className="w-4 h-4 text-gold" />
                        <span>Selected Area: <strong className="text-bone">{selectedZone}</strong> ({selectedDimension})</span>
                      </div>
                      <span className="font-label-caps text-[10px] text-bone-dim uppercase bg-noir-900 px-2.5 py-1 border border-noir-700">
                        Custom Stencil Fitting Included
                      </span>
                    </div>
                  </div>
                </fieldset>

                {/* FIELDSET 03: Style & Project Narrative */}
                <fieldset className="space-y-4">
                  <legend className="w-full flex items-baseline justify-between pb-3 border-b border-noir-700/60 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-label-caps text-xs text-crimson-light px-2 py-0.5 bg-noir-850 border border-crimson/30">
                        03
                      </span>
                      <span className="font-headline-sm text-lg sm:text-xl text-bone tracking-wide uppercase font-bold">
                        Style &amp; Concept
                      </span>
                    </div>
                    <span className="font-label-data text-xs text-bone-dim">
                      {selectedTags.length} tags selected
                    </span>
                  </legend>

                  <div className="p-6 bg-noir-850 border border-noir-700 space-y-6">
                    {/* Style Multi-select Tag Checkboxes */}
                    <div>
                      <span className="font-label-caps text-xs text-bone-dim block mb-2 uppercase tracking-wider">
                        Style Preferences (Select all that apply)
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {vectorTags.map((tag) => {
                          const isTagActive = selectedTags.includes(tag);
                          const tagId = `style-${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                          return (
                            <div key={tag}>
                              <input
                                type="checkbox"
                                id={tagId}
                                checked={isTagActive}
                                onChange={() => toggleTag(tag)}
                                className="sr-only peer"
                              />
                              <label
                                htmlFor={tagId}
                                className={`block px-3 py-1.5 font-label-caps text-xs uppercase cursor-pointer transition-colors border peer-focus-visible:ring-2 peer-focus-visible:ring-crimson ${
                                  isTagActive
                                    ? 'bg-crimson text-bone border-crimson font-bold'
                                    : 'bg-noir-900 text-bone-dim hover:text-bone border-noir-700'
                                }`}
                              >
                                {tag}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Narrative Textarea with Accessible Label */}
                    <div className="space-y-2">
                      <label htmlFor="concept-description" className="font-label-caps text-xs text-bone-dim block uppercase tracking-wider">
                        Project Description / Idea Details
                      </label>
                      <textarea
                        id="concept-description"
                        name="conceptDescription"
                        rows={4}
                        value={conceptNarrative}
                        onChange={(e) => setConceptNarrative(e.target.value)}
                        placeholder="Describe your idea: subject matter, specific elements, placement nuances, or existing tattoos to work around..."
                        className="w-full p-4 bg-noir-900 border border-noir-700 text-bone placeholder:text-bone-dim font-body-md text-sm focus:outline-none focus:border-crimson transition-colors resize-y min-h-[100px]"
                      />
                    </div>

                    {/* Flash Vault References */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-label-caps text-xs text-bone-dim uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-gold" />
                          Flash Reference (Optional)
                        </span>
                        <span className="font-label-data text-[10px] text-bone-dim uppercase">
                          Click to pair
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {flashInspirations.map((vault) => {
                          const isVaultActive = selectedVaultSample === vault.title;
                          return (
                            <button
                              key={vault.title}
                              type="button"
                              onClick={() => setSelectedVaultSample(isVaultActive ? '' : vault.title)}
                              className={`p-3 bg-noir-900 border text-left transition-colors cursor-pointer ${
                                isVaultActive
                                  ? 'border-crimson bg-noir-800 ring-1 ring-crimson'
                                  : 'border-noir-700 hover:border-noir-600'
                              }`}
                            >
                              <div className="relative h-24 overflow-hidden bg-noir-950 mb-2">
                                <img
                                  src={vault.img}
                                  alt={vault.title}
                                  className="w-full h-full object-cover"
                                />
                                {isVaultActive && (
                                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-crimson text-bone font-label-caps text-[9px] uppercase">
                                    Selected
                                  </div>
                                )}
                              </div>
                              <span className="font-title-editorial text-xs text-bone truncate block font-bold">
                                {vault.title}
                              </span>
                              <span className="font-body-sm text-[10px] text-bone-dim truncate block mt-0.5">
                                {vault.sub}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Reference File Upload */}
                    <div>
                      <label
                        htmlFor="reference-file-input"
                        className="p-6 bg-noir-900 border-dashed border border-noir-700 hover:border-noir-600 block text-center transition-colors cursor-pointer group"
                      >
                        <input
                          id="reference-file-input"
                          name="referenceFiles"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="sr-only"
                        />
                        {uploadedFileName ? (
                          <div className="flex items-center justify-center gap-2 text-emerald-400">
                            <FileCheck className="w-5 h-5" />
                            <span className="font-body-sm text-sm font-semibold">{uploadedFileName}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-7 h-7 text-bone-dim group-hover:text-crimson-light transition-colors mx-auto mb-2" />
                            <span className="font-title-editorial text-sm text-bone block mb-1">
                              Upload reference photo (Optional)
                            </span>
                            <span className="font-body-sm text-xs text-bone-dim block">
                              JPG, PNG, HEIC up to 25MB. Clear photos of the body area help us plan accurately.
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </fieldset>

                {/* FIELDSET 04: Artist & Schedule */}
                <fieldset className="space-y-4">
                  <legend className="w-full flex items-baseline justify-between pb-3 border-b border-noir-700/60 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-label-caps text-xs text-crimson-light px-2 py-0.5 bg-noir-850 border border-crimson/30">
                        04
                      </span>
                      <span className="font-headline-sm text-lg sm:text-xl text-bone tracking-wide uppercase font-bold">
                        Artist &amp; Schedule
                      </span>
                    </div>
                    <span className="font-label-data text-xs text-bone-dim">
                      {selectedArtist}
                    </span>
                  </legend>

                  {/* Artist Selection Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="radiogroup" aria-label="Preferred Artist">
                    {ARTISTS_DATA.map((art) => {
                      const isArtSelected = selectedArtist === art.name;
                      const artId = `artist-${art.id}`;
                      return (
                        <div key={art.id}>
                          <input
                            type="radio"
                            id={artId}
                            name="preferredArtist"
                            value={art.name}
                            checked={isArtSelected}
                            onChange={() => setSelectedArtist(art.name)}
                            className="sr-only peer"
                          />
                          <label
                            htmlFor={artId}
                            className={`cursor-pointer block p-4 bg-noir-850 transition-colors flex flex-col justify-between border h-full peer-focus-visible:ring-2 peer-focus-visible:ring-crimson ${
                              isArtSelected
                                ? 'border-crimson bg-noir-800 ring-1 ring-crimson'
                                : 'border-noir-700 hover:border-noir-600'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <img
                                src={art.avatar}
                                alt={art.name}
                                className="w-12 h-12 rounded-full object-cover shrink-0 border border-noir-700"
                              />
                              <div className="min-w-0">
                                <span className="font-title-editorial text-sm text-bone truncate block font-bold">
                                  {art.name}
                                </span>
                                <span className="font-label-caps text-[9px] text-crimson-light uppercase block truncate">
                                  {art.specialty.split(',')[0]}
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-label-data text-bone-dim pt-2 border-t border-noir-700">
                              <span>{art.experience}</span>
                              <span className="text-gold">{art.slotsRemaining} slots this month</span>
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  {/* Date & Time Controls */}
                  <div className="p-6 bg-noir-850 border border-noir-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="appointment-date" className="block font-label-caps text-xs text-bone-dim uppercase mb-2 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gold" />
                        Preferred Date *
                      </label>
                      <input
                        id="appointment-date"
                        name="appointmentDate"
                        type="date"
                        required
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-noir-900 border border-noir-700 text-bone font-label-data text-xs focus:outline-none focus:border-crimson"
                      />
                    </div>

                    <div>
                      <label htmlFor="appointment-slot" className="block font-label-caps text-xs text-bone-dim uppercase mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                        Time Window *
                      </label>
                      <select
                        id="appointment-slot"
                        name="appointmentSlot"
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-noir-900 border border-noir-700 text-bone font-label-data text-xs focus:outline-none focus:border-crimson"
                      >
                        <option value="11:00 AM">Morning Session (11:00 AM)</option>
                        <option value="2:00 PM">Afternoon Session (2:00 PM)</option>
                        <option value="6:00 PM">Evening Session (6:00 PM)</option>
                      </select>
                    </div>
                  </div>
                </fieldset>

                {/* FIELDSET 05: Client Contact Information */}
                <fieldset className="space-y-4">
                  <legend className="w-full flex items-baseline justify-between pb-3 border-b border-noir-700/60 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-label-caps text-xs text-crimson-light px-2 py-0.5 bg-noir-850 border border-crimson/30">
                        05
                      </span>
                      <span className="font-headline-sm text-lg sm:text-xl text-bone tracking-wide uppercase font-bold">
                        Client Information
                      </span>
                    </div>
                  </legend>

                  <div className="p-6 bg-noir-850 border border-noir-700 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="client-fullname" className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 flex items-center gap-1">
                          <User className="w-3 h-3 text-bone-dim" />
                          Full Name *
                        </label>
                        <input
                          id="client-fullname"
                          name="clientFullName"
                          required
                          type="text"
                          autoComplete="name"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Jane Doe"
                          className="w-full px-3 py-2 bg-noir-900 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
                        />
                      </div>

                      <div>
                        <label htmlFor="client-phone" className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-bone-dim" />
                          Phone / WhatsApp *
                        </label>
                        <input
                          id="client-phone"
                          name="clientPhone"
                          required
                          type="tel"
                          autoComplete="tel"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="+1 (212) 555-0199"
                          className="w-full px-3 py-2 bg-noir-900 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
                        />
                      </div>

                      <div>
                        <label htmlFor="client-email" className="block font-label-caps text-[10px] uppercase text-bone-dim mb-1 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-bone-dim" />
                          Email *
                        </label>
                        <input
                          id="client-email"
                          name="clientEmail"
                          required
                          type="email"
                          autoComplete="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="client@domain.com"
                          className="w-full px-3 py-2 bg-noir-900 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
                        />
                      </div>
                    </div>

                    {/* Terms & Conditions Checkbox */}
                    <div className="pt-2">
                      <label htmlFor="client-medical-terms" className="flex items-start gap-3 cursor-pointer text-xs font-body-sm text-bone-muted select-none">
                        <input
                          id="client-medical-terms"
                          name="medicalCheck"
                          type="checkbox"
                          checked={medicalCheck}
                          onChange={(e) => setMedicalCheck(e.target.checked)}
                          className="mt-0.5 rounded border-noir-700 text-crimson focus:ring-0 cursor-pointer"
                        />
                        <span>
                          I confirm I am 18+ years old with valid ID, not pregnant or nursing, and agree to the studio's 48-hour cancellation policy.
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!medicalCheck || !clientName.trim()}
                      className="w-full py-4 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 border border-crimson/40 disabled:opacity-50 disabled:cursor-not-allowed font-bold mt-4"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Submit Booking Request</span>
                    </button>
                  </div>
                </fieldset>
              </form>

              {/* Right Column: Order / Appointment Summary */}
              <aside className="lg:col-span-4 space-y-6" aria-label="Appointment Summary">
                <div className="sticky top-28 bg-noir-850 p-6 border border-noir-700 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-noir-700">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-crimson-light" />
                      <h2 className="font-title-editorial text-base uppercase text-bone font-bold">
                        Booking Summary
                      </h2>
                    </div>
                    <span className="font-label-caps text-[9px] text-gold uppercase tracking-wider border border-gold/30 px-2 py-0.5">
                      Kampala Studio
                    </span>
                  </div>

                  <dl className="space-y-3 font-label-data text-xs">
                    <div className="flex justify-between py-1 border-b border-noir-700/40">
                      <dt className="text-bone-dim uppercase">Service:</dt>
                      <dd className="text-bone font-semibold">{selectedDiscipline}</dd>
                    </div>

                    <div className="flex justify-between py-1 border-b border-noir-700/40">
                      <dt className="text-bone-dim uppercase">Placement:</dt>
                      <dd className="text-bone font-semibold">{selectedZone}</dd>
                    </div>

                    <div className="flex justify-between py-1 border-b border-noir-700/40">
                      <dt className="text-bone-dim uppercase">Scale:</dt>
                      <dd className="text-bone font-semibold">{selectedDimension}</dd>
                    </div>

                    <div className="flex justify-between py-1 border-b border-noir-700/40">
                      <dt className="text-bone-dim uppercase">Artist:</dt>
                      <dd className="text-crimson-light font-bold">{selectedArtist}</dd>
                    </div>

                    <div className="flex justify-between py-1 border-b border-noir-700/40">
                      <dt className="text-bone-dim uppercase">Date:</dt>
                      <dd className="text-gold font-bold">{selectedDate}</dd>
                    </div>

                    <div className="flex justify-between py-1 border-b border-noir-700/40">
                      <dt className="text-bone-dim uppercase">Time Window:</dt>
                      <dd className="text-bone">{selectedTimeSlot}</dd>
                    </div>
                  </dl>

                  {/* Calculated Deposit */}
                  <div className="p-4 bg-noir-900 border border-noir-700 space-y-1.5">
                    <div className="flex justify-between items-center font-label-caps text-xs">
                      <span className="text-bone-dim uppercase">Session Deposit:</span>
                      <span className="text-crimson-light font-bold text-base font-label-data">
                        ${calculateDeposit()}.00
                      </span>
                    </div>
                    <p className="text-[11px] text-bone-dim leading-tight font-body-sm">
                      Deducted directly from the final cost on the day of your appointment.
                    </p>
                  </div>

                  {/* Direct WhatsApp Consultation */}
                  <div className="p-4 bg-noir-900 border border-gold/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-gold font-label-caps uppercase font-bold">
                      <MessageCircle className="w-4 h-4" />
                      <span>Have specific questions?</span>
                    </div>
                    <p className="font-body-sm text-[11px] text-bone-dim">
                      Message Marvin and our artists directly on WhatsApp for quick feedback on sizing, reference art, or scheduling.
                    </p>
                    <button
                      type="button"
                      onClick={onOpenWhatsApp}
                      className="w-full py-2 bg-noir-800 hover:bg-noir-750 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors border border-noir-700 text-center block font-bold"
                    >
                      Message Studio on WhatsApp
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            /* Confirmation Success State */
            <div
              role="status"
              aria-live="polite"
              className="max-w-2xl mx-auto py-16 text-center space-y-8"
            >
              <div className="w-16 h-16 rounded-full bg-crimson/20 border border-crimson text-crimson-light flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-3">
                <span className="font-label-caps text-xs text-gold uppercase tracking-widest block">
                  Request Confirmed
                </span>
                <h2 className="font-headline-xl text-3xl sm:text-4xl text-bone uppercase font-bold">
                  Booking Request Received
                </h2>
                <p className="font-body-md text-sm text-bone-muted max-w-lg mx-auto leading-relaxed">
                  Thank you, <strong className="text-bone">{clientName || 'Client'}</strong>. We have received your booking request for <strong className="text-gold">{selectedDate}</strong> with <strong className="text-crimson-light">{selectedArtist}</strong>. Our team will review your project and confirm via WhatsApp or email within 4 hours.
                </p>
              </div>

              <div className="p-6 bg-noir-850 border border-noir-700 text-left font-label-data text-xs space-y-2.5 max-w-md mx-auto">
                <div className="flex justify-between text-bone-dim">
                  <span>Service:</span>
                  <span className="text-bone font-semibold">{selectedDiscipline}</span>
                </div>
                <div className="flex justify-between text-bone-dim">
                  <span>Artist:</span>
                  <span className="text-crimson-light font-bold">{selectedArtist}</span>
                </div>
                <div className="flex justify-between text-bone-dim">
                  <span>Placement &amp; Size:</span>
                  <span className="text-bone">{selectedZone} ({selectedDimension})</span>
                </div>
                <div className="flex justify-between text-bone-dim">
                  <span>Scheduled Date:</span>
                  <span className="text-gold font-bold">{selectedDate} at {selectedTimeSlot}</span>
                </div>
                <div className="flex justify-between text-bone-dim">
                  <span>Contact:</span>
                  <span className="text-bone">{clientPhone}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={onOpenWhatsApp}
                  className="px-6 py-3 bg-gold text-noir-950 font-label-caps text-xs uppercase tracking-widest font-bold hover:bg-gold-light transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message on WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="px-6 py-3 bg-noir-850 hover:bg-noir-800 text-bone font-label-caps text-xs uppercase tracking-wider transition-colors border border-noir-700"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
