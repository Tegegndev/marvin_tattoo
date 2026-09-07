import React, { useState } from 'react';
import { PageView } from '../types';
import { HERO_IMAGE, MARVIN_DIRECT_PHONE, WHATSAPP_NUMBER } from '../data/atelierData';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons8 } from '../components/Icons8';

interface AftercarePageProps {
  onNavigate: (page: PageView) => void;
  onOpenWhatsApp: () => void;
}

interface TimelineStage {
  dayRange: string;
  title: string;
  subtitle: string;
  phase: string;
  appearance: string;
  feel: string;
  ritual: string[];
  warning: string;
  icon: string;
}

const TIMELINE_STAGES: TimelineStage[] = [
  {
    dayRange: 'Hours 0 – 24',
    title: 'The Initial Seal',
    subtitle: 'Wrap protection & first sterile cleanse',
    phase: 'Immediate Post-Session',
    appearance: 'Fresh, vibrant dark ink with clear lymph fluid or minor weeping. Skin may look glossy and red around the perimeter.',
    feel: 'Feels like mild to moderate sunburn with localized heat.',
    ritual: [
      'Keep initial wrap on for 2–4 hours (or 3–5 days if second-skin film is applied).',
      'Remove wrap gently with clean hands under lukewarm running water.',
      'Wash gently with fragrance-free antibacterial soap using clean fingertips only.',
      'Pat dry with a clean paper towel — never rub or use cloth towels.',
      'Let breathe unbandaged unless instructed otherwise.'
    ],
    warning: 'Do not re-wrap with plastic cling film once removed unless specifically directed.',
    icon: 'first-aid'
  },
  {
    dayRange: 'Days 2 – 4',
    title: 'The Weeping & Tightening',
    subtitle: 'Cellular repair & moisture barrier formation',
    phase: 'Early Healing',
    appearance: 'Tattoo begins to feel tight and dry. A dull, papery film starts forming over dense blackwork.',
    feel: 'Tight, sensitive to stretching, slightly tender to the touch.',
    ritual: [
      'Wash 2–3 times daily with lukewarm water and antibacterial soap.',
      'Apply a paper-thin layer of aftercare balm 2–3 times a day.',
      'Ensure the layer is sheer — skin must breathe without looking greasy.',
      'Wear loose-fitting, soft cotton clothing that does not rub against the piece.'
    ],
    warning: 'Never apply petroleum jelly or thick ointments that suffocate the pores.',
    icon: 'tint'
  },
  {
    dayRange: 'Days 5 – 14',
    title: 'The Flaking & Peeling',
    subtitle: 'Surface skin shedding & itching control',
    phase: 'Active Peeling',
    appearance: 'Black ink flakes begin shedding like dark parchment paper or peeling sunburn. Colors may look cloudy underneath.',
    feel: 'Intense itching, dry texture, occasional tightness.',
    ritual: [
      'DO NOT PICK, PULL, OR SCRATCH flaking skin — let flakes fall off naturally.',
      'Lightly pat or tap surrounding skin if itching is severe.',
      'Continue applying a micro-thin film of soothing balm whenever skin feels tight.',
      'Take quick showers only; avoid hot steam directly on the piece.'
    ],
    warning: 'Picking scabs or peeling flakes pulls pigment out of the dermis, creating permanent light patches.',
    icon: 'hand-paper'
  },
  {
    dayRange: 'Weeks 3 – 12',
    title: 'Dermal Maturation',
    subtitle: 'Full pigment locking & longevity protection',
    phase: 'Full Recovery',
    appearance: 'Surface skin is fully closed. A delicate "onion-skin" sheen settles as deeper dermal layers regenerate into rich, permanent dark contrast.',
    feel: 'Completely healed to touch, normal skin texture returned.',
    ritual: [
      'Maintain skin hydration with daily fragrance-free lotion.',
      'Apply broad-spectrum SPF 30+ whenever exposed to sunlight.',
      'For piercings: Book your titanium downsizing check at the atelier.',
      'Inspect your piece — claim your free 1-year touch-up if any detail needs balancing.'
    ],
    warning: 'Unprotected UV exposure breaks down dark pigment particles permanently.',
    icon: 'sun'
  }
];

