import React, { useState } from 'react';
import { PageView, PortfolioPiece } from '../types';
import { ARTISTS_DATA } from '../data/atelierData';
import { motion, AnimatePresence } from 'framer-motion';
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
  MapPin 
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
  const [selectedArtist, setSelectedArtist] = useState<string>(initialPiece?.artist || 'Master Marvin');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-18');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('2:00 PM');
  const [patronName, setPatronName] = useState<string>('');
  const [patronPhone, setPatronPhone] = useState<string>('');
  const [patronEmail, setPatronEmail] = useState<string>('');
  const [medicalCheck, setMedicalCheck] = useState<boolean>(true);

  const disciplines = [
    {
      id: 'Custom Tattoo',
      badge: 'Custom',
      icon: <Edit3 className="w-5 h-5 text-primary" />,
      desc: 'One-of-a-kind custom design drawn from scratch, just for you.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbF0kjVhLkWWHDVZS3MXB0sFTeR4iCUYZg4PZUSC-y7hFLZrwH4NoOC8wQQ0hjpzsPVEhsM76SuYl4PSZkFcjxz7qtzn-CzlJ5hlOfMoCsUan-DkuIgrh3lVblkkZw7F4lQVXH5g6Efhls9C4TNPHTA3_UGebNk9jBmtbWXWR7Hbpfw6V0kVEdb87CN_ZiCPN1oTpmEgaCTJTpIscHTnqHfNhCWOBBjVWeu9UzEwtW9TzyeIc0R2CsRQ'
    },
    {
      id: 'Flash Designs',
      badge: 'Flash',
      icon: <Sparkles className="w-5 h-5 text-secondary" />,
      desc: 'Ready-to-go designs from the flash wall, first come first served.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ8XqYldeN2RLQHWF5mM1iUwFoIEFi163iGeRSQb40gZPzBn-3RUjkhfB51oBBTPjA3uahQRjcq02m0In3-lZV7LDyQ5vI2GPGUxkaqkkM_1PQWYOjBvd9kXWznG22_1kx20Ucqd12cbl19WH01AJeWux7AMskIdhTR1oEmpbLdcdQ57gPiWa3W8_zh50nd8lR2xLldytTG1xAelB0jp5Y8_YyU4OEJQ0UkzLdNZUX35mpVg-kAKvsKg'
    },
    {
      id: 'Cover-Up',
      badge: 'Cover-Up',
      icon: <Layers className="w-5 h-5 text-primary" />,
      desc: 'Cover-ups and redesigns for tattoos you no longer want.',
      img: 'https://lh3.googleusercontent.com/aida/AEtjO1XNohxnOuUyiuRH81bDZ-UO8NfUNRWjsUcNf17CRapKv9vqwRHRvs3ImL_JXOm2FvDj6HykULWGcCWZgYx9hVcVCLxqzHuv1hF1ialW4869cGWPNTHer5TvmOtY_nxwDKw6nQDMXi3mq1XDnV16QhONJg9c1lC6tE19Ss8zvWLgg3iC8edIVpUsZahYztL6uWO1QlydX2_bGpDx5xF0AII2u44j6IKQa1Bcw-3gRSQPd0R3M512GxMVb3KS'
    },
    {
      id: 'Piercing',
      badge: 'Piercing',
      icon: <Syringe className="w-5 h-5 text-secondary" />,
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
    { title: 'Small', sub: '< 3 inches', val: 'Small (<3")' },
    { title: 'Medium', sub: '4 to 6 inches', val: 'Medium (4-6")' },
    { title: 'Large', sub: '7 to 10 inches', val: 'Large (7-10")' },
    { title: 'Full Day', sub: '6-8 hours', val: 'Full Day Master Session' }
  ];

  const vectorTags = [
    'Dark Gothic',
    'Black & Grey Realism',
    'Fine Line',
    'Surrealism',
    'Gothic Lettering',
    'Heavy Blackwork'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#8a0b14', '#e9c349', '#ffffff', '#ffb3ad']
    });
  };

  return (
    <div className="w-full pt-20 bg-surface-container-lowest min-h-screen">
      <div className="relative w-full overflow-hidden bg-surface-container-lowest text-on-surface">
        {/* Glow Spheres */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-primary-container blur-[140px]" />
          <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-secondary-container blur-[130px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 lg:py-12">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-surface-container-highest">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 bg-primary-container text-on-primary font-label-caps text-xs uppercase tracking-widest border border-primary/30">
                  Booking
                </span>
                <span className="text-outline font-label-data text-xs uppercase tracking-widest flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                  Marvin &amp; Team
                </span>
              </div>
              <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-6xl text-on-surface tracking-tight leading-none font-bold">
                Tattoo &amp; Pierce
              </h1>
              <p className="font-body-md text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                Custom tattoos, cover-ups, and piercing appointments. Every booking starts with a consultation to go over design, placement, and aftercare.
              </p>
            </div>

            {/* Expedited WhatsApp Desk */}
            <button
              onClick={onOpenWhatsApp}
              className="inline-flex items-center justify-between gap-4 px-5 py-3.5 bg-surface-container-high hover:bg-surface-bright text-on-surface transition-all shadow-md group border border-surface-container-highest"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <span className="block font-label-caps text-[10px] uppercase text-secondary">
                    Fast Response
                  </span>
                  <span className="font-body-sm text-xs font-semibold text-on-surface">
                    Message on WhatsApp
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-outline group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Booking Flow Wizard Layout */}
          {!isSubmitted ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-10">
              {/* Left Column: Form Steps (8 Cols) */}
              <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-12">
                {/* STEP 01: Select Discipline */}
                <section className="space-y-6">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-label-caps text-xs text-primary px-2 py-0.5 bg-surface-container border border-primary/30">
                        01
                      </span>
                      <h2 className="font-headline-sm text-lg sm:text-xl text-on-surface tracking-wide uppercase font-bold">
                        Choose a Service
                      </h2>
                    </div>
                    <span className="font-label-data text-xs text-outline font-semibold">
                      {selectedDiscipline}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {disciplines.map((d) => {
                      const isSelected = selectedDiscipline === d.id;
                      return (
                        <div
                          key={d.id}
                          onClick={() => setSelectedDiscipline(d.id)}
                          className={`cursor-pointer group relative flex flex-col justify-between p-5 bg-surface-container transition-all overflow-hidden border ${
                            isSelected
                              ? 'border-primary ring-1 ring-primary bg-surface-container-high'
                              : 'border-surface-container-highest hover:border-outline'
                          }`}
                        >
                          <div
                            className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity"
                            style={{ backgroundImage: `url('${d.img}')` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-surface-container/95 via-surface-container/80 to-surface-container/40 pointer-events-none" />

                          <div className="relative z-10 flex justify-between items-start mb-6">
                            <div className="flex items-center gap-2">
                              {d.icon}
                              <span className="px-2 py-0.5 bg-surface-container-lowest/90 text-on-surface font-label-caps text-[9px] uppercase tracking-wider border border-surface-container-highest">
                                {d.badge}
                              </span>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                                isSelected ? 'bg-primary border-primary' : 'border-outline-variant bg-surface-bright'
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest" />}
                            </div>
                          </div>

                          <div className="relative z-10">
                            <h3 className="font-title-editorial text-base text-on-surface group-hover:text-primary transition-colors font-bold">
                              {d.id}
                            </h3>
                            <p className="font-body-sm text-xs text-on-surface-variant mt-1 leading-snug">
                              {d.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* STEP 02: Placement & Scale */}
                <section className="space-y-6">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-label-caps text-xs text-primary px-2 py-0.5 bg-surface-container border border-primary/30">
                        02
                      </span>
                      <h2 className="font-headline-sm text-lg sm:text-xl text-on-surface tracking-wide uppercase font-bold">
                        Placement &amp; Scale
                      </h2>
                    </div>
                    <span className="font-label-data text-xs text-outline">
                      {selectedZone} / {selectedDimension}
                    </span>
                  </div>

                  <div className="p-6 bg-surface-container border border-surface-container-highest space-y-6">
                    {/* Zone Selector */}
                    <div>
                      <span className="font-label-caps text-xs text-outline block mb-3 uppercase tracking-wider">
                        Placement
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {zoneOptions.map((z) => (
                          <button
                            key={z}
                            type="button"
                            onClick={() => setSelectedZone(z)}
                            className={`px-3 py-2 font-label-data text-xs uppercase tracking-wider text-center transition-all border ${
                              selectedZone === z
                                ? 'bg-surface-bright text-primary border-primary font-bold'
                                : 'bg-surface-container-low text-outline hover:text-on-surface border-surface-container-highest'
                            }`}
                          >
                            {z}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dimension Selector */}
                    <div>
                      <span className="font-label-caps text-xs text-outline block mb-3 uppercase tracking-wider">
                        Size
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        {dimensionOptions.map((dim) => {
                          const isDimActive = selectedDimension === dim.val;
                          return (
                            <button
                              key={dim.val}
                              type="button"
                              onClick={() => setSelectedDimension(dim.val)}
                              className={`p-3 text-center transition-colors border ${
                                isDimActive
                                  ? 'bg-surface-bright border-primary text-primary'
                                  : 'bg-surface-container-low border-surface-container-highest text-outline hover:text-on-surface'
                              }`}
                            >
                              <span className="font-label-data text-xs block font-bold">
                                {dim.title}
                              </span>
                              <span className="font-body-sm text-[11px] text-outline block mt-0.5">
                                {dim.sub}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Anatomical Calibration Box */}
                    <div className="pt-4 border-t border-surface-container-highest">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-label-caps text-xs text-outline uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-secondary" />
                          Placement Preview
                        </span>
                        <span className="font-label-data text-xs text-secondary">
                          {selectedZone}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-surface-container-low border border-surface-container-highest items-center">
                        <div className="md:col-span-4 relative overflow-hidden bg-surface-dim h-40">
                          <img
                            alt="Placement guide reference"
                            className="w-full h-full object-cover opacity-90"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbF0kjVhLkWWHDVZS3MXB0sFTeR4iCUYZg4PZUSC-y7hFLZrwH4NoOC8wQQ0hjpzsPVEhsM76SuYl4PSZkFcjxz7qtzn-CzlJ5hlOfMoCsUan-DkuIgrh3lVblkkZw7F4lQVXH5g6Efhls9C4TNPHTA3_UGebNk9jBmtbWXWR7Hbpfw6V0kVEdb87CN_ZiCPN1oTpmEgaCTJTpIscHTnqHfNhCWOBBjVWeu9UzEwtW9TzyeIc0R2CsRQ"
                          />
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-surface-container-lowest/90 text-primary font-label-caps text-[9px] uppercase border border-primary/30">
                            Scope: {selectedDimension}
                          </div>
                        </div>
                        <div className="md:col-span-8 space-y-3">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="p-2 bg-surface-container border border-surface-container-highest text-center">
                              <span className="block font-label-caps text-outline uppercase text-[9px]">Zone</span>
                              <span className="font-title-editorial text-on-surface text-xs truncate block">{selectedZone}</span>
                            </div>
                            <div className="p-2 bg-surface-container border border-surface-container-highest text-center">
                              <span className="block font-label-caps text-outline uppercase text-[9px]">Protocol</span>
                              <span className="font-title-editorial text-primary text-xs truncate block">1-2 Sessions</span>
                            </div>
                            <div className="p-2 bg-surface-container border border-surface-container-highest text-center">
                              <span className="block font-label-caps text-outline uppercase text-[9px]">Sterilization</span>
                              <span className="font-title-editorial text-secondary text-xs truncate block">Autoclave</span>
                            </div>
                          </div>
                          <p className="font-body-sm text-xs text-outline leading-snug">
                            We'll map the design to your body at the stencil appointment, so it sits right and moves naturally.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* STEP 03: Stylistic Reference & Narrative */}
                <section className="space-y-6">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-label-caps text-xs text-primary px-2 py-0.5 bg-surface-container border border-primary/30">
                        03
                      </span>
                      <h2 className="font-headline-sm text-lg sm:text-xl text-on-surface tracking-wide uppercase font-bold">
                        Design &amp; Details
                      </h2>
                    </div>
                    <span className="font-label-data text-xs text-outline">
                      {selectedTags.length} styles selected
                    </span>
                  </div>

                  <div className="p-6 bg-surface-container border border-surface-container-highest space-y-6">
                    {/* Styles */}
                    <div>
                      <span className="font-label-caps text-xs text-outline block mb-2 uppercase tracking-wider">
                        Style (select all that apply)
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {vectorTags.map((tag) => {
                          const isTagActive = selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleTag(tag)}
                              className={`px-3 py-1.5 font-label-caps text-xs uppercase transition-all border ${
                                isTagActive
                                  ? 'bg-primary-container text-on-primary border-primary'
                                  : 'bg-surface-container-low text-outline hover:text-on-surface border-surface-container-highest'
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Narrative Textarea */}
                    <div className="space-y-2">
                      <label className="font-label-caps text-xs text-outline block uppercase tracking-wider">
                        About Your Tattoo
                      </label>
                      <textarea
                        rows={4}
                        value={conceptNarrative}
                        onChange={(e) => setConceptNarrative(e.target.value)}
                        placeholder="Tell us what you want: the subject, the meaning, and any tattoos already in that area..."
                        className="w-full p-4 bg-surface-container-low border border-surface-container-highest text-on-surface placeholder:text-outline font-body-md text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>

                    {/* Flash Vault Style Samples */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-label-caps text-xs text-outline uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-secondary" />
                          Flash Inspiration
                        </span>
                        <span className="font-label-data text-[10px] text-outline uppercase">
                          Tap to pick
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
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
                        ].map((vault) => {
                          const isVaultActive = selectedVaultSample === vault.title;
                          return (
                            <div
                              key={vault.title}
                              onClick={() => setSelectedVaultSample(vault.title)}
                              className={`p-3 bg-surface-container-low border cursor-pointer transition-all ${
                                isVaultActive
                                  ? 'border-primary ring-1 ring-primary bg-surface-bright'
                                  : 'border-surface-container-highest hover:border-outline'
                              }`}
                            >
                              <div className="relative h-28 overflow-hidden bg-surface-dim mb-2">
                                <img
                                  src={vault.img}
                                  alt={vault.title}
                                  className="w-full h-full object-cover"
                                />
                                {isVaultActive && (
                                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-primary text-on-primary font-label-caps text-[9px] uppercase">
                                    Selected
                                  </div>
                                )}
                              </div>
                              <h4 className="font-title-editorial text-sm text-on-surface truncate">
                                {vault.title}
                              </h4>
                              <p className="font-body-sm text-[11px] text-outline truncate mt-0.5">
                                {vault.sub}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Reference Upload Box */}
                    <div className="p-6 bg-surface-container-low border-dashed border border-surface-container-highest hover:border-outline text-center transition-colors cursor-pointer group">
                      <Upload className="w-8 h-8 text-outline group-hover:text-primary transition-colors mx-auto mb-2" />
                      <span className="font-title-editorial text-sm text-on-surface block mb-1">
                        Drag &amp; drop reference photos
                      </span>
                      <span className="font-body-sm text-xs text-outline block">
                        JPG, PNG, HEIC up to 25MB. Include clear photos of the area, especially for cover-ups.
                      </span>
                    </div>
                  </div>
                </section>

                {/* STEP 04: Artist & Time Window */}
                <section className="space-y-6">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-label-caps text-xs text-primary px-2 py-0.5 bg-surface-container border border-primary/30">
                        04
                      </span>
                      <h2 className="font-headline-sm text-lg sm:text-xl text-on-surface tracking-wide uppercase font-bold">
                        Artist &amp; Time Window
                      </h2>
                    </div>
                    <span className="font-label-data text-xs text-outline">
                      {selectedArtist}
                    </span>
                  </div>

                  {/* Artists Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {ARTISTS_DATA.map((art) => {
                      const isArtSelected = selectedArtist === art.name;
                      return (
                        <div
                          key={art.id}
                          onClick={() => setSelectedArtist(art.name)}
                          className={`cursor-pointer p-4 bg-surface-container transition-all flex flex-col justify-between border ${
                            isArtSelected
                              ? 'border-primary ring-1 ring-primary bg-surface-bright'
                              : 'border-surface-container-highest hover:border-outline'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={art.avatar}
                              alt={art.name}
                              className="w-12 h-12 rounded-full object-cover shrink-0 border border-surface-container-highest"
                            />
                            <div className="min-w-0">
                              <h4 className="font-title-editorial text-sm text-on-surface truncate font-bold">
                                {art.name}
                              </h4>
                              <span className="font-label-caps text-[9px] text-primary uppercase block truncate">
                                {art.specialty.split(',')[0]}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-label-data text-outline pt-2 border-t border-surface-container-highest">
                            <span>{art.experience}</span>
                            <span className="text-secondary">{art.slotsRemaining} slots left</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Date & Slot Picker */}
                  <div className="p-6 bg-surface-container border border-surface-container-highest grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-caps text-xs text-outline uppercase mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-surface-container-low border border-surface-container-highest text-on-surface font-label-data text-xs focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block font-label-caps text-xs text-outline uppercase mb-2">
                        Time
                      </label>
                      <select
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        className="w-full px-3 py-2.5 bg-surface-container-low border border-surface-container-highest text-on-surface font-label-data text-xs focus:outline-none focus:border-primary"
                      >
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="6:00 PM">6:00 PM</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* STEP 05: Your Details */}
                <section className="space-y-6">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-label-caps text-xs text-primary px-2 py-0.5 bg-surface-container border border-primary/30">
                        05
                      </span>
                      <h2 className="font-headline-sm text-lg sm:text-xl text-on-surface tracking-wide uppercase font-bold">
                        Your Details
                      </h2>
                    </div>
                  </div>

                  <div className="p-6 bg-surface-container border border-surface-container-highest space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-label-caps text-[10px] uppercase text-outline mb-1">
                          Full Name *
                        </label>
                        <input
                          required
                          type="text"
                          value={patronName}
                          onChange={(e) => setPatronName(e.target.value)}
                          placeholder="e.g. Jane Doe"
                          className="w-full px-3 py-2 bg-surface-container-low border border-surface-container-highest text-on-surface font-body-sm text-sm focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block font-label-caps text-[10px] uppercase text-outline mb-1">
                          WhatsApp / Phone *
                        </label>
                        <input
                          required
                          type="tel"
                          value={patronPhone}
                          onChange={(e) => setPatronPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-3 py-2 bg-surface-container-low border border-surface-container-highest text-on-surface font-body-sm text-sm focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block font-label-caps text-[10px] uppercase text-outline mb-1">
                          Email *
                        </label>
                        <input
                          required
                          type="email"
                          value={patronEmail}
                          onChange={(e) => setPatronEmail(e.target.value)}
                          placeholder="you@email.com"
                          className="w-full px-3 py-2 bg-surface-container-low border border-surface-container-highest text-on-surface font-body-sm text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer text-xs font-body-sm text-on-surface-variant">
                        <input
                          type="checkbox"
                          checked={medicalCheck}
                          onChange={(e) => setMedicalCheck(e.target.checked)}
                          className="mt-0.5 rounded border-surface-container-highest text-primary focus:ring-0"
                        />
                        <span>
                          I confirm I'm 18+ years old, not pregnant or nursing, and I agree to the 48-hour cancellation policy.
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={!medicalCheck}
                      className="w-full py-4 bg-primary-container hover:bg-on-primary-fixed-variant text-on-surface font-label-caps text-xs uppercase tracking-[0.25em] transition-all btn-gothic-glow flex items-center justify-center gap-2 border border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed font-bold mt-4"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Send Booking Request</span>
                    </button>
                  </div>
                </section>
              </form>

              {/* Right Column: Summary */}
              <div className="lg:col-span-4 space-y-6">
                <div className="sticky top-28 bg-surface-container p-6 border border-surface-container-highest shadow-2xl space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <h3 className="font-title-editorial text-base uppercase text-on-surface">
                        Booking Summary
                      </h3>
                    </div>
                    <span className="font-label-caps text-[9px] text-secondary uppercase tracking-wider">
                      Ref #9921
                    </span>
                  </div>

                  <div className="space-y-3 font-label-data text-xs">
                    <div className="flex justify-between py-1 border-b border-surface-container-highest/40">
                      <span className="text-outline uppercase">Discipline:</span>
                      <span className="text-on-surface font-semibold">{selectedDiscipline}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-surface-container-highest/40">
                      <span className="text-outline uppercase">Zone:</span>
                      <span className="text-on-surface font-semibold">{selectedZone}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-surface-container-highest/40">
                      <span className="text-outline uppercase">Scale:</span>
                      <span className="text-on-surface font-semibold">{selectedDimension}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-surface-container-highest/40">
                      <span className="text-outline uppercase">Artist:</span>
                      <span className="text-primary font-bold">{selectedArtist}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-surface-container-highest/40">
                      <span className="text-outline uppercase">Scheduled:</span>
                      <span className="text-secondary font-bold">{selectedDate}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-surface-container-highest/40">
                      <span className="text-outline uppercase">Window:</span>
                      <span className="text-on-surface">{selectedTimeSlot.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Calculated Deposit */}
                  <div className="p-4 bg-surface-container-lowest border border-surface-container-highest space-y-2">
                    <div className="flex justify-between items-center font-label-caps text-xs">
                      <span className="text-outline uppercase">Consultation Deposit:</span>
                      <span className="text-primary font-bold text-base font-label-data">
                        ${calculateDeposit()}.00
                      </span>
                    </div>
                    <p className="text-[11px] text-outline leading-tight font-body-sm">
                      Applied to your session on the day of your appointment.
                    </p>
                  </div>

                  {/* Fast WhatsApp Bridge */}
                  <div className="p-3 bg-surface-container-low border border-secondary/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-secondary font-label-caps uppercase">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Questions?</span>
                    </div>
                    <p className="font-body-sm text-[11px] text-outline">
                      Prefer to talk? Message us on WhatsApp and we'll help you book.
                    </p>
                    <button
                      onClick={onOpenWhatsApp}
                      className="w-full py-2 bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-caps text-xs uppercase tracking-wider transition-colors border border-surface-container-highest text-center block"
                    >
                      Message on WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Confirmation Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto py-16 text-center space-y-8"
            >
              <div className="w-20 h-20 rounded-full bg-primary-container/30 border border-primary text-primary flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-3">
                <span className="font-label-caps text-xs text-secondary uppercase tracking-widest block">
                  Request Sent
                </span>
                <h2 className="font-headline-xl text-3xl sm:text-4xl text-on-surface uppercase font-bold">
                  Booking request received
                </h2>
                <p className="font-body-md text-sm text-on-surface-variant max-w-lg mx-auto leading-relaxed">
                  Thanks, <span className="text-on-surface font-bold">{patronName || 'friend'}</span>. We'll review your details and confirm your appointment ({selectedDate}) within 4 business hours.
                </p>
              </div>

              <div className="p-6 bg-surface-container border border-surface-container-highest text-left font-label-data text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between text-outline">
                  <span>Discipline:</span>
                  <span className="text-on-surface">{selectedDiscipline}</span>
                </div>
                <div className="flex justify-between text-outline">
                  <span>Artist:</span>
                  <span className="text-primary font-bold">{selectedArtist}</span>
                </div>
                <div className="flex justify-between text-outline">
                  <span>Placement:</span>
                  <span className="text-on-surface">{selectedZone}</span>
                </div>
                <div className="flex justify-between text-outline">
                  <span>Date:</span>
                  <span className="text-secondary font-bold">{selectedDate}</span>
                </div>
                <div className="flex justify-between text-outline">
                  <span>Phone:</span>
                  <span className="text-on-surface">{patronPhone || 'Verified'}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={onOpenWhatsApp}
                  className="px-6 py-3 bg-secondary text-on-secondary font-label-caps text-xs uppercase tracking-widest font-bold hover:bg-secondary-fixed transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message on WhatsApp</span>
                </button>
                <button
                  onClick={() => onNavigate('home')}
                  className="px-6 py-3 bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-caps text-xs uppercase tracking-wider transition-colors border border-surface-container-highest"
                >
                  Back to Home
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
