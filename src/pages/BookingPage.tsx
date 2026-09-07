import React, { useState } from 'react';
import { PageView, PortfolioPiece } from '../types';
import { ARTISTS_DATA } from '../data/atelierData';
import { Icons8 } from '../components/Icons8';
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
      icon: <Icons8 name="pen-fancy" size={20} className="text-crimson-light" />,
      desc: 'One-of-a-kind custom design drawn from scratch, just for you.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbF0kjVhLkWWHDVZS3MXB0sFTeR4iCUYZg4PZUSC-y7hFLZrwH4NoOC8wQQ0hjpzsPVEhsM76SuYl4PSZkFcjxz7qtzn-CzlJ5hlOfMoCsUan-DkuIgrh3lVblkkZw7F4lQVXH5g6Efhls9C4TNPHTA3_UGebNk9jBmtbWXWR7Hbpfw6V0kVEdb87CN_ZiCPN1oTpmEgaCTJTpIscHTnqHfNhCWOBBjVWeu9UzEwtW9TzyeIc0R2CsRQ'
    },
    {
      id: 'Flash Designs',
      badge: 'Flash',
      icon: <Icons8 name="magic" size={20} className="text-gold" />,
      desc: 'Ready-to-go designs from the flash wall, first come first served.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ8XqYldeN2RLQHWF5mM1iUwFoIEFi163iGeRSQb40gZPzBn-3RUjkhfB51oBBTPjA3uahQRjcq02m0In3-lZV7LDyQ5vI2GPGUxkaqkkM_1PQWYOjBvd9kXWznG22_1kx20Ucqd12cbl19WH01AJeWux7AMskIdhTR1oEmpbLdcdQ57gPiWa3W8_zh50nd8lR2xLldytTG1xAelB0jp5Y8_YyU4OEJQ0UkzLdNZUX35mpVg-kAKvsKg'
    },
    {
      id: 'Cover-Up',
      badge: 'Cover-Up',
      icon: <Icons8 name="layer-group" size={20} className="text-crimson-light" />,
      desc: 'Cover-ups and redesigns for tattoos you no longer want.',
      img: 'https://lh3.googleusercontent.com/aida/AEtjO1XNohxnOuUyiuRH81bDZ-UO8NfUNRWjsUcNf17CRapKv9vqwRHRvs3ImL_JXOm2FvDj6HykULWGcCWZgYx9hVcVCLxqzHuv1hF1ialW4869cGWPNTHer5TvmOtY_nxwDKw6nQDMXi3mq1XDnV16QhONJg9c1lC6tE19Ss8zvWLgg3iC8edIVpUsZahYztL6uWO1QlydX2_bGpDx5xF0AII2u44j6IKQa1Bcw-3gRSQPd0R3M512GxMVb3KS'
    },
    {
      id: 'Piercing',
      badge: 'Piercing',
      icon: <Icons8 name="syringe" size={20} className="text-gold" />,
      desc: 'Titanium and gold piercings, done in a sterile room.',
      img: 'https://lh3.googleusercontent.com/aida/AEtjO1UKxCrKf8AiwCBwkQ0y1UMs_JKbByxBZorm3NnTNxcM3ZUiLIEHKRttY1oxTIY8tXi2TfHbXHWEaxX8iCKE7Y9FA5upzEFzSwWIrWxnqAp6eUBMp5xJerdVTc2IyoTZfxksnLUQ3B73pCPmD5mGa1RK-1m3yRqf9WF7mvUATlR7wt3huzzGTWReAc75DBvmAszA-6D1iZXVAevDKv4cizXRfWRXlo0W4XMBRecGsmQe8cPXL1fmD1xw0hhv'
    }
  ];

  const zoneOptions = [
    'Forearm',
    'Full Sleeve',
    'Backpiece',
    'Chest',
    'Collarbone',
    'Ribcage',
    'Leg / Calf',
    'Neck & Throat',
    'Hands / Fingers',
    'Ear (Piercing)',
    'Navel / Nose (Piercing)'
  ];

  const dimensionOptions = [
    { label: 'Small (2-3")', priceEstimate: '$120 - $200', time: '1-2 hrs' },
    { label: 'Medium (4-6")', priceEstimate: '$250 - $450', time: '2-4 hrs' },
    { label: 'Large (7-10")', priceEstimate: '$500 - $900', time: '4-6 hrs' },
    { label: 'Full Day / Multi-Session', priceEstimate: '$1,000+', time: 'Full Day' },
    { label: 'Piercing + Titanium Jewelry', priceEstimate: '$60 - $120', time: '30 mins' }
  ];

  const vectorTags = [
    'Dark Gothic',
    'Black & Grey Realism',
    'Fine-Line Script',
    'Geometric / Ornamental',
    'Baroque Memento Mori',
    'Anatomical / Skull',
    'Cover-Up Blast Over',
    'Titanium Piercing'
  ];

  const flashInspirations = [
    {
      title: 'Baroque Memento Mori',
      sub: 'Skull with intricate baroque florals',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ8XqYldeN2RLQHWF5mM1iUwFoIEFi163iGeRSQb40gZPzBn-3RUjkhfB51oBBTPjA3uahQRjcq02m0In3-lZV7LDyQ5vI2GPGUxkaqkkM_1PQWYOjBvd9kXWznG22_1kx20Ucqd12cbl19WH01AJeWux7AMskIdhTR1oEmpbLdcdQ57gPiWa3W8_zh50nd8lR2xLldytTG1xAelB0jp5Y8_YyU4OEJQ0UkzLdNZUX35mpVg-kAKvsKg'
    },
    {
      title: 'Medieval Dagger & Serpents',
      sub: 'Heavy blackwork blade with filigree handle',
      img: 'https://lh3.googleusercontent.com/aida/AEtjO1XNohxnOuUyiuRH81bDZ-UO8NfUNRWjsUcNf17CRapKv9vqwRHRvs3ImL_JXOm2FvDj6HykULWGcCWZgYx9hVcVCLxqzHuv1hF1ialW4869cGWPNTHer5TvmOtY_nxwDKw6nQDMXi3mq1XDnV16QhONJg9c1lC6tE19Ss8zvWLgg3iC8edIVpUsZahYztL6uWO1QlydX2_bGpDx5xF0AII2u44j6IKQa1Bcw-3gRSQPd0R3M512GxMVb3KS'
    },
    {
      title: 'Titanium Industrial Helix',
      sub: 'Anodized gold titanium barbell cluster',
      img: 'https://lh3.googleusercontent.com/aida/AEtjO1UKxCrKf8AiwCBwkQ0y1UMs_JKbByxBZorm3NnTNxcM3ZUiLIEHKRttY1oxTIY8tXi2TfHbXHWEaxX8iCKE7Y9FA5upzEFzSwWIrWxnqAp6eUBMp5xJerdVTc2IyoTZfxksnLUQ3B73pCPmD5mGa1RK-1m3yRqf9WF7mvUATlR7wt3huzzGTWReAc75DBvmAszA-6D1iZXVAevDKv4cizXRfWRXlo0W4XMBRecGsmQe8cPXL1fmD1xw0hhv'
    }
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
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
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8a0b14', '#d4af37', '#e5e2e1']
    });
  };

  const currentPricing = dimensionOptions.find((d) => d.label === selectedDimension);

  return (
    <div className="w-full pt-20 bg-noir-950 min-h-screen">
      {/* Header */}
      <section className="w-full bg-noir-900 py-12 md:py-16 px-4 md:px-8 lg:px-12 border-b border-noir-700/40">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-crimson" />
              <span className="font-label-caps text-xs uppercase text-crimson-light tracking-[0.25em]">
                STUDIO BOOKINGS
              </span>
            </div>
            <span className="font-label-data text-xs text-bone-dim">KAMPALA · EST. 2014</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-bone uppercase font-bold tracking-tight">
                Book a Tattoo or Piercing
              </h1>
              <p className="font-body-md text-sm text-bone-muted max-w-2xl mt-2 leading-relaxed">
                Tell us about your project below. We review every request to check sizing, placement, and time needed before confirming your session.
              </p>
            </div>

            {/* Direct WhatsApp Consult Banner */}
            <div className="p-4 bg-noir-850 border border-gold/40 flex items-center justify-between gap-4 shrink-0">
              <div className="space-y-0.5">
                <span className="font-label-caps text-[10px] text-gold uppercase tracking-wider block font-bold">
                  Fast WhatsApp Response
                </span>
                <span className="font-body-sm text-xs text-bone-muted block">
                  Prefer to chat directly? Send reference photos &amp; questions.
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenWhatsApp}
                className="px-4 py-2 bg-gold hover:bg-gold-light text-noir-950 font-label-caps text-xs uppercase font-bold transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>WhatsApp</span>
                <Icons8 name="whatsapp" size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Intake Form View */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-12 md:py-16 bg-noir-950">
        <div className="max-w-7xl mx-auto">
          {!isSubmitted ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Multi-Step Protocol Form (8 Cols) */}
              <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-12">
                {/* FIELDSET 01: Discipline & Type */}
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
                    <span className="font-label-data text-xs text-bone-dim">
                      {selectedDiscipline}
                    </span>
                  </legend>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup" aria-label="Service Type">
                    {disciplines.map((d) => {
                      const isSelected = selectedDiscipline === d.id;
                      const inputId = `discipline-${d.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
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
                            className={`cursor-pointer block p-5 bg-noir-850 transition-all duration-200 border h-full flex flex-col justify-between peer-focus-visible:ring-2 peer-focus-visible:ring-crimson ${
                              isSelected
                                ? 'border-crimson bg-noir-800 ring-1 ring-crimson'
                                : 'border-noir-700 hover:border-slate-500'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <div className="p-2 bg-noir-900 border border-noir-700">
                                  {d.icon}
                                </div>
                                <span className={`font-label-caps text-[10px] uppercase tracking-wider px-2 py-0.5 border ${
                                  isSelected
                                    ? 'bg-crimson text-bone border-crimson'
                                    : 'bg-noir-900 text-bone-dim border-noir-700'
                                }`}>
                                  {d.badge}
                                </span>
                              </div>

                              <span className="font-headline-sm text-base text-bone uppercase block mb-1 font-bold">
                                {d.id}
                              </span>

                              <p className="font-body-sm text-xs text-bone-muted leading-relaxed mb-4">
                                {d.desc}
                              </p>
                            </div>

                            <div className="w-full h-24 overflow-hidden bg-noir-950 border border-noir-700">
                              <img
                                src={d.img}
                                alt={d.id}
                                className="w-full h-full object-cover grayscale contrast-125"
                              />
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>

                {/* FIELDSET 02: Placement & Dimensions */}
                <fieldset className="space-y-4">
                  <legend className="w-full flex items-baseline justify-between pb-3 border-b border-noir-700/60 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-label-caps text-xs text-crimson-light px-2 py-0.5 bg-noir-850 border border-crimson/30">
                        02
                      </span>
                      <span className="font-headline-sm text-lg sm:text-xl text-bone tracking-wide uppercase font-bold">
                        Placement &amp; Size
                      </span>
                    </div>
                    <span className="font-label-data text-xs text-bone-dim">
                      {selectedZone}
                    </span>
                  </legend>

                  <div className="p-6 bg-noir-850 border border-noir-700 space-y-6">
                    {/* Zone Dropdown with Accessible Label */}
                    <div className="space-y-2">
                      <label htmlFor="placement-zone-select" className="font-label-caps text-xs text-bone-dim block uppercase tracking-wider">
                        Body Placement Area
                      </label>
                      <select
                        id="placement-zone-select"
                        name="placementZone"
                        value={selectedZone}
                        onChange={(e) => setSelectedZone(e.target.value)}
                        className="w-full px-4 py-3 bg-noir-900 border border-noir-700 text-bone font-body-md text-sm focus:outline-none focus:border-crimson transition-colors"
                      >
                        {zoneOptions.map((zone) => (
                          <option key={zone} value={zone}>
                            {zone}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dimension Radio Options */}
                    <div className="space-y-3">
                      <span className="font-label-caps text-xs text-bone-dim block uppercase tracking-wider">
                        Estimated Size Scale
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Estimated Size Scale">
                        {dimensionOptions.map((dim) => {
                          const isDimSelected = selectedDimension === dim.label;
                          const dimId = `dim-${dim.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                          return (
                            <div key={dim.label}>
                              <input
                                type="radio"
                                id={dimId}
                                name="dimensionScale"
                                value={dim.label}
                                checked={isDimSelected}
                                onChange={() => setSelectedDimension(dim.label)}
                                className="sr-only peer"
                              />
                              <label
                                htmlFor={dimId}
                                className={`cursor-pointer block p-3.5 bg-noir-900 transition-colors border flex items-center justify-between peer-focus-visible:ring-2 peer-focus-visible:ring-crimson ${
                                  isDimSelected
                                    ? 'border-crimson bg-noir-800 ring-1 ring-crimson'
                                    : 'border-noir-700 hover:border-noir-600'
                                }`}
                              >
                                <div className="space-y-0.5">
                                  <span className="font-headline-sm text-xs text-bone uppercase block font-bold">
                                    {dim.label}
                                  </span>
                                  <span className="font-body-sm text-[11px] text-bone-dim block">
                                    Est. Time: {dim.time}
                                  </span>
                                </div>
                                <span className="font-label-data text-xs text-gold font-bold">
                                  {dim.priceEstimate}
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
                        <Icons8 name="map-marker-alt" size={16} className="text-gold" />
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
                          <Icons8 name="magic" size={14} className="text-gold" />
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
                            <Icons8 name="file-invoice" size={20} />
                            <span className="font-body-sm text-sm font-semibold">{uploadedFileName}</span>
                          </div>
                        ) : (
                          <>
                            <Icons8 name="cloud-upload-alt" size={28} className="text-bone-dim group-hover:text-crimson-light transition-colors mx-auto mb-2" />
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
                                <span className="font-label-caps text-[10px] text-crimson-light uppercase block truncate">
                                  {art.specialty}
                                </span>
                              </div>
                            </div>
                            <span className="font-label-data text-xs text-bone-dim border-t border-noir-700 pt-2 block">
                              {art.experience} · {art.role}
                            </span>
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  {/* Date & Time Slot Grid */}
                  <div className="p-6 bg-noir-850 border border-noir-700 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="preferred-session-date" className="font-label-caps text-xs text-bone-dim block uppercase tracking-wider flex items-center gap-1.5">
                          <Icons8 name="calendar-alt" size={14} className="text-gold" />
                          Preferred Session Date
                        </label>
                        <input
                          id="preferred-session-date"
                          name="preferredDate"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min="2026-09-08"
                          className="w-full px-4 py-3 bg-noir-900 border border-noir-700 text-bone font-label-data text-sm focus:outline-none focus:border-crimson"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="preferred-session-time" className="font-label-caps text-xs text-bone-dim block uppercase tracking-wider flex items-center gap-1.5">
                          <Icons8 name="clock" size={14} className="text-gold" />
                          Preferred Time Window
                        </label>
                        <select
                          id="preferred-session-time"
                          name="preferredTimeSlot"
                          value={selectedTimeSlot}
                          onChange={(e) => setSelectedTimeSlot(e.target.value)}
                          className="w-full px-4 py-3 bg-noir-900 border border-noir-700 text-bone font-body-md text-sm focus:outline-none focus:border-crimson"
                        >
                          <option value="11:00 AM">Morning Session (11:00 AM)</option>
                          <option value="2:00 PM">Afternoon Slot (2:00 PM)</option>
                          <option value="5:00 PM">Evening Slot (5:00 PM)</option>
                          <option value="Full Day">Full Day Pass (11:00 AM - 7:00 PM)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* FIELDSET 05: Client Credentials & Verification */}
                <fieldset className="space-y-4">
                  <legend className="w-full flex items-baseline justify-between pb-3 border-b border-noir-700/60 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-label-caps text-xs text-crimson-light px-2 py-0.5 bg-noir-850 border border-crimson/30">
                        05
                      </span>
                      <span className="font-headline-sm text-lg sm:text-xl text-bone tracking-wide uppercase font-bold">
                        Client Details &amp; Consent
                      </span>
                    </div>
                    <span className="font-label-data text-xs text-emerald-400">
                      Encrypted Studio Data
                    </span>
                  </legend>

                  <div className="p-6 bg-noir-850 border border-noir-700 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="client-full-name" className="font-label-caps text-[10px] text-bone-dim uppercase tracking-wider block flex items-center gap-1">
                          <Icons8 name="user" size={12} className="text-bone-dim" /> Full Name *
                        </label>
                        <input
                          id="client-full-name"
                          name="clientFullName"
                          required
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="e.g. Sandra Nabirye"
                          className="w-full px-3 py-2.5 bg-noir-900 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="client-phone-number" className="font-label-caps text-[10px] text-bone-dim uppercase tracking-wider block flex items-center gap-1">
                          <Icons8 name="phone" size={12} className="text-bone-dim" /> WhatsApp / Phone *
                        </label>
                        <input
                          id="client-phone-number"
                          name="clientPhoneNumber"
                          required
                          type="tel"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="+256 705 748774"
                          className="w-full px-3 py-2.5 bg-noir-900 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="client-email-address" className="font-label-caps text-[10px] text-bone-dim uppercase tracking-wider block flex items-center gap-1">
                          <Icons8 name="envelope" size={12} className="text-bone-dim" /> Email *
                        </label>
                        <input
                          id="client-email-address"
                          name="clientEmailAddress"
                          required
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="client@domain.com"
                          className="w-full px-3 py-2.5 bg-noir-900 border border-noir-700 text-bone font-body-sm text-sm focus:outline-none focus:border-crimson"
                        />
                      </div>
                    </div>

                    {/* Medical & Legal Checkbox */}
                    <div className="pt-4 border-t border-noir-700">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={medicalCheck}
                          onChange={(e) => setMedicalCheck(e.target.checked)}
                          className="mt-1 accent-crimson bg-noir-900 border-noir-700 w-4 h-4 rounded"
                        />
                        <span className="font-body-sm text-xs text-bone-muted leading-relaxed">
                          I confirm I am 18+ years of age (or accompanied by legal guardian for ear piercings), not currently pregnant or nursing, and have no known contraindications for skin puncturing.
                        </span>
                      </label>
                    </div>
                  </div>
                </fieldset>

                {/* Submit CTA */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-label-data text-bone-dim">
                    <Icons8 name="shield-alt" size={20} className="text-crimson-light" />
                    <span>No upfront payment required until custom consultation confirmation.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={!medicalCheck}
                    className="w-full sm:w-auto px-8 py-4 bg-crimson hover:bg-crimson-hover disabled:opacity-50 text-bone font-label-caps text-xs uppercase tracking-[0.2em] transition-all btn-gothic-glow font-bold border border-crimson/40"
                  >
                    Submit Booking Request
                  </button>
                </div>
              </form>

              {/* Right Column: Live Booking Dossier Summary (4 Cols) */}
              <aside aria-label="Booking Summary" className="lg:col-span-4 sticky top-28 space-y-6">
                <div className="bg-noir-850 p-6 border border-noir-700 space-y-6">
                  {/* Summary Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-noir-700">
                    <span className="font-label-caps text-xs uppercase text-bone font-bold">
                      Session Overview
                    </span>
                    <span className="font-label-data text-[10px] text-crimson-light uppercase">
                      Draft Preview
                    </span>
                  </div>

                  {/* Selected Specs List */}
                  <div className="space-y-3 font-label-data text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-noir-800">
                      <span className="text-bone-dim">Discipline:</span>
                      <span className="text-bone font-semibold">{selectedDiscipline}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-noir-800">
                      <span className="text-bone-dim">Placement Area:</span>
                      <span className="text-bone font-semibold">{selectedZone}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-noir-800">
                      <span className="text-bone-dim">Dimension Scale:</span>
                      <span className="text-bone font-semibold">{selectedDimension}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-noir-800">
                      <span className="text-bone-dim">Resident Artist:</span>
                      <span className="text-crimson-light font-bold">{selectedArtist}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-noir-800">
                      <span className="text-bone-dim">Target Date:</span>
                      <span className="text-gold font-bold">{selectedDate} ({selectedTimeSlot})</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-noir-800">
                      <span className="text-bone-dim">Est. Time:</span>
                      <span className="text-bone">{currentPricing?.time || 'Custom'}</span>
                    </div>
                  </div>

                  {/* Estimate Box */}
                  <div className="p-4 bg-noir-900 border border-noir-700 space-y-1">
                    <span className="font-label-caps text-[10px] text-bone-dim uppercase tracking-wider block">
                      Estimated Investment Range
                    </span>
                    <div className="font-label-data text-xl text-gold font-bold">
                      {currentPricing?.priceEstimate || 'Custom Quote'}
                    </div>
                    <p className="font-body-sm text-[10px] text-bone-dim leading-snug pt-1">
                      Final quotes confirmed during artist consultation based on line complexity and size.
                    </p>
                  </div>

                  {/* Deposit Policy Notice */}
                  <div className="p-3.5 bg-noir-900/60 border border-noir-700/60 space-y-1 text-xs">
                    <span className="font-label-caps text-[10px] text-bone uppercase block font-bold">
                      Deposit Policy
                    </span>
                    <p className="font-body-sm text-[11px] text-bone-dim leading-relaxed">
                      Deducted directly from the final cost on the day of your appointment.
                    </p>
                  </div>

                  {/* Direct WhatsApp Consultation */}
                  <div className="p-4 bg-noir-900 border border-gold/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-gold font-label-caps uppercase font-bold">
                      <Icons8 name="whatsapp" size={16} />
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
                <Icons8 name="check-circle" size={32} />
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
                  <Icons8 name="whatsapp" size={16} />
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