const STEPS_DATA = [
  {
    number: '01',
    title: 'Keep the Wrap On',
    tagline: 'Initial Protection',
    description: "Leave the initial wrap in place for 2–4 hours. I'll specify the exact duration based on your piece.",
    details: 'The wrap creates a sterile barrier while the fresh micro-punctures begin coagulation. If medical adhesive film (SecondSkin) was applied, Marvin will advise leaving it on for 3 to 5 days.',
    icon: 'first-aid',
    color: 'crimson'
  },
  {
    number: '02',
    title: 'Wash Clean',
    tagline: 'Lukewarm & Fragrance-Free',
    description: 'Wash with lukewarm water and fragrance-free antibacterial soap. Pat dry with a clean paper towel.',
    details: 'Use only your clean fingertips in gentle circular motions to remove residual lymph and dried blood. Never use sponges, loofahs, or bath towels which harbor bacteria.',
    icon: 'tint',
    color: 'gold'
  },
  {
    number: '03',
    title: 'Moisturize',
    tagline: 'Thin & Breathable',
    description: "Apply a thin layer of recommended aftercare balm 2–3 times daily. Don't oversaturate.",
    details: 'Less is more: the skin needs oxygen to heal properly. A pea-sized dab warmed between clean fingers is enough for a large forearm or collarbone piece.',
    icon: 'magic',
    color: 'emerald'
  },
  {
    number: '04',
    title: "Don't Touch It",
    tagline: 'Zero Scratching or Picking',
    description: 'Peeling and flaking is normal healing. Do not pick, scratch, or pull at anything.',
    details: 'As old epidermal cells shed, pieces of dark flaking skin will detach on their own. Pulling flakes forcibly pulls embedded ink out of the dermis and creates scar tissue.',
    icon: 'hand-paper',
    color: 'crimson'
  },
  {
    number: '05',
    title: 'Avoid Sun',
    tagline: '3 Weeks Minimum & SPF 30+',
    description: 'Keep your tattoo out of direct sunlight for at least 3 weeks. Once healed, always apply SPF 30+.',
    details: 'UV rays break down organic and carbon black pigments. Direct sunlight on healing skin can cause intense burning, blistering, and immediate fading.',
    icon: 'sun',
    color: 'gold'
  },
  {
    number: '06',
    title: 'No Submersion',
    tagline: 'Showers Only — No Soaking',
    description: 'No pools, ocean, hot tubs, baths, or saunas for at least 3 weeks. Showers are fine.',
    details: 'Stagnant water in pools, hot tubs, or lakes contains bacteria that enter fresh wounds. Submersion also softens scabs prematurely, leading to ink loss.',
    icon: 'water',
    color: 'crimson'
  }
];

const DOS_LIST = [
  'Wash hands thoroughly before any contact with your tattoo',
  'Wear loose, clean, breathable cotton clothing over the area',
  'Stay well hydrated and get adequate sleep for cellular regeneration',
  'Keep the tattoo clean from gym grime, dust, and workplace contaminants',
  'Contact Marvin immediately if something looks or feels abnormal'
];

const DONTS_LIST = [
  'Pick, scratch, pull, or peel flaking skin and scabs',
  'Apply petroleum jelly, heavy Vaseline, or scented lotions',
  'Expose the healing area to direct sunlight or tanning beds',
  'Submerge in any body of water (baths, pools, lakes, jacuzzis)',
  'Perform intense friction workouts or heavy sweat routines for 48 hours',
  'Allow pets, animal fur, or unsterilized surfaces to contact the tattoo'
];

const RED_FLAGS = [
  {
    id: 'red-01',
    title: 'Excessive Redness & Swelling',
    description: 'Redness spreading outwards with intense heat or hardening beyond day 3.',
    severity: 'High Priority',
    action: 'Send Marvin a clear photo immediately.'
  },
  {
    id: 'red-02',
    title: 'Pus or Colored Discharge',
    description: 'Thick yellow, green, or foul-smelling fluid (clear lymph fluid on days 1–2 is normal).',
    severity: 'Urgent Alert',
    action: 'Contact Marvin and seek medical advice promptly.'
  },
  {
    id: 'red-03',
    title: 'Fever, Chills, or Body Aches',
    description: 'Systemic symptoms indicating your body is fighting a secondary infection.',
    severity: 'Immediate Action',
    action: 'Consult a medical professional & notify studio.'
  },
  {
    id: 'red-04',
    title: 'Spreading Red Streaks',
    description: 'Thin red lines tracking away from the tattooed or pierced area.',
    severity: 'Critical Medical',
    action: 'Seek medical evaluation immediately.'
  },
  {
    id: 'red-05',
    title: 'Escalating Throbbing Pain',
    description: 'Pain that increases significantly after 48–72 hours instead of tapering off.',
    severity: 'High Priority',
    action: 'Message Marvin on WhatsApp for assessment.'
  }
];

export const AftercarePage: React.FC<AftercarePageProps> = ({ onNavigate }) => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [checkedDos, setCheckedDos] = useState<Record<number, boolean>>({});

  const toggleDo = (index: number) => {
    setCheckedDos((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const activeStage = TIMELINE_STAGES[activeStageIndex];

  return (
    <div className="w-full pt-20 bg-noir-950 min-h-screen selection:bg-crimson selection:text-bone">
      {/* 1. Hero Banner */}
      <section className="relative w-full overflow-hidden bg-noir-950 py-16 md:py-24 border-b border-noir-700/40">
        {/* Background Ambient Imagery */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 filter grayscale contrast-125 pointer-events-none scale-105"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-noir-950/80 via-noir-950/60 to-noir-950 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-noir-700/40">
            <div className="flex items-center gap-3">
              <span className="font-label-caps text-xs text-crimson-light tracking-[0.25em] uppercase font-bold">
                CLIENT HEALING PROTOCOL
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-noir-600" />
              <span className="font-label-data text-xs text-bone-dim">MARVIN ATELIER</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-label-data text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                100% Sterile Standard
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Hero Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-noir-900 border border-crimson/30 rounded-sm">
                <Icons8 name="fire" size={16} className="text-crimson-light animate-pulse" />
                <span className="font-label-caps text-xs text-bone uppercase tracking-widest">
                  Proper Care for Dark Art
                </span>
              </div>

              <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-bone font-bold tracking-tight leading-[1.1]">
                Aftercare <span className="text-crimson-light">Guide</span>
              </h1>

              <p className="font-body-md text-base md:text-lg text-bone-muted leading-relaxed max-w-2xl">
                Your skin is a living canvas. The permanence, deep black values, and razor-sharp linework
                of your tattoo depend heavily on your discipline during the next few weeks. Follow this exact ritual.
              </p>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Marvin,%20I%20have%20an%20aftercare%20question%20about%20my%20tattoo.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-noir-900 hover:bg-noir-850 text-bone border border-noir-700 font-label-caps text-xs uppercase tracking-wider transition-all rounded-sm"
                >
                  <Icons8 name="whatsapp" size={16} className="text-emerald-400" />
                  <span>Aftercare SOS WhatsApp</span>
                </a>
                <button
                  onClick={() => onNavigate('booking')}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs font-bold uppercase tracking-widest transition-all rounded-sm shadow-md"
                >
                  <Icons8 name="calendar-check" size={16} />
                  <span>Book Consultation</span>
                </button>
              </div>
            </div>

            {/* Hero Right Column: Healing Timeline Stat Card */}
            <div className="lg:col-span-5">
              <div className="bg-noir-900/95 border border-noir-700 p-6 md:p-8 rounded-xl relative overflow-hidden backdrop-blur-md shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-crimson/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between pb-5 border-b border-noir-700/60 mb-6">
                  <div className="flex items-center gap-2.5">
                    <Icons8 name="clock" size={20} className="text-gold" />
                    <span className="font-label-caps text-xs uppercase tracking-widest text-bone font-bold">
                      Healing Timeline
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-noir-800 text-gold text-[10px] font-label-caps uppercase tracking-wider rounded border border-gold/30">
                    Guaranteed Results
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-label-data p-3 bg-noir-950 rounded border border-noir-800">
                    <span className="text-bone-muted uppercase">Initial Wrap Duration:</span>
                    <span className="text-crimson-light font-bold">2 — 4 Hours</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-label-data p-3 bg-noir-950 rounded border border-noir-800">
                    <span className="text-bone-muted uppercase">Active Flaking Phase:</span>
                    <span className="text-gold font-bold">Days 5 — 14</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-label-data p-3 bg-noir-950 rounded border border-noir-800">
                    <span className="text-bone-muted uppercase">Deep Dermal Healing:</span>
                    <span className="text-emerald-400 font-bold">Weeks 3 — 12</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-label-data p-3 bg-noir-950 rounded border border-noir-800">
                    <span className="text-bone-muted uppercase">Touch-Up Warranty:</span>
                    <span className="text-bone font-bold">1 Full Year Free</span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-noir-700/60 flex items-center justify-between text-xs text-bone-muted font-body-sm">
                  <div className="flex items-center gap-1.5">
                    <Icons8 name="award" size={16} className="text-gold shrink-0" />
                    <span>Kampala Atelier Standard</span>
                  </div>
                  <span className="text-bone font-bold font-label-data">EST. 2014</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive 4-Phase Recovery Timeline */}
      <section className="w-full py-16 md:py-24 bg-noir-900 border-b border-noir-700/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-noir-700/40">
            <div>
              <span className="font-label-caps text-xs text-crimson-light uppercase tracking-[0.25em] font-bold block mb-2">
                FOUR-PHASE TIMELINE
              </span>
              <h2 className="font-headline-lg text-2xl md:text-4xl text-bone font-bold">
                Healing Stage Explorer
              </h2>
            </div>
            <p className="text-xs md:text-sm text-bone-muted max-w-md">
              Select your current recovery milestone below to understand what to expect and which care ritual to perform.
            </p>
          </div>

          {/* Milestone Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {TIMELINE_STAGES.map((stage, idx) => {
              const isActive = activeStageIndex === idx;
              return (
                <button
                  key={stage.dayRange}
                  onClick={() => setActiveStageIndex(idx)}
                  className={`p-4 text-left rounded-xl transition-all relative border flex flex-col justify-between ${
                    isActive
                      ? 'bg-noir-950 border-crimson shadow-xl'
                      : 'bg-noir-950/50 border-noir-700 hover:border-slate-600 hover:bg-noir-950/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-crimson/20 text-crimson-light' : 'bg-noir-800 text-bone-dim'}`}>
                      <Icons8 name={stage.icon} size={16} />
                    </div>
                    <span className={`text-[10px] font-label-data uppercase tracking-wider ${isActive ? 'text-crimson-light font-bold' : 'text-bone-dim'}`}>
                      Stage 0{idx + 1}
                    </span>
                  </div>
                  <div>
                    <div className="font-label-caps text-xs text-bone uppercase tracking-wider font-bold">
                      {stage.dayRange}
                    </div>
                    <div className="text-xs text-bone-muted truncate mt-0.5">
                      {stage.title}
                    </div>
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-[1px] left-4 right-4 h-0.5 bg-crimson" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Stage Detailed Breakdown */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage.dayRange}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-noir-950 border border-noir-700 rounded-xl p-6 md:p-8 lg:p-10 shadow-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Overview */}
                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-crimson/10 border border-crimson/30 text-crimson-light text-[11px] font-label-caps uppercase tracking-wider rounded mb-3">
                      {activeStage.phase} · {activeStage.dayRange}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-bone">
                      {activeStage.title}
                    </h3>
                    <p className="text-sm text-bone-muted mt-1">
                      {activeStage.subtitle}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-noir-900 rounded-lg border border-noir-800 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-label-caps uppercase tracking-wider text-slate-300 font-bold">
                        <Icons8 name="eye" size={14} className="text-gold" />
                        <span>Visual Appearance</span>
                      </div>
                      <p className="text-xs text-bone-muted leading-relaxed">
                        {activeStage.appearance}
                      </p>
                    </div>

                    <div className="p-4 bg-noir-900 rounded-lg border border-noir-800 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-label-caps uppercase tracking-wider text-slate-300 font-bold">
                        <Icons8 name="hand-paper" size={14} className="text-crimson-light" />
                        <span>Tactile Sensation</span>
                      </div>
                      <p className="text-xs text-bone-muted leading-relaxed">
                        {activeStage.feel}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Ritual Checklist */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                  <div>
                    <h4 className="font-label-caps text-xs text-bone uppercase tracking-widest mb-4 flex items-center gap-2 font-bold">
                      <Icons8 name="shield-alt" size={16} className="text-emerald-400" />
                      <span>Mandatory Care Ritual for this Phase</span>
                    </h4>

                    <ul className="space-y-3">
                      {activeStage.ritual.map((step, sIdx) => (
                        <li
                          key={sIdx}
                          className="flex items-start gap-3 p-3 bg-noir-900/60 rounded-lg border border-noir-800/80"
                        >
                          <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                            ✓
                          </span>
                          <span className="text-xs md:text-sm text-bone-dim leading-relaxed">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Warning Notice */}
                  <div className="p-4 bg-crimson/10 border border-crimson/30 rounded-lg flex items-start gap-3">
                    <Icons8 name="exclamation-triangle" size={16} className="text-crimson-light shrink-0 mt-0.5" />
                    <div className="text-xs text-bone-dim leading-relaxed">
                      <strong className="text-crimson-light font-label-caps uppercase tracking-wider block mb-0.5">
                        Crucial Warning:
                      </strong>
                      {activeStage.warning}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 3. Step-by-Step Instructions */}
      <section className="w-full py-16 md:py-24 bg-noir-950">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="font-label-caps text-xs text-crimson-light uppercase tracking-[0.25em] font-bold">
              STEP-BY-STEP INSTRUCTIONS
            </div>
            <h2 className="font-headline-xl text-3xl md:text-4xl lg:text-5xl text-bone font-bold">
              Proper Care for Dark Art
            </h2>
            <p className="font-body-md text-sm md:text-base text-bone-muted">
              Six immutable rules designed specifically to preserve rich black saturation, micro-detail linework, and sterile skin restoration.
            </p>
          </div>

          {/* 6 Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {STEPS_DATA.map((step) => (
              <div
                key={step.number}
                className="bg-noir-900 border border-noir-700/80 hover:border-slate-600 rounded-xl p-6 md:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group relative overflow-hidden"
              >
                {/* Step Accent Glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-noir-800/60 rounded-full blur-xl pointer-events-none group-hover:bg-crimson/10 transition-colors" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-label-data text-2xl font-bold text-slate-500 group-hover:text-crimson-light transition-colors">
                      {step.number}
                    </span>
                    <div className="p-3 bg-noir-950 rounded-lg border border-noir-800 text-bone group-hover:border-slate-600 transition-colors">
                      <Icons8 name={step.icon} size={20} />
                    </div>
                  </div>

                  <div className="font-label-caps text-[11px] text-crimson-light uppercase tracking-wider font-bold mb-1">
                    {step.tagline}
                  </div>
                  <h3 className="text-xl font-bold text-bone mb-3">
                    {step.title}
                  </h3>
                  <p className="text-xs md:text-sm text-bone-muted leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-noir-800/80">
                  <p className="text-[11px] text-bone-dim leading-relaxed italic">
                    {step.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Do's & Don'ts (Quick Reference) */}
      <section className="w-full py-16 md:py-24 bg-noir-900 border-y border-noir-700/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="font-label-caps text-xs text-gold uppercase tracking-[0.25em] font-bold">
              QUICK REFERENCE
            </div>
            <h2 className="font-headline-lg text-3xl md:text-4xl text-bone font-bold">
              Do&apos;s &amp; Don&apos;ts
            </h2>
            <p className="text-sm text-bone-muted">
              A quick reference guide for your daily healing routine. Keep this in mind every time you look in the mirror.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
            {/* DO Column */}
            <div className="bg-noir-950 border border-emerald-500/30 rounded-xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-950 border border-emerald-500/40 rounded-lg text-emerald-400">
                    <Icons8 name="check-circle" size={20} />
                  </div>
                  <div>
                    <h3 className="font-label-caps text-sm uppercase tracking-widest text-emerald-400 font-bold">
                      Do This
                    </h3>
                    <p className="text-xs text-bone-dim">Essential habits for optimal dark art healing</p>
                  </div>
                </div>
                <span className="text-[11px] font-label-data text-emerald-400 uppercase tracking-wider font-semibold">
                  Required
                </span>
              </div>

              <ul className="space-y-4">
                {DOS_LIST.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => toggleDo(idx)}
                    className="flex items-start gap-3 p-3.5 bg-noir-900/80 rounded-lg border border-noir-800 hover:border-emerald-500/40 transition-colors cursor-pointer group"
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      checkedDos[idx]
                        ? 'bg-emerald-500 border-emerald-500 text-noir-950'
                        : 'border-emerald-500/40 text-transparent group-hover:border-emerald-400'
                    }`}>
                      <Icons8 name="check" size={14} className="stroke-[3]" />
                    </div>
                    <span className={`text-xs md:text-sm leading-relaxed transition-colors ${
                      checkedDos[idx] ? 'text-bone-muted line-through' : 'text-bone'
                    }`}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DON'T Column */}
            <div className="bg-noir-950 border border-crimson/30 rounded-xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-crimson/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between pb-4 border-b border-crimson/20 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-crimson/20 border border-crimson/40 rounded-lg text-crimson-light">
                    <Icons8 name="times-circle" size={20} />
                  </div>
                  <div>
                    <h3 className="font-label-caps text-sm uppercase tracking-widest text-crimson-light font-bold">
                      Don&apos;t Do This
                    </h3>
                    <p className="text-xs text-bone-dim">Actions that damage linework and cause infections</p>
                  </div>
                </div>
                <span className="text-[11px] font-label-data text-crimson-light uppercase tracking-wider font-semibold">
                  Forbidden
                </span>
              </div>

              <ul className="space-y-4">
                {DONTS_LIST.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3.5 bg-noir-900/80 rounded-lg border border-noir-800"
                  >
                    <div className="w-5 h-5 rounded-full bg-crimson/20 border border-crimson/40 text-crimson-light flex items-center justify-center shrink-0 mt-0.5">
                      <Icons8 name="times" size={14} />
                    </div>
                    <span className="text-xs md:text-sm text-bone-dim leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. When to Contact Me / Warning Signs & Red Flags */}
      <section className="w-full py-16 md:py-24 bg-noir-950">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-noir-900 border border-noir-700 rounded-2xl p-6 md:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-crimson/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-crimson/20 border border-crimson/40 text-crimson-light font-label-caps text-xs uppercase tracking-wider rounded">
                  <Icons8 name="exclamation-triangle" size={14} />
                  <span>Clinical Safety Standard</span>
                </div>
                <h2 className="font-headline-lg text-2xl md:text-4xl text-bone font-bold">
                  When to Contact Me
                </h2>
                <p className="text-sm md:text-base text-bone-muted leading-relaxed">
                  Most tattoos heal beautifully with standard discipline. However, if you notice any of these five red flags, reach out to Marvin immediately:
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <a
                  href={`tel:${MARVIN_DIRECT_PHONE}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-noir-950 hover:bg-noir-850 text-bone border border-noir-700 font-label-caps text-xs uppercase tracking-wider rounded-sm transition-colors"
                >
                  <Icons8 name="phone" size={16} className="text-crimson-light" />
                  <span>Call {MARVIN_DIRECT_PHONE}</span>
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Marvin,%20I%20have%20an%20urgent%20healing%20question%20regarding%20my%20tattoo.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/40 font-label-caps text-xs uppercase tracking-wider rounded-sm transition-colors"
                >
                  <Icons8 name="whatsapp" size={16} className="text-emerald-400" />
                  <span>Urgent WhatsApp Alert</span>
                </a>
              </div>
            </div>

            {/* Red Flag Warning Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {RED_FLAGS.map((flag) => (
                <div
                  key={flag.id}
                  className="p-4 bg-noir-950 border border-noir-800 rounded-xl space-y-2 hover:border-crimson/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-label-caps uppercase tracking-wider px-2 py-0.5 bg-crimson/10 text-crimson-light rounded border border-crimson/30">
                      {flag.severity}
                    </span>
                    <Icons8 name="exclamation-triangle" size={16} className="text-crimson-light" />
                  </div>
                  <h4 className="text-sm font-bold text-bone font-label-caps uppercase tracking-wide">
                    {flag.title}
                  </h4>
                  <p className="text-xs text-bone-muted leading-relaxed">
                    {flag.description}
                  </p>
                  <div className="pt-2 text-[11px] text-slate-300 font-semibold flex items-center gap-1">
                    <Icons8 name="arrow-right" size={12} className="text-crimson-light" />
                    <span>{flag.action}</span>
                  </div>
                </div>
              ))}

              {/* Year Guarantee Box */}
              <div className="p-4 bg-noir-950 border border-gold/40 rounded-xl space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-label-caps uppercase tracking-wider px-2 py-0.5 bg-gold/10 text-gold rounded border border-gold/30">
                      Artist Guarantee
                    </span>
                    <Icons8 name="award" size={16} className="text-gold" />
                  </div>
                  <h4 className="text-sm font-bold text-bone font-label-caps uppercase tracking-wide">
                    Free 1-Year Touch-Ups
                  </h4>
                  <p className="text-xs text-bone-muted leading-relaxed">
                    I stand behind my dark art. If any fine-line fades or requires pigment balancing after full healing, touch-ups are free for 12 months.
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-gold font-semibold flex items-center gap-1">
                  <span>Level 5, New Pioneer Mall</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Ready to Embrace the Darkness? CTA Section */}
      <section className="relative w-full py-20 md:py-28 overflow-hidden bg-noir-950 border-t border-noir-700/60">
        {/* Background Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-crimson/15 via-noir-950/80 to-noir-950 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-noir-900 border border-crimson/40 rounded-full shadow-lg">
            <Icons8 name="fire" size={16} className="text-crimson-light animate-pulse" />
            <span className="font-label-caps text-xs text-bone uppercase tracking-widest font-bold">
              BESPOKE DARK ARTISTRY · KAMPALA
            </span>
          </div>

          <h2 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-bone font-bold tracking-tight">
            Ready to Embrace the <span className="text-crimson-light">Darkness?</span>
          </h2>

          <p className="font-body-md text-base md:text-lg text-bone-muted leading-relaxed max-w-2xl mx-auto">
            Book a consultation and let&apos;s create something beautifully twisted. I work exclusively with dark, Gothic, and macabre themes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('booking')}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-crimson hover:bg-crimson-hover text-bone font-label-caps text-xs font-bold uppercase tracking-widest transition-all rounded-sm shadow-xl hover:shadow-crimson/30 hover:-translate-y-0.5"
            >
              <Icons8 name="calendar-check" size={16} />
              <span>Book Your Consultation</span>
            </button>

            <button
              onClick={() => onNavigate('portfolio')}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-noir-900 hover:bg-noir-850 text-bone border border-noir-700 font-label-caps text-xs uppercase tracking-wider transition-all rounded-sm hover:-translate-y-0.5"
            >
              <span>Explore Portfolio</span>
              <Icons8 name="arrow-right" size={16} className="text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('equipment')}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-noir-900 hover:bg-noir-850 text-gold border border-gold/40 font-label-caps text-xs uppercase tracking-wider transition-all rounded-sm hover:-translate-y-0.5"
            >
              <Icons8 name="box-open" size={16} />
              <span>Shop Aftercare Balm</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AftercarePage;
